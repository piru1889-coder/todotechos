import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/Bloques";
import { Check, WhatsApp } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { getService, services } from "@/content/services";
import { site } from "@/content/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.title, description: s.summary, alternates: { canonical: `/servicios/${s.slug}` } };
}

export default async function Servicio(props: PageProps<"/servicios/[slug]">) {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) notFound();
  const whatsappServiceUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    `Hola, quiero más información por el servicio ${s.title}`,
  )}`;

  return (
    <>
      <PageHero titulo={s.title} bajada={s.summary} migas={[{ href: "/servicios", label: "Servicios" }]} />

      <section className="seccion">
        <div className="contenedor grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <Reveal modo="descubre" className="corte-techo">
              <Photo slot={`service.${s.slug}`} src={s.image} alt={s.title} variant={s.art} className="aspect-[16/10] w-full" priority />
            </Reveal>
            <Reveal className="mt-10">
              <h2 className="titulo titulo-barra !text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)]">En qué consiste</h2>
              <p className="mt-5 max-w-[60ch] text-[1.1875rem] leading-relaxed">{s.description}</p>
            </Reveal>
          </div>

          <Reveal as="aside" demora={150} className="chapa self-start p-7 md:p-9 lg:sticky lg:top-24">
            <h2 className="font-display text-[1.75rem] font-bold uppercase leading-none">Alcances</h2>
            <ul className="mt-5 grid gap-3">
              {s.scope.map((a) => (
                <li key={a} className="flex gap-3">
                  <Check className="mt-0.5 shrink-0 text-verde" width={22} height={22} />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <a href={whatsappServiceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-verde w-full">
                <WhatsApp width={20} height={20} /> Consultar por este servicio
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
