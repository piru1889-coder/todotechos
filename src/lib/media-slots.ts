import { clients, infrastructure } from "@/content/company";
import { services } from "@/content/services";
import { workplaces } from "@/content/workplaces";
import { slugForMedia } from "./slug";

export { slugForMedia } from "./slug";

export type MediaSlot = {
  key: string;
  section: string;
  label: string;
  fallback?: string;
  defaultFit: "cover" | "contain";
  mediaType?: "image" | "video";
  recommendedSize?: string;
  formatHelp?: string;
  workplaceKey?: string;
  imageNumber?: number;
  showInAdmin?: boolean;
};

export const mediaSlots: MediaSlot[] = [
  {
    key: "brand.logo",
    section: "Identidad",
    label: "Logo principal del sitio",
    defaultFit: "contain",
    recommendedSize: "600 × 240 px",
    formatHelp: "PNG o WebP con fondo transparente; JPG si tiene fondo.",
  },
  {
    key: "hero.video",
    section: "Inicio",
    label: "Video de fondo principal",
    fallback: "/videos/hero.mp4",
    defaultFit: "cover",
    mediaType: "video",
    recommendedSize: "1920 × 1080 px (16:9)",
    formatHelp: "MP4, hasta 50 MB. Horizontal, sin audio o con audio silenciado.",
  },
  {
    key: "hero.poster",
    section: "Inicio",
    label: "Imagen de respaldo mientras carga el video",
    defaultFit: "cover",
    recommendedSize: "1920 × 1080 px (16:9)",
    formatHelp: "JPG, PNG o WebP; se muestra como fondo del inicio.",
  },
  {
    key: "home.about",
    section: "Inicio",
    label: "Foto de la sección “Quiénes somos”",
    fallback: "/images/nosotros.png",
    defaultFit: "cover",
    recommendedSize: "1200 × 960 px (5:4)",
    formatHelp: "JPG, PNG o WebP.",
  },
  ...infrastructure.map((item) => ({
    key: `infra.${slugForMedia(item.title)}`,
    section: "Infraestructura",
    label: item.title,
    defaultFit: "cover" as const,
    showInAdmin: false,
  })),
  ...services.map((service) => ({
    key: `service.${service.slug}`,
    section: "Portadas de servicios en Inicio",
    label: `Portada de ${service.title}`,
    fallback: service.image,
    defaultFit: "cover" as const,
    recommendedSize: "1600 × 1000 px (16:10)",
    formatHelp: "JPG, PNG o WebP. Se usa en la tarjeta de Inicio y en la página del servicio.",
  })),
  ...clients.map((client) => ({
    key: `client.${slugForMedia(client.name)}`,
    section: "Logos del carrusel de clientes",
    label: `Logo de ${client.name}`,
    fallback: client.logo,
    defaultFit: "contain" as const,
    recommendedSize: "600 × 300 px",
    formatHelp: "PNG o WebP con fondo transparente. Aparece en Inicio y en Clientes.",
  })),
  ...workplaces.flatMap((workplace) =>
    workplace.images.map((image, index) => ({
      key: `workplace.${workplace.key}.${index + 1}`,
      section: "Fotos de trabajos realizados",
      label: `${workplace.title} · foto ${index + 1} de ${workplace.images.length}`,
      fallback: image,
      defaultFit: "cover" as const,
      recommendedSize: "1200 × 900 px (4:3)",
      formatHelp: "JPG, PNG o WebP. Reemplazá esta foto para actualizar el carrusel de la obra.",
      workplaceKey: workplace.key,
      imageNumber: index + 1,
    })),
  ),
];

export const getMediaSlot = (key: string) => mediaSlots.find((slot) => slot.key === key);
