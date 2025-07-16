/* eslint-disable max-len */

import * as functions from "firebase-functions";
import admin from "firebase-admin";
import {readFileSync} from "fs";


// Use default credentials in production (Cloud Functions), custom service account locally
// const geminiApiKey = functions.config().gemini.api_key;
const storageBucket =
process.env.STORAGE_BUCKET || (functions.config().app && functions.config().app.storage_bucket);

if (!admin.apps.length) {
  if (process.env.SERVICE_ACCOUNT_KEY_PATH) {
    // Local development: use service account key
    const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    // console.log("Using service account:", serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket,
    });
  } else {
    // Production: use default credentials and Firebase config
    admin.initializeApp({
      storageBucket,
    });
  }
}

const db = admin.firestore();
const storage = admin.storage();

// Connect to Firestore emulator when running locally
if (
  process.env.FUNCTIONS_EMULATOR === "true" ||
  process.env.NODE_ENV === "development"
) {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

const firebaseAdmin = {
  admin,
  db,
  storage,
};

export default firebaseAdmin;
