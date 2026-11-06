import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createApi } from "./api/app.js";

// Serves /api/banner from Vite's own dev and preview servers, so the live
// course lookup works under plain `npm run dev` without building first.
// Editing anything under api/ restarts the dev server automatically.
const bannerApi = () => ({
  name: "banner-api",
  configureServer(server) { server.middlewares.use(createApi()); },
  configurePreviewServer(server) { server.middlewares.use(createApi()); },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), bannerApi()],
});
