import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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
  // If already initialized, get the existing instance
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
