import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";

// Code-splitting: el detalle de producto no se carga en el bundle inicial del catálogo.
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// El admin entero es su propio chunk, así que nadie en el sitio público lo descarga.
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminProductList = lazy(() => import("./pages/admin/ProductList"));
const AdminProductForm = lazy(() => import("./pages/admin/ProductForm"));
const AdminCategoryList = lazy(() => import("./pages/admin/CategoryList"));
const AdminStoreSettings = lazy(() => import("./pages/admin/StoreSettingsPage"));

export default function AppRouter() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Las rutas de admin no llevan la animación de transición del sitio
  // público (AnimatePresence/key por pathname) porque son una app aparte.
  if (isAdminRoute) {
    return (
      <Suspense fallback={null}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProductList />} />
            <Route path="productos/nuevo" element={<AdminProductForm />} />
            <Route path="productos/:id" element={<AdminProductForm />} />
            <Route path="categorias" element={<AdminCategoryList />} />
            <Route path="destacado" element={<AdminStoreSettings />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route
          path="/producto/:slug"
          element={
            <Suspense fallback={null}>
              <ProductDetail />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
