import { NextResponse } from "next/server";
import { isMysqlConfigured } from "@/lib/media-db";
import { workplaces } from "@/content/workplaces";
import { getWorkplacesWithOverrides } from "@/lib/workplace-content";

export async function GET() {
  if (!isMysqlConfigured()) return NextResponse.json(workplaces);

  try {
    return NextResponse.json(await getWorkplacesWithOverrides(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[workplaces] No se pudieron cargar los nombres y ubicaciones.", error);
    return NextResponse.json({ error: "No se pudieron cargar los trabajos realizados." }, { status: 503 });
  }
}
