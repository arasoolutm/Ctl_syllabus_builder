// Runs the whole app (built frontend + /api/banner proxy) as one Node process.
// Works on any host that can run Node 20+: a UTM VM, Render, Railway, Docker, etc.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApi } from "./api/app.js";

const app = express();
const dir = path.dirname(fileURLToPath(import.meta.url));

app.use(createApi());

// Serve the Vite build; send unknown paths to index.html.
app.use(express.static(path.join(dir, "dist")));
app.get(/.*/, (req, res) => res.sendFile(path.join(dir, "dist", "index.html")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Syllabus Builder on http://localhost:${port}`));
