// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTAeYtuegETjwPWm_dYQUgmW_GaJi5UCM",
  authDomain: "shopease-73b1e.firebaseapp.com",
  projectId: "shopease-73b1e",
  storageBucket: "shopease-73b1e.appspot.com",
  messagingSenderId: "823123651774",
  appId: "1:823123651774:web:ac21d43ad603c6816a02ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth =getAuth(app);
auth.languageCode = 'en'
const provider = new GoogleAuthProvider();

const googleSignIn = document.getElementById("google-signin-button")

export {fireDB, auth}