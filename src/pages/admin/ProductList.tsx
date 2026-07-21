import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Card, PageHeader } from "../../components/admin/ui";
import { archiveProduct, listAllProducts, updateProduct } from "../../lib/adminApi";
import { formatPrice } from "../../lib/whatsapp";
import type { AdminProduct } from "../../types/product";

type Filter = "active" | "archived" | "all";

const filterLabels: Record<Filter, string> = {
  active: "Activos",
  archived: "Archivados",
  all: "Todos",
};

export default function ProductList() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [filter, setFilter] = useState<Filter>("active");
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    listAllProducts()
      .then(setProducts)
      .catch(() => setError("No pudimos cargar los productos."));
  };

  useEffect(reload, []);

  const handleToggleActive = async (product: AdminProduct) => {
    if (product.is_active) {
      await archiveProduct(product.id);
    } else {
      await updateProduct(product.id, { is_active: true });
    }
    reload();
  };

  const filtered = (products ?? []).filter((p) => {
    if (filter === "active") return p.is_active;
    if (filter === "archived") return !p.is_active;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Todo lo que se muestra en la tienda pública sale de aquí."
        action={
          <Link
            to="/admin/productos/nuevo"
            className="inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90"
          >
            Nuevo producto
          </Link>
        }
      />

      <div className="mt-6 inline-flex rounded-lg border border-ink/10 bg-surface p-1 text-sm">
        {(["active", "archived", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-md px-3.5 py-1.5 transition-colors ${
              filter === f ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {error && <p className="mt-8 text-sm text-red-600">{error}</p>}
      {!error && products === null && <p className="mt-8 text-sm text-ink/60">Cargando…</p>}

      {!error && products !== null && (
        <Card className="mt-6 overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-hero/10 text-xs uppercase tracking-wide text-ink/40">
                <th className="px-6 py-3 font-medium">Producto</th>
                <th className="px-6 py-3 font-medium">Categoría</th>
                <th className="px-6 py-3 font-medium">Precio</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-hero/10">
                  <td className="px-6 py-3.5 font-medium">
                    {product.name}
                    {product.is_featured && (
                      <span className="ml-2 rounded-full bg-hero-light px-2 py-0.5 text-xs font-normal text-ink/70">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-ink/60">{product.category?.name ?? "Sin categoría"}</td>
                  <td className="px-6 py-3.5 text-ink/60">{formatPrice(product.price)}</td>
                  <td className="px-6 py-3.5">
                    {product.is_active ? (
                      product.is_available ? (
                        <span className="rounded-full bg-category-sage/70 px-2 py-0.5 text-xs font-medium text-ink/70">
                          Disponible
                        </span>
                      ) : (
                        <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-medium text-ink/50">
                          Agotado
                        </span>
                      )
                    ) : (
                      <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-medium text-ink/50">
                        Archivado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-4">
                      <Link to={`/admin/productos/${product.id}`} className="text-ink/60 hover:text-ink">
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(product)}
                        className="text-ink/60 hover:text-ink"
                      >
                        {product.is_active ? "Archivar" : "Reactivar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-ink/50">
                    No hay productos en esta vista.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
