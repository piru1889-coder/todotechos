"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, whatsappUrl } from "@/content/site";
import { Logo } from "./Logo";
import { Flecha, Telefono, WhatsApp } from "./Icons";

export function Header() {
  const pathname = usePathname();
  const [solida, setSolida] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolida(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto]);

  const activo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const clara = solida && !abierto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] duration-300 ${
        clara ? "h-[64px] bg-white shadow-[0_1px_0_var(--color-linea),0_10px_30px_-18px_rgb(0_0_0/0.35)]" : "h-[76px] bg-transparent"
      }`}
    >
      {/* velo para leer el menú sobre el video */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent transition-opacity duration-300 ${
          clara || abierto ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="contenedor relative z-10 flex h-full items-center justify-between gap-6">
        <Link href="/" onClick={() => setAbierto(false)} className="shrink-0 origin-left scale-[0.86] sm:scale-100">
          <Logo tono={clara ? "oscuro" : "claro"} />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={activo(item.href) ? "page" : undefined}
                  className={`group relative py-2 font-display text-[1.0625rem] font-semibold uppercase tracking-[0.04em] transition-colors ${
                    clara ? "text-tinta hover:text-verde" : "text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-[3px] origin-left -skew-x-[20deg] transition-transform duration-300 ease-[var(--ease-obra)] group-hover:scale-x-100 ${
                      clara ? "bg-verde" : "bg-verde-luz"
                    } ${activo(item.href) ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-verde !hidden !min-h-11 !px-5 !text-base sm:!inline-flex"
          >
            <WhatsApp width={20} height={20} /> Solicitar cotización
          </a>
          <button
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
            className={`relative grid h-12 w-12 place-items-center xl:hidden ${clara ? "text-tinta" : "text-white"}`}
          >
            <span className="relative block h-4 w-7">
              <span
                className={`absolute left-0 h-[2.5px] w-full bg-current transition-transform duration-300 ${
                  abierto ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[2.5px] w-full -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  abierto ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 h-[2.5px] w-full bg-current transition-transform duration-300 ${
                  abierto ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menú móvil a pantalla completa */}
      <div
        id="menu-movil"
        inert={!abierto}
        className={`sobre-oscuro chapa-verde fixed inset-0 z-0 flex flex-col overflow-y-auto pt-[76px] text-white transition-[clip-path] duration-500 ease-[var(--ease-obra)] xl:hidden ${
          abierto ? "[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]" : "[clip-path:polygon(0_0,100%_0,100%_0,0_0)]"
        }`}
      >
        <nav aria-label="Principal móvil" className="contenedor flex-1 py-6">
          <ul>
            {nav.map((item, i) => (
              <li
                key={item.href}
                className="border-b border-white/12 transition-[opacity,transform] duration-500"
                style={{
                  opacity: abierto ? 1 : 0,
                  transform: abierto ? "none" : "translateY(12px)",
                  transitionDelay: abierto ? `${120 + i * 45}ms` : "0ms",
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  aria-current={activo(item.href) ? "page" : undefined}
                  className={`flex items-center justify-between py-4 font-display text-[2rem] font-bold uppercase italic leading-none ${
                    activo(item.href) ? "text-verde-luz" : ""
                  }`}
                >
                  {item.label}
                  <Flecha className="opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="contenedor grid gap-3 pb-8">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setAbierto(false)}
            className="btn btn-verde w-full"
          >
            <WhatsApp width={20} height={20} /> Solicitar cotización
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a href={site.contact.phoneHref} className="btn btn-linea">
              <Telefono width={20} height={20} /> Llamar
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
