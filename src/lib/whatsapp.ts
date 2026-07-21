import type { Product } from "../types/product";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

interface BuildWhatsappLinkOptions {
  color?: string;
  quantity?: number;
}

export function buildWhatsappLink(product: Product, options: BuildWhatsappLinkOptions = {}): string {
  const quantity = options.quantity ?? 1;
  const finalPrice = product.is_on_promo && product.promo_price ? product.promo_price : product.price;
  const total = finalPrice * quantity;
  const productUrl = `${window.location.origin}/producto/${product.slug}`;

  const lines = [
    `Hola, quiero comprar: *${product.name}*`,
    ...(options.color ? [`Color: ${options.color}`] : []),
    `Cantidad: ${quantity}`,
    quantity > 1 ? `Precio unitario: ${formatPrice(finalPrice)}` : `Precio: ${formatPrice(finalPrice)}`,
    ...(quantity > 1 ? [`Total: ${formatPrice(total)}`] : []),
    productUrl,
    "Confírmame disponibilidad y cómo pago para cerrar mi compra.",
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

/** Link genérico para contacto general (ej. footer), sin contexto de producto. */
export function buildGeneralWhatsappLink(): string {
  const message = encodeURIComponent("Hola, tengo una pregunta sobre Coral Tejidos.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
