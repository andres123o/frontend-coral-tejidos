import { useEffect, useState } from "react";

import CategoryFilter from "../components/CategoryFilter";
import FeaturedProduct from "../components/FeaturedProduct";
import Hero from "../components/Hero";
import Container from "../components/layout/Container";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import { ProductGridSkeleton } from "../components/Skeleton";
import { getStoreSettings, listCategories, listProducts } from "../lib/api";
import type { Category, Product, StoreSettings } from "../types/product";

// Cuántos productos mostrar antes del corte editorial de "Destacado". Es fijo,
// pensado para ~2 filas de grid. En mobile (grid de 2 columnas) son 4
// productos = 2 filas; en tablet/desktop (mismo breakpoint "sm" que el resto
// de ajustes mobile-only del sitio) son 8, sin cambios respecto a antes.
const FEATURED_BREAK_AFTER_MOBILE = 4;
const FEATURED_BREAK_AFTER_DESKTOP = 8;

export default function Home() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 640px)").matches);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
    getStoreSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
      listProducts({ category: category ?? undefined, q: search || undefined })
        .then(setProducts)
        .catch(() => setError("No pudimos cargar el catálogo. Intenta de nuevo en un momento."));
    }, 250); // debounce de búsqueda

    return () => clearTimeout(timeout);
  }, [category, search]);

  const showFeatured = !category && !search;
  // Por ahora, un solo producto destacado (se puede ampliar más adelante).
  const featured = (products?.filter((p) => p.is_featured) ?? []).slice(0, 1)[0] ?? null;

  // Evita mostrar (y animar) el mismo producto dos veces en la página cuando
  // ya aparece en el bloque "Destacado".
  const restProducts = showFeatured && featured ? (products ?? []).filter((p) => p.id !== featured.id) : products ?? [];

  const breakAfter = isDesktop ? FEATURED_BREAK_AFTER_DESKTOP : FEATURED_BREAK_AFTER_MOBILE;
  const firstBatch = showFeatured ? restProducts.slice(0, breakAfter) : restProducts;
  const secondBatch = showFeatured ? restProducts.slice(breakAfter) : [];

  return (
    <div>
      <Hero />

      <Container as="section" className="py-16">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <CategoryFilter categories={categories} active={category} onSelect={setCategory} />
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {error && <p className="py-16 text-center text-ink/60">{error}</p>}
        {!error && products === null && <ProductGridSkeleton />}
        {!error && products !== null && <ProductGrid products={firstBatch} />}
      </Container>

      {showFeatured && !error && featured && (
        <FeaturedProduct
          product={featured}
          desktopImageUrl={settings?.featured_image_desktop_url}
          mobileImageUrl={settings?.featured_image_mobile_url}
        />
      )}

      {showFeatured && !error && secondBatch.length > 0 && (
        <Container as="section" className="py-16">
          <ProductGrid products={secondBatch} />
        </Container>
      )}
    </div>
  );
}
