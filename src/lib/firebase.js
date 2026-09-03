import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "your_firebase_api_key_here" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "your_project_id"
);

if (!isFirebaseConfigured) {
  console.warn(
    "[GRUHAM Firebase] Firebase is not yet fully configured. Please populate your .env file with values from Firebase Console."
  );
}

// Initialize Firebase App singleton
const app = isFirebaseConfigured
  ? !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

// Export Auth & Auth Providers
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
export const emailProvider = new EmailAuthProvider();

// Export Firestore Database
export const db = app ? getFirestore(app) : null;

export default app;
