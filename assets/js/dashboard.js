import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
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
const auth = getAuth();
const db = getFirestore();

let uid;
let good = []; // empty array
let bad = [];
let useTime = [];
let label = [];
let max;
let close = 0;
let upDown = 0;
let turn = 0;
let lean = 0;
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    // console.log(uid);

    getData().then(() => {
      //   //render here
      updateChart(good, bad, label);
      //   // updateLineChart();
    });
    getPieChartData().then(() => {
      updatePieChart(close, upDown, turn, lean);
    });
    // Call any functions or perform actions that require the uid here
  } else {
    // User is signed out, handle accordingly
  }
});

// gets line chart data
async function getData() {
  const docRef = collection(db, uid);
  const q = query(docRef, orderBy("timeStamp"), limitToLast(7));

  const querySnapshot = await getDocs(q); // code that takes time 0.5sec

  querySnapshot.forEach((doc) => {
    let data = doc.data();
    console.log(data);
    // causes error if timeStamp is "null" in Firebase.
    let today = data.timeStamp.toDate();
    // console.log(today);
    let date = today.getDate();
    let month = today.toLocaleString("default", { month: "short" });
    let goodData = doc.data().goodPosture / 60000;
    goodData = goodData.toFixed(2);
    let badData = doc.data().badPosture / 60000;
    badData = badData.toFixed(2);
    let useTimeData = doc.data().useTime / 60000;
    useTimeData = useTimeData.toFixed(2);
    good.push(goodData);
    bad.push(badData);
    useTime.push(useTimeData);
    label.push(month + " " + date);
  });
  max = Math.max(Math.max(good), Math.max(bad));
  console.log(good);
  console.log(bad);
}

async function getPieChartData() {
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

var chart;
var pieChart;
var earning;
$(function () {
  // =====================================
  // Profit
  // =====================================
  chart = {
    series: [
      {
        name: "Good Posture:",
        data: [355, 390, 300, 350, 390, 180, 355, 390],
      },
      {
        name: "Bad Posture:",
        data: [280, 250, 325, 215, 250, 310, 280, 250],
      },
    ],

    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },

    colors: ["#5D87FF", "#49BEFF"],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      type: "category",
      categories: [
        "16/08",
        "17/08",
        "18/08",
        "19/08",
        "20/08",
        "21/08",
        "22/08",
        "23/08",
      ],
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
    },

    yaxis: {
      show: true,
      min: 0,
      max: 400,
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
  };
  var chart = new ApexCharts(document.querySelector("#chart"), chart);

  // var earning = {
  //   chart: {
  //     id: "sparkline3",
  //     type: "area",
  //     height: 60,
  //     sparkline: {
  //       enabled: true,
  //     },
  //     group: "sparklines",
  //     fontFamily: "Plus Jakarta Sans', sans-serif",
  //     foreColor: "#adb0bb",
  //   },
  //   series: [
  //     {
  //       name: "Earnings",
  //       color: "#49BEFF",
  //       data: [25, 66, 20, 40, 12, 58, 20],
  //     },
  //   ],
  //   stroke: {
  //     curve: "smooth",
  //     width: 2,
  //   },
  //   fill: {
  //     colors: ["#f3feff"],
  //     type: "solid",
  //     opacity: 0.05,
  //   },

  //   markers: {
  //     size: 0,
  //   },
  //   tooltip: {
  //     theme: "dark",
  //     fixed: {
  //       enabled: true,
  //       position: "right",
  //     },
  //     x: {
  //       show: false,
  //     },
  //   },
  // };
  // new ApexCharts(document.querySelector("#earning"), earning).render();
});

function updateChart(goodData, badData, labelData) {
  chart = {
    series: [
      {
        name: "Good Posture:",
        data: goodData,
      },
      {
        name: "Bad Posture:",
        data: badData,
      },
    ],

    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },

    colors: ["#5D87FF", "#49BEFF"],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      type: "category",
      categories: labelData,
      // categories: [
      //   "16/08",
      //   "17/08",
      //   "18/08",
      //   "19/08",
      //   "20/08",
      //   "21/08",
      //   "22/08",
      //   "23/08",
      // ],
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
    },

    yaxis: {
      show: true,
      min: 0,
      max: max,
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
  };
  var chart = new ApexCharts(document.querySelector("#chart"), chart);
  chart.render();

  var earning = {
    chart: {
      id: "sparkline3",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    series: [
      {
        name: "Use Time",
        color: "#49BEFF",
        data: useTime,
      },
    ],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: ["#f3feff"],
      type: "solid",
      opacity: 0.05,
    },

    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };
  new ApexCharts(document.querySelector("#earning"), earning).render();
}

function updatePieChart(close, upDown, turn, lean) {
  let total = close + upDown + turn + lean;
  document.getElementById("posCount").innerText = total + " counts";
  pieChart = {
    color: "#adb5bd",
    series: [turn, close, lean, upDown],
    labels: ["Left or right", "Close", "Leaned", "Up or down"],
    chart: {
      width: 180,
      type: "donut",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
        },
      },
    },
    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    colors: ["#5D87FF", "#49BEFF", "#5eb44b", "#b4ccb9"],

    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 150,
          },
        },
      },
    ],
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  var chart = new ApexCharts(document.querySelector("#breakup"), pieChart);
  chart.render();
}
