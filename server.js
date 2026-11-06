// Runs the site and the /api/banner proxy together as one Node app.
// Works anywhere that runs Node 20+.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApi } from "./api/app.js";

const app = express();
const dir = path.dirname(fileURLToPath(import.meta.url));

app.use(createApi());

// serve the built site, send any other path to index.html
app.use(express.static(path.join(dir, "dist")));
app.get(/.*/, (req, res) => res.sendFile(path.join(dir, "dist", "index.html")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Syllabus Builder on http://localhost:${port}`));
