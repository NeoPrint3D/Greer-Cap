// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcterkJh7_o9fJuqxUezDtL8Rww6Xf43U",
  authDomain: "greer-cap.firebaseapp.com",
  projectId: "greer-cap",
  storageBucket: "greer-cap.appspot.com",
  messagingSenderId: "647204162535",
  appId: "1:647204162535:web:470af9f7792acc70c58b42",
  measurementId: "G-Q7BZ7LFE7E",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
