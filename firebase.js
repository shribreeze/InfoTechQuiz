// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDJEri0SxzIClsltfn8vc3HpEGtUAHUt8",
  authDomain: "infotech-quiz.firebaseapp.com",
  projectId: "infotech-quiz",
  storageBucket: "infotech-quiz.firebasestorage.app",
  messagingSenderId: "209798941312",
  appId: "1:209798941312:web:00e2a9e7bf0ed466013465",
  measurementId: "G-201JYQ69D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };