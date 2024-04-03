// ecohub-frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJxRrindXnO3WOpFFxFmovJdWbvmG8Hp8",
  authDomain: "ecohub-2a3f4.firebaseapp.com",
  projectId: "ecohub-2a3f4",
  storageBucket: "ecohub-2a3f4.appspot.com",
  messagingSenderId: "1008949589248",
  appId: "1:1008949589248:web:854f3a1ac92dc3e8ac2fe5",
  measurementId: "G-24SZ6PV16Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


export { auth, app, firestore };