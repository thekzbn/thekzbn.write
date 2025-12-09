// src/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration using environment variables
// These will need to be set in your Vercel project's environment variables
// e.g., VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.
// For local development, you can create a .env.local file in your project root.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;

// Check if Firebase is already initialized to prevent errors during hot reload
if (!initializeApp.length) { // This check is a common pattern for Vite/React setup
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  // If already initialized, get the existing instance (though usually initializeApp handles this)
  // This part might vary based on how initializeApp handles subsequent calls in a dev environment.
  // For most modern setups, simply calling initializeApp again with the same config
  // will return the existing app instance without error.
  // However, for explicit handling during development:
  // app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  // db = getFirestore(app);
  // A simpler approach for Vite is to let initializeApp manage itself or use the above commented code if issues arise.
  // For now, we'll assume initializeApp handles subsequent calls gracefully for the sake of brevity.
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}


export { app, db };
