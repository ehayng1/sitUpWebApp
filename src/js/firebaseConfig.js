import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";
import {
  getFirestore,
  doc,
  getDocs,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  updateDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyC5zzgEpNakWPXNGb0BHMUtrVEMsSUxzeY",
  authDomain: "myposture-5466a.firebaseapp.com",
  projectId: "myposture-5466a",
  storageBucket: "myposture-5466a.appspot.com",
  messagingSenderId: "145725455668",
  appId: "1:145725455668:web:e9e2f4832d62ec73adf961",
};
//Ben's firebaseConfig
// apiKey: "AIzaSyDIRrDmKkf2e3xwSspo14UP88iJXIVMZDQ",
//   authDomain: "postureproject-665d4.firebaseapp.com",
//   projectId: "postureproject-665d4",
//   storageBucket: "postureproject-665d4.appspot.com",
//   messagingSenderId: "531981476826",
//   appId: "1:531981476826:web:72f9c47953e30ee12d56e3",
//   measurementId: "G-33YLD60E06"
const app = initializeApp(firebaseConfig);
// const storage = getStorage();
const db = getFirestore();

export default db;
