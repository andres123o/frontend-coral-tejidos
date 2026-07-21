import { motion } from "framer-motion";

import { easeOutExpo } from "../lib/motion";

/**
 * Full-bleed, editorial hero. La imagen va en `public/images/hero-crochet.jpg`
 * (drop-in, sin tocar código). Mientras no exista, se ve el degradado sobre el
 * pastel de fondo, así que no queda roto ni vacío.
 *
 * La imagen y el texto viven en capas separadas: el filtro/velo de color solo
 * se aplica a la capa de fondo, para que el texto no quede afectado por el filter.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero px-6 py-16 text-center sm:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center grayscale-[35%]"
        style={{ backgroundImage: "url('/images/hero-crochet.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/50 to-ink/65" />

      <div className="relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="text-eyebrow text-surface/80"
        >
          Artesanía atemporal
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="mt-3 font-display text-hero font-bold tracking-[0.02em] text-surface"
        >
          Belleza tejida a mano
        </motion.h1>
      </div>
    </section>
  );
}
