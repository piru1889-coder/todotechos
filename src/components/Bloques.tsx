import Link from "next/link";
import type { ReactNode } from "react";
import { clients } from "@/content/company";
import { whatsappUrl } from "@/content/site";
import { slugForMedia } from "@/lib/slug";
import { Flecha, WhatsApp } from "./Icons";

/** Encabezado de las páginas interiores. */
export function PageHero({
  titulo,
  bajada,
  migas,
  children,
}: {
  titulo: string;
  bajada?: string;
  migas?: { href: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="sobre-oscuro chapa-verde relative overflow-hidden text-white">
      {/* la pendiente del techo, a escala de página */}
      <svg aria-hidden viewBox="0 0 1600 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 400 L1600 40 V400 Z" fill="#06200f" fillOpacity="0.55" />
        <path d="M0 400 L1600 40" stroke="#2cc163" strokeOpacity="0.5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="contenedor relative pb-14 pt-[calc(var(--header-h)+3.5rem)] md:pb-20 md:pt-[calc(var(--header-h)+5.5rem)]">
        {migas && (
          <nav aria-label="Ruta" className="mb-5 text-[0.9375rem] text-white/70">
            <ol className="flex flex-wrap gap-x-2">
              {migas.map((m) => (
                <li key={m.href} className="after:ml-2 after:content-['/']">
                  <Link href={m.href} className="underline-offset-4 hover:text-white hover:underline">
                    {m.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="relative pl-[clamp(1.1rem,2.4vw,2.25rem)]">
          <span aria-hidden className="absolute bottom-[0.35rem] left-0 top-[0.3rem] w-[clamp(0.45rem,0.9vw,0.8rem)] origin-bottom -skew-x-[14deg] bg-verde-luz" />
          <h1 className="display max-w-[16ch] text-[clamp(2.75rem,7.5vw,6.25rem)] [text-wrap:balance]">
            <span className="hero-linea">
              <span>{titulo}</span>
            </span>
          </h1>
        </div>
        {bajada && <p className="mt-6 max-w-[58ch] text-[clamp(1.0625rem,1rem+0.4vw,1.3125rem)] text-white/85">{bajada}</p>}
        {children}
      </div>
    </section>
  );
}

/** Banda de llamado a la acción (bloque 09 del brief). */
export function CtaBand({ titulo = "¿Tenés un proyecto industrial o civil?" }: { titulo?: string }) {
  return (
    <section className="sobre-oscuro relative overflow-hidden bg-verde text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.06) 0 2px, transparent 2px 13px, rgb(0 0 0 / 0.1) 13px 15px, transparent 15px 26px)",
        }}
      />
      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[38%] bg-verde-hondo [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)] lg:block" />
      <div className="contenedor relative flex flex-col gap-8 py-14 md:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="display max-w-[15ch] text-[clamp(2.4rem,5.4vw,4.5rem)] [text-wrap:balance]">{titulo}</h2>
          <p className="mt-4 max-w-[46ch] text-lg text-white/90">
            Contanos qué necesitás construir y dónde. Analizamos tu caso y te respondemos con una propuesta.
          </p>
        </div>
        <div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-white text-verde-hondo after:bg-tinta hover:text-white focus-visible:text-white"
          >
            <WhatsApp width={22} height={22} /> Solicitar cotización <Flecha />
          </a>
        </div>
      </div>
    </section>
  );
}

/** Casillero de cliente: logo original o espacio reservado. */
export function ClientSlot({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="grid h-24 place-items-center border border-linea bg-white px-6">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/media/${encodeURIComponent(`client.${slugForMedia(name)}`)}`}
          alt={name}
          loading="lazy"
          className="h-14 w-[170px] object-contain"
        />
      ) : (
        <span className="text-center text-sm leading-tight text-acero">
          Logo de cliente
          <span className="block text-[0.75rem] opacity-70">pendiente de autorización</span>
        </span>
      )}
    </div>
  );
}

export function ClientsMarquee() {
  const fila = (oculta: boolean) =>
    clients.map((c, i) => (
      <div key={`${oculta}-${i}`} aria-hidden={oculta || undefined} className="w-[210px] shrink-0 px-2.5">
        <ClientSlot {...c} />
      </div>
    ));
  return (
    <div className="cinta-wrap overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="cinta">
        {fila(false)}
        {fila(true)}
      </div>
    </div>
  );
}
