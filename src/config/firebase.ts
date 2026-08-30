import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración oficial de Firebase para el proyecto 'anclaconsejo'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBmTFMmsPmd4ApTzsGOUIw8GCzUXyPtoc4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anclaconsejo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anclaconsejo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anclaconsejo.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "63423105940",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:63423105940:web:d98ab54187f8883e0b5d81"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const db = getFirestore(app);

export default app;
