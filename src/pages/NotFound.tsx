import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-display text-2xl">Página no encontrada.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Volver al catálogo
      </Link>
    </div>
  );
}
