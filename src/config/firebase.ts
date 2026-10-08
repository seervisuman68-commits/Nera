import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration with environment variables support & sensible fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoNeraPlatformMockApiKey12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nera-emergency-shifts.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nera-emergency-shifts",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nera-emergency-shifts.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "103984729182",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:103984729182:web:9c847d12f12a83"
};

let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseConfigured = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseConfigured = true;
} catch (error) {
  console.warn("Firebase initialized with local state mode:", error);
}

export { app, auth, db, isFirebaseConfigured, firebaseConfig };
