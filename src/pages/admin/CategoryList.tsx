import { useEffect, useState } from "react";

import { Button, Card, PageHeader, TextInput } from "../../components/admin/ui";
import { createCategory, deleteCategory, listAllCategoriesAdmin, updateCategory } from "../../lib/adminApi";
import type { Category } from "../../types/product";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    listAllCategoriesAdmin()
      .then(setCategories)
      .catch(() => setError("No pudimos cargar las categorías."));
  };

  useEffect(reload, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createCategory({ name: newName.trim() });
    setNewName("");
    reload();
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const saveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    await updateCategory(id, { name: editingName.trim() });
    setEditingId(null);
    reload();
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    reload();
  };

  return (
    <div>
      <PageHeader title="Categorías" description="Se usan para organizar y filtrar el catálogo público." />

      <Card className="mt-6">
        <form onSubmit={handleCreate} className="flex gap-2">
          <TextInput
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nueva categoría"
            className="max-w-sm flex-1"
          />
          <Button type="submit">Agregar</Button>
        </form>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        {categories && (
          <ul className="mt-6 divide-y divide-ink/5">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between py-3">
                {editingId === category.id ? (
                  <TextInput
                    value={editingName}
                    autoFocus
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(category.id)}
                    onBlur={() => saveEdit(category.id)}
                    className="max-w-xs"
                  />
                ) : (
                  <span className="text-sm">{category.name}</span>
                )}

                <div className="flex gap-4 text-sm text-ink/60">
                  <button type="button" onClick={() => startEdit(category)} className="hover:text-ink">
                    Renombrar
                  </button>
                  <button type="button" onClick={() => handleDelete(category.id)} className="hover:text-red-600">
                    Borrar
                  </button>
                </div>
              </li>
            ))}
            {categories.length === 0 && <li className="py-6 text-sm text-ink/50">Sin categorías todavía.</li>}
          </ul>
        )}
      </Card>

      <p className="mt-4 text-xs text-ink/40">
        Si borras una categoría que tiene productos, esos productos quedan sin categoría, no se borran.
      </p>
    </div>
  );
}
