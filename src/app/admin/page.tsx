"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { Workplace } from "@/content/workplaces";

type MediaSlot = {
  key: string;
  section: string;
  label: string;
  mediaType: "image" | "video";
  recommendedSize: string;
  formatHelp: string;
  workplaceKey: string | null;
  imageNumber: number | null;
  fallback: string | null;
  uploaded: boolean;
  fitMode: "cover" | "contain";
  contentType: string | null;
  byteSize: number | null;
  updatedAt: string | null;
};

const formatSize = (size: number | null) =>
  size === null ? "" : size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [slots, setSlots] = useState<MediaSlot[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState("");
  const [search, setSearch] = useState("");
  const [revision, setRevision] = useState(0);

  const loadSlots = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      setAuthenticated(true);
      if (!response.ok) {
        setMessage(result.error || "No se pudieron cargar las imágenes.");
        return;
      }
      setMessage("");
      setSlots(result.slots as MediaSlot[]);
      setWorkplaces(result.workplaces as Workplace[]);
    } catch {
      setAuthenticated(false);
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSlots(), 0);
    return () => window.clearTimeout(timer);
  }, [loadSlots]);

  const filteredSlots = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    if (!query) return slots;
    return slots.filter((slot) => `${slot.section} ${slot.label} ${slot.key}`.toLocaleLowerCase("es").includes(query));
  }, [search, slots]);

  const groups = useMemo(
    () =>
      filteredSlots.reduce<Record<string, MediaSlot[]>>((result, slot) => {
        if (slot.workplaceKey) return result;
        (result[slot.section] ??= []).push(slot);
        return result;
      }, {}),
    [filteredSlots],
  );
  const filteredWorkplaces = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    if (!query) return workplaces;
    return workplaces.filter((workplace) =>
      `${workplace.title} ${workplace.location} ${workplace.key}`.toLocaleLowerCase("es").includes(query) ||
      filteredSlots.some((slot) => slot.workplaceKey === workplace.key),
    );
  }, [filteredSlots, search, workplaces]);

  async function logIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "No se pudo iniciar sesión.");
        return;
      }
      setAuthenticated(true);
      setPassword("");
      await loadSlots();
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function upload(slot: MediaSlot, file: File) {
    setBusyKey(slot.key);
    setMessage("");
    try {
      const form = new FormData();
      form.set("key", slot.key);
      form.set("file", file);
      form.set("fitMode", slot.fitMode);
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        setMessage("La sesión venció. Volvé a ingresar.");
        return;
      }
      if (!response.ok) {
        setMessage(result.error || `No se pudo guardar ${slot.label}.`);
        return;
      }
      await loadSlots();
      setRevision((current) => current + 1);
      setMessage(`Se actualizó “${slot.label}”.`);
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setBusyKey("");
    }
  }

  async function changeFit(slot: MediaSlot, fitMode: "cover" | "contain") {
    setBusyKey(slot.key);
    setMessage("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: slot.key, fitMode }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        setMessage("La sesión venció. Volvé a ingresar.");
        return;
      }
      if (!response.ok) {
        setMessage(result.error || `No se pudo cambiar el ajuste de ${slot.label}.`);
        return;
      }
      await loadSlots();
      setRevision((current) => current + 1);
      setMessage(`Se actualizó el ajuste de “${slot.label}”.`);
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setBusyKey("");
    }
  }

  async function restore(slot: MediaSlot) {
    if (!window.confirm(`¿Querés restaurar el archivo original de “${slot.label}”?`)) return;
    setBusyKey(slot.key);
    setMessage("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: slot.key }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        setMessage("La sesión venció. Volvé a ingresar.");
        return;
      }
      if (!response.ok) {
        setMessage(result.error || `No se pudo restaurar ${slot.label}.`);
        return;
      }
      await loadSlots();
      setRevision((current) => current + 1);
      setMessage(`Se restauró el archivo original de “${slot.label}”.`);
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setBusyKey("");
    }
  }

  async function saveWorkplace(workplace: Workplace) {
    const busyId = `workplace:${workplace.key}`;
    setBusyKey(busyId);
    setMessage("");
    try {
      const response = await fetch("/api/admin/workplaces", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: workplace.key,
          title: workplace.title,
          location: workplace.location,
        }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setAuthenticated(false);
        setMessage("La sesión venció. Volvé a ingresar.");
        return;
      }
      if (!response.ok) {
        setMessage(result.error || `No se pudieron guardar los datos de ${workplace.title}.`);
        return;
      }
      setMessage(`Se guardaron el nombre y la ubicación de “${workplace.title}”.`);
    } catch {
      setMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setBusyKey("");
    }
  }

  function changeWorkplace(key: string, field: "title" | "location", value: string) {
    setWorkplaces((current) =>
      current.map((workplace) => (workplace.key === key ? { ...workplace, [field]: value } : workplace)),
    );
  }

  const renderSlot = (slot: MediaSlot) => {
    const mediaUrl = `/api/media/${encodeURIComponent(slot.key)}?v=${revision}`;
    return (
      <li key={slot.key} className="flex flex-col border border-linea bg-white p-4">
        <div className="flex min-h-36 items-center justify-center overflow-hidden bg-chapa-clara p-3">
          {slot.mediaType === "video" ? (
            <video
              key={`${slot.key}-${revision}`}
              src={mediaUrl}
              controls
              muted
              playsInline
              className="max-h-40 max-w-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${slot.key}-${revision}`}
              src={mediaUrl}
              alt={`Vista previa: ${slot.label}`}
              onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
              className="max-h-32 max-w-full object-contain"
            />
          )}
        </div>
        <h3 className="mt-4 font-semibold">{slot.label}</h3>
        <p className="mt-1 text-xs text-acero">
          {slot.uploaded
            ? `${slot.mediaType === "video" ? "Video personalizado" : "Imagen personalizada"} · ${formatSize(slot.byteSize)}`
            : slot.fallback
              ? "Se muestra el archivo original del sitio"
              : "Todavía no hay un archivo cargado"}
        </p>
        <p className="mt-3 text-sm font-semibold">Tamaño recomendado: {slot.recommendedSize}</p>
        <p className="mt-1 text-sm text-acero">
          {slot.formatHelp}
          {slot.mediaType === "video" ? " Límite: 50 MB." : " Límite: 8 MB."}
        </p>
        {slot.mediaType === "image" && (
          <label className="mt-4 block text-sm font-medium">
            Cómo se muestra en el sitio
            <select
              value={slot.fitMode}
              disabled={!slot.uploaded || busyKey === slot.key}
              onChange={(event) => void changeFit(slot, event.currentTarget.value === "contain" ? "contain" : "cover")}
              className="mt-1.5 min-h-10 w-full border border-linea bg-white px-2 disabled:bg-chapa-clara disabled:text-acero"
            >
              <option value="cover">Recortar para llenar el marco</option>
              <option value="contain">Mostrar la imagen completa</option>
            </select>
          </label>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <label className={`btn btn-verde min-h-10 cursor-pointer px-3 py-2 text-sm ${busyKey === slot.key ? "pointer-events-none opacity-60" : ""}`}>
            {busyKey === slot.key
              ? "Guardando…"
              : slot.mediaType === "video"
                ? "Cambiar video"
                : "Cambiar imagen"}
            <input
              type="file"
              accept={slot.mediaType === "video" ? "video/mp4" : "image/jpeg,image/png,image/webp"}
              className="sr-only"
              disabled={busyKey === slot.key}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                if (file) void upload(slot, file);
              }}
            />
          </label>
          {slot.uploaded && (
            <button
              type="button"
              disabled={busyKey === slot.key}
              onClick={() => void restore(slot)}
              className="min-h-10 border border-linea px-3 py-2 text-sm font-semibold hover:border-verde hover:text-verde disabled:opacity-60"
            >
              Restaurar original
            </button>
          )}
        </div>
      </li>
    );
  };

  async function logOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setSlots([]);
  }

  if (authenticated === null) {
    return <div className="grid min-h-dvh place-items-center px-6 text-acero">Cargando panel…</div>;
  }

  if (!authenticated) {
    return (
      <main id="contenido" className="grid min-h-dvh place-items-center bg-chapa-clara px-5 py-12">
        <form onSubmit={logIn} className="w-full max-w-md border border-linea bg-white p-7 shadow-lg sm:p-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-verde">TODO TECHOS</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">Panel de contenidos</h1>
          <p className="mt-3 text-acero">Ingresá con la cuenta de administrador para actualizar imágenes, videos y datos de las obras.</p>
          <label className="mt-7 block text-sm font-semibold" htmlFor="admin-user">Usuario</label>
          <input
            id="admin-user"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1.5 min-h-12 w-full border border-linea px-3 outline-none focus:border-verde"
          />
          <label className="mt-4 block text-sm font-semibold" htmlFor="admin-password">Contraseña</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 min-h-12 w-full border border-linea px-3 outline-none focus:border-verde"
          />
          {message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
          <button type="submit" disabled={loading} className="btn btn-verde mt-6 w-full disabled:opacity-60">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-chapa-clara">
      <header className="border-b border-linea bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-verde">TODO TECHOS</p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase sm:text-4xl">Contenido del sitio</h1>
          </div>
          <button onClick={logOut} className="shrink-0 border border-linea px-4 py-2 text-sm font-semibold hover:border-verde hover:text-verde">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="max-w-4xl border border-linea bg-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold uppercase">Cómo actualizar el sitio</h2>
          <ol className="mt-3 grid gap-2 text-sm text-acero sm:grid-cols-3">
            <li><strong className="text-tinta">1. Buscá</strong> la parte del sitio que querés cambiar.</li>
            <li><strong className="text-tinta">2. Revisá</strong> el tamaño recomendado y elegí una imagen o video.</li>
            <li><strong className="text-tinta">3. Confirmá</strong> el resultado en la vista previa. El cambio se guarda al subirlo.</li>
          </ol>
          <p className="mt-4 text-sm text-acero">
            Los tamaños indicados son recomendaciones en píxeles, no una obligación exacta. Imágenes: JPG, PNG o WebP hasta 8 MB.
            Video del inicio: MP4 hasta 50 MB. Usá “Restaurar original” para volver al archivo inicial.
          </p>
        </div>
        <label className="mt-6 block max-w-xl">
          <span className="sr-only">Buscar imagen</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por sección o nombre…"
            className="min-h-12 w-full border border-linea bg-white px-4 outline-none focus:border-verde"
          />
        </label>

        {message && (
          <p role="status" className={`mt-5 border px-4 py-3 text-sm ${message.includes("No se pudo") || message.includes("MySQL") ? "border-red-300 bg-red-50 text-red-800" : "border-verde/30 bg-verde/5 text-verde"}`}>
            {message}
          </p>
        )}

        {Object.entries(groups).map(([section, sectionSlots]) => (
          <section key={section} className="mt-10" aria-labelledby={`section-${section}`}>
            <h2 id={`section-${section}`} className="font-display text-2xl font-bold uppercase">{section}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sectionSlots.map(renderSlot)}
            </ul>
          </section>
        ))}

        {filteredWorkplaces.map((workplace) => {
          const workplaceSlots = slots.filter((slot) => slot.workplaceKey === workplace.key);
          const busyId = `workplace:${workplace.key}`;
          return (
            <section key={workplace.key} className="mt-10 border-t border-linea pt-8" aria-labelledby={`workplace-${workplace.key}`}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 id={`workplace-${workplace.key}`} className="font-display text-2xl font-bold uppercase">
                    Obra: {workplace.title}
                  </h2>
                  <p className="mt-1 text-sm text-acero">Actualizá el nombre, la ubicación y las fotos que pasan en el carrusel de Clientes.</p>
                </div>
                <button
                  type="button"
                  disabled={busyKey === busyId}
                  onClick={() => void saveWorkplace(workplace)}
                  className="btn btn-verde min-h-10 px-4 py-2 text-sm disabled:opacity-60"
                >
                  {busyKey === busyId ? "Guardando…" : "Guardar nombre y ubicación"}
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Nombre de la obra
                  <input
                    value={workplace.title}
                    maxLength={190}
                    disabled={busyKey === busyId}
                    onChange={(event) => changeWorkplace(workplace.key, "title", event.currentTarget.value)}
                    className="mt-1.5 min-h-11 w-full border border-linea bg-white px-3"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Ubicación que aparece en la tarjeta
                  <input
                    value={workplace.location}
                    maxLength={255}
                    disabled={busyKey === busyId}
                    onChange={(event) => changeWorkplace(workplace.key, "location", event.currentTarget.value)}
                    className="mt-1.5 min-h-11 w-full border border-linea bg-white px-3"
                  />
                </label>
              </div>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {workplaceSlots.map(renderSlot)}
              </ul>
            </section>
          );
        })}
        {filteredSlots.length === 0 && filteredWorkplaces.length === 0 && (
          <p className="mt-8 text-acero">No encontramos partes del sitio con esa búsqueda.</p>
        )}
      </main>
    </div>
  );
}
