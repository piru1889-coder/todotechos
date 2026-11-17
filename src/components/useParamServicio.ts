"use client";

import { useSyncExternalStore } from "react";

const sinCambios = () => () => {};

/** Lee el servicio seleccionado desde la URL sin romper el prerender. */
export function useParamServicio(validos: { value: string }[]) {
  const param = useSyncExternalStore(
    sinCambios,
    () => new URLSearchParams(window.location.search).get("servicio"),
    () => null,
  );
  return param && validos.some((o) => o.value === param) ? param : null;
}
