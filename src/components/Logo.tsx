"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Logo estático vectorial y tipográfico hasta contar con el archivo original.
 */
export function Logo({ tono = "claro", className = "" }: { tono?: "claro" | "oscuro"; className?: string }) {
  const texto = tono === "claro" ? "text-white" : "text-tinta";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label="TODO TECHOS, Construcciones y Metalúrgica">
      <LogoImageFallback texto={texto} />
    </span>
  );
}

function LogoImageFallback({ texto }: { texto: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <Image
        src="/api/media/brand.logo"
        alt=""
        aria-hidden
        width={600}
        height={240}
        unoptimized
        onError={() => setFailed(true)}
        className="h-[55px] w-[150px] object-contain"
      />
    );
  }

  return (
    <>
      <svg
        viewBox="0 0 150 22"
        className="-mb-[3px] ml-[2px] h-[15px] w-[104px] text-verde-luz"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinejoin="miter"
        aria-hidden
      >
        <path d="M2 20 62 3l26 7.400V4h9v9l28 7" />
      </svg>
      <span className={`font-display text-[1.72rem] font-bold tracking-[0.01em] ${texto} transition-colors duration-300`}>
        TODO TECHOS
      </span>
      <span className="mt-[3px] bg-verde px-[5px] py-[2.500px] font-display text-[0.56rem] font-semibold tracking-[0.13em] text-white">
        CONSTRUCCIONES &amp; METALÚRGICA
      </span>
    </>
  );
}
