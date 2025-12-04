// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWnAVFcJBbJ_CCPY6Nm-fE9atdXodwo9A",
  authDomain: "lab1-a265c.firebaseapp.com",
  projectId: "lab1-a265c",
  storageBucket: "lab1-a265c.firebasestorage.app",
  messagingSenderId: "237499195008",
  appId: "1:237499195008:web:04fb06e276586e71061065",
  measurementId: "G-77QPWBL8K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };