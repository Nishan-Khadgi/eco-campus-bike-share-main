// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlIwvDV-ZYnUrATDGI1cRyZ0Hr1lvO5Fg",
  authDomain: "e-campus-bike.firebaseapp.com",
  projectId: "e-campus-bike",
  storageBucket: "e-campus-bike.firebasestorage.app",
  messagingSenderId: "655020868133",
  appId: "1:655020868133:web:5a0a28d4dea25927cf75cc",
  measurementId: "G-H5Y37FSLZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, app, analytics, googleProvider, db };
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail
};
export type { User };