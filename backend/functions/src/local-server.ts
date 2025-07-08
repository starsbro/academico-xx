import "dotenv/config";

// Polyfill DOMMatrix for pdfjs-dist legacy build in Node.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).DOMMatrix = class {};

// Initialize Firebase Admin SDK for local server
import "./config/firebaseAdmin";

import express from "express";
import cors from "cors";
import apiRoutes from "./routes";

const app = express();

// Allow all CORS for local testing
app.use(cors());


// Only use express.json() for routes that expect JSON
// (e.g., /message, /users, /chats)
app.use("/message", express.json());
app.use("/users", express.json());
app.use("/chats", express.json());

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
