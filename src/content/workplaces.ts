export type Workplace = {
  title: string;
  location: string;
  images: string[];
};

const imageSet = (folder: string, count: number) =>
  Array.from({ length: count }, (_, index) => `/images/${folder}/${index + 1}.jpg`);

export const workplaces: Workplace[] = [
  { title: "Centro comercial", location: "Calafate, Santa Cruz", images: imageSet("CentroComercialSantaCruz", 5) },
  { title: "Obra Confitera", location: "Dique El Jumeal, Catamarca", images: imageSet("ConfiteraCatamarca", 7) },
  { title: "Hotel Garden Plaza", location: "Tucumán", images: imageSet("HotelGrandPlazaTucuman", 9) },
  { title: "Hospital El Rodeo", location: "Catamarca", images: imageSet("HospitalCatamarca", 4) },
  {
    title: "La Sevillanita",
    location: "Parque Industrial El Pantanillo, Catamarca",
    images: imageSet("LasevillanitaCatamarca", 8),
  },
  { title: "Fábrica Navatuc SRL", location: "Tucumán", images: imageSet("NavatucTucuman", 3) },
  { title: "Obra Ríos", location: "Catamarca", images: imageSet("RiosCatamarca", 7) },
  { title: "Sanatorio Jalil", location: "Catamarca", images: imageSet("sanatorioCatamarca", 6) },
];
