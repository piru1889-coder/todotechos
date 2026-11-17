export type Workplace = {
  key: string;
  title: string;
  location: string;
  images: string[];
};

const imageSet = (folder: string, count: number) =>
  Array.from({ length: count }, (_, index) => `/images/${folder}/${index + 1}.jpg`);

export const workplaces: Workplace[] = [
  { key: "centro-comercial", title: "Centro comercial", location: "Calafate, Santa Cruz", images: imageSet("CentroComercialSantaCruz", 5) },
  { key: "obra-confitera", title: "Obra Confitera", location: "Dique El Jumeal, Catamarca", images: imageSet("ConfiteraCatamarca", 7) },
  { key: "hotel-garden-plaza", title: "Hotel Garden Plaza", location: "Tucumán", images: imageSet("HotelGrandPlazaTucuman", 9) },
  { key: "hospital-el-rodeo", title: "Hospital El Rodeo", location: "Catamarca", images: imageSet("HospitalCatamarca", 4) },
  {
    key: "la-sevillanita",
    title: "La Sevillanita",
    location: "Parque Industrial El Pantanillo, Catamarca",
    images: imageSet("LasevillanitaCatamarca", 8),
  },
  { key: "fabrica-navatuc", title: "Fábrica Navatuc SRL", location: "Tucumán", images: imageSet("NavatucTucuman", 3) },
  { key: "obra-rios", title: "Obra Ríos", location: "Catamarca", images: imageSet("RiosCatamarca", 7) },
  { key: "sanatorio-jalil", title: "Sanatorio Jalil", location: "Catamarca", images: imageSet("sanatorioCatamarca", 6) },
];
