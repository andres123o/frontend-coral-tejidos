export function ProductCardSkeleton() {
  return (
    <div className="aspect-card w-full animate-pulse rounded-card bg-ink/5">
      <div className="flex h-full flex-col justify-end gap-2 p-5">
        <div className="h-4 w-2/3 rounded bg-ink/10" />
        <div className="h-3 w-1/3 rounded bg-ink/10" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
