/**
 * Datos generales del sitio.
 * Todo lo que el futuro panel admin va a editar vive en /src/content.
 * IMPORTANTE: teléfono, WhatsApp, email y domicilio son PROVISORIOS
 * hasta que TODO TECHOS confirme los datos oficiales.
 */
export const site = {
  name: "TODO TECHOS",
  tagline: "Construcciones & Metalúrgica",
  url: "https://www.todotechos.com.ar",
  description:
    "Naves industriales, obras de infraestructura, cañerías industriales, zinguería y energía solar para empresas.",
  /** Mientras sea true se muestra el aviso de "contenido de muestra" en el pie. */
  demo: true,
  year: 2026,

  hero: {
    /** El video queda como archivo estático; solo su imagen alternativa se administra en el panel. */
    video: "/api/media/hero.video",
    poster: "/api/media/hero.poster",
    titleLines: [
      "INGENIERÍA Y CONSTRUCCIÓN DE ",
      " NAVES LOGÍSTICAS E INDUSTRIALES",
    ],
    subtitle:
      'Soluciones "llave en mano" respaldadas por más de 60 años de experiencia en el sector industrial.',
  },

  about: {
    intro:
      "En TODO TECHOS desarrollamos soluciones para proyectos industriales y empresariales, integrando experiencia, capacidad operativa y compromiso con cada obra. Nuestros servicios abarcan naves, infraestructura, cañerías, zinguería y energía solar.",
  },

  contact: {
    phone: "+54 381 448-1270",
    phoneHref: "tel:+543814481270",
    whatsapp: "5493814481270",
    whatsappMessage: "Hola, quiero consultar por un proyecto para TODO TECHOS",
    email: "info@todotechos.com.ar",
    address: "Av. Ejército del Norte 1890",
    province: "Tucumán, Argentina",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.+Ej%C3%A9rcito+del+Norte+1890%2C+Tucum%C3%A1n%2C+Argentina",
    mapsEmbed:
      "https://www.google.com/maps?q=Av.+Ej%C3%A9rcito+del+Norte+1890%2C+Tucum%C3%A1n%2C+Argentina&z=16&output=embed",
    instagram: "https://www.instagram.com/todotechos",
    instagramHandle: "@todotechos",
  },
} as const;

export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
  site.contact.whatsappMessage,
)}`;

export const nav = [
  { href: "/", label: "Inicio" },
  { href: "/empresa", label: "Empresa" },
  { href: "/servicios", label: "Servicios" },
  { href: "/clientes", label: "Clientes" },
  { href: "/contacto", label: "Contacto" },
] as const;

/**
 * Indicadores de capacidad. El brief pide usar solo cifras verificadas:
 * por eso hay una sola cifra (a confirmar) y el resto son ventajas cualitativas.
 */
export const indicators = [
  {
    value: "Soluciones a medida",
    label:
      "Adaptamos cada proyecto a las necesidades específicas de cada cliente.",
  },
  {
    text: "Taller propio",
    label: "fabricación y montaje con equipo de la empresa",
  },
  { text: "Obra integral", label: "del movimiento de suelo a la cubierta" },
  {
    text: "Compromiso asumido",
    label: "Garantizamos la entrega de nuestros proyectos en tiempo y forma.",
  },
] as const;
