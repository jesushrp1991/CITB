const generateVirtualWebCamCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "virtualWebCamCanvasVideoContainer");
  return canvas;
};

const generateVideoContainerWithId = (videoId) => {
  const video = document.createElement("video");
  video.setAttribute("id", videoId);
  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");
  video.style.display = "none";
  return video;
};

const generateCITBVideoContainer = () => {
  return generateVideoContainerWithId("CITBVideo");
};

const generateOtherVideoContainer = () => {
  return generateVideoContainerWithId("OTHERVideo");
};

const getButtonShow = () => {
  const buttonShow = document.getElementById("buttonShow");
  return buttonShow;
};

const getButtonClass = () => {
  const buttonClass = document.getElementById("buttonClass");
  return buttonClass;
};

const getButtonPresentation = () => {
  const buttonPresentation = document.getElementById("duplo1");
  return buttonPresentation;
};

const getButtonCam = () => {
  const buttonCam = document.getElementById("CITBcamButton");
  return buttonCam;
};
const getButtonClose = () => {
  const buttonClose = document.getElementById("buttonClose");
  return buttonClose;
};

const getContainerButton = () => {
  const div = document.getElementById("buttonsContainer");
  return div;
};

const getButtonDrag = () => {
  const buttonDrag = document.getElementById("buttonDrag");
  return buttonDrag;
};

const setButtonBackground = (citbInputName, activated) => {
  const citbFloatingButtonElement = document.getElementsByTagName(
    "citb-floating-buttons"
  )[0];

  if(citbInputName == "citbCamActive"){
    activated
      ? citbFloatingButtonElement.citbCamActive = 'active'
      : citbFloatingButtonElement.citbCamActive = ''
  }
  if(citbInputName == "citbShowActive"){
    activated
    ? citbFloatingButtonElement.citbShowActive = 'active'
    : citbFloatingButtonElement.citbShowActive = ''
  }
  if(citbInputName == "citbClassActive"){
    activated
    ? citbFloatingButtonElement.citbClassActive = 'active'
    : citbFloatingButtonElement.citbClassActive = ''
  }
  if(citbInputName == "citbDuploActive"){
    activated
    ? citbFloatingButtonElement.citbDuploActive = 'active'
    : citbFloatingButtonElement.citbDuploActive = ''
  }
  if(citbInputName == "citbDuploMiniActive"){
    activated
    ? citbFloatingButtonElement.citbDuploMiniActive = 'active'
    : citbFloatingButtonElement.citbDuploMiniActive = ''
  }
  if(citbInputName == "citbDuploContainerActive"){
    activated
    ? citbFloatingButtonElement.citbDuploContainerActive = 'active'
    : citbFloatingButtonElement.citbDuploContainerActive = ''
  }
};

const addFloatingContainerToDom = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  return;
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
  document.getElementsByTagName("citb-floating-buttons")[0].style.visibility = "hidden";
  document.getElementById("pWebContainerState").innerText = "CLOSE";
};
const setMicrophone = (microphone) => {
  document.getElementById("pModeCurrentMic").innerText = microphone;
};

const showDiv = () => {
  if (document.getElementsByTagName("citb-floating-buttons")[0]) {
    document.getElementsByTagName("citb-floating-buttons")[0].style.visibility = "visible";
    document.getElementById("pWebContainerState").innerText = "OPEN";
  }
};

const createWebContainerState = () => {
  const pWebContainerState = document.createElement("p");
  pWebContainerState.setAttribute("id", "pWebContainerState");
  pWebContainerState.style.display = "none";
  return pWebContainerState;
};

const createModeCurrentMic = () => {
  const pModeCurrentMic = document.createElement("p");
  pModeCurrentMic.setAttribute("id", "pModeCurrentMic");
  pModeCurrentMic.style.display = "none";
  return pModeCurrentMic;
};

const getButtonShowPopupMicClassMode = () => {
  const buttonPopup = document.createElement("button");
  buttonPopup.setAttribute("id", "buttonPopup");
  buttonPopup.style.display = "none";
  return buttonPopup;
};

const getButtonShowPopupVideo = () => {
  const buttonPopup = document.createElement("button");
  buttonPopup.setAttribute("id", "buttonPopupVideo");
  buttonPopup.style.display = "none";
  return buttonPopup;
};

const getButtonOnOffExtension = () => {
  const buttonOnOff = document.createElement("button");
  buttonOnOff.setAttribute("id", "buttonOnOff");
  buttonOnOff.style.display = "none";
  return buttonOnOff;
};

export {
  generateVirtualWebCamCanvas,
  getButtonShow,
  getButtonClass,
  getButtonCam,
  getButtonClose,
  getContainerButton,
  setButtonBackground,
  addFloatingContainerToDom,
  getVirtualCam,
  getButtonDrag,
  closeButtonContainer,
  setMicrophone,
  generateOtherVideoContainer,
  generateCITBVideoContainer,
  showDiv,
  createWebContainerState,
  createModeCurrentMic,
  getButtonShowPopupMicClassMode,
  getButtonPresentation,
  getButtonShowPopupVideo,
  getButtonOnOffExtension,
};