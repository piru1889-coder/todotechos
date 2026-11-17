"use client";

import { useEffect, useState } from "react";
import type { Workplace } from "@/content/workplaces";
import { Reveal } from "./Reveal";
import { WorkplaceCarousel } from "./WorkplaceCarousel";

export function WorkplacesGallery({ initialWorkplaces }: { initialWorkplaces: Workplace[] }) {
  const [items, setItems] = useState(initialWorkplaces);

  useEffect(() => {
    let active = true;
    fetch("/api/workplaces", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`No se pudieron cargar las obras: HTTP ${response.status}`);
        return (await response.json()) as Workplace[];
      })
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((error: unknown) => {
        console.error("[WorkplacesGallery] No se pudieron actualizar los nombres de las obras.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((workplace, index) => (
        <Reveal key={workplace.key} demora={index * 70}>
          <WorkplaceCarousel workplace={workplace} />
        </Reveal>
      ))}
    </div>
  );
}
