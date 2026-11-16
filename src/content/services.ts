import type { ArtVariant } from "@/components/Photo";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  scope: string[];
  art: ArtVariant;
  image?: string;
  featured: boolean;
};

/** Catálogo de servicios presentado al cliente para su validación final. */
export const services: Service[] = [
  {
    slug: "naves-industriales",
    title: "Naves industriales",
    shortTitle: "Naves industriales",
    summary: "Construcción y montaje de naves industriales, desde la estructura hasta los cerramientos y cubiertas.",
    description:
      "Ejecutamos naves industriales según el alcance de cada proyecto, integrando el montaje de estructuras, cerramientos y cubiertas. También realizamos ampliaciones y restauraciones de naves existentes.",
    scope: [
      "Montaje de estructuras",
      "Cerramientos laterales y frontales",
      "Cubiertas",
      "Ampliaciones y restauraciones",
    ],
    art: "nave",
    image: "/images/navesindustriales.jpg",
    featured: true,
  },
  {
    slug: "obras-infraestructura",
    title: "Obras de infraestructura para empresas",
    shortTitle: "Infraestructura",
    summary: "Obras civiles y movimientos de suelo para preparar terrenos y acompañar proyectos empresariales.",
    description:
      "Reunimos obras civiles y movimientos de suelo para acompañar proyectos de infraestructura para empresas. El alcance se define según las características del terreno y las necesidades de cada obra.",
    scope: [
      "Limpieza, excavación y preparación del terreno",
      "Nivelación, rellenos y compactación",
      "Fundaciones y hormigón",
      "Obras civiles complementarias",
    ],
    art: "civil",
    image: "/images/civil.jpg",
    featured: true,
  },
  {
    slug: "canerias-industriales",
    title: "Cañerías industriales",
    shortTitle: "Cañerías industriales",
    summary: "Montaje de cañerías para la industria y sistemas de protección contra incendios.",
    description:
      "Las instalaciones de cañerías industriales se resuelven de acuerdo con las especificaciones de cada proyecto. El servicio contempla también sistemas de protección contra incendios, con alcance y requisitos a definir para cada obra.",
    scope: [
      "Cañerías para instalaciones industriales",
      "Tendido y montaje según proyecto",
      "Sistemas de protección contra incendios",
      "Coordinación con las demás instalaciones de obra",
    ],
    art: "estructura",
    image: "/images/canos.webp",
    featured: true,
  },
  {
    slug: "zingueria-industrial",
    title: "Zinguería industrial",
    shortTitle: "Zinguería industrial",
    summary: "Piezas de zinguería para resolver encuentros, desagües y terminaciones en cubiertas industriales.",
    description:
      "La zinguería industrial ayuda a proteger cubiertas y cerramientos, conducir el agua y resolver terminaciones. Las piezas y su instalación se definen de acuerdo con el diseño y las condiciones de cada proyecto.",
    scope: [
      "Canaletas y desagües pluviales",
      "Babetas y encuentros",
      "Remates y terminaciones",
      "Piezas a medida para cubiertas industriales",
    ],
    art: "techo",
    image: "/images/zingueria.png",
    featured: true,
  },
  {
    slug: "energia-solar",
    title: "Energía solar",
    shortTitle: "Energía solar",
    summary: "Información y soluciones de energía solar para empresas, según el consumo y las condiciones del sitio.",
    description:
      "La energía solar fotovoltaica transforma la radiación solar en electricidad mediante paneles e inversores. La solución se dimensiona considerando el consumo, la superficie disponible y las condiciones de instalación y conexión de cada empresa.",
    scope: [
      "Evaluación de consumo y espacio disponible",
      "Paneles solares fotovoltaicos",
      "Dimensionamiento según las condiciones del sitio",
      "Alternativas a definir según el proyecto",
    ],
    art: "equipo",
    image: "/images/solar.jpg",
    featured: true,
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
