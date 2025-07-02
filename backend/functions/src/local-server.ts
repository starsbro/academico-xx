// Polyfill DOMMatrix for pdfjs-dist legacy build in Node.js
(global as any).DOMMatrix = class {};

import 'dotenv/config';
import express from "express";
import cors from "cors";
import apiRoutes from "./routes";

const app = express();

// Allow all CORS for local testing
app.use(cors());

// Do NOT use express.json() globally to avoid breaking file uploads
// app.use(express.json());

// Logging middleware (optional)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/", apiRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Local Express server running on http://localhost:${PORT}`);
});
