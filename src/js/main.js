import { upload } from "./index.js";
import { getUserInfo } from "./index.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
// const { systemPreferences } = require("electron");
// import { reset } from "./index.js";
// const { dialog } = require("electron");
let timeThreshold = 300; // For 0.5 seconds;
let startAlgo = false;
let lastClosedTime,
  continuous = false;
let body = document.querySelector("body");
let message;

function reset() {
  goodPosture = 0;
  badPosture = 0;
  useTime = 0;
  cameraTime = 0;
  countDistance = 0;
  countHeadTowardShoulder = 0;
  countHeadTurned = 0;
  countHeadUporDown = 0;

  useTimeStart = new Date().getTime();
  cameraStartTime = new Date().getTime();
}

//entry point :
export function main() {
  let access;
  // window.electronAPI
  //   .requestWebcamAccess()
  //   .then(() => {
  //     console.log("Webcam access granted. Proceed with using the webcam.");
  //     access = true;
  //     console.log(access);
  //   })
  //   .catch((error) => {
  //     console.error("Error requesting webcam access:", error);
  //     // Your code to handle the error
  //     access = false;
  //     console.log(access);
  //   });

  JEEFACETRANSFERAPI.init({
    canvasId: "canvas",
    NNCpath: "assets/model/",
    callbackReady: function (errCode) {
      if (errCode) {
        console.log(
          "ERROR - cannot init JEEFACETRANSFERAPI. errCode =",
          errCode
        );
        // errorCallback(errCode);
        // return;
      }
      console.log("INFO : JEEFACETRANSFERAPI is ready !!!");
      successCallback();
    }, //end callbackReady()
  });
} //end main()

export function successCallback() {
  // Call next frame
  nextFrame();
  document.getElementById("full-page-loader").style.display = "none";
  body = document.querySelector("body");
  message = document.querySelector("#message");
  // Add code after API is ready.
}

export function errorCallback(errorCode) {
  // Add code to handle the error
}

export async function nextFrame() {
  if (!startAlgo) {
    return;
  }
  let deltaTime = Date.now() - lastClosedTime;
  if (deltaTime > timeThreshold && continuous) {
    // start_alarm();
    // console.log("Alarm Called");
    //when the user posture is BAD
    // body.style.background = "#f00";
  } else {
    // stop_alarm();
    //when the user posture is GOOD
    // body.style.background = "#fff";
  }

  // detected
  if (JEEFACETRANSFERAPI.is_detected()) {
    // Do something awesome with rotation values
    let rotation = JEEFACETRANSFERAPI.get_rotationStabilized();
    let isHeadPostureOk = isHeadPostureOK(rotation);
    let positionScaleZ = JEEFACETRANSFERAPI.get_positionScale()[2];
    let screenDistanceOK = isScreenDistanceOK(positionScaleZ);

    if (
      !isHeadPostureOk[0] ||
      !isHeadPostureOk[1] ||
      !isHeadPostureOk[2] ||
      !screenDistanceOK
    ) {
      if (lastClosedTime === undefined || !continuous)
        lastClosedTime = Date.now(); // Now is the new time
      continuous = true;
      if (message) {
        console.log("Bad Posture");
        if (state !== "Bad") {
          let data = {
            timeStamp: serverTimestamp(),
            useTime: useTimeEnd - useTimeStart,
            // useTime: useTime,
            cameraTime: cameraTime,
            goodPosture: goodPosture,
            badPosture: useTime - goodPosture,
            breakTime: cameraTime - useTime,
            countDistance: countDistance,
            countHeadTowardShoulder: countHeadTowardShoulder,
            countHeadTurned: countHeadTurned,
            countHeadUporDown: countHeadUporDown,
          };
          await updateData();
        }
        state = "Bad";
        goodEndTime = new Date().getTime();
        let timeDiff = goodEndTime - goodStartTime;
        if (timeDiff > timeThreshold) {
          // warn user if bad posture persists more than 5 min
          goodPosture = goodPosture + timeDiff;
          console.log(
            "Good Posture Duration: ",
            // Math.floor(badPosture / 60000),
            // " mins"
            Math.floor(goodPosture / 1000),
            " seconds"
          );
        }

        badEndTime = new Date().getTime();
        let diff = badEndTime - badStartTime;

        if (diff > 5 * 60 * 1000) {
          badPosture = badPosture + 5000;
          useTime = useTime + 5000;
          cameraTime = cameraTime + 5000;
          badStartTime = new Date().getTime();
          console.log(badStartTime);
          alert("Your posture has been bad for 5 minutes");
          // dialog.showMessageBox({
          //   type: "info",
          //   title: "Information",
          //   message: "Hello, world!",
          //   icon: "/path/to/image.png",
          //   buttons: ["OK"],
          // });
        }

        goodStartTime = new Date().getTime();
        let messageContent = "";
        if (!screenDistanceOK) {
          messageContent += "<p>Too close to the screen.</p>";
          countDistance++;
        }
        if (!isHeadPostureOk[0]) {
          messageContent += "<p>Head is either too up or too down.</p>";
          countHeadUporDown++;
        }
        if (!isHeadPostureOk[1]) {
          messageContent += "<p>Head is turned too much.</p>";
          countHeadTurned++;
        }
        if (!isHeadPostureOk[2]) {
          messageContent += "<p>Head is bent towards shoulders.</p>";
          countHeadTowardShoulder++;
        }
        message.innerHTML = messageContent;
      }
    }
    // GOOD posture
    else {
      if (state !== "Good") {
        let data = {
          useTime: useTimeEnd - useTimeStart,

          // useTime: useTime,
          timeStamp: serverTimestamp(),
          cameraTime: cameraTime,
          goodPosture: goodPosture,
          badPosture: useTime - goodPosture,
          breakTime: cameraTime - useTime,
          // breakTime: useTime - cameraTime,
          countDistance: countDistance,
          countHeadTowardShoulder: countHeadTowardShoulder,
          countHeadTurned: countHeadTurned,
          countHeadUporDown: countHeadUporDown,
        };
        await updateData();
      }
      state = "Good";
      console.log("Good Posture");
      badEndTime = new Date().getTime();
      let timeDiff = badEndTime - badStartTime;
      if (timeDiff > timeThreshold) {
        // warn user if bad posture persists more than 5 min
        // if (timeDiff > 3000) {
        //   alert("Your posture has been bad for 3 seconds!");
        //   // dialog.showMessageBox({
        //   //   type: "info",
        //   //   title: "Information",
        //   //   message: "Your posture has been bad for 5 seconds!",
        //   //   // icon: "/path/to/image.png",
        //   //   buttons: ["OK"],
        //   // });
        //   badStartTime = new Date().getTime();
        // }
        badPosture = badPosture + timeDiff;
        // console.log(
        //   "Bad Posture Duration: ",
        //   // Math.floor(badPosture / 60000),
        //   // " mins"
        //   Math.floor(badPosture / 1000),
        //   " seconds"
        // );
        // console.log(
        //   "Good Posture Duration: ",
        //   // Math.floor(badPosture / 60000),
        //   // " mins"
        //   Math.floor((useTime - badPosture) / 1000),
        //   " seconds"
        // );
      }
      badStartTime = new Date().getTime();

      if (message) {
        message.innerHTML = "";
      }
      continuous = false;
    }

    //**************************************************************************** */

    // The API is detected
  } else {
    //wrap up
    goodEndTime = new Date().getTime();
    let temp = goodEndTime - goodStartTime;
    if (temp > timeThreshold) {
      goodPosture = temp + goodPosture;
    }
    goodStartTime = new Date().getTime();

    useTimeEnd = new Date().getTime();

    if (state !== "Not Detected") {
      message = document.querySelector("#message");
      message.innerHTML = "";
      let data = {
        useTime: useTimeEnd - useTimeStart,
        // useTime: useTime,
        timeStamp: serverTimestamp(),
        cameraTime: cameraTime,
        goodPosture: goodPosture,
        badPosture: useTime - goodPosture,
        breakTime: cameraTime - useTime,
        // breakTime: useTime - cameraTime,
        countDistance: countDistance,
        countHeadTowardShoulder: countHeadTowardShoulder,
        countHeadTurned: countHeadTurned,
        countHeadUporDown: countHeadUporDown,
      };
      await updateData();
    }
    state = "Not Detected";

    console.log("Not Detected");
    let tempUseTime = useTimeEnd - useTimeStart;
    if (tempUseTime > timeThreshold) {
      useTime = useTime + tempUseTime;
      console.log("Use Time: ", Math.floor(useTime / 1000), " seconds");
    }
    useTimeStart = new Date().getTime();
    badStartTime = new Date().getTime();
  }
  // Replay frame
  if (isSwitchOn) {
    requestAnimationFrame(nextFrame);
  }
}

// let prevState = null
let state = null;

let isSwitchOn = false;

let goodPosture = 0;
let badPosture = 0;
let useTime = 0;
let cameraTime = 0;

let goodStartTime;
let goodEndTime;
let badStartTime;
let badEndTime;

// time detected
let useTimeStart;
let useTimeEnd;

// time used.
let cameraStartTime;
let cameraEndTime;

let countDistance = 0;
let countHeadTowardShoulder = 0;
let countHeadTurned = 0;
let countHeadUporDown = 0;

export function start() {
  // init_sound();
  startAlgo = true;
  document.getElementById("camera").style.display = "block";
  cameraStartTime = new Date().getTime();
  useTimeStart = new Date().getTime();
  goodStartTime = new Date().getTime();
  badStartTime = new Date().getTime();

  nextFrame();
  // hides the warning page
  // document.getElementById("warnings").style.display = "none";
}

export function cameraOff() {
  isSwitchOn = false;
  document.getElementById("camera").style.display = "none";
}

// unused but should be used.
export function quit() {
  // if endtime - starttime > threshold
  // user quitted straight without turning off the camera
  if (cameraEndTime - cameraStartTime > timeThreshold) {
    stop();
  } else {
    // upload data
    // uploadData()
    // just quit
  }
}
export async function updateData() {
  //wrap up
  cameraEndTime = new Date().getTime();
  let tempTime = cameraEndTime - cameraStartTime;
  cameraTime = cameraTime + tempTime;

  goodEndTime = new Date().getTime();
  tempTime = goodEndTime - goodStartTime;
  goodPosture = tempTime + goodPosture;
  // goodPosture = tempTime;

  useTimeEnd = new Date().getTime();
  tempTime = useTimeEnd - useTimeStart;
  useTime = useTime + tempTime;
  // useTime =  tempTime;

  // append each times to firebase database instead of console logging
  console.log("Total Camera Time: ", Math.floor(cameraTime / 1000), " seconds");
  console.log("Use Time: ", Math.floor(useTime / 1000), " seconds");
  console.log(
    "Break Time: ",
    Math.floor((cameraTime - useTime) / 1000),
    " seconds"
  );
  console.log(
    "Good Posture Duration: ",
    Math.floor(goodPosture / 1000),
    " seconds"
  );
  console.log(
    "Bad Posture Duration: ",
    Math.abs(Math.floor((useTime - goodPosture) / 1000)),
    " seconds"
  );
  console.log("Distance: ", countDistance);
  console.log("HeadUporDown: ", countHeadUporDown);
  console.log("HeadTowardShoulder: ", countHeadTowardShoulder);
  console.log("HeadTurned: ", countHeadTurned);

  let data = {
    useTime: useTime,
    timeStamp: serverTimestamp(),
    cameraTime: cameraTime,
    goodPosture: goodPosture,
    badPosture: useTime - goodPosture,
    breakTime: cameraTime - useTime,
    // breakTime: useTime - cameraTime,
    countDistance: countDistance,
    countHeadTowardShoulder: countHeadTowardShoulder,
    countHeadTurned: countHeadTurned,
    countHeadUporDown: countHeadUporDown,
  };
  await upload(data);
  data = reset();
  getUserInfo();

  cameraStartTime = new Date().getTime();
  useTimeStart = new Date().getTime();
  goodStartTime = new Date().getTime();
  badStartTime = new Date().getTime();
}

//when the electron ends call this function manually as well
export async function stop() {
  //wrap up
  cameraEndTime = new Date().getTime();
  let tempTime = cameraEndTime - cameraStartTime;
  cameraTime = cameraTime + tempTime;

  goodEndTime = new Date().getTime();
  tempTime = goodEndTime - goodStartTime;
  goodPosture = tempTime + goodPosture;
  // goodPosture = tempTime;

  useTimeEnd = new Date().getTime();
  tempTime = useTimeEnd - useTimeStart;
  useTime = useTime + tempTime;
  // useTime =  tempTime;

  // append each times to firebase database instead of console logging
  console.log("Total Camera Time: ", Math.floor(cameraTime / 1000), " seconds");
  console.log("Use Time: ", Math.floor(useTime / 1000), " seconds");
  console.log(
    "Break Time: ",
    Math.floor((cameraTime - useTime) / 1000),
    " seconds"
  );
  console.log(
    "Good Posture Duration: ",
    Math.floor(goodPosture / 1000),
    " seconds"
  );
  console.log(
    "Bad Posture Duration: ",
    Math.abs(Math.floor((useTime - goodPosture) / 1000)),
    " seconds"
  );
  console.log("Distance: ", countDistance);
  console.log("HeadUporDown: ", countHeadUporDown);
  console.log("HeadTowardShoulder: ", countHeadTowardShoulder);
  console.log("HeadTurned: ", countHeadTurned);

  isSwitchOn = false;
  let data = {
    useTime: useTime,
    timeStamp: serverTimestamp(),
    cameraTime: cameraTime,
    goodPosture: goodPosture,
    badPosture: useTime - goodPosture,
    breakTime: cameraTime - useTime,
    // breakTime: useTime - cameraTime,
    countDistance: countDistance,
    countHeadTowardShoulder: countHeadTowardShoulder,
    countHeadTurned: countHeadTurned,
    countHeadUporDown: countHeadUporDown,
  };
  await upload(data);
  data = reset();
  getUserInfo();
  document.getElementById("camera").style.display = "none";
}

export function handleSwitch() {
  console.log("Switch Button Clicked!");
  let camera;

  let isFirstPage = !document.getElementById("cameraSwitch");
  if (isFirstPage) {
    camera = document.getElementById("cameraSwitchIndex");
  } else {
    camera = document.getElementById("cameraSwitch");
  }
  console.log(camera);
  camera.innerText = isSwitchOn ? "Camera On" : "Camera Off";
  if (isSwitchOn) {
    if (!isFirstPage) {
      document.getElementById("camera").style.display = "none";
      document.getElementById("guide").style.display = "block";
    }
    stop();
  } else {
    isSwitchOn = true;
    if (!isFirstPage) {
      document.getElementById("camera").style.display = "block";
      document.getElementById("guide").style.display = "none";
    }
    start();
  }
}
window.addEventListener("load", main);
document
  .getElementById("cameraToggle")
  .addEventListener("change", handleSwitch);
