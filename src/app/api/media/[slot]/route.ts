import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { RowDataPacket } from "mysql2";
import {
  ensureMediaTable,
  getMysqlPool,
  isMysqlConfigured,
} from "@/lib/media-db";
import { getMediaSlot } from "@/lib/media-slots";

interface MediaFileRow extends RowDataPacket {
  content_type: string;
  file_data: Buffer;
  fit_mode: "cover" | "contain";
}

interface MediaFitRow extends RowDataPacket {
  fit_mode: "cover" | "contain";
}

function mediaResponse(data: Uint8Array, contentType: string, request: Request) {
  const range = request.headers.get("range");
  let start = 0;
  let end = data.byteLength - 1;
  let status = 200;

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${data.byteLength}` },
      });
    }

    if (match[1]) {
      start = Number(match[1]);
      end = match[2] ? Number(match[2]) : end;
    } else {
      const suffixLength = Number(match[2]);
      start = Math.max(0, data.byteLength - suffixLength);
    }
    if (start >= data.byteLength || end < start) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${data.byteLength}` },
      });
    }
    end = Math.min(end, data.byteLength - 1);
    status = 206;
  }

  const body = new Uint8Array(end - start + 1);
  body.set(data.subarray(start, end + 1));
  const headers = new Headers({
    "Content-Type": contentType,
    "Content-Length": String(body.byteLength),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": "inline",
    "Accept-Ranges": "bytes",
  });
  if (status === 206) headers.set("Content-Range", `bytes ${start}-${end}/${data.byteLength}`);

  return new Response(body, {
    status,
    headers,
  });
}

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/media/[slot]">,
) {
  const { slot: key } = await params;
  const slot = getMediaSlot(key);

  if (!slot) {
    return new Response("Imagen no encontrada.", {
      status: 404,
    });
  }

  const metadata =
    new URL(request.url).searchParams.get("metadata") === "1";

  /*
   * Solicitud de metadatos de la imagen
   */
  if (metadata) {
    if (!isMysqlConfigured()) {
      return Response.json(
        {
          fitMode: slot.defaultFit,
          uploaded: false,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    try {
      await ensureMediaTable();

      const [rows] = await getMysqlPool().execute<MediaFitRow[]>(
        "SELECT fit_mode FROM site_media WHERE slot_key = ?",
        [key],
      );

      return Response.json(
        {
          fitMode: rows[0]?.fit_mode ?? slot.defaultFit,
          uploaded: Boolean(rows[0]),
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    } catch (error) {
      console.error(
        `[media] No se pudo leer el ajuste de ${key} desde MySQL.`,
        error,
      );

      /*
       * Si MySQL falla, utilizar el valor predeterminado
       * en lugar de devolver un error 503.
       */
      return Response.json(
        {
          fitMode: slot.defaultFit,
          uploaded: false,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }
  }

  /*
   * Intentar cargar la imagen desde MySQL
   */
  if (isMysqlConfigured()) {
    try {
      await ensureMediaTable();

      const [rows] = await getMysqlPool().execute<MediaFileRow[]>(
        `
    SELECT content_type, file_data
    FROM site_media
    WHERE slot_key = ?
  `,
        [key],
      );

      if (rows[0]) {
        return mediaResponse(
          new Uint8Array(rows[0].file_data),
          rows[0].content_type,
          request,
        );
      }
    } catch (error) {
      console.error(
        `[media] No se pudo leer ${key} desde MySQL. Se utilizará el respaldo.`,
        error,
      );

      /*
       * No devolver 503 aquí.
       * La ejecución continúa para intentar cargar
       * el archivo de respaldo desde public.
       */
    }
  }

  /*
   * Utilizar el archivo de respaldo dentro de public
   */
  if (slot.fallback) {
    try {
      const filePath = join(
        process.cwd(),
        "public",
        slot.fallback.slice(1),
      );

      const file = await readFile(filePath);

      const extension = slot.fallback
        .split(".")
        .pop()
        ?.toLowerCase();

      const contentType =
        extension === "mp4"
          ? "video/mp4"
          : extension === "svg"
          ? "image/svg+xml"
          : extension === "jpg" || extension === "jpeg"
            ? "image/jpeg"
            : extension === "webp"
              ? "image/webp"
              : "image/png";

      return mediaResponse(
        new Uint8Array(file),
        contentType,
        request,
      );
    } catch (error) {
      console.error(
        `[media] No se pudo leer el archivo de respaldo ${slot.fallback}.`,
        error,
      );

      return new Response(
        "No se pudo cargar la imagen de respaldo.",
        {
          status: 500,
        },
      );
    }
  }

  /*
   * hero.poster puede no tener una imagen configurada
   */
  if (key === "hero.poster") {
    return new Response(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(
    "Todavía no hay una imagen cargada.",
    {
      status: 404,
    },
  );
}