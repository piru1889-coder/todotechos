"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { Flecha, ServicioIcono } from "./Icons";

/* Pórticos de una nave en perspectiva: se dibujan solos al cargar y quedan
   de fondo hasta que el video del drone esté disponible. */
const VP = { x: 1180, y: 470 };
const BASE = [
  [60, 900],
  [60, 400],
  [520, 215],
  [980, 400],
  [980, 900],
] as const;
const escalar = (s: number) => BASE.map(([x, y]) => [VP.x + (x - VP.x) * s, VP.y + (y - VP.y) * s] as const);
const FRAMES = Array.from({ length: 8 }, (_, i) => escalar(Math.pow(0.78, i)));
const pathDe = (pts: readonly (readonly [number, number])[]) =>
  "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
const CORREAS = [1, 2, 3].map((k) => pathDe([FRAMES[0][k], FRAMES[FRAMES.length - 1][k]]));

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [videoListo, setVideoListo] = useState(false);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const escala = useTransform(scrollYProgress, [0, 1], [1, reducido ? 1 : 1.18]);
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, reducido ? 0 : -90]);
  const opacidad = useTransform(scrollYProgress, [0, 0.75], [1, reducido ? 1 : 0]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (v.readyState >= 3) setVideoListo(true);
  }, []);

  return (
    <section ref={ref} className="sobre-oscuro relative flex min-h-[100svh] flex-col overflow-hidden bg-verde-noche text-white">
      <motion.div aria-hidden className="absolute inset-0" style={{ scale: escala }}>
        <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_70%_30%,#14532f_0%,#0a3120_45%,#06200f_100%)]" />
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          className="hero-trazo absolute inset-0 h-full w-full"
          fill="none"
          strokeLinejoin="round"
        >
          {FRAMES.map((f, i) => (
            <path
              key={i}
              d={pathDe(f)}
              pathLength={1}
              stroke={i === 0 ? "#2cc163" : "#ffffff"}
              strokeOpacity={i === 0 ? 0.85 : 0.5 - i * 0.045}
              strokeWidth={Math.max(1.2, 5 - i * 0.6)}
              style={{ "--i": i } as CSSProperties}
            />
          ))}
          {CORREAS.map((d, i) => (
            <path key={d} d={d} pathLength={1} stroke="#ffffff" strokeOpacity={0.28} strokeWidth={1.5} style={{ "--i": 9 + i } as CSSProperties} />
          ))}
        </svg>
        <video
          ref={video}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${videoListo ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/api/media/hero.poster"
          onCanPlay={() => setVideoListo(true)}
        >
          <source src={site.hero.video} type="video/mp4" />
        </video>
        {/* degradado oscuro para legibilidad (solo hace falta con video) */}
        <div className={`absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10 transition-opacity duration-1000 ${videoListo ? "opacity-100" : "opacity-0"}`} />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-verde-noche via-verde-noche/55 to-transparent" />
      </motion.div>

      <motion.div
        className="contenedor relative z-10 flex flex-1 flex-col justify-end pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-20"
        style={{ y: yTexto, opacity: opacidad }}
      >
        <div className="relative pl-[clamp(1.4rem,3.2vw,3.25rem)]">
          <span
            aria-hidden
            className="hero-entra absolute bottom-[0.6rem] left-0 top-[0.4rem] w-[clamp(0.6rem,1.3vw,1.25rem)] origin-bottom -skew-x-[14deg] bg-verde-luz"
            style={{ "--i": 0 } as CSSProperties}
          />
          <h1 className="display text-[clamp(2.5rem,7vw,6.5rem)]">
            {site.hero.titleLines.map((linea, i) => (
              <span key={linea} className="hero-linea">
                <span style={{ "--i": i } as CSSProperties} className={i === 1 ? "text-[0.62em] font-semibold tracking-[0.01em] text-white/90" : ""}>
                  {linea}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <p className="hero-entra mt-6 max-w-[46ch] text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] leading-snug text-white/88 md:mt-8" style={{ "--i": 1 } as CSSProperties}>
          {site.hero.subtitle}
        </p>

        <div className="hero-entra mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ "--i": 2 } as CSSProperties}>
          <Link href="/contacto" className="btn btn-verde">
            Solicitar presupuesto <Flecha />
          </Link>
          <Link href="/obras" className="btn btn-linea">
            Ver proyectos
          </Link>
        </div>
      </motion.div>

      {/* Accesos a servicios, como en la referencia del brief */}
      <nav
        aria-label="Servicios principales"
        className="hero-entra relative z-10 hidden border-t border-white/15 bg-verde-noche/60 backdrop-blur-sm lg:block"
        style={{ "--i": 4 } as CSSProperties}
      >
        <ul className="contenedor grid grid-cols-5">
          {services
            .filter((s) => s.featured)
            .map((s) => (
              <li key={s.slug} className="border-l border-white/15 last:border-r">
                <Link
                  href={`/servicios/${s.slug}`}
                  className="group relative flex items-center gap-3.5 overflow-hidden px-5 py-5 font-display text-[1.1875rem] font-semibold uppercase leading-none tracking-[0.03em]"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-verde transition-transform duration-500 ease-[var(--ease-obra)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
                  <ServicioIcono slug={s.slug} width={34} height={34} className="relative shrink-0 text-verde-luz transition-colors group-hover:text-white" />
                  <span className="relative">{s.shortTitle}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <span aria-hidden className="absolute bottom-28 right-8 z-10 hidden h-20 w-px bg-white/25 lg:block">
        <span className="absolute inset-0 bg-verde-luz [animation:baja_2.6s_var(--ease-obra)_infinite]" />
      </span>
    </section>
  );
}
