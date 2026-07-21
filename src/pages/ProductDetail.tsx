import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";

import GalleryArrows from "../components/GalleryArrows";
import PromoBadge from "../components/PromoBadge";
import { getCategoryColorClass } from "../lib/categoryTheme";
import { routeTransition } from "../lib/motion";
import { buildWhatsappLink, formatPrice } from "../lib/whatsapp";
import { getProduct, getStoreSettings } from "../lib/api";
import type { Product, StoreSettings } from "../types/product";

const FALLBACK_SHIPPING_INFO =
  "Envíos: 2–4 días hábiles a nivel nacional · Cambios: hasta 5 días después de recibido.";

function CloseButton() {
  const navigate = useNavigate();

  const handleClose = () => {
    // Vuelve al historial (misma posición de scroll en el catálogo) en vez de
    // recargar "/" desde cero, salvo que se haya entrado directo a este link.
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Cerrar"
      className="absolute right-6 top-6 z-30 flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 max-sm:active:scale-90 max-sm:active:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-deep focus-visible:ring-offset-2 sm:h-10 sm:w-10"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    if (!slug) return;
    setProduct(null);
    setNotFound(false);
    setActiveImage(0);
    setSelectedColor(null);
    setQuantity(1);
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        setSelectedColor(p.colors[0] ?? null);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="relative flex h-dvh flex-col items-center justify-center px-6 text-center md:h-screen">
        <CloseButton />
        <p className="font-display text-2xl">No encontramos esta pieza.</p>
        <Link to="/" className="mt-4 inline-block underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="h-dvh w-full animate-pulse bg-ink/5 md:h-screen" />;
  }

  const colorClass = getCategoryColorClass(product.category?.slug);
  const displayPrice = product.is_on_promo && product.promo_price ? product.promo_price : product.price;
  const images = product.images;
  const currentImage = images[activeImage];
  const hasGallery = images.length > 1;

  // Meta tags para que compartir el link (WhatsApp/Instagram) muestre este
  // producto específico, no el título/imagen genérico del sitio.
  const pageTitle = `${product.name} | ${formatPrice(displayPrice)} | Coral Tejidos`;
  const pageDescription = product.subtitle || product.description || "Pieza de crochet hecha a mano.";
  const pageUrl = `${window.location.origin}/producto/${product.slug}`;
  const shareImage = images[0] ? `${window.location.origin}${images[0]}` : undefined;

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  };
  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImage((i) => (i + 1) % images.length);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={routeTransition}
      className="relative flex h-dvh flex-col overflow-hidden md:h-screen md:grid md:grid-cols-2"
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        {shareImage && <meta property="og:image" content={shareImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <CloseButton />

      <div className={`card-surface group relative min-h-0 flex-1 md:h-full ${colorClass}`}>
        {product.is_on_promo && <PromoBadge />}
        <motion.div
          layoutId={`product-image-${product.slug}`}
          className="flex h-full min-h-0 items-center justify-center p-10 md:p-14"
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="h-auto w-auto max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="font-display tracking-wide text-ink/40">Coral Tejidos</span>
          )}
        </motion.div>
        {hasGallery && <GalleryArrows onPrev={goPrev} onNext={goNext} />}
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-8 py-10 md:h-full md:px-16 lg:px-20">
        <div className="max-w-md">
          {product.category && (
            <p className="text-xs tracking-widest text-ink/50">{product.category.name}</p>
          )}
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">{product.name}</h1>
          {product.subtitle && <p className="mt-2 text-sm text-ink/60">{product.subtitle}</p>}

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl">{formatPrice(displayPrice)}</span>
            {product.is_on_promo && (
              <span className="text-base text-ink/40 line-through">{formatPrice(product.price)}</span>
            )}
            {product.scarcity_label && (
              <span className="rounded-full border border-ink/30 px-3 py-1 text-xs text-ink/70">
                {product.scarcity_label}
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/80">{product.description}</p>

          {product.colors.length > 1 && (
            <div className="mt-6">
              <p className="text-xs tracking-widest text-ink/50">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      selectedColor === color
                        ? "border-ink bg-ink text-surface"
                        : "border-ink/20 text-ink hover:bg-ink/5"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          {product.colors.length === 1 && (
            <p className="mt-6 text-sm text-ink/60">Color: {product.colors[0]}</p>
          )}

          {product.is_available && (
            <div className="mt-6">
              <p className="text-xs tracking-widest text-ink/50">Cantidad</p>
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Restar cantidad"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink/5 max-sm:active:scale-90 max-sm:active:bg-ink/10 sm:h-8 sm:w-8"
                >
                  −
                </button>
                <span className="w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Sumar cantidad"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink/5 max-sm:active:scale-90 max-sm:active:bg-ink/10 sm:h-8 sm:w-8"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {product.is_available ? (
            <a
              href={buildWhatsappLink(product, { color: selectedColor ?? undefined, quantity })}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block w-fit rounded-full bg-ink px-8 py-3 text-center text-button text-surface transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-deep focus-visible:ring-offset-2"
            >
              Comprar ahora
            </a>
          ) : (
            <p className="mt-10 inline-block w-fit rounded-full bg-ink/10 px-8 py-3 text-center text-button text-ink/60">
              Agotado por ahora
            </p>
          )}

          <p className="mt-6 text-xs text-ink/50">{settings?.shipping_info || FALLBACK_SHIPPING_INFO}</p>
        </div>
      </div>
    </motion.div>
  );
}
