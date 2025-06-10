// src/config/firebaseAdmin.js
import { admin } from 'firebase-admin';
import { readFileSync } from 'fs';

//const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

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

// const admin = require('firebase-admin');
// const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();

// module.exports = { admin, db };

// TypeScript
// // src/config/firebaseAdmin.js
// const admin = require('firebase-admin');
// const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
// if (!serviceAccountKeyPath) {
//   throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable is not set');
// }
// const serviceAccount = require(serviceAccountKeyPath);

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();

// module.exports = { admin, db };
