import { NextResponse } from "next/server";
import { isAdminSessionValid, isSameOrigin } from "@/lib/admin-auth";
import { workplaces } from "@/content/workplaces";
import { saveWorkplaceDetails } from "@/lib/workplace-content";

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }
  if (!isAdminSessionValid(request)) {
    return NextResponse.json({ error: "Iniciá sesión para continuar." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Completá el nombre y la ubicación del trabajo." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const workplace = workplaces.find((item) => item.key === values.key);
  const title = typeof values.title === "string" ? values.title.trim() : "";
  const location = typeof values.location === "string" ? values.location.trim() : "";
  if (!workplace || !title || title.length > 190 || !location || location.length > 255) {
    return NextResponse.json({ error: "Revisá el nombre y la ubicación. Ambos campos son obligatorios." }, { status: 400 });
  }

  try {
    await saveWorkplaceDetails(workplace.key, title, location);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[admin/workplaces] No se pudo actualizar ${workplace.key}.`, error);
    return NextResponse.json({ error: "No se pudieron guardar los datos del trabajo en MySQL." }, { status: 503 });
  }
}
