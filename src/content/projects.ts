import type { ArtVariant } from "@/components/Photo";

export type Project = {
  slug: string;
  title: string;
  /** slug del servicio relacionado */
  service: string;
  city: string;
  province: string;
  /** m² — opcional, solo si el dato está verificado */
  surface?: number;
  year?: number;
  duration?: string;
  client?: string;
  scope: string;
  description: string;
  featured: boolean;
  art: ArtVariant;
  /** Foto principal y galería en /public. Vacío = dibujo provisorio. */
  image?: string;
  gallery?: { src?: string; caption: string }[];
};

/**
 * OBRAS DE MUESTRA — nombres, localidades y superficies ilustrativos.
 * Reemplazar por las fichas reales (6 a 10) que entregue el cliente.
 */
export const projects: Project[] = [
  {
    slug: "planta-industrial-catamarca",
    title: "Planta industrial",
    service: "naves-industriales",
    city: "San Fernando del Valle",
    province: "Catamarca",
    surface: 5200,
    year: 2025,
    duration: "8 meses",
    scope: "Estructura, cerramientos y cubierta",
    description:
      "Nave de producción con estructura de pórticos metálicos, cerramiento lateral de chapa y cubierta con aislación.",
    featured: true,
    art: "nave",
  },
  {
    slug: "centro-logistico-tucuman",
    title: "Centro logístico",
    service: "naves-industriales",
    city: "San Miguel de Tucumán",
    province: "Tucumán",
    surface: 3000,
    year: 2024,
    duration: "6 meses",
    scope: "Nave, playa de maniobras y obra civil",
    description:
      "Depósito logístico con muelles de carga, platea de hormigón y playa de maniobras para camiones.",
    featured: true,
    art: "techo",
  },
  {
    slug: "nave-industrial-santiago",
    title: "Nave industrial",
    service: "naves-industriales",
    city: "La Banda",
    province: "Santiago del Estero",
    surface: 4500,
    year: 2024,
    duration: "7 meses",
    scope: "Fabricación y montaje de estructura",
    description:
      "Fabricación en taller y montaje en obra de pórticos, correas y arriostramientos para una nave de gran luz.",
    featured: true,
    art: "estructura",
  },
  {
    slug: "ampliacion-de-planta-la-rioja",
    title: "Ampliación de planta",
    service: "naves-industriales",
    city: "La Rioja",
    province: "La Rioja",
    surface: 2800,
    year: 2023,
    duration: "5 meses",
    scope: "Ampliación con planta en funcionamiento",
    description:
      "Ampliación de una nave existente, ejecutada por etapas para no interrumpir la producción.",
    featured: true,
    art: "nave",
  },
  {
    slug: "movimiento-de-suelo-parque-industrial",
    title: "Preparación de predio industrial",
    service: "obras-infraestructura",
    city: "Güemes",
    province: "Salta",
    surface: 12000,
    year: 2023,
    duration: "3 meses",
    scope: "Limpieza, nivelación y compactación",
    description:
      "Limpieza del terreno, nivelación, relleno y compactación para la futura implantación de una planta.",
    featured: true,
    art: "suelo",
  },
  {
    slug: "recambio-de-cubierta-deposito",
    title: "Recambio de cubierta en depósito",
    service: "zingueria-industrial",
    city: "Yerba Buena",
    province: "Tucumán",
    surface: 1900,
    year: 2022,
    duration: "2 meses",
    scope: "Reemplazo de chapa, aislación y zinguería",
    description:
      "Retiro de la cubierta existente y colocación de chapa nueva con aislación, canaletas y zinguería.",
    featured: true,
    art: "techo",
  },
  {
    slug: "fundaciones-y-platea-jujuy",
    title: "Fundaciones y platea industrial",
    service: "obras-infraestructura",
    city: "Palpalá",
    province: "Jujuy",
    surface: 2200,
    year: 2022,
    duration: "4 meses",
    scope: "Bases, vigas de fundación y platea",
    description:
      "Obra civil completa para una nave: bases aisladas, vigas de fundación y platea de hormigón armado.",
    featured: false,
    art: "civil",
  },
  {
    slug: "entrepiso-metalico-tucuman",
    title: "Entrepiso metálico",
    service: "naves-industriales",
    city: "Banda del Río Salí",
    province: "Tucumán",
    surface: 650,
    year: 2021,
    duration: "6 semanas",
    scope: "Fabricación y montaje de entrepiso",
    description:
      "Entrepiso metálico para ampliar la superficie de depósito dentro de una nave existente.",
    featured: false,
    art: "estructura",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const formatSurface = (m2: number) => `${m2.toLocaleString("es-AR")} m²`;
