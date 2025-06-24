// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Only initialize Firebase if we have the required config
const hasRequiredConfig = firebaseConfig.apiKey && firebaseConfig.projectId;
const app =
  hasRequiredConfig && !getApps().length ? initializeApp(firebaseConfig) : getApps().length > 0 ? getApp() : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// Connect to emulators in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Check if we're using emulators (you can set this env var when running emulators)
  const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';

  if (useEmulators && auth && db) {
    try {
      // Connect to Auth emulator (only if not already connected)
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

      // Connect to Firestore emulator (only if not already connected)
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch {
      // Emulators already connected or not available
      console.log('Firebase emulators already connected');
    }
  }
}
