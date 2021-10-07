const EXTENSIONID = "pgloinlccpmhpgbnccfecikdjgdhneof";
import {
  citbMicrophone,
  setMicrophone,
  setMode,
  closeButtonContainer,
} from "./functions.js";

const setCloseEvent = (buttonClose) => {
  buttonClose.addEventListener("click", () => {
    closeButtonContainer();
  });
};

const setbuttonShowClickEvent = (
  buttonShow,
  classActivated,
  devices,
  showActivated
) => {
  buttonShow.addEventListener("click", () => {
    if (classActivated) {
      const mic = citbMicrophone(devices);
      if (mic.length > 0) {
        setMicrophone(mic[0].deviceId);
      } else {
        console.log("Could not change Microphone");
      }
    }
    setMode(showActivated ? "none" : "show");
  });
};

const setbuttonClassClickEvent = (buttonClass, classActivated, devices) => {
  if (classActivated) {
    const citbMicrophone = citbMicrophone(devices);
    if (citbMicrophone.length > 0) {
      setMicrophone(citbMicrophone[0].deviceId);
      setMode("none");
    } else {
      console.log("Could not change Microphone");
    }
  } else {
    const otherMicrophones = devices.filter(
      (x) => x.kind === "audioinput" && !x.label.includes(MYAUDIODEVICELABEL)
    );
    if (otherMicrophones.length > 0) {
      setMicrophone(otherMicrophones[0].deviceId);
      setMode("class");
    } else {
      console.log("Could not change Microphone");
    }
  }
};

const handleMouseOverEvent = () => {
  document.getElementById("buttonsContainer").style.background =
    "rgba(240, 243, 250,0.8)";
  document.getElementById("buttonClose").style.display = "block";
};

const handleMouseLeaveEvent = () => {
  document.getElementById("buttonsContainer").style.background =
    "rgb(240, 243, 250)";
  document.getElementById("buttonsContainer").style.boxShadow = "none";
  document.getElementById("buttonClose").style.display = "none";
};

export {
  setCloseEvent,
  handleMouseOverEvent,
  handleMouseLeaveEvent,
  setbuttonShowClickEvent,
  setbuttonClassClickEvent,
};
