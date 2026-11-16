import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/Bloques";
import { Flecha } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { infrastructure, milestones, values } from "@/content/company";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { slugForMedia } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Empresa",
  description:
    "Historia, trayectoria, infraestructura y forma de trabajo de TODO TECHOS, empresa de construcciones metálicas y obras industriales.",
  alternates: { canonical: "/empresa" },
};

export default function Empresa() {
  return (
    <>
      <PageHero
        titulo="Nuestra empresa"
        bajada="Más de 60 años construyendo para la industria: del techo que nos dio el nombre a obras completas de gran escala."
      />

      {/* Presentación */}
      <section className="seccion">
        <div className="contenedor grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <Reveal>
            <h2 className="titulo titulo-barra">Qué hacemos y para quién</h2>
            <p className="mt-6 max-w-[56ch] text-[1.1875rem] leading-relaxed">{site.about.intro}</p>
            <p className="mt-4 max-w-[56ch] text-acero">
              Trabajamos para industrias, empresas de logística, el agro y organismos que necesitan naves, estructuras y
              obra civil ejecutadas por un solo equipo, con un único responsable de principio a fin.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/servicios/${s.slug}`}
                    className="inline-block border border-linea px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:border-verde hover:bg-verde hover:text-white"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal modo="descubre" className="corte-techo">
            <Photo src="/images/nosotros.png" fit="cover" alt="Equipo de TODO TECHOS junto a vehículos de trabajo" variant="nave" className="aspect-[5/4] w-full" />
          </Reveal>
        </div>
      </section>

      {/* Historia: es una secuencia real, por eso va como línea de tiempo */}
      <section className="chapa seccion" aria-labelledby="t-historia">
        <div className="contenedor">
          <Reveal>
            <h2 id="t-historia" className="titulo titulo-barra">
              Historia y evolución
            </h2>
            <p className="bajada mt-4">Seis décadas de oficio, sumando capacidades a medida que crecían las obras.</p>
          </Reveal>
          <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-[7px] top-2 h-full w-[2px] bg-tinta/15 md:left-0 md:top-[7px] md:h-[2px] md:w-full" />
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.title} demora={i * 120} className="relative pl-9 md:pl-0 md:pt-10">
                <span aria-hidden className="absolute left-0 top-1.5 h-4 w-4 -skew-x-[14deg] bg-verde md:top-0" />
                <h3 className="font-display text-[1.75rem] font-bold uppercase leading-none">{m.title}</h3>
                <p className="mt-2.5 max-w-[30ch] text-acero">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Infraestructura */}
      <section className="seccion" aria-labelledby="t-recursos">
        <div className="contenedor">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="t-recursos" className="titulo titulo-barra">
                Con qué trabajamos
              </h2>
              <p className="bajada mt-4">Taller, equipos, logística y personal propios.</p>
            </div>
            <Link href="/infraestructura" className="enlace shrink-0">
              Ver infraestructura <Flecha />
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {infrastructure.map((r, i) => (
              <Reveal as="li" key={r.title} demora={i * 90}>
                <Photo slot={`infra.${slugForMedia(r.title)}`} src={r.image} alt={r.title} variant={r.art} className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 25vw, 50vw" />
                <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-none">{r.title}</h3>
                <p className="mt-2 text-acero">{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Seguridad, calidad y metodología */}
      <section className="sobre-oscuro seccion bg-tinta text-white" aria-labelledby="t-metodo">
        <div className="contenedor grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <h2 id="t-metodo" className="titulo titulo-barra">
              Seguridad, calidad y forma de trabajo
            </h2>
          </Reveal>
          <ul className="grid gap-0 border-t border-white/15">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} demora={i * 100} className="grid gap-2 border-b border-white/15 py-7 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <h3 className="font-display text-[1.75rem] font-bold uppercase leading-none text-verde-luz">{v.title}</h3>
                <p className="max-w-[48ch] text-white/80">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand titulo="Hablemos de tu proyecto" />
    </>
  );
}
