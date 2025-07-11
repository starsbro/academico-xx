import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes";
// import {FieldValue} from "firebase-admin/firestore";

// eslint-disable-next-line @typescript-eslint/no-empty-function
// console.log = function() {};

// Initialize Firebase Admin SDK
admin.initializeApp();

// console.log("Admin initialized:", !!admin);
// console.log("Admin.firestore:", !!admin.firestore);
// console.log("Admin.firestore.FieldValue (after init):",
//   FieldValue);

const app = express();


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
  // console.log(`Express Main: Unhandled route -
  //   Method: ${req.method},
  //   Path: ${req.path}`);
  res.status(404).send(`Not Found: The requested resource 
      could not be found via Express routing.`);
});

// Export the Express app as an HTTP Cloud Function
exports.api = functions.https.onRequest(app);

// Export Next.js app function
export {nextjsApp} from "./nextjs";
