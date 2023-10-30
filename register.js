import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
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
import {
  getFirestore,
  doc,
  getDoc,
  serverTimestamp,
  getDocs,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  updateDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore();
let email = "";
let password = "";
let name = "";
let feet;
let inches;
let sports;
let computerGamingChecked = false;
let consoleGamingChecked = false;
let phoneGamingChecked = false;
let neckPainChecked = false;
let backPainChecked = false;
let ADHDChecked = false;

async function signIn(event) {
  event.preventDefault(); // Prevent the form submission and page reload

  // data we want to write to firebase
  const sex = document.getElementById("sex").value;
  const weight = document.getElementById("weight").value;
  const shoesize = document.getElementById("shoesize").value;

  if (
    feet == "" ||
    inches == "" ||
    shoesize == "" ||
    sex == "" ||
    weight == "" ||
    sports == ""
  ) {
    alert("Please fill up the survey!");
  } else {
    await setDoc(doc(db, "users", email), {
      email: email,
      name: name,
      feet: feet,
      inches: inches,
      shoesize: shoesize,
      sex: sex,
      weight: weight,
      computerGaming: computerGamingChecked,
      consoleGaming: consoleGamingChecked,
      phoneGaming: phoneGamingChecked,
      ADHD: ADHDChecked,
      neckPain: neckPainChecked,
      backPain: backPainChecked,
      sports: sports,
    });

    const auth = getAuth();
    let uid;

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        uid = user.uid;
        console.log(user);
        // ...
      })
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: name,
        })
          .then(() => {
            const auth = getAuth();
            console.log("name updated:", auth.currentUser.displayName);
            alert("Thank you for signing up!");
            location.href = "index.html";
            // window.electronAPI.send("navigateToPage", "index.html");
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // if (errorMessage === "auth/user-not-found" || "auth/wrong-password") {
        //   alert("Email or password do not match");
        // }
        console.log(error);

        if (errorCode == "auth/email-already-in-use") {
          alert(
            "This email is already being used. Please use a different email account"
          );
        }
        // else if (name === "") {
        //   alert("Please enter your name.");
        // } else if (email === "") {
        //   alert("Please enter email address.");
        // } else if (password === "") {
        //   alert("Please enter password.");
        // }
        else if (errorCode == "auth/weak-password") {
          alert("Password is too weak.");
        } else if (errorCode == "auth/network-request-failed") {
          alert("Network connection failed.");
        } else if (errorCode == "auth/invalid-email") {
          alert("Email format is invalid");
        } else {
          alert(errorMessage);
        }
        // ..
      });
  }
  // mainWindow.loadFile("index.html");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("register").addEventListener("click", signIn);
});

function next() {
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  name = document.getElementById("name").value;
  if (name === "") {
    alert("Please enter your name.");
  } else if (email === "") {
    alert("Please enter email address.");
  } else if (password === "") {
    alert("Please enter password.");
  } else {
    document.getElementById("signup").style.display = "none";
    document.getElementById("survey").style.display = "block";
  }
}
document.getElementById("next").addEventListener("click", next);

// js for dropdown
document.querySelectorAll(".dropdown-item").forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const selectedDropdown = this.getAttribute("data-dropdown");
    const selectedValue = this.getAttribute("data-value");
    document.getElementById(
      selectedDropdown
    ).textContent = `${selectedDropdown}: ${selectedValue}`;
    if (selectedDropdown === "Feet") {
      feet = selectedValue;
    } else if (selectedDropdown === "Sports") {
      sports = selectedValue;
    } else if (selectedDropdown === "Inches") {
      inches = selectedValue;
    }
  });
});
function updateCheckboxState(checkboxId, varName) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.addEventListener("change", function () {
    if (checkboxId === "computerGaming") {
      computerGamingChecked = checkbox.checked;
      console.log(computerGamingChecked);
    } else if (checkboxId === "consoleGaming") {
      consoleGamingChecked = checkbox.checked;
    } else if (checkboxId === "phoneGaming") {
      phoneGamingChecked = checkbox.checked;
    } else if (checkboxId === "neckPain") {
      neckPainChecked = checkbox.checked;
    } else if (checkboxId === "backPain") {
      backPainChecked = checkbox.checked;
    } else if (checkboxId === "ADHD") {
      ADHDChecked = checkbox.checked;
    }
  });
}

// Call the function to set up checkbox state tracking
updateCheckboxState("computerGaming", computerGamingChecked);
updateCheckboxState("consoleGaming", consoleGamingChecked);
updateCheckboxState("phoneGaming", phoneGamingChecked);

updateCheckboxState("neckPain", neckPainChecked);
updateCheckboxState("backPain", backPainChecked);
updateCheckboxState("ADHD", ADHDChecked);
