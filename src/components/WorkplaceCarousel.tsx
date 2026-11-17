"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Workplace } from "@/content/workplaces";
import { Pin } from "./Icons";

export function WorkplaceCarousel({ workplace }: { workplace: Workplace }) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const activeRef = useRef(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageUrl = useCallback(
    (index: number) => `/api/media/${encodeURIComponent(`workplace.${workplace.key}.${index + 1}`)}`,
    [workplace.key],
  );

  useEffect(() => {
    if (workplace.images.length < 2) return;
    let transitionTimeout: number | undefined;
    const preload = (index: number) => {
      const image = new window.Image();
      image.src = imageUrl(index);
    };
    preload(1);

    const interval = window.setInterval(() => {
      const current = activeRef.current;
      const next = (current + 1) % workplace.images.length;
      activeRef.current = next;
      setPrevious(current);
      setActive(next);
      preload((next + 1) % workplace.images.length);
      window.clearTimeout(transitionTimeout);
      transitionTimeout = window.setTimeout(() => setPrevious(null), 700);
    }, 4500);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(transitionTimeout);
    };
  }, [imageUrl, workplace.images]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxIndex !== null && !dialog.open) dialog.showModal();
    if (lightboxIndex === null && dialog.open) dialog.close();
  }, [lightboxIndex]);

  const moveLightbox = (direction: -1 | 1) => {
    setLightboxIndex((current) =>
      current === null ? current : (current + direction + workplace.images.length) % workplace.images.length,
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxIndex(active)}
        aria-label={`Ampliar imágenes de ${workplace.title}`}
        className="group w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#232b2f]">
          {previous !== null && (
            <Image
              src={imageUrl(previous)}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              unoptimized
              aria-hidden
              className="object-cover"
            />
          )}
          <Image
            key={imageUrl(active)}
            src={imageUrl(active)}
            alt={`${workplace.title}, ${workplace.location}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            unoptimized
            className="animate-[workplace-fade_700ms_ease-out] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <div className="border-b-2 border-linea pb-4 pt-4 transition-colors group-hover:border-verde">
          <h3 className="font-display text-[1.375rem] font-bold uppercase leading-tight">{workplace.title}</h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-acero">
            <Pin width={17} height={17} className="shrink-0 text-verde" />
            {workplace.location}
          </p>
        </div>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Imágenes de ${workplace.title}`}
        onClose={() => setLightboxIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setLightboxIndex(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") moveLightbox(-1);
          if (event.key === "ArrowRight") moveLightbox(1);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-black/95 p-4 text-white backdrop:bg-black/80"
      >
        {lightboxIndex !== null && (
          <div className="mx-auto flex h-full max-w-7xl flex-col">
            <div className="flex items-center justify-between gap-4 py-2">
              <p className="font-display text-lg font-semibold uppercase">
                {workplace.title} <span className="text-white/65">{lightboxIndex + 1} / {workplace.images.length}</span>
              </p>
              <button type="button" onClick={() => setLightboxIndex(null)} className="btn btn-linea">
                Cerrar
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image
                key={imageUrl(lightboxIndex)}
                src={imageUrl(lightboxIndex)}
                alt={`${workplace.title}, ${workplace.location}`}
                fill
                sizes="100vw"
                unoptimized
                className="object-contain"
                priority
              />
            </div>
            <div className="flex justify-center gap-4 py-3">
              <button type="button" onClick={() => moveLightbox(-1)} className="btn btn-linea">
                Anterior
              </button>
              <button type="button" onClick={() => moveLightbox(1)} className="btn btn-linea">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
