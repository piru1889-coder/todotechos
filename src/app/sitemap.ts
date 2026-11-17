import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { nav, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    ...nav.map((n) => ({ url: url(n.href === "/" ? "" : n.href), priority: n.href === "/" ? 1 : 0.8 })),
    ...services.map((s) => ({ url: url(`/servicios/${s.slug}`), priority: 0.7 })),
    { url: url("/privacidad"), priority: 0.2 },
  ];
}
