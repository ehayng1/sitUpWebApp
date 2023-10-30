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
  setDoc,
  collection,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
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
// Ben's firebase setting
// const firebaseConfig = {
//   apiKey: "AIzaSyDIRrDmKkf2e3xwSspo14UP88iJXIVMZDQ",
//   authDomain: "postureproject-665d4.firebaseapp.com",
//   projectId: "postureproject-665d4",
//   storageBucket: "postureproject-665d4.appspot.com",
//   messagingSenderId: "531981476826",
//   appId: "1:531981476826:web:72f9c47953e30ee12d56e3",
//   measurementId: "G-33YLD60E06"
// };
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
let uid;
const userName = auth.currentUser.displayName;
document.getElementById("userName").innerText = userName;

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    upload();
    getUserInfo();

    // Call any functions or perform actions that require the uid here
  } else {
    // User is signed out, handle accordingly
  }
});

export async function upload(data) {
  // alert(uid);
  const docRef = doc(db, uid, currDate);
  let docSnap = await getDoc(docRef);
  // console.log(data);
  if (docSnap.exists()) {
    let tempData = { ...docSnap.data() };
    // add the data by "data" amount
    for (let key in tempData) {
      if (key !== "timeStamp") {
        tempData[key] = tempData[key] + Math.abs(data[key]);
      }
    }
    console.log("data being added!", data);
    console.log("data being set!", tempData);

    await setDoc(doc(db, uid, new Date().toDateString()), tempData);
  } else {
    console.log(data);
    await setDoc(doc(db, uid, new Date().toDateString()), data);
  }
}

// load data here
let currDate = new Date().toDateString();

export async function getUserInfo() {
  const docRef = doc(db, uid, currDate);
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let useTime = docSnap.data().cameraTime / 60000;
    let good = docSnap.data().goodPosture / 60000;
    let bad = useTime - good;
    let breakTime = docSnap.data().breakTime / 60000;

    // console.log(docSnap.data())
    alert("asdasd");
    document.getElementById("useTime").innerText = useTime.toFixed(2) + " min";
    document.getElementById("break").innerText = breakTime.toFixed(2) + " min";
    document.getElementById("bad").innerText =
      (docSnap.data().badPosture / 60000).toFixed(2) + " min";
    document.getElementById("good").innerText = good.toFixed(2) + " min";
  }
}

// resets data
export async function reset() {
  // data.useTime = 0;
  // data.cameraTime = 0;
  // data.goodPosture = 0;
  // data.badPosture = 0;
  // data.breakTime = 0;
  // data.countDistance = 0;
  // data.countHeadTowardShoulder = 0;
  // data.countHeadTurned = 0;
  // data.countHeadUporDown = 0;
  let newData = {
    goodPosture: 0,
    badPosture: 0,
    breakTime: 0,
    countDistance: 0,
    countHeadTowardShoulder: 0,
    countHeadTurned: 0,
    countHeadUporDown: 0,
  };
  return newData;
}

getUserInfo();

// code for daily tips
const tip1 = {
  title: "Be mindful of your posture",
  author: "Mayo Clinic - Proper ergonomics for sitting",
  description:
    "Throughout the day, consciously check your posture and make adjustments if needed. Develop the habit of sitting and standing tall with your shoulders back and your head aligned with your spine.",
};

const tip2 = {
  title: "Ergonomic Workspace Setup",
  author: "Harvard Health - Sitting at a computer",
  description:
    "Arrange your computer monitor at eye level, position your keyboard and mouse within easy reach, and use an ergonomic chair to maintain a neutral spine position while working at your desk.",
};

const tip3 = {
  title: "Take Regular Stretch Breaks",
  author: "Cleveland Clinic - Exercises for back health",
  description:
    "Every 30 minutes, stand up, stretch your arms and legs, and gently rotate your neck and shoulders. This helps alleviate muscle tension and reduces the risk of slouching.",
};

const tip4 = {
  title: "Support Your Lumbar Region",
  author: "American Chiropractic Association - Sitting comfortably",
  description:
    "Use a cushion or small pillow to support your lower back's natural curve when sitting. This prevents the rounding of your spine and promotes better posture.",
};

const tip5 = {
  title: "Stay Active Throughout the Day",
  author: "Mayo Clinic - Exercise: 7 benefits of regular physical activity",
  description:
    "Incorporate short walks and gentle exercises into your daily routine. Maintaining an active lifestyle helps strengthen your core and back muscles, contributing to better posture.",
};

const tip6 = {
  title: "Mind Your Smartphone Posture",
  author: "Spine-Health - Texting and using a smartphone",
  description:
    "Hold your smartphone at eye level to prevent straining your neck while texting or browsing. Avoid bending your neck for extended periods to reduce the risk of 'text neck.'",
};

const tip7 = {
  title: "Proper Driving Posture",
  author:
    "American Academy of Orthopaedic Surgeons - Proper driving ergonomics",
  description:
    "Adjust your car's seat, steering wheel, and mirrors to maintain a comfortable and upright driving position. This minimizes stress on your spine during long journeys.",
};
let tips = [tip1, tip2, tip3, tip1, tip2, tip3, tip1];

// 1. getDoc()
// let docId = new Date().toDateString();
// const docRef = doc(db, "data", docId);
// const docSnap = await getDoc(docRef);
// let doc1;
// let DailyPostureTipIndex;

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
//   doc1 = docSnap.data();
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }

// // 2. if DailyPostureTip exists in the document, get that number
// if (Number.isInteger(doc1.DailyPostureTip)) {
//   DailyPostureTipIndex = doc1.DailyPostureTip;
// }
// // 2.1. if not, updateDoc with DailyPostureTip using Math.floor(Math.random() * (7 - 0) + 0)
// else {
//   updateDoc(docRef, {
//     DailyPostureTipIndex: Math.floor(Math.random() * (7 - 0) + 0),
//   });
// }
// document.getElementById("PostureTitle").innerText =
//   tips[DailyPostureTipIndex].title;
// document.getElementById("PostureAuthor").innerText =
//   tips[DailyPostureTipIndex].author;
// document.getElementById("PostureDescription").innerText =
//   tips[DailyPostureTipIndex].description;

let countDistance = 0;
let countHeadTurned = 0;
let countHeadTowardShoulder = 0;
let countHeadUporDown = 0;
// Maximum of the counts of bad posutres
let maxCount = 0;
let secondMaxCount = 0;

async function getCountData() {
  // Getting the posture Counts.
  const q = query(collection(db, "data"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    let data = doc.data();
    countDistance = countDistance + data.countDistance;
    countHeadTurned = countHeadTurned + data.countHeadTurned;
    countHeadTowardShoulder =
      countHeadTowardShoulder + data.countHeadTowardShoulder;
    countHeadUporDown = countHeadUporDown + data.countHeadUporDown;
  });
  maxCount = Math.max(
    countDistance,
    countHeadTurned,
    countHeadTowardShoulder,
    countHeadUporDown
  );
  let arr = [
    countDistance,
    countHeadTurned,
    countHeadTowardShoulder,
    countHeadUporDown,
  ];
  var iframe = document.createElement("iframe");
  iframe.width = "auto";
  iframe.height = "60%";
  if (maxCount === countDistance) {
    maxCount = "countDistance";
    arr.splice(0, 1);
  } else if (maxCount === countHeadTurned) {
    maxCount = "countHeadTurned";
    arr.splice(1, 1);
  } else if (maxCount === countHeadTowardShoulder) {
    maxCount = "countHeadTowardShoulder";
    arr.splice(2, 1);
  } else if (maxCount === countHeadUporDown) {
    arr.splice(3, 1);
    iframe.src = "https://www.youtube.com/embed/eznjIHMTi_U";
    maxCount = "countHeadUporDown";
  }
  // gets the seoncd MaxCount
  secondMaxCount = arr.reduce((a, b) => Math.max(a, b), -Infinity);
  var iframe2 = document.createElement("iframe");
  iframe2.width = "auto";
  iframe2.height = "60%";
  if (secondMaxCount === countDistance) {
    secondMaxCount = "countDistance";
    iframe2.src = "https://www.youtube.com/embed/wQylqaCl8Zo";
  } else if (secondMaxCount === countHeadTurned) {
    secondMaxCount = "countHeadTurned";
    iframe2.src = "https://www.youtube.com/embed/XDio1qSGWhc";
  } else if (secondMaxCount === countHeadTowardShoulder) {
    secondMaxCount = "countHeadTowardShoulder";
    iframe2.src = "https://www.youtube.com/embed/JEtyI4ufoX4";
  } else if (secondMaxCount === countHeadUporDown) {
    iframe2.src = "https://www.youtube.com/embed/eznjIHMTi_U";
    secondMaxCount = "countHeadUporDown";
  }
  document.getElementById("video").prepend(iframe);
  document.getElementById("video2").prepend(iframe2);
}
getCountData();

// console.log(countDistance);
