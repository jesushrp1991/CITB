import { setEvents } from "./eventos.js";
import { enviroment } from "./enviroment.js";
import{ audioTimerLoop } from "./managers/videoManager/webcam.js"
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
  getButtonShowPopupVideo,
  getButtonPresentation,
  showTooltip,
  classTooltip,
  presentationTooltip,
  getButtonOnOffExtension,
  closeButtonContainer
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

import {
  divOverlay,
  divFab,
  formWrapper,
  divHeader,
  headerClose,
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
    headerCloseVideo,
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

  window.classActivated = false;
  //Activate Extension 
  window.isExtentionActive = false;
  const buttonOnOffExtension = getButtonOnOffExtension();
  const openCloseExtension = async () =>{
    let isCITBConnected = await checkCITBConnetion();
    if(window.isExtentionActive){      
      closeButtonContainer();
      if (window.cameraAudioLoop != undefined) {
        window.cameraAudioLoop();
        window.cameraAudioLoop = undefined;
      }
      if (window.classActivated) {
        deactivateClassMode();
      }
      if (showModeEnabled) {
        showCallBackFunction();
      }   
    }
    if(isCITBConnected){
      if(!window.isExtentionActive){
        window.cameraAudioLoop = audioTimerLoop(drawFrameOnVirtualCamera, 1000/30);
        showDiv();
      }
    }  
    window.isExtentionActive = !window.isExtentionActive;
    buttonOnOffExtension.innerText = window.isExtentionActive;    
    onOffExtension();
  }
  buttonOnOffExtension.addEventListener("click", openCloseExtension);
  
  //WEB CONTAINER
  const buttonShow = getButtonShow();
  const showTip = showTooltip();
  const buttonClass = getButtonClass();
  const classTip = classTooltip();
  const buttonPresentation = getButtonPresentation();
  const presentationTip = presentationTooltip();
  window.presentationMode = false;

  window.buttonCam = getButtonCam();
  const buttonClose = getButtonClose();
  const buttonDrag = getButtonDrag();
  const buttonPopup = getButtonShowPopupMicClassMode();
  const buttonVideoPopup = getButtonShowPopupVideo();
  const pWebContainerState = createWebContainerState();
  const pModeCurrentMic = createModeCurrentMic();

  const div_OverlayVideo = divOverlayVideo();
  const div_FabVideo= divFabVideo();
  const form_WrapperVideo = formWrapperVideo();
  const div_HeaderVideo = divHeaderVideo();
  const close_headerVideo = headerCloseVideo();
  const h_HeaderVideo = hHeaderVideo();

  
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
  const header_close = headerClose();
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
      document.body.appendChild(buttonOnOffExtension);
      // console.log("LocalStorage coll",localStorage.getItem("asd123"));
      // setEventButtonNext(helptButton, buttonHelpNextCallBack);
      buttonPopup.addEventListener('click',showPopupMic);
      buttonVideoPopup.addEventListener('click',showPopupVideo);
      document.body.appendChild(buttonPopup);
      document.body.appendChild(buttonVideoPopup);
      document.body.appendChild(pWebContainerState);
      document.body.appendChild(pModeCurrentMic);
      setMicrophone(enviroment.MYAUDIODEVICELABEL);

      //WEB CONTAINER
      const buttonsContainerDiv = getContainerButton();

      addElementsToDiv(
        buttonsContainerDiv,
        [
          buttonClose,
          window.buttonCam,
          buttonShow,
          showTip,
          buttonClass,
          classTip,
          buttonPresentation,
          presentationTip,
          buttonDrag,
        ]
      );
    
      setButtonBackground(window.buttonCam, window.citbActivated);
      setButtonBackground(buttonShow, showModeEnabled);
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
     checkingMicrophoneId();
    //  speachCommands();
    }
  }; //END ONREADY STATE CHANGE

  const presentacionCallBackFunction = async () =>{
      await fadeInFadeOut();
      window.presentationMode = !window.presentationMode
      setButtonBackground(buttonPresentation, window.presentationMode);
      await fadeInFadeOut();
  }
  buttonPresentation.addEventListener('click',presentacionCallBackFunction);
  const camCallBackFunction = async () => {
    try{
      if (!canChangeCameras) {
        alert(enviroment.messageCITBCamOffline);
        return;
      }
      if(window.presentationMode){
        await fadeInFadeOut();
        window.presentationMode = !window.presentationMode 
        setButtonBackground(buttonPresentation, window.presentationMode); 
        await fadeInFadeOut();
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
    }catch(e){
      logErrors(e,"camCallBackFunction,ln 205");
    }
  };


  const getCITBVideoDevices = async () => {
    try {
      const citbVideo = devices.filter(
        s => 
        s.label.includes(enviroment.MYVIDEODDEVICELABEL.split(",")[0]) 
        ||  s.label.includes(enviroment.MYVIDEODDEVICELABEL.split(",")[1])   
      );
      return (citbVideo.length > 0) ? citbVideo : [];
    } catch (error) {
      logErrors(error,"getCITBVideoDevices ln. 266");
    }
  };

  const getCITBMicDevices = () => {

    try {
      const citbMicrophone = devices.filter(
        (x) =>
          x.kind === "audioinput" &&
          x.label.includes(enviroment.MYAUDIODEVICELABEL)
      );
      return (citbMicrophone.length > 0) ? citbMicrophone : [];
    } catch (error) {
      logErrors(error,"getCITBMicDevices ln. 266");
    }
  };

  const getCITBMicMedia = async () => {
    try {
      let citbMicrophone = getCITBMicDevices();
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
    } catch (error) {
      logErrors(error,"getCTBMicMedia ln. 227");
    }
  };

  const showCallBackFunction = async () => {
    try {
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
    } catch (error) {
      logErrors(error,"showCallBackFunction ln. 251")
    }
  };

  const activateClassMode = () => {
    try {
      if (showModeEnabled) {
        showCallBackFunction();
      }
      const otherMicrophones = document.getElementById("pModeCurrentMic").innerText.toString();
      if (otherMicrophones) {
        window.classActivated = true;
        checkingMicrophoneId();
        setButtonBackground(buttonClass, window.classActivated);
        return true;
      }
      return false;
    } catch (error) {
      logErrors(error,"activateClassMode ln 280")
    }
  };

  const deactivateClassMode = () => {
   try {
    const citbMicrophone = getCITBMicDevices();
    if (citbMicrophone.length > 0) {
      setMicrophone(citbMicrophone[0].deviceId);
      window.classActivated = false;
      checkingMicrophoneId();
      setButtonBackground(buttonClass, window.classActivated);
      return true;
    }
    return false;
   } catch (error) {
     logErrors(error,"deactivateClassMode ln 298")
   }
  };

  const changeToClassMode = () =>{
    try {
      if (window.classActivated) {
        if (deactivateClassMode()) {
          
        } else {
          alert("There is no CITB microphone");
        }
      } else {
        //activate class mode
        if(!checkbox_class.checked || selec_Mic.value != window.otherMicSelection)
        {
          setMicrophone(selec_Mic.value);
          window.otherMicSelection = selec_Mic.value;
        }else{
          setMicrophone(window.otherMicSelection);
        }
        if (activateClassMode()) {
        } else {
          alert("There is not another microphone");
        }
      }
    } catch (error) {
      logErrors(error,"changeToClassMode ln 318")
    }
  }

  const chooseMicClassMode = (e) =>{
    e.preventDefault();
    div_Fab.setAttribute('class','fab');
    div_Overlay.removeAttribute('class');
    changeToClassMode();
  }

  const closeModalClassMode = (e) => {
    e.preventDefault();
    div_Fab.setAttribute('class','fab');
    div_Overlay.removeAttribute('class');
  }
  const classCallBackFunction = async (isFromPopup) => {
    try {
      if(!checkbox_class.checked && !window.classActivated){
        showPopupMic();
      }else{
        changeToClassMode();
      }
    } catch (error) {
      logErrors(error,"classCallBackFunction ln 352")
    }
  };

  const showPopupMic = async() =>{
    try {
      let usableMics = devices.filter(
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
        header_close,
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
      setButtonCallBack(header_close,closeModalClassMode);
    } catch (error) {
      logErrors(error,"showPopupMic ln 364")
    }
  }
  const chooseVideo = async(e) =>{
    e.preventDefault();
    await builVideosFromDevices(selec_MicVideo.value);
    await buildVideoContainersAndCanvas();
    await drawFrameOnVirtualCamera();
    div_FabVideo.setAttribute('class','fab');
    div_OverlayVideo.removeAttribute('class');
  }

  const closeVideo = (e) => {
    e.preventDefault();
    div_FabVideo.setAttribute('class','fab');
    div_OverlayVideo.removeAttribute('class');
  }
  const showPopupVideo = async() =>{
      try {
        let usableVideo = devices.filter(
          (x) =>
            x.kind === "videoinput" 
            && !x.label.includes(enviroment.MYVIDEODDEVICELABEL) 
            && !x.label.includes("Virtual Class In The Box") 

          );
        // enviroment.MYVIDEODDEVICELABEL.forEach(element => {
        //   usableVideo = usableVideo.filter((device)=> device.label != element);
        // });
        usableVideo = usableVideo.filter((x) => !x.label.includes('box'));
        createPopupVideo(
          div_OverlayVideo,
          div_FabVideo,
          form_WrapperVideo,
          div_HeaderVideo,
          close_headerVideo,
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
        setButtonCallBackVideo(close_headerVideo,closeVideo);
      } catch (error) {
        logErrors(error,"showPopupVideo ln 412")
      }
  }

  var currentAudioMediaStream = new MediaStream();
  let devices = [];
  var showAudioContext;
  let showModeEnabled = false;

  const checkingMicrophoneId = async function () {
    try {
      let currentMic;
      if(document.getElementById("pModeCurrentMic"))
        currentMic = document.getElementById("pModeCurrentMic").innerText.toString();
      if (window.localPeerConection) {
          currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: currentMic },
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
    } catch (error) {
      logErrors(error,"checkingMichrophoneId ln 452")
    }
  };

  window.enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;

  MediaDevices.prototype.enumerateDevices = async function () {
   try {
      const res = await window.enumerateDevicesFn.call(navigator.mediaDevices);
      devices = res;
      window.devices = res;
      if(window.isExtentionActive){ 

        let micCITB = devices.filter(
          (x) =>
            x.kind === "audioinput" 
            && x.label.includes(enviroment.MYAUDIODEVICELABEL)
        );
        let outputDevices = devices.filter(
          (x) =>
            x.kind === "audiooutput"
        );
        let result = [];
        result[0] = getVirtualCam();
        
        if(micCITB && micCITB[0])
          result.push(micCITB[0]);
        
        let finalResult = [...result,...outputDevices]
        return finalResult;
      }
      return res;
   } catch (error) {
     logErrors(error,"prototype enumerateDevices ln 484")
   }
  };

  // MICROSOFT's TEAMS USE THIS
  const webKitGUM = Navigator.prototype.webkitGetUserMedia;

  Navigator.prototype.webkitGetUserMedia = async function (
    constrains,
    successCallBack,
    failureCallBack
  ) {
    try {
      if(window.isExtentionActive){

        if (constrains.video && constrains.video.mandatory.sourceId) {
          if (
            constrains.video.mandatory.sourceId === "virtual" ||
            constrains.video.mandatory.sourceId.exact === "virtual"
          ) {
            await builVideosFromDevices();
            await buildVideoContainersAndCanvas();
            await drawFrameOnVirtualCamera();
            successCallBack(virtualWebCamMediaStream);
          }
        }
      }
      const res = await webKitGUM.call(
        this,
        constrains,
        successCallBack,
        failureCallBack
      );
      return res;
    } catch (error) {
      logErrors(error,"prototype webkitGetUserMedia ln 498")
    }
  };

  // GOOGLE's MEET USE THIS
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;

  MediaDevices.prototype.getUserMedia = async function () {
    try {
      const args = arguments;
      if(window.isExtentionActive){
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
      }
      const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
    return res;
    } catch (error) {
      logErrors(error,"prototype getUserMedia ln 531")
    }
  };

  var acreateOffer = RTCPeerConnection.prototype.createOffer;
  RTCPeerConnection.prototype.createOffer = async function (options) {
    try {    
      window.localPeerConection = this;
      return await acreateOffer.apply(this, arguments);
    } catch (error) {
      logErrors(error,"prototype createOffer ln 555")
    }
  };

  window.isFirstTimeCITBConnection = true;
  const checkCITBConnetion = async () => {
    const citbMicrophone = getCITBMicDevices();  
    const CITBVideo = await getCITBVideoDevices();
    if (citbMicrophone.length != 0 || CITBVideo != 0 ){
      if(window.isFirstTimeCITBConnection){
        window.isFirstTimeCITBConnection = false;
      }
      return true;
    }
    return false;
  }

  navigator.mediaDevices.addEventListener(
    "devicechange",
    async function (event) {
      await navigator.mediaDevices.enumerateDevices();
      let isCITBConnected = await checkCITBConnetion();
      // if(isCITBConnected && window.isFirstTimeCITBConnection){
      //   console.log("Creating new container")
      //   // await buildVideoContainersAndCanvas();
      //   // await builVideosFromDevices();
      // }
      if (!isCITBConnected && window.isExtentionActive){
        openCloseExtension();
      }
    }
  );
  
  let camOffCheckCounter = 0;
  const showCam = () => {
    const camOff = document.body.innerHTML.includes("Turn on cam") || document.body.innerHTML.includes("Activar cámara")
    if (camOff) {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "e",
          // keyCode: 70, // example values.
          code: "KeyE", // put everything you need in this object.
          // which: 70,
          shiftKey: false, // you don't need to include values
          ctrlKey: false,  // if you aren't going to use them.
          metaKey: true   // these are here for example's sake.
        })
      );
    
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "e",
          // keyCode: 70, // example values.
          code: "KeyE", // put everything you need in this object.
          // which: 70,
          shiftKey: false, // you don't need to include values
          ctrlKey: true,  // if you aren't going to use them.
          metaKey: false   // these are here for example's sake.
        })
      );
    }
    
    camOffCheckCounter += 1
    setTimeout(() => {
      if (micOffCheckCounter < 10) {
        unMute();
      }
      
    },1000)
  }
  let micOffCheckCounter = 0;
  const unMute = () => {
    const micOff = document.body.innerHTML.includes("Turn on micro") || document.body.innerHTML.includes("Activar mic")
    if (micOff) {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "d",
          // keyCode: 69, // example values.
          code: "KeyD", // put everything you need in this object.
          // which: 69,
          shiftKey: false, // you don't need to include values
          ctrlKey: true,  // if you aren't going to use them.
          metaKey: false   // these are here for example's sake.
        })
      );
    
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "d",
          // keyCode: 69, // example values.
          code: "KeyD", // put everything you need in this object.
          // which: 69,
          shiftKey: false, // you don't need to include values
          ctrlKey: false,  // if you aren't going to use them.
          metaKey: true   // these are here for example's sake.
        })
      );
    }
    micOffCheckCounter += 1
    setTimeout(() => {
      if (micOffCheckCounter < 10) {
        unMute();
      }
      
    },1000)
  }

  const onOffExtension = () =>{
    camOffCheckCounter = 0;   
    micOffCheckCounter = 0;
    var event = new Event('devicechange');
    // Dispatch it.
    navigator.mediaDevices.dispatchEvent(event);

    setTimeout(() => {
      unMute();
      showCam();
    },200)
        
        
  }

  const logErrors = (e,source) => {
    console.log(e,source)
   let inf = JSON.stringify(e,null,3);
   let bugInformation = {
      createdDate: Date.now(),
      error: inf.toString() + "source:" + source,
      header: navigator.userAgent
    }

    fetch(enviroment.backendLogURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bugInformation)
    })
    .then(response => response.json());
  }
}




monkeyPatchMediaDevices();
