import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTQhgMngKaPJeCPlRqa7w8W3L8yS6Dgns",
  authDomain: "campus-companion-590e2.firebaseapp.com",
  projectId: "campus-companion-590e2",
  storageBucket: "campus-companion-590e2.firebasestorage.app",
  messagingSenderId: "1053293418680",
  appId: "1:1053293418680:web:6292c27c9a0ed0b8bffc4d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);