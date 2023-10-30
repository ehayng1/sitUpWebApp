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
  collectionGroup,
  collection,
  query,
  orderBy,
  limit,
  limitToLast,
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
const auth = getAuth();
const db = getFirestore();
// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

let uid;
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    // console.log(uid);

    getData().then(() => {
      updateLineChart();
    });
    // Call any functions or perform actions that require the uid here
  } else {
    // User is signed out, handle accordingly
  }
});

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + "").replace(",", "").replace(" ", "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

let good = []; // empty array
let bad = [];
let label = [];

// gets line chart data
async function getData() {
  const docRef = collection(db, uid);
  const q = query(docRef, orderBy("timeStamp"), limitToLast(7));

  const querySnapshot = await getDocs(q); // code that takes time 0.5sec

  querySnapshot.forEach((doc) => {
    let data = doc.data();

    // console.log(data);
    let today = data.timeStamp.toDate();
    // console.log(today);
    let date = today.getDate();
    let month = today.toLocaleString("default", { month: "short" });
    good.push(doc.data().goodPosture / 60000);
    bad.push(doc.data().badPosture / 60000);
    label.push(month + " " + date);
  });
}
function updateLineChart() {
  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: label,
      // labels: ["mon", "tue", "wed", "thu"],
      datasets: [
        {
          label: "Good Posture",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "#1cc88a",
          pointRadius: 3,
          pointBackgroundColor: "#1cc88a",
          pointBorderColor: "#1cc88a",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "#1cc88a",
          pointHoverBorderColor: "#1cc88a",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: good,
        },
        {
          label: "Bad Posture",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "#e74a3b",
          pointRadius: 3,
          pointBackgroundColor: "#e74a3b",
          pointBorderColor: "#e74a3b",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "#e74a3b",
          pointHoverBorderColor: "#e74a3b",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: bad,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0,
        },
      },
      scales: {
        xAxes: [
          {
            time: {
              unit: "date",
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 7,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return number_format(value) + " min";
              },
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2],
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: "#6e707e",
        titleFontSize: 14,
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return (
              datasetLabel +
              ": " +
              number_format(tooltipItem.yLabel) +
              " minutes"
            );
          },
        },
      },
    },
  });
}
