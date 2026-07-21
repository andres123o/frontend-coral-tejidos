import { FaSignOutAlt } from "react-icons/fa";
import { NavLink, Navigate, Outlet } from "react-router-dom";

import Logo from "../../components/Logo";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";

const navItems = [
  { to: "/admin", label: "Productos", end: true },
  { to: "/admin/categorias", label: "Categorías" },
  { to: "/admin/destacado", label: "Destacado" },
];

export default function AdminLayout() {
  const { session, loading } = useSession();

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen bg-hero/10">
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-ink/10 bg-surface px-4 py-6">
        <div className="flex items-center gap-2 px-2">
          <Logo className="h-8 w-8 text-ink" />
          <span className="font-logotype text-xl leading-none text-ink">Coral Tejidos</span>
        </div>
        <span className="mt-3 px-2 text-sm text-ink/50">Bienvenida Daniela</span>

        <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-hero-deep text-surface" : "text-ink/60 hover:bg-hero/25 hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm text-ink/60 transition-colors hover:border-ink/20 hover:bg-hero/20 hover:text-ink"
        >
          <FaSignOutAlt className="h-3.5 w-3.5" />
          Salir
        </button>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-8 lg:px-12">
        <Outlet />
      </main>
    </div>
  );
}
