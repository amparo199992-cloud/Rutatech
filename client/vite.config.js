import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // En desarrollo, las llamadas a /api van al servidor Express (mismo origen → cookies sin CORS).
    proxy: {
      "/api": "http://localhost:4000",
      "/sitemap.xml": "http://localhost:4000",
    },
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
