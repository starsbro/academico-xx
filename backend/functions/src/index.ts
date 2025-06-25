import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes";
import {FieldValue} from "firebase-admin/firestore";

// eslint-disable-next-line @typescript-eslint/no-empty-function
console.log = function() {};

// Initialize Firebase Admin SDK
admin.initializeApp();

console.log("Admin initialized:", !!admin);
console.log("Admin.firestore:", !!admin.firestore);
console.log("Admin.firestore.FieldValue (after init):",
  FieldValue);

const app = express();

// Enhanced CORS configuration for development and production
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://academico-ai.web.app",
    "https://academico-ai.firebaseapp.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Apply other middlewares
app.use(express.json());

// Add a logging middleware for
// all incoming requests (keep this for debugging)
app.use((req, res, next) =>{
  console.log(`Express Main: Incoming Request -
    Method: ${req.method},
    Path: ${req.path},
    Origin: ${req.headers.origin},
    Headers: ${JSON.stringify(req.headers, null, 2)},
    Body: ${JSON.stringify(req.body)}`
  );
  next();
});

app.use("/", apiRoutes);

// Generic 404 handler for Express routes not matched by apiRoutes
app.use((req, res) => {
  console.log(`Express Main: Unhandled route - 
    Method: ${req.method},
    Path: ${req.path}`);
  res.status(404)
    .send(`Not Found: The requested resource 
      could not be found via Express routing.`);
});

// Export the Express app as an HTTP Cloud Function
exports.api = functions.https.onRequest(app);

// Export Next.js app function
export {nextjsApp} from "./nextjs";
