import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button, Field, TextInput } from "../../components/admin/ui";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";

export default function Login() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);
    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-ink px-12 py-12 text-surface lg:flex">
        <span className="font-logotype text-2xl">Coral Tejidos</span>
        <div>
          <p className="font-display text-3xl leading-snug">Administrador de tienda</p>
          <p className="mt-3 max-w-sm text-sm text-surface/60">
            Gestiona productos, categorías y el destacado de la portada, todo desde un solo lugar.
          </p>
        </div>
        <span className="text-xs text-surface/40">Acceso privado</span>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display text-2xl lg:hidden">Administrador de tienda</h1>
          <p className="mt-1 text-sm text-ink/60">Inicia sesión para administrar la tienda.</p>

          <div className="mt-8 space-y-4">
            <Field label="Correo">
              <TextInput
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label="Contraseña">
              <TextInput
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="mt-8 w-full">
            {submitting ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
