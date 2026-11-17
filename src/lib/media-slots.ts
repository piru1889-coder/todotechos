import { clients, infrastructure } from "@/content/company";
import { services } from "@/content/services";
import { slugForMedia } from "./slug";

export { slugForMedia } from "./slug";

export type MediaSlot = {
  key: string;
  section: string;
  label: string;
  fallback?: string;
  defaultFit: "cover" | "contain";
};

export const mediaSlots: MediaSlot[] = [
  { key: "brand.logo", section: "Identidad", label: "Logo del sitio", defaultFit: "contain" },
  { key: "hero.poster", section: "Inicio", label: "Imagen alternativa del hero", defaultFit: "contain" },
  ...infrastructure.map((item) => ({
    key: `infra.${slugForMedia(item.title)}`,
    section: "Infraestructura",
    label: item.title,
    defaultFit: "cover" as const,
  })),
  ...services.map((service) => ({
    key: `service.${service.slug}`,
    section: "Servicios",
    label: service.title,
    fallback: service.image,
    defaultFit: "cover" as const,
  })),
  ...clients.map((client) => ({
    key: `client.${slugForMedia(client.name)}`,
    section: "Clientes",
    label: client.name,
    fallback: client.logo,
    defaultFit: "contain" as const,
  })),
];

export const getMediaSlot = (key: string) => mediaSlots.find((slot) => slot.key === key);
