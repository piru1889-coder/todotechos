import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { Flecha, ServicioIcono } from "@/components/Icons";
import { ClientsMarquee, CtaBand } from "@/components/Bloques";
import { indicators, site } from "@/content/site";
import { services } from "@/content/services";
import { infrastructure } from "@/content/company";

export default function Inicio() {
  const destacados = services.filter((s) => s.featured);
  return (
    <>
      <Hero />

      {/* 03 · Servicios principales */}
      <section className="seccion" aria-labelledby="t-servicios">
        <div className="contenedor">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="t-servicios" className="titulo titulo-barra">
                Qué hacemos
              </h2>
              <p className="bajada mt-4">
                Soluciones para acompañar proyectos industriales, desde las
                naves y la infraestructura hasta las cañerías, la zinguería y la
                energía solar.
              </p>
            </div>
            <Link href="/servicios" className="enlace shrink-0">
              Todos los servicios <Flecha />
            </Link>
          </Reveal>

          <Reveal demora={120} className="mt-10 grid gap-4">
            {destacados.map((s, i) => (
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className={`group relative flex min-h-56 overflow-hidden border border-linea bg-tinta text-white transition-colors duration-300 hover:bg-verde-hondo focus-visible:bg-verde-hondo ${i % 2 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="relative min-h-56 w-[38%] shrink-0 self-stretch sm:w-[40%]">
                  <Photo
                    src={s.image}
                    slot={`service.${s.slug}`}
                    alt=""
                    variant={s.art}
                    rotulo={false}
                    className="!absolute inset-0 h-full w-full"
                    sizes="(min-width: 768px) 40vw, 38vw"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-7 lg:p-10">
                  <ServicioIcono
                    slug={s.slug}
                    width={34}
                    height={34}
                    className="mb-3 text-verde-luz transition-colors group-hover:text-white"
                  />
                  <h3 className="font-display text-xl font-bold uppercase leading-tight sm:text-2xl lg:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/80 sm:text-base">
                    {s.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-verde-luz transition-colors group-hover:text-white sm:text-base">
                    Ver servicio <Flecha />
                  </span>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 04 · Quiénes somos */}
      <section className="seccion !pt-0" aria-labelledby="t-quienes">
        <div className="contenedor grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 id="t-quienes" className="titulo titulo-barra">
              Quiénes somos
            </h2>
            <p className="mt-6 max-w-[54ch] text-[1.1875rem] leading-relaxed">
              {site.about.intro}
            </p>
            <p className="mt-4 max-w-[54ch] text-acero">
              Trabajamos con taller y equipos propios, y acompañamos cada obra
              desde el primer movimiento de suelo hasta la entrega.
            </p>
            <Link href="/empresa" className="btn btn-tinta mt-8">
              Conocer la empresa <Flecha />
            </Link>
          </Reveal>
          <div className="relative">
            <Reveal modo="descubre" className="corte-techo">
              <Photo
                src="/images/nosotros.png"
                fit="cover"
                alt="Equipo de TODO TECHOS junto a vehículos de trabajo"
                variant="estructura"
                className="aspect-[5/4] w-full"
              />
            </Reveal>
            <Reveal
              demora={350}
              className="absolute -bottom-6 -left-3 bg-verde px-6 py-4 text-white shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] sm:-left-8 [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)]"
            >
              <p className="display text-[3.5rem]">+60</p>
              <p className="font-display text-lg font-semibold uppercase leading-none tracking-wide">
                años en obra
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 · Indicadores de capacidad */}
      <section className="chapa mt-6" aria-label="Capacidad de la empresa">
        <div className="contenedor">
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {indicators.map((ind, i) => (
              <Reveal
                as="li"
                key={ind.label}
                demora={i * 90}
                className="border-tinta/12 px-1 py-8 sm:px-6 md:py-11 lg:border-l lg:first:border-l-0 [&:nth-child(even)]:border-l [&:nth-child(even)]:pl-5 max-lg:[&:nth-child(n+3)]:border-t"
              >
                <p className="display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-verde-hondo">
                  {"value" in ind ? ind.value : ind.text}
                </p>
                <p className="mt-2 max-w-[22ch] text-[0.9875rem] leading-snug text-acero">
                  {ind.label}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      

      {/* 08 · Empresas que confían en nosotros */}
      <section className="seccion bg-chapa-clara" aria-labelledby="t-clientes">
        <div className="contenedor">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 id="t-clientes" className="titulo titulo-barra titulo-barra--sin-solape max-w-[18ch]">
              Empresas que confían en nosotros
            </h2>
            <Link href="/clientes" className="enlace shrink-0">
              Ver clientes y obras <Flecha />
            </Link>
          </Reveal>
        </div>
        <Reveal demora={120} className="mt-10">
          <ClientsMarquee />
        </Reveal>
      </section>

      {/* 09 · Llamado a la acción */}
      <CtaBand />
    </>
  );
}
