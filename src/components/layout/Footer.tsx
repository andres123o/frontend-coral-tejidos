import { FaHeart, FaInstagram, FaWhatsapp } from "react-icons/fa";

import { buildGeneralWhatsappLink } from "../../lib/whatsapp";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 py-8">
      <Container className="flex flex-col items-center gap-4 text-sm text-ink/60 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/coral_tejido/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Coral Tejidos"
            className="transition-colors hover:text-ink"
          >
            <FaInstagram className="h-5 w-5" />
          </a>
          <a
            href={buildGeneralWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp de Coral Tejidos"
            className="transition-colors hover:text-ink"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>
        </div>

        <p className="flex items-center gap-1.5">
          Hecho con <FaHeart className="h-3.5 w-3.5 text-red-500" aria-hidden="true" /> en Suesca, Colombia
        </p>
      </Container>
    </footer>
  );
}
