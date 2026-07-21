import { Link } from "react-router-dom";

import Logo from "../Logo";
import Container from "./Container";

export default function Header() {
  return (
    <header className="bg-surface">
      <Container className="flex items-center justify-center py-0.5 sm:justify-start">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-14 w-14 text-ink sm:h-14 sm:w-14" />
          <span className="font-logotype text-2xl font-normal leading-none tracking-[-0.01em] text-ink sm:text-2xl">
            Coral Tejidos
          </span>
        </Link>
      </Container>
    </header>
  );
}
