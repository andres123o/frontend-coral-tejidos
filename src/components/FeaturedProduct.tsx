import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { fadeUp } from "../lib/motion";
import { formatPrice } from "../lib/whatsapp";
import type { Product } from "../types/product";

// Art direction: una imagen compuesta para el recorte ancho de desktop (21:9)
// y otra compuesta para el recorte alto de mobile (4:5). No es el mismo
// recorte automático de CSS, cada una se ve tal como se diseñó. Editable
// desde el admin (/admin/destacado); estos son solo el respaldo mientras
// no se haya subido nada todavía.
const FALLBACK_IMAGE_DESKTOP = "/images/destacada.jpg";
const FALLBACK_IMAGE_MOBILE = "/images/destacado-mobile.jpg";

interface FeaturedProductProps {
  product: Product;
  desktopImageUrl?: string | null;
  mobileImageUrl?: string | null;
}

/**
 * Momento editorial a todo el ancho (fuera del Container, igual que el Hero):
 * una sola foto grande de campaña (no el recorte de producto), texto
 * superpuesto con degradado: el lenguaje real de campaña de Gucci/Prada,
 * no una card de grid ni un panel imagen+texto.
 */
export default function FeaturedProduct({ product, desktopImageUrl, mobileImageUrl }: FeaturedProductProps) {
  const displayPrice = product.is_on_promo && product.promo_price ? product.promo_price : product.price;

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
      <Link
        to={`/producto/${product.slug}`}
        className="group relative block aspect-[4/5] min-h-[320px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-deep focus-visible:ring-offset-2 sm:aspect-[21/9]"
      >
        <picture>
          <source media="(min-width: 640px)" srcSet={desktopImageUrl || FALLBACK_IMAGE_DESKTOP} />
          <img
            src={mobileImageUrl || FALLBACK_IMAGE_MOBILE}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        <span className="absolute left-6 top-6 rounded-full border border-surface/70 px-3 py-1 text-xs text-surface sm:left-10 sm:top-10">
          Destacado
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6 text-surface sm:p-10">
          <h3 className="font-display text-3xl sm:text-4xl">{product.name}</h3>
          <p className="mt-2 text-lg">{formatPrice(displayPrice)}</p>
          <span className="mt-4 inline-flex items-center border-b border-surface pb-1 text-button transition-opacity group-hover:opacity-70">
            Ver pieza
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
