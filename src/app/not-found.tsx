import Link from "next/link";
import { PageHero } from "@/components/Bloques";
import { Flecha } from "@/components/Icons";

export default function NoEncontrada() {
  return (
    <PageHero titulo="Página no encontrada" bajada="El enlace puede estar mal escrito o la página ya no existe.">
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-verde">
          Volver al inicio <Flecha />
        </Link>
      </div>
    </PageHero>
  );
}
