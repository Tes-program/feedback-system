// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD6bAEmWfNbF8smi2pRggFSOo2FSRTQ8Pg",
  authDomain: "c2m-fb.firebaseapp.com",
  projectId: "c2m-fb",
  storageBucket: "c2m-fb.firebasestorage.app",
  messagingSenderId: "899237434116",
  appId: "1:899237434116:web:2fa6ee0b0d47bf5c61b651"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;