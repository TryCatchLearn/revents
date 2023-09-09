import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "revents-2023.firebaseapp.com",
  projectId: "revents-2023",
  databaseURL: "https://revents-2023-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "revents-2023.appspot.com",
  messagingSenderId: "1035070806815",
  appId: "1:1035070806815:web:c6d36ac427322dff386e2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const fb = getDatabase(app);