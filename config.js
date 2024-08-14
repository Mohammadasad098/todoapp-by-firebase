import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfpNLLfXcWLVO_GdHdSgYMfTgdcssg-Ow",
    authDomain: "todoapp-by-firebase-d636d.firebaseapp.com",
    projectId: "todoapp-by-firebase-d636d",
    storageBucket: "todoapp-by-firebase-d636d.appspot.com",
    messagingSenderId: "660159005428",
    appId: "1:660159005428:web:ab8a8336720ca0e369d4a1",
    measurementId: "G-Z4EHS4ZX03"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);