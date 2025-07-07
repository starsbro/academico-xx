// src/config/firebaseAdmin.js
import admin from "firebase-admin";
import {readFileSync} from "fs";


const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
if (!serviceAccountPath) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable is not set!"
  );
}
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
console.log("Using service account:", serviceAccountPath);


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Add this to your .env
  });
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
