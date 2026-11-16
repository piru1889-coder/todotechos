import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/Bloques";
import { Flecha, ServicioIcono } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Naves industriales, infraestructura para empresas, cañerías industriales, zinguería industrial y energía solar.",
  alternates: { canonical: "/servicios" },
};

export default function Servicios() {
  return (
    <>
      <PageHero
        titulo="Servicios"
        bajada="Cada prestación puede contratarse por separado o como parte de una obra integral, con un solo equipo a cargo."
      />
      <section className="seccion">
        <div className="contenedor grid gap-16 md:gap-24">
          {services.map((s, i) => (
            <article key={s.slug} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal modo="descubre" className={`${i % 2 ? "corte-techo-inv lg:order-2" : "corte-techo"}`}>
                <Link href={`/servicios/${s.slug}`} tabIndex={-1} aria-hidden className="obra-card block">
                  <Photo slot={`service.${s.slug}`} src={s.image} alt={s.title} variant={s.art} className="aspect-[16/11] w-full" innerClassName="obra-foto" />
                </Link>
              </Reveal>
              <Reveal demora={150}>
                <ServicioIcono slug={s.slug} width={48} height={48} className="text-verde" />
                <h2 className="titulo mt-4 !text-[clamp(1.9rem,1.3rem+2vw,3rem)]">{s.title}</h2>
                <p className="mt-4 max-w-[52ch] text-[1.125rem] text-acero">{s.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.9875rem]">
                  {s.scope.slice(0, 4).map((a) => (
                    <li key={a} className="flex items-center gap-2">
                      <span aria-hidden className="h-2.5 w-1.5 -skew-x-[14deg] bg-verde" />
                      {a}
                    </li>
                  ))}
                </ul>
                <Link href={`/servicios/${s.slug}`} className="btn btn-tinta mt-7">
                  Ver servicio <Flecha />
                </Link>
              </Reveal>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
