import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createApi } from "./api/app.js";

// Adds /api/banner to npm run dev and npm run preview, so the lookup works without building.
const bannerApi = () => ({
  name: "banner-api",
  configureServer(server) { server.middlewares.use(createApi()); },
  configurePreviewServer(server) { server.middlewares.use(createApi()); },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), bannerApi()],
});
