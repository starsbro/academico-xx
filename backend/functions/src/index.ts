import {https} from "firebase-functions/v2";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import apiRoutes from "./routes";

// Add logging for all incoming requests
console.log("[BOOT] Express app starting up...");

const app = express();

// Log every incoming request (method, path, headers)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  console.log(`[REQ-HEADERS] ${JSON.stringify(req.headers)}`);
  next();
});


// Only allow trusted origins in production
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? ["https://academico-ai.web.app"] : true,
}));

// Handle preflight requests explicitly
app.options("*", cors());

// Only apply express.json() to routes that expect JSON, not file uploads
// app.use(express.json());

app.use("/", apiRoutes);

// Centralized error handler
app.use((err: unknown, req: Request, res: Response) => {
  console.error("[ERROR]", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Generic 404 handler for Express routes not matched by apiRoutes
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).send(
    "Not Found: The requested resource could not be found via Express routing."
  );
});

// Export the Express app as an HTTP Cloud Function (2nd gen compatible)
// Allow up to 32MB request size for file uploads
export const api = https.onRequest({
  region: "us-central1",
}, app);
