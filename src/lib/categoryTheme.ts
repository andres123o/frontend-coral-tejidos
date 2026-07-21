/**
 * Mapea el slug de categoría al color-block de la paleta (ver documentacion/filosofia-diseno-coral-tejidos.md).
 * Vive en un solo lugar para poder remapear sin tocar componentes.
 */
const CATEGORY_COLORS: Record<string, string> = {
  amigurumis: "bg-category-malva",
  hogar: "bg-category-sage",
  bebe: "bg-category-salmon",
  accesorios: "bg-category-polvo",
  prendas: "bg-category-arena",
  "ediciones-especiales": "bg-category-aqua",
};

const FALLBACK_COLORS = Object.values(CATEGORY_COLORS);

export function getCategoryColorClass(categorySlug: string | undefined): string {
  if (categorySlug && CATEGORY_COLORS[categorySlug]) {
    return CATEGORY_COLORS[categorySlug];
  }
  if (!categorySlug) return FALLBACK_COLORS[0];

  // Fallback determinístico para categorías nuevas que aún no tienen color asignado.
  let hash = 0;
  for (let i = 0; i < categorySlug.length; i += 1) {
    hash = (hash * 31 + categorySlug.charCodeAt(i)) % FALLBACK_COLORS.length;
  }
  return FALLBACK_COLORS[hash];
}
