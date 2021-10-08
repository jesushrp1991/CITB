import {
  citbMicrophone,
  setMicrophone,
  setMode,
  closeButtonContainer,
  compare
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
      const mic = citbMicrophone(devices,"audioinput",MYAUDIODEVICELABEL,compare.iqual);
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
  buttonClass.addEventListener("click",()=>{
    if (classActivated) {
      const citbMicrophone = citbMicrophone(devices,"audioinput",MYAUDIODEVICELABEL,compare.iqual);
      if (citbMicrophone.length > 0) {
        setMicrophone(citbMicrophone[0].deviceId);
        setMode("none");
      } else {
        console.log("Could not change Microphone");
      }
    } else {
      // const otherMicrophones = devices.filter(
      //   (x) => x.kind === "audioinput" && !x.label.includes(MYAUDIODEVICELABEL)
      // );
      const otherMicrophones = citbMicrophone(devices,"audioinput",MYAUDIODEVICELABEL,compare.distinct);
      if (otherMicrophones.length > 0) {
        setMicrophone(otherMicrophones[0].deviceId);
        setMode("class");
      } else {
        console.log("Could not change Microphone");
      }
    }
  })
};

const setButtonCamClickEvent = (buttonCam,citbActivated,devices) =>{
  buttonCam.addEventListener('click', () => {
    if (citbActivated) {
      const otherVideos = devices.filter(x => (x.kind === 'videoinput' && x.deviceId != defaultVideoId));
      if (otherVideos.length > 0) {
        setVideo(otherVideos[0].deviceId);
      } else {
        alert('Could not change Video');
      }
    } else {
      const citbVideo = devices.filter(x => (x.kind === 'videoinput' && x.label.includes(MYVIDEODDEVICELABEL)));
      if (citbVideo.length > 0) {
        setVideo(citbVideo[0].deviceId);
      } else {
        alert('Could not change Video');
      }
    }
  });
};

const handleMouseOverEvent = () => {
  document.getElementById("buttonsContainer").style.background ="rgba(240, 243, 250,0.8)";
};

const handleMouseLeaveEvent = () => {
  document.getElementById("buttonsContainer").style.background =
    "rgb(240, 243, 250)";
  document.getElementById("buttonsContainer").style.boxShadow = "none";
};

const mouseDragEvents = (buttonClose,buttonCam,buttonShow,buttonClass,buttonsContainerDiv,buttonDrag) =>{
  buttonClose.addEventListener("mouseenter", () => {
    console.log("close event");
    handleMouseOverEvent();
  }, { passive: false });

  buttonCam.addEventListener("mouseenter", () => {
    handleMouseOverEvent();
  }, { passive: false });

  buttonShow.addEventListener("mouseenter", () => {
    handleMouseOverEvent();
  }, { passive: false });

  buttonClass.addEventListener("mouseenter", () => {
    handleMouseOverEvent();
  }, { passive: false });

  buttonClose.addEventListener("mouseleave", () => {
    handleMouseLeaveEvent();
  }, { passive: false });

  buttonCam.addEventListener("mouseleave", () => {
    handleMouseLeaveEvent();
  }, { passive: false });

  buttonShow.addEventListener("mouseleave", () => {
    handleMouseLeaveEvent();
  }, { passive: false });

  buttonClass.addEventListener("mouseleave", () => {
    handleMouseLeaveEvent();
  }, { passive: false });

  buttonsContainerDiv.addEventListener('mouseenter', () => {
    handleMouseOverEvent();
  }, { passive: false });

  buttonsContainerDiv.addEventListener("mouseleave", () => {
    handleMouseLeaveEvent();
  }, { passive: false });

  buttonsContainerDiv.addEventListener("mouseover", () => {
    handleMouseOverEvent();
  }, { passive: false });

  //BEGIN DRAG****///
  buttonsContainerDiv.addEventListener('mousedown', (e) => {
    dragMouseDown(e);
    // handleDrag(window.buttonsContainerDiv);
    // closeButtonContainer(buttonClose);
  });
  buttonDrag.addEventListener('mousedown', (e) => {
    dragMouseDown(e);
    // handleDrag(window.buttonsContainerDiv);
    // closeButtonContainer(buttonClose);
  });
  console.log("Set all listeners");
}
let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position:
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  // set the element's new position:
  window.buttonsContainerDiv.style.rigth = '';
  window.buttonsContainerDiv.style.top = (window.buttonsContainerDiv.offsetTop - pos2) + "px";
  window.buttonsContainerDiv.style.left = (window.buttonsContainerDiv.offsetLeft - pos1) + "px";
}

function closeDragElement() {
  /* stop moving when mouse button is released:*/
  document.onmouseup = null;
  document.onmousemove = null;
}

export {
  setCloseEvent,
  handleMouseOverEvent,
  handleMouseLeaveEvent,
  setbuttonShowClickEvent,
  setbuttonClassClickEvent,
  setButtonCamClickEvent,
  mouseDragEvents
};
