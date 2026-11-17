import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { isAdminSessionValid, isSameOrigin } from "@/lib/admin-auth";
import { ensureMediaTable, getMysqlPool, isMysqlConfigured } from "@/lib/media-db";
import { mediaSlots, getMediaSlot } from "@/lib/media-slots";
import { getWorkplacesWithOverrides } from "@/lib/workplace-content";

const MAX_IMAGE_FILE_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024;
interface MediaSummaryRow extends RowDataPacket {
  slot_key: string;
  content_type: string;
  byte_size: number;
  fit_mode: "cover" | "contain";
  updated_at: Date;
  workplace_key: string | null;
  title: string | null;
  location: string | null;
}

const MIME_SIGNATURES: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) =>
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a,
  "image/webp": (bytes) =>
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP",
  "video/mp4": (bytes) =>
    bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 8)) === "ftyp",
};

function unauthorized() {
  return NextResponse.json({ error: "Iniciá sesión para continuar." }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminSessionValid(request)) return unauthorized();
  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "MySQL todavía no está configurado." }, { status: 503 });
  }

  try {
    await ensureMediaTable();
    const [rows] = await getMysqlPool().query<MediaSummaryRow[]>(
      "SELECT slot_key, content_type, OCTET_LENGTH(file_data) AS byte_size, fit_mode, updated_at FROM site_media",
    );
    const saved = new Map(rows.map((row) => [row.slot_key, row]));
    const workplaceDetails = await getWorkplacesWithOverrides();
    return NextResponse.json({
      slots: mediaSlots.filter((slot) => slot.showInAdmin !== false).map((slot) => {
        const row = saved.get(slot.key);
        return {
          key: slot.key,
          section: slot.section,
          label: slot.label,
          mediaType: slot.mediaType ?? "image",
          recommendedSize: slot.recommendedSize ?? "1200 × 900 px",
          formatHelp: slot.formatHelp ?? "JPG, PNG o WebP; hasta 8 MB.",
          workplaceKey: slot.workplaceKey ?? null,
          imageNumber: slot.imageNumber ?? null,
          fallback: slot.fallback ?? null,
          uploaded: Boolean(row),
          contentType: row?.content_type ?? null,
          byteSize: row?.byte_size ?? null,
          fitMode: row?.fit_mode ?? slot.defaultFit,
          updatedAt: row?.updated_at?.toISOString() ?? null,
        };
      }),
      workplaces: workplaceDetails,
    });
  } catch (error) {
    console.error("[admin/media] No se pudieron listar las imágenes.", error);
    return NextResponse.json({ error: "No se pudieron cargar las imágenes desde MySQL." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }
  if (!isAdminSessionValid(request)) return unauthorized();
  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "MySQL todavía no está configurado." }, { status: 503 });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_VIDEO_FILE_SIZE + 64 * 1024) {
    return NextResponse.json({ error: "El archivo supera el límite de 50 MB." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "El archivo enviado no es válido." }, { status: 400 });
  }

  const key = form.get("key");
  const file = form.get("file");
  const requestedFit = form.get("fitMode");
  const slot = typeof key === "string" ? getMediaSlot(key) : undefined;
  if (!slot || !(file instanceof File)) {
    return NextResponse.json({ error: "Seleccioná una ubicación y un archivo válido." }, { status: 400 });
  }
  const maxFileSize = slot.mediaType === "video" ? MAX_VIDEO_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
  if (file.size === 0 || file.size > maxFileSize) {
    return NextResponse.json({
      error: slot.mediaType === "video" ? "El video debe pesar hasta 50 MB." : "La imagen debe pesar hasta 8 MB.",
    }, { status: 413 });
  }
  const allowedTypes = slot.mediaType === "video" ? ["video/mp4"] : ["image/jpeg", "image/png", "image/webp"];
  const signatureMatches = allowedTypes.includes(file.type) ? MIME_SIGNATURES[file.type] : undefined;
  if (!signatureMatches) {
    return NextResponse.json({
      error: slot.mediaType === "video" ? "Formato no permitido. Usá MP4." : "Formato no permitido. Usá JPG, PNG o WebP.",
    }, { status: 415 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!signatureMatches(bytes)) {
    return NextResponse.json({ error: "El contenido no coincide con el formato de imagen declarado." }, { status: 415 });
  }
  const fitMode = requestedFit === "contain" ? "contain" : requestedFit === "cover" ? "cover" : null;
  if (!fitMode) {
    return NextResponse.json({ error: "Seleccioná cómo se debe ajustar la imagen." }, { status: 400 });
  }

  try {
    await ensureMediaTable();
    await getMysqlPool().execute(
      `INSERT INTO site_media (slot_key, content_type, file_data, fit_mode)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE content_type = VALUES(content_type), file_data = VALUES(file_data), fit_mode = VALUES(fit_mode)`,
      [key, file.type, Buffer.from(bytes), fitMode],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[admin/media] No se pudo guardar ${key}.`, error);
    return NextResponse.json({ error: "No se pudo guardar la imagen en MySQL." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }
  if (!isAdminSessionValid(request)) return unauthorized();
  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "MySQL todavía no está configurado." }, { status: 503 });
  }

  let body: { key?: unknown; fitMode?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  if (typeof body.key !== "string" || !getMediaSlot(body.key) || (body.fitMode !== "cover" && body.fitMode !== "contain")) {
    return NextResponse.json({ error: "Ubicación o ajuste de imagen inválido." }, { status: 400 });
  }

  try {
    await ensureMediaTable();
    const [existing] = await getMysqlPool().execute<RowDataPacket[]>(
      "SELECT slot_key FROM site_media WHERE slot_key = ?",
      [body.key],
    );
    if (existing.length === 0) {
      return NextResponse.json({ error: "Primero subí una imagen para cambiar su ajuste." }, { status: 404 });
    }
    await getMysqlPool().execute(
      "UPDATE site_media SET fit_mode = ? WHERE slot_key = ?",
      [body.fitMode, body.key],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[admin/media] No se pudo cambiar el ajuste de ${body.key}.`, error);
    return NextResponse.json({ error: "No se pudo guardar el ajuste de la imagen." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }
  if (!isAdminSessionValid(request)) return unauthorized();
  if (!isMysqlConfigured()) {
    return NextResponse.json({ error: "MySQL todavía no está configurado." }, { status: 503 });
  }

  let body: { key?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  if (typeof body.key !== "string" || !getMediaSlot(body.key)) {
    return NextResponse.json({ error: "Ubicación de imagen desconocida." }, { status: 400 });
  }

  try {
    await ensureMediaTable();
    await getMysqlPool().execute("DELETE FROM site_media WHERE slot_key = ?", [body.key]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[admin/media] No se pudo restaurar ${body.key}.`, error);
    return NextResponse.json({ error: "No se pudo restaurar la imagen original." }, { status: 503 });
  }
}
