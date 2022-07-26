import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCSHUKcpNWvgC6jibs8esbIwcOP9iGoBUA",
  authDomain: "netflix-eb418.firebaseapp.com",
  projectId: "netflix-eb418",
  storageBucket: "netflix-eb418.appspot.com",
  messagingSenderId: "619527221653",
  appId: "1:619527221653:web:00cfe6972a766eb9edc69c"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export {
    db,
    storage
}