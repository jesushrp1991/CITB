import { setEvents } from "./eventos.js";
import { enviroment } from "./enviroment.js";
import {
  getButtonShow,
  getButtonClass,
  getButtonCam,
  getButtonClose,
  getContainerButton,
  setButtonBackground,
  addElementsToDiv,
  getVirtualCam,
  getButtonDrag,
  setMicrophone,
  showDiv,
  createWebContainerState,
  createModeCurrentMic,
  getButtonShowPopupMicClassMode,
  getButtonShowPopupVideo
} from "./domUtils.js";

import {
  builVideosFromDevices,
  buildVideoContainersAndCanvas,
  drawFrameOnVirtualCamera,
  virtualWebCamMediaStream,
  videoCITB,
  videoOther,
  canChangeCameras,
  fadeInFadeOut
} from "./managers/videoManager/webcam.js";

// import {
//   helptButtonNext,
//   imgHelp,
//   divHelp,
//   showHelp,
//   setEventButtonNext,
// } from "../helper/helper.js";

import {
  divOverlay,
  divFab,
  formWrapper,
  divHeader,
  hHeader,
  divContent,
  classIcon,
  divTextFields,
  selectMic,
  labelText,
  divButton,
  checkboxSelect,
  labelCheckBox,
  buttonSelect,
  createPopup,
  setButtonCallBack
} from "./managers/popupClassMode/popupClassMode.js";

import {
    divOverlayVideo,
    divFabVideo,
    formWrapperVideo,
    divHeaderVideo,
    hHeaderVideo,
    buttonCloseVideo,
    divContentVideo,
    classIconVideo,
    divTextFieldsVideo,
    selectMicVideo,
    labelTextVideo,
    divButtonVideo,
    buttonSelectVideo,
    createPopupVideo,
    setButtonCallBackVideo
} from "./managers/popupVideoMode/popupVideoMode.js";

import {speachCommands} from "./managers/voiceManager/voice.js"


function monkeyPatchMediaDevices() {
  window.showActivated = false;
  window.classActivated = false;

  window.helpCount = 2;
  window.showMicSelector = true;

  //WEB CONTAINER
  const buttonShow = getButtonShow();
  const buttonClass = getButtonClass();
  window.buttonCam = getButtonCam();
  const buttonClose = getButtonClose();
  const buttonDrag = getButtonDrag();
  const buttonPopup = getButtonShowPopupMicClassMode();
  const buttonVideoPopup = getButtonShowPopupVideo();
  const pWebContainerState = createWebContainerState();
  const pModeCurrentMic = createModeCurrentMic();

  // const helptButton = helptButtonNext();
  // const help_div = divHelp();
  // const img_help = imgHelp();

  //POPUP MIC CLASS MODE
  const div_OverlayVideo = divOverlayVideo();
  const div_FabVideo= divFabVideo();
  const form_WrapperVideo = formWrapperVideo();
  const div_HeaderVideo = divHeaderVideo();
  const h_HeaderVideo = hHeaderVideo();
  const h_buttonCloseVideo = buttonCloseVideo();

  const div_ContentVideo = divContentVideo();
  const div_ButtonIconVideo = classIconVideo();
  const div_TextFieldsVideo = divTextFieldsVideo();
  const selec_MicVideo = selectMicVideo();
  const label_TextVideo = labelTextVideo();
  const div_ButtonVideo = divButtonVideo();
  const button_SelectVideo = buttonSelectVideo();
  const brVideo = document.createElement("br");

  //POPUP MIC MODE
  const div_Overlay = divOverlay();
  const div_Fab = divFab();
  const form_Wrapper = formWrapper();
  const div_Header = divHeader();
  const h_Header = hHeader();
  const div_Content = divContent();
  const div_ButtonIcon = classIcon();
  const div_TextFields = divTextFields();
  const selec_Mic = selectMic();
  const label_Text = labelText();
  const div_Button = divButton();
  const checkbox_class = checkboxSelect();
  const checkbox_label = labelCheckBox();
  const button_Select = buttonSelect();
  const br = document.createElement("br");

  document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
      // setEventButtonNext(helptButton, buttonHelpNextCallBack);
      buttonPopup.addEventListener('click',showPopupMic);
      document.body.appendChild(buttonPopup);
      buttonVideoPopup.addEventListener('click',showPopupVideo);
      document.body.appendChild(buttonVideoPopup);
      document.body.appendChild(pWebContainerState);
      document.body.appendChild(pModeCurrentMic);
      setMicrophone(enviroment.MYAUDIODEVICELABEL);

      //WEB CONTAINER
      const buttonsContainerDiv = getContainerButton();
      const br = document.createElement("br");
      const br0 = document.createElement("br");
      const br1 = document.createElement("br");
      const br2 = document.createElement("br");
      addElementsToDiv(
        buttonsContainerDiv,
        buttonClose,
        br0,
        window.buttonCam,
        br,
        buttonShow,
        br1,
        buttonClass,
        br2,
        buttonDrag
      );

      setButtonBackground(window.buttonCam, window.citbActivated);
      setButtonBackground(buttonShow, window.showActivated);
      setButtonBackground(buttonClass, window.classActivated);
      setButtonBackground(buttonDrag);
      if (window.actualVideoTag == videoCITB) {
        window.citbActivated = true;
        setButtonBackground(window.buttonCam, window.citbActivated);
      }
      setEvents(
        buttonShow,
        buttonClass,
        window.buttonCam,
        buttonClose,
        buttonsContainerDiv,
        camCallBackFunction,
        showCallBackFunction,
        classCallBackFunction
      );
    }
  }; //END ONREADY STATE CHANGE

  const buttonHelpNextCallBack = () => {
    if (window.helpCount == 7) {
      helptButton.textContent = "Close";
    } else if (window.helpCount >= 8) {
      help_div.style.display = "none";
      return;
    }
    img_help.src = `chrome-extension://${enviroment.EXTENSIONID}/helper/img/${window.helpCount}.png`;
    window.helpCount++;
  };
  const camCallBackFunction = async () => {
    console.log("canChange",canChangeCameras)
    if (!canChangeCameras) {
      alert('In order to be able to change cameras you need to choose "Virtual Class In The Box" as your webcam on your videoconference app');
      return;
    }
    if (window.actualVideoTag.id == "OTHERVideo") {
      await fadeInFadeOut();
      window.actualVideoTag = videoCITB;
      window.citbActivated = true;
      await fadeInFadeOut();
    } else {
      await fadeInFadeOut();
      window.actualVideoTag = videoOther;
      window.citbActivated = false;
      await fadeInFadeOut();
    }
    setButtonBackground(window.buttonCam, window.citbActivated);
  };

  const getCITBMicMedia = async () => {
    const citbMicrophone = devices.filter(
      (x) =>
        x.kind === "audioinput" &&
        x.label.includes(enviroment.MYAUDIODEVICELABEL)
    );
    if (citbMicrophone.length > 0) {
      let constraints = {
        video: false,
        audio: {
          deviceId: { exact: citbMicrophone[0].deviceId },
        },
      };
      let result = await navigator.mediaDevices.getUserMedia(constraints);
      return result;
    } else {
      return null;
    }
  };

  const showCallBackFunction = async () => {
    if (window.classActivated) {
      deactivateClassMode();
    }
    if (showModeEnabled) {
      if (showAudioContext != null) {
        showAudioContext.close();
        showAudioContext = null;
        showModeEnabled = false;
        setButtonBackground(buttonShow, showModeEnabled);
      }
    } else {
      showAudioContext = new AudioContext();
      const CITBMicMedia = await getCITBMicMedia();
      if (CITBMicMedia == null) {
        setButtonBackground(buttonShow, false);
        return;
      }
      const source = showAudioContext.createMediaStreamSource(CITBMicMedia);
      source.connect(showAudioContext.destination);
      showModeEnabled = true;
      setButtonBackground(buttonShow, showModeEnabled);
    }
  };

  const activateClassMode = () => {
    if (showModeEnabled) {
      showCallBackFunction();
    }
    const otherMicrophones = document.getElementById("pModeCurrentMic").innerText.toString();
    if (otherMicrophones) {
      window.classActivated = true;
      setButtonBackground(buttonClass, window.classActivated);
      return true;
    }
    return false;
  };

  const deactivateClassMode = () => {
    const citbMicrophone = devices.filter(
      (x) =>
        x.kind === "audioinput" &&
        x.label.includes(enviroment.MYAUDIODEVICELABEL)
    );
    if (citbMicrophone.length > 0) {
      setMicrophone(citbMicrophone[0].deviceId);
      window.classActivated = false;
      setButtonBackground(buttonClass, window.classActivated);
      return true;
    }
    return false;
  };

  const changeToClassMode = () =>{
    if (window.classActivated) {
      if (deactivateClassMode()) {
      } else {
        alert("There is no CITB microphone");
      }
    } else {
      if (activateClassMode()) {
      } else {
        alert("There is not another microphone");
      }
    }
  }

  const chooseMicClassMode = (e) =>{
    e.preventDefault();
    setMicrophone(selec_Mic.value);
    window.showMicSelector = !checkbox_class.checked;
    div_Fab.setAttribute('class','fab');
    div_Overlay.removeAttribute('class');
    changeToClassMode();
  }

  const showPopupMic = async() =>{
    let mics = await navigator.mediaDevices.enumerateDevices();
      let usableMics = mics.filter(
        (x) =>
          x.kind === "audioinput" &&
          !x.label.includes("Mezcla")
        );
      usableMics = usableMics.filter(
        (x) =>
          !x.label.includes("Mix")
        );
      usableMics = usableMics.filter(
        (x) =>
          !x.label.includes(enviroment.MYAUDIODEVICELABEL) 
        );
      createPopup(
        div_Overlay,
        div_Fab,
        form_Wrapper,
        div_Header,
        h_Header,
        div_Content,
        div_ButtonIcon,
        div_TextFields,
        selec_Mic,
        label_Text,
        div_Button,
        checkbox_class,
        checkbox_label,
        button_Select,
        br,
        usableMics
      );
      setButtonCallBack(button_Select,chooseMicClassMode);
  }
  const chooseVideo = async(e) =>{
    console.log("CHOOSE VIDEO")
    e.preventDefault();
    await builVideosFromDevices(selec_MicVideo.value);
    await buildVideoContainersAndCanvas();
    await drawFrameOnVirtualCamera();
    div_FabVideo.setAttribute('class','fab');
    div_OverlayVideo.removeAttribute('class');
  }
  const showPopupVideo = async() =>{
      let mics = await navigator.mediaDevices.enumerateDevices();
      let usableVideo = mics.filter(
        (x) =>
          x.kind === "videoinput" 
          && !x.label.includes(enviroment.MYVIDEODDEVICELABEL) 
          && !x.label.includes("Virtual Class In The Box") 

        );
      usableVideo = usableVideo.filter((x) => !x.label.includes('box'));
      createPopupVideo(
        div_OverlayVideo,
        div_FabVideo,
        form_WrapperVideo,
        div_HeaderVideo,
        h_HeaderVideo,
        div_ContentVideo,
        div_ButtonIconVideo,
        div_TextFieldsVideo,
        selec_MicVideo,
        label_TextVideo,
        div_ButtonVideo,
        button_SelectVideo,
        brVideo,
        usableVideo
      );
      setButtonCallBackVideo(button_SelectVideo,chooseVideo);
      // setButtonCallBackVideo(h_buttonCloseVideo,chooseVideo);

  }

  const classCallBackFunction = async (isFromPopup) => {
    if(window.showMicSelector && !window.classActivated){
      showPopupMic();
    }else{
      changeToClassMode();
    }
  };

  var isShow;
  var currentAudioMediaStream = new MediaStream();
  let devices = [];
  var showAudioContext;
  let showModeEnabled = false;
  let defaultMicrophoneId;

  const checkingMicrophoneId = async function () {
    try {
      let currentMic = document
        .getElementById("pModeCurrentMic")
        .innerText.toString();
      if (window.localPeerConection) {
        if (defaultMicrophoneId != currentMic) {
          defaultMicrophoneId = currentMic;
          setMicrophone(defaultMicrophoneId);
          currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: defaultMicrophoneId },
            video: false,
          });
          if (
            currentAudioMediaStream &&
            currentAudioMediaStream.getAudioTracks().length > 0
          ) {
            const micAudioTrack = currentAudioMediaStream.getAudioTracks()[0];
            const senders = window.localPeerConection.getSenders();
            const sendersWithTracks = senders.filter((s) => s.track != null);
            sendersWithTracks
              .filter((x) => x.track.kind === "audio")
              .forEach((mysender) => {
                mysender.replaceTrack(micAudioTrack);
              });
          }
        }
      }
    } catch (error) {
      console.log("no voy a cambiar el modo debido a este error: ", error);
    }
  };
  setInterval(checkingMicrophoneId, 500);

  window.enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;

  MediaDevices.prototype.enumerateDevices = async function () {
    const res = await window.enumerateDevicesFn.call(navigator.mediaDevices);
    devices = res;
    res.push(getVirtualCam());
    return res;
  };

  // MICROSOFT's TEAMS USE THIS
  const webKitGUM = Navigator.prototype.webkitGetUserMedia;

  Navigator.prototype.webkitGetUserMedia = async function (
    constrains,
    successCallBack,
    failureCallBack
  ) {
    if (constrains.video && constrains.video.mandatory.sourceId) {
      if (
        constrains.video.mandatory.sourceId === "virtual" ||
        constrains.video.mandatory.sourceId.exact === "virtual"
      ) {
        await builVideosFromDevices();
        await buildVideoContainersAndCanvas();
        await drawFrameOnVirtualCamera();
        speachCommands();
        successCallBack(virtualWebCamMediaStream);
      }
    }
    const res = await webKitGUM.call(
      this,
      constrains,
      successCallBack,
      failureCallBack
    );
    return res;
  };

  // GOOGLE's MEET USE THIS
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;

  MediaDevices.prototype.getUserMedia = async function () {
    const args = arguments;

    if (args.length && args[0].video && args[0].video.deviceId) {
      if (
        args[0].video.deviceId === "virtual" ||
        args[0].video.deviceId.exact === "virtual"
      ) {
        await builVideosFromDevices();
        await buildVideoContainersAndCanvas();
        await drawFrameOnVirtualCamera();
        speachCommands();
        return virtualWebCamMediaStream;
      } else {
        return await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
      }
    }
    const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
    return res;
  };

  var acreateOffer = RTCPeerConnection.prototype.createOffer;
  RTCPeerConnection.prototype.createOffer = async function (options) {
    isShow = showDiv(isShow);
    // showHelp(help_div, img_help, helptButton);
    window.localPeerConection = this;
    return await acreateOffer.apply(this, arguments);
  };

  navigator.mediaDevices.addEventListener(
    "devicechange",
    async function (event) {
      const res = await navigator.mediaDevices.enumerateDevices();
      await buildVideoContainersAndCanvas();
      await builVideosFromDevices();
    }
  );

  const checkDevices = () => {
    navigator.mediaDevices.enumerateDevices();
    setTimeout(() => {
      checkDevices();
    }, 1000);
  };
  checkDevices();
}

monkeyPatchMediaDevices();
