/******************************************
 * My Login
 *
 * Bootstrap 4 Login Page
 *
 * @author          Muhamad Nauval Azhar
 * @uri 			https://nauval.in
 * @copyright       Copyright (c) 2018 Muhamad Nauval Azhar
 * @license         My Login is licensed under the MIT license.
 * @github          https://github.com/nauvalazhar/my-login
 * @version         1.2.0
 *
 * Help me to keep this project alive
 * https://www.buymeacoffee.com/mhdnauvalazhar
 *
 ******************************************/

"use strict";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyC5zzgEpNakWPXNGb0BHMUtrVEMsSUxzeY",
  authDomain: "myposture-5466a.firebaseapp.com",
  projectId: "myposture-5466a",
  storageBucket: "myposture-5466a.appspot.com",
  messagingSenderId: "145725455668",
  appId: "1:145725455668:web:e9e2f4832d62ec73adf961",
};

const app = initializeApp(firebaseConfig);

// async function LogIn(event) {
//   console.log("LogIn function triggered");
//   event.preventDefault();
//   const auth = getAuth();
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   const electronAPI = window.electronAPI; // Access the electronAPI object

//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // await electronAPI.showDialog({
//     //   type: "info",
//     //   title: "Alert",
//     //   message: "Logged In!",
//     //   buttons: ["OK"],
//     // });
//     electronAPI.navigateToPage("./index.html");
//   } catch (error) {
//     const errorCode = error.code;
//     // await electronAPI.showDialog({
//     //   type: "info",
//     //   title: "Alert",
//     //   message: errorCode,
//     //   buttons: ["OK"],
//     // });
//   }
// }
async function LogIn(event) {
  event.preventDefault();

  console.log("LogIn function triggered");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
    })
    .then(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      alert("Welcome " + user.displayName + "!");
      location.href = "index.html";
      // window.electronAPI.send("navigateToPage", "index.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      // const errorMessage = error.message;
      if (email === "") {
        alert("Please enter email address.");
      } else if (password === "") {
        alert("Please enter password.");
      } else if (errorCode == "auth/network-request-failed") {
        alert("Network connection failed.");
      } else if (errorCode == "auth/invalid-email") {
        alert("Email format is not correct.");
      } else if (errorCode == "auth/user-not-found") {
        alert("Email does not exist.");
      } else if (errorCode == "auth/wrong-password") {
        alert("Password is incorrect.");
      }
    });
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logIn").addEventListener("click", LogIn);
});
