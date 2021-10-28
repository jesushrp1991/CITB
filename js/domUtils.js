const generateVirtualWebCamCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'virtualWebCamCanvasVideoContainer')
    return canvas
}

const generateVideoContainerWithId = (videoId) => {
  const video = document.createElement('video');
  video.setAttribute('id', videoId);
  video.setAttribute('playsinline', "")
  video.setAttribute('autoplay', "")
  video.style.display = 'none';
  return video
}

const generateCITBVideoContainer = () => {
  return generateVideoContainerWithId('CITBVideo')
}

const generateOtherVideoContainer = () => {
  return generateVideoContainerWithId('OTHERVideo')
}

const getButtonShow = () => {
  const buttonShow = document.createElement("button");
  buttonShow.className = "CITBButton";
  buttonShow.classList.add("CITBShowButton");
  return buttonShow;
};

const getButtonClass = () => {
  const buttonClass = document.createElement("button");
  buttonClass.className = "CITBButton";
  buttonClass.classList.add("CITBClassButton");
  return buttonClass;
};

const getButtonCam = () => {
  const buttonCam = document.createElement("button");
  buttonCam.className = "CITBButton";
  buttonCam.classList.add("CITBCamButton");
  return buttonCam;
};
const getButtonClose = () => {
  const buttonClose = document.createElement("button");
  buttonClose.setAttribute("id", "buttonClose");
  return buttonClose;
};

const getContainerButton = () => {
  const div = document.createElement("div");
  div.setAttribute("id", "buttonsContainer");
  div.style.position = "absolute";
  div.style.zIndex = 980;
  div.style.width = "40px";
  div.style.height = "210px";
  div.style.top = "60px";
  div.style.right = "16px";
  div.style.background = "rgb(240, 243, 250)";
  div.style.borderRadius = "20px";
  return div;
};
const getButtonDrag = () => {
  const buttonDrag = document.createElement("button");
  buttonDrag.setAttribute("id", "buttonDrag");
  return buttonDrag;
};

const setButtonBackground = (button, activated) => {
  activated
    ? button.classList.add("active")
    : button.classList.remove("active");
};

const addElementsToDiv = (
  div,
  buttonClose,
  br0,
  buttonCam,
  br,
  buttonShow,
  br1,
  buttonClass,
  br2,
  buttonDrag
) => {
  div.appendChild(buttonClose);
  div.appendChild(buttonCam);
  div.appendChild(br);
  div.appendChild(buttonShow);
  div.appendChild(br1);
  div.appendChild(buttonClass);
  div.appendChild(br2);
  div.appendChild(buttonDrag);
  document.body.appendChild(div);
  div.style.display = "none";
};

const getVirtualCam = () => {
  return {
    deviceId: "virtual",
    groupID: "uh",
    kind: "videoinput",
    label: "Virtual Class In The Box",
  };
};

const closeButtonContainer = () => {
  document.getElementById("buttonsContainer").style.visibility = "hidden";
  document.getElementById("pWebContainerState").innerText = "CLOSE";
};
const setMicrophone = (microphone) => { 
  document.getElementById("pModeCurrentMic").innerText = microphone;
}; 

// const setVideoT = (mode) =>{
//   document.getElementById('pVideoState').innerText = mode;
// }
// const setModeT = (mode) =>{
//   document.getElementById('pModeState').innerText = mode;
// }

// const setCITBCam = (exitsCam) =>{
//   document.getElementById('pModeExistsCam').innerText = exitsCam;

// }
const showDiv = (isShow) => {
  if (document.getElementById('buttonsContainer') && !isShow){
    document.getElementById('buttonsContainer').style.display = 'block';
    document.getElementById("pWebContainerState").innerText = "OPEN";
    isShow = true;
  }
  return isShow;
}

// const createVideoState = () =>{
//   const pVideoState = document.createElement('p');
//   pVideoState.setAttribute('id','pVideoState');
//   pVideoState.style.display = 'none';
//   return pVideoState;
// }
// const createModeState = () =>{
//   const pModeState = document.createElement('p');
//   pModeState.setAttribute('id','pModeState');
//   pModeState.style.display = 'none';
//   return pModeState;
// }
const createWebContainerState = () =>{
  const pWebContainerState = document.createElement('p');
  pWebContainerState.setAttribute('id','pWebContainerState');
  pWebContainerState.style.display = 'none';
  return pWebContainerState;
}
// const createModeExistsCam = () =>{
//   const pModeExistsCam = document.createElement('p');
//   pModeExistsCam.setAttribute('id','pModeExistsCam');
//   pModeExistsCam.style.display = 'none';
//   return pModeExistsCam;
// }
const createModeCurrentMic = () =>{
  const pModeCurrentMic = document.createElement('p');
  pModeCurrentMic.setAttribute('id','pModeCurrentMic');
  pModeCurrentMic.style.display = 'none';
  return pModeCurrentMic;
}

const getButtonShowPopupMicClassMode = () => {
  const buttonPopup = document.createElement("button");
  buttonPopup.setAttribute('id','buttonPopup');
  buttonPopup.style.display = 'none';
  return buttonPopup;
};

export {
  generateVirtualWebCamCanvas,
  getButtonShow,
  getButtonClass,
  getButtonCam,
  getButtonClose,
  getContainerButton,
  setButtonBackground,
  addElementsToDiv,
  getVirtualCam,
  getButtonDrag,
  closeButtonContainer,
  setMicrophone,
  generateOtherVideoContainer,
  generateCITBVideoContainer,
  // setVideoT, 
  // setModeT, 
  // setCITBCam,
  showDiv,
  // createVideoState,
  // createModeState,
  createWebContainerState,
  // createModeExistsCam,
  createModeCurrentMic,
  getButtonShowPopupMicClassMode
};
