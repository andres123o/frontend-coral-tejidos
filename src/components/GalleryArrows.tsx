interface GalleryArrowsProps {
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  className?: string;
}

/**
 * Flechas de navegación de galería. En tablet/desktop (sm y más), muy
 * sutiles: invisibles en reposo, aparecen solo al pasar el mouse sobre el
 * contenedor padre (que debe tener la clase `group`), sin cambios ahí.
 * En mobile no hay mouse/hover, así que se muestran siempre y con un área
 * de toque más grande (más cerca de las 44px que recomienda Apple/Google).
 */
export default function GalleryArrows({ onPrev, onNext, className = "" }: GalleryArrowsProps) {
  const base =
    "absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-ink/40 opacity-100 transition-opacity duration-200 hover:text-ink/70 max-sm:active:scale-90 max-sm:active:bg-ink/10 focus-visible:opacity-100 focus-visible:outline-none sm:p-1.5 sm:opacity-0 sm:group-hover:opacity-100";

  return (
    <div className={className}>
      <button type="button" onClick={onPrev} aria-label="Foto anterior" className={`${base} left-2`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button type="button" onClick={onNext} aria-label="Foto siguiente" className={`${base} right-2`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
