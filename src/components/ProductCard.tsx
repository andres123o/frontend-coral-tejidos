import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

import { getCategoryColorClass } from "../lib/categoryTheme";
import { fadeUp } from "../lib/motion";
import { formatPrice } from "../lib/whatsapp";
import type { Product } from "../types/product";
import GalleryArrows from "./GalleryArrows";
import PromoBadge from "./PromoBadge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const colorClass = getCategoryColorClass(product.category?.slug);
  const displayPrice = product.is_on_promo && product.promo_price ? product.promo_price : product.price;
  const currentImage = product.images[activeImage] ?? product.images[0];
  const hasGallery = product.images.length > 1;

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
  };
  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImage((i) => (i + 1) % product.images.length);
  };

  return (
    <motion.div variants={fadeUp} className="group relative">
      <Link
        to={`/producto/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-deep focus-visible:ring-offset-2"
      >
        <div
          className={`card-surface relative aspect-card overflow-hidden rounded-card ${colorClass} ${
            product.is_available ? "" : "grayscale-[40%]"
          }`}
        >
          {product.is_on_promo && product.is_available && <PromoBadge />}
          {!product.is_available && (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-surface">
              Agotado
            </span>
          )}

          <motion.div layoutId={`product-image-${product.slug}`} className="flex h-full items-center justify-center p-4 sm:p-8">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="font-display tracking-wide text-ink/40">Coral Tejidos</span>
            )}
          </motion.div>

          {hasGallery && <GalleryArrows onPrev={goPrev} onNext={goNext} />}
        </div>

        <div className="flex items-center justify-between pt-3">
          <div>
            <h3 className="font-display text-card-title">{product.name}</h3>
            {product.subtitle && <p className="text-xs text-ink/50">{product.subtitle}</p>}
            <p className="text-sm text-ink/70">{formatPrice(displayPrice)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
