import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAg93AWVf1oXVXTQOvarSOATvABF8GRv8g",
  authDomain: "streamflix-61152.firebaseapp.com",
  projectId: "streamflix-61152",
  storageBucket: "streamflix-61152.firebasestorage.app",
  messagingSenderId: "434484001427",
  appId: "1:434484001427:web:4282d0b08b0ee02551eb66",
  measurementId: "G-0MC53D5PE5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
