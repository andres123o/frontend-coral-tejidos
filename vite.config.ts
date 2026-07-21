import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // En Windows, el watcher de archivos a veces no detecta cambios en
    // tailwind.config.js y sirve CSS viejo hasta reiniciar. Polling lo evita.
    watch: {
      usePolling: true,
    },
  },
  build: {
    // Code-splitting explícito por vendor pesado, para que el bundle inicial
    // del catálogo no cargue framer-motion/react-router de una sola vez.
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["framer-motion"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
