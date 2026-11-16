import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Bloques";
import { ObrasExplorer } from "@/components/ObrasExplorer";
import { projects } from "@/content/projects";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Obras realizadas",
  description: "Obras de naves industriales, infraestructura y zinguería realizadas por TODO TECHOS.",
  alternates: { canonical: "/obras" },
};

export default function Obras() {
  const conObras = services
    .filter((s) => projects.some((p) => p.service === s.slug))
    .map((s) => ({ value: s.slug, label: s.shortTitle }));

  return (
    <>
      <PageHero titulo="Obras realizadas" bajada="Filtrá por tipo de obra o por provincia y abrí cada ficha para ver el alcance del trabajo." />
      <section className="seccion">
        <div className="contenedor">
          <ObrasExplorer projects={projects} servicios={conObras} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
