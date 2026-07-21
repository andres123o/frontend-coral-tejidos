import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ImageUploader from "../../components/admin/ImageUploader";
import { BackLink, Button, Card, Field, PageHeader, Select, Textarea, TextInput } from "../../components/admin/ui";
import { createProduct, getProduct, updateProduct } from "../../lib/adminApi";
import { listCategories } from "../../lib/api";
import type { Category, ProductInput } from "../../types/product";

const EMPTY: ProductInput = {
  name: "",
  subtitle: "",
  description: "",
  price: 0,
  promo_price: null,
  is_on_promo: false,
  category_id: null,
  images: [],
  colors: [],
  scarcity_label: "",
  is_available: true,
  is_featured: false,
};

function ColorChips({ colors, onChange }: { colors: string[]; onChange: (colors: string[]) => void }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value || colors.includes(value)) return;
    onChange([...colors, value]);
    setDraft("");
  };

  return (
    <Field label="Colores disponibles" hint="Si dejas solo un color, se muestra como texto. Con dos o más, la persona elige antes de comprar.">
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <span
            key={color}
            className="flex items-center gap-1.5 rounded-full bg-hero/20 px-3 py-1 text-sm text-ink/80"
          >
            {color}
            <button type="button" onClick={() => onChange(colors.filter((c) => c !== color))} aria-label={`Quitar ${color}`}>
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder="Escribe un color y presiona Enter"
          className="rounded-full border border-ink/15 bg-surface px-3 py-1 text-sm outline-none focus:border-ink/30"
        />
      </div>
    </Field>
  );
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((p) =>
        setForm({
          name: p.name,
          subtitle: p.subtitle ?? "",
          description: p.description,
          price: p.price,
          promo_price: p.promo_price,
          is_on_promo: p.is_on_promo,
          category_id: p.category?.id ?? null,
          images: p.images,
          colors: p.colors,
          scarcity_label: p.scarcity_label ?? "",
          is_available: p.is_available,
          is_featured: p.is_featured,
        }),
      )
      .catch(() => setError("No pudimos cargar el producto."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit && id) {
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      navigate("/admin");
    } catch {
      setError("No pudimos guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink/60">Cargando…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <BackLink to="/admin" label="Volver a productos" />

      <PageHeader title={isEdit ? "Editar producto" : "Nuevo producto"} />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-5">
            <Field label="Nombre">
              <TextInput
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>

            <Field label="Subtítulo (opcional)">
              <TextInput
                value={form.subtitle ?? ""}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </Field>

            <Field label="Descripción">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio">
                <TextInput
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </Field>
              <Field label="Precio en promoción (opcional)">
                <TextInput
                  type="number"
                  min={0}
                  value={form.promo_price ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, promo_price: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_on_promo}
                onChange={(e) => setForm({ ...form, is_on_promo: e.target.checked })}
              />
              Está en promoción
            </label>

            <Field label="Categoría">
              <Select
                value={form.category_id ?? ""}
                onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>

            <ColorChips colors={form.colors ?? []} onChange={(colors) => setForm({ ...form, colors })} />

            <Field label="Escasez/urgencia (opcional)">
              <TextInput
                value={form.scarcity_label ?? ""}
                onChange={(e) => setForm({ ...form, scarcity_label: e.target.value })}
                placeholder='Ej. "Pieza única", "Últimas 2"'
              />
            </Field>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <ImageUploader
              images={form.images ?? []}
              onChange={(images) => setForm({ ...form, images })}
              removeBackground
            />
          </Card>

          <Card className="space-y-4">
            <p className="text-xs font-medium text-ink/60">Estado</p>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.is_available}
                onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
              />
              <span>Disponible ({'"'}Agotado{'"'} y sin botón de compra si se desmarca)</span>
            </label>

            <div>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                <span>Destacado (aparece en el bloque grande de la portada)</span>
              </label>
              <p className="mt-1 pl-6 text-xs text-ink/40">Solo un producto puede estar destacado a la vez.</p>
            </div>
          </Card>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
