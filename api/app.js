import express from "express";
import banner from "./banner.js";

// The /api/banner route. Used by server.js and by vite.config.js for npm run dev.
export function createApi() {
  const app = express();
  app.use(express.json());
  // banner.js works with Express as-is, no changes needed
  app.all("/api/banner", (req, res) => banner(req, res));
  return app;
}
