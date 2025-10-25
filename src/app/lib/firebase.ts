// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-oOqrguNAYhyfF9xJiY18_AIePkwvMrs",
  authDomain: "neurodash-5beb2.firebaseapp.com",
  projectId: "neurodash-5beb2",
  storageBucket: "neurodash-5beb2.firebasestorage.app",
  messagingSenderId: "1033654981451",
  appId: "1:1033654981451:web:a0798376285311c9a70ece"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);