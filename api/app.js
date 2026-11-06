import express from "express";
import banner from "./banner.js";

// The /api/banner routes as a small Express app. Mounted by server.js in
// production and by vite.config.js during `npm run dev` / `npm run preview`,
// so both serve the exact same handler.
export function createApi() {
  const app = express();
  app.use(express.json());
  // Express's req/res already provide the req.query, req.body and
  // res.status().json() that banner.js uses, so it needs no adapter.
  app.all("/api/banner", (req, res) => banner(req, res));
  return app;
}
