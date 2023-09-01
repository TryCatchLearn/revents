import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "revents-2023.firebaseapp.com",
  projectId: "revents-2023",
  storageBucket: "revents-2023.appspot.com",
  messagingSenderId: "1035070806815",
  appId: "1:1035070806815:web:c6d36ac427322dff386e2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);