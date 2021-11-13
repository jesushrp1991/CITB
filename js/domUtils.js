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


const getButtonPresentation = () => {
  const buttonClass = document.createElement("button");
  buttonClass.className = "CITBButton";
  buttonClass.setAttribute("id", "buttonPresentation");
  buttonClass.classList.add("CITBPresentationButton");
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
  div.style.height = "250px";
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

const addElementsToDiv = (div, array) => {
  array.forEach(element => {
    div.appendChild(element);
  })
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

const showDiv = (isShow) => {
  if (document.getElementById('buttonsContainer') && !isShow){
    document.getElementById('buttonsContainer').style.display = 'block';
    document.getElementById("pWebContainerState").innerText = "OPEN";
    isShow = true;
  }
  return isShow;
}

const createWebContainerState = () =>{
  const pWebContainerState = document.createElement('p');
  pWebContainerState.setAttribute('id','pWebContainerState');
  pWebContainerState.style.display = 'none';
  return pWebContainerState;
}

const createCitbMicrophoneState = () =>{
  const pCitbMicrophoneState = document.createElement('p');
  pCitbMicrophoneState.setAttribute('id','pCitbMicrophoneState');
  pCitbMicrophoneState.style.display = 'none';
  return pCitbMicrophoneState;
}

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

const getButtonShowPopupVideo = () => {
  const buttonPopup = document.createElement("button");
  buttonPopup.setAttribute('id','buttonPopupVideo');
  buttonPopup.style.display = 'none';
  return buttonPopup;
};

const getButtonSimplePopup = () => {
  const buttonPopup = document.createElement("button");
  buttonPopup.setAttribute('id','buttonSimplePopup');
  buttonPopup.style.display = 'none';
  return buttonPopup;
};

const getButtonMicAlertPopup = () => {
  const buttonPopup = document.createElement("button");
  buttonPopup.setAttribute('id','buttonMicAlertPopup');
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
  showDiv,
  createWebContainerState,
  createCitbMicrophoneState,
  createModeCurrentMic,
  getButtonShowPopupMicClassMode,
  getButtonPresentation,
  getButtonShowPopupVideo,
  getButtonSimplePopup,
  getButtonMicAlertPopup
};
