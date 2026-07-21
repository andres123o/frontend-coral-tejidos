import { useLocation } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import AppRouter from "./router";

export default function App() {
  const location = useLocation();
  // La vista de producto es una toma completa de pantalla (100vh, sin scroll)
  // con su propio botón de cierre, así que no lleva el header/footer del sitio.
  const isFullScreenRoute = location.pathname.startsWith("/producto/");
  // El admin tiene su propio layout (AdminLayout), tampoco lleva el
  // header/footer público.
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isFullScreenRoute || isAdminRoute) {
    return <AppRouter />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}
