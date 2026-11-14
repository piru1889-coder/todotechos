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

function imageResponse(data: Uint8Array, contentType: string) {
  const body = new ArrayBuffer(data.byteLength);
  new Uint8Array(body).set(data);

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
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
        return imageResponse(
          new Uint8Array(rows[0].file_data),
          rows[0].content_type,
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
        extension === "svg"
          ? "image/svg+xml"
          : extension === "jpg" || extension === "jpeg"
            ? "image/jpeg"
            : extension === "webp"
              ? "image/webp"
              : "image/png";

      return imageResponse(
        new Uint8Array(file),
        contentType,
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