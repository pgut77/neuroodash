// Importa lo necesario
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjapVWmk_PLziCsmyCpmkhUG4AfLgHuzk",
  authDomain: "neurodashboard-bc3c2.firebaseapp.com",
  projectId: "neurodashboard-bc3c2",
  storageBucket: "neurodashboard-bc3c2.firebasestorage.app",
  messagingSenderId: "793975344259",
  appId: "1:793975344259:web:52e73954f8e813d2d2dfb6",
  measurementId: "G-WP68XGBMQQ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔥 Inicializa Firestore y expórtalo
export const db = getFirestore(app);
