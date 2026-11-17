import Link from "next/link";
import { nav, site, whatsappUrl } from "@/content/site";
import { services } from "@/content/services";
import { Logo } from "./Logo";
import { Instagram, Pin, WhatsApp } from "./Icons";

export function Footer() {
  const c = site.contact;
  return (
    <footer className="sobre-oscuro chapa-verde relative text-white/80">
      <div className="contenedor grid gap-12 pb-12 pt-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <p className="mt-5 max-w-[34ch] text-[0.9875rem]">
            Construcciones metálicas, cubiertas, obras civiles y movimientos de suelo para proyectos industriales y de
            gran escala.
          </p>
          <a
            href={c.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-white transition-colors hover:text-verde-luz"
          >
            <Instagram /> {c.instagramHandle}
          </a>
        </div>

        <nav aria-label="Pie: secciones">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Secciones</h2>
          <ul className="mt-4 grid gap-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-verde-luz">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Pie: servicios">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Servicios</h2>
          <ul className="mt-4 grid gap-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="transition-colors hover:text-verde-luz">
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Contacto</h2>
          <ul className="mt-4 grid gap-3.5">
            <li>
              <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition-colors hover:text-verde-luz">
                <Pin className="mt-0.5 shrink-0 text-verde-luz" />
                <span>
                  {c.address}
                  <br />
                  {c.province}
                  <span className="mt-0.5 block text-sm underline underline-offset-4">Ver en Google Maps</span>
                </span>
              </a>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition-colors hover:text-verde-luz">
                <WhatsApp className="shrink-0 text-verde-luz" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className={`contenedor flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between ${site.demo ? "" : "max-md:pb-24"}`}>
          <p>
            © {site.year} {site.name}. Todos los derechos reservados.
          </p>
          <Link href="/privacidad" className="underline underline-offset-4 transition-colors hover:text-white">
            Política de privacidad
          </Link>
        </div>
      </div>

      
    </footer>
  );
}
