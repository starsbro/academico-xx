// src/config/firebaseAdmin.js
import {admin} from "firebase-admin";
import {readFileSync} from "fs";

// const serviceAccount = require(
//   process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
// );
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const firebaseAdmin = {
  admin,
  db,
};

export default firebaseAdmin;
