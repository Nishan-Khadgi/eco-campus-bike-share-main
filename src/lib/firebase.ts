// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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

export { auth, app, analytics };
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
export type { User };