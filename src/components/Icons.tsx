import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const Flecha = ({ className = "", ...p }: P) => (
  <svg {...base(p)} className={`flecha ${className}`} width={20} height={20}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24ZM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43l-.47-.01Z" />
  </svg>
);

export const Telefono = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export const Correo = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Pin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" />
    <circle cx="12" cy="9.500" r="2.500" />
  </svg>
);

export const Instagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.500" y="3.500" width="17" height="17" rx="4.500" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.200" cy="6.800" r="0.600" fill="currentColor" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...base(p)} strokeWidth={2.4}>
    <path d="m5 12.500 4.500 4.500L19 7.500" />
  </svg>
);

/* Íconos de servicio, dibujados a línea como en un plano */
const servicio: Record<string, string[]> = {
  "naves-industriales": ["M3 21V10l9-5 9 5v11", "M3 21h18", "M9 21v-6h6v6", "M7.500 11.500h9"],
  "obras-infraestructura": ["M3 20h18", "M3 15h18M3 10h18", "M5 5h14v5H5z", "M9 15v5M15 15v5M12 10v5M7 10v5M17 10v5"],
  "canerias-industriales": ["M4 3v7a3 3 0 0 0 3 3h10a3 3 0 0 1 3 3v5", "M2 3h4M18 21h4", "M7 10V6M17 17v4"],
  "zingueria-industrial": ["M2 17 8 6h14l-6 11z", "M7 17 13 6M12 17 18 6", "M2 17h14"],
  "energia-solar": ["M4 10h16l-2 9H6z", "M8 10l1-5h7l1 5", "M9 14v2M13 14v2M17 14v2", "M12 2v1M4 4l1.5 1.5M20 4l-1.5 1.5"],
};

export const ServicioIcono = ({ slug, ...p }: P & { slug: string }) => (
  <svg {...base(p)} strokeWidth={1.5}>
    {(servicio[slug] ?? servicio["naves-industriales"]).map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);
