// Import the functions you need from the SDKs you need
import { initializeApp,  } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsJ56WMUZBn1_ytzfXEKqvi7oln_3l-5Y",
  authDomain: "bhabi-sil.firebaseapp.com",
  projectId: "bhabi-sil",
  storageBucket: "bhabi-sil.appspot.com",
  messagingSenderId: "211838291293",
  appId: "1:211838291293:web:b2f40973cb71df1645acb4",
  measurementId: "G-WE4GT4DF2S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);


