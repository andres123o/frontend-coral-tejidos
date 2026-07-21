import type { Category } from "../types/product";

interface CategoryFilterProps {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({ categories, active, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill label="Todos" isActive={active === null} onClick={() => onSelect(null)} />
      {categories.map((category) => (
        <FilterPill
          key={category.id}
          label={category.name}
          isActive={active === category.slug}
          onClick={() => onSelect(category.slug)}
        />
      ))}
    </div>
  );
}

function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-button transition-colors max-sm:active:scale-95 focus-visible:ring-2 focus-visible:ring-hero-deep focus-visible:ring-offset-2 ${
        isActive
          ? "border-ink bg-ink text-surface"
          : "border-ink/20 bg-transparent text-ink hover:bg-ink/5"
      }`}
    >
      {label}
    </button>
  );
}
