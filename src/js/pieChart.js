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
  getDoc,
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
const app = initializeApp(firebaseConfig);
// const storage = getStorage();
const db = getFirestore();
const auth = getAuth();
let uid;

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    getData().then(() => {
      updatePieChart();
    });
    // Call any functions or perform actions that require the uid here
  } else {
    // User is signed out, handle accordingly
  }
});
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

let close = 20;
let upDown = 10;
let turn = 20;
let lean = 10;

async function getData() {
  const docRef = collection(db, uid);
  const q = query(docRef, orderBy("timeStamp"), limit(7));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    let data = doc.data();
    // console.log(doc.id, " => ", data);
    close = close + data.countDistance; // close to the screen
    upDown = upDown + data.countHeadUporDown; // head up or down
    turn = turn + data.countHeadTurned; // head turn to left or right
    lean = lean + data.countHeadTowardShoulder; // head leaned to shoulder
  });
}

// Pie Chart
function updatePieChart() {
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "Too close to screen",
        "Head too up or down",
        "Head turned too much",
        "Head leaned to shoulder",
      ],
      datasets: [
        {
          data: [close, upDown, turn, lean],
          backgroundColor: ["#f6c23e", "#e74a3b", "#3498db", "#8e44ad"],
          hoverBackgroundColor: ["#e0ac1c", "#c42720", "#2c6dad", "#6b3080"],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: true,
        caretPadding: 10,
      },
      legend: {
        display: false,
      },
      cutoutPercentage: 80,
    },
  });
}
