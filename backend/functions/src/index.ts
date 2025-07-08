import {https} from "firebase-functions/v2";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes";

// Add logging for all incoming requests
console.log("[BOOT] Express app starting up...");
// import {FieldValue} from "firebase-admin/firestore";

// eslint-disable-next-line @typescript-eslint/no-empty-function
// console.log = function() {};

// Initialize Firebase Admin SDK
// admin.initializeApp(); // Initialization handled in firebaseAdmin.ts

// console.log("Admin initialized:", !!admin);
// console.log("Admin.firestore:", !!admin.firestore);
// console.log("Admin.firestore.FieldValue (after init):",
//   FieldValue);

const app = express();

// Log every incoming request (method, path, headers)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  console.log(`[REQ-HEADERS] ${JSON.stringify(req.headers)}`);
  next();
});


// TEMP: Allow all origins for debugging
app.use(cors());

// Handle preflight requests explicitly
app.options("*", cors());

// Only apply express.json() to routes that expect JSON, not file uploads
// app.use(express.json());

// Add a logging middleware for
// all incoming requests (keep this for debugging)
app.use((req, res, next) => {
  // console.log(`Express Main: Incoming Request -
  //   Method: ${req.method},
  //   Path: ${req.path},
  //   Origin: ${req.headers.origin},
  //   Headers: ${JSON.stringify(req.headers, null, 2)},
  //   Body: ${JSON.stringify(req.body)}`
  // );
  next();
});

app.use("/", apiRoutes);

// Generic 404 handler for Express routes not matched by apiRoutes
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).send(
    "Not Found: The requested resource could not be found via Express routing."
  );
});

// Export the Express app as an HTTP Cloud Function (2nd gen compatible)
export const api = https.onRequest({region: "us-central1"}, app);
