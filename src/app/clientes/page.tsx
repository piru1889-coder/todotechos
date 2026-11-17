import type { Metadata } from "next";
import { ClientsMarquee, CtaBand, PageHero } from "@/components/Bloques";
import { Reveal } from "@/components/Reveal";
import { WorkplaceCarousel } from "@/components/WorkplaceCarousel";
import { workplaces } from "@/content/workplaces";

export const metadata: Metadata = {
  title: "Clientes",
  description: "Empresas e industrias que confiaron sus obras a TODO TECHOS.",
  alternates: { canonical: "/clientes" },
};

export default function Clientes() {
  return (
    <>
      <PageHero titulo="Clientes" bajada="Empresas e industrias con las que trabajamos." />

      <section className="pb-16 pt-12" aria-label="Empresas e industrias clientes">
        <Reveal>
          <ClientsMarquee />
        </Reveal>
      </section>

      <section className="seccion bg-chapa-clara" aria-labelledby="t-casos">
        <div className="contenedor">
          <h2 id="t-casos" className="titulo titulo-barra">
            Trabajos realizados
          </h2>
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {workplaces.map((workplace, i) => (
              <Reveal key={workplace.title} demora={i * 70}>
                <WorkplaceCarousel workplace={workplace} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
