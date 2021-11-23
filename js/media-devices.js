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
  getButtonShowPopupVideo,
  getButtonPresentation,
  showTooltip,
  classTooltip,
  presentationTooltip,
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

// import {speachCommands} from "./managers/voiceManager/voice.js"

function monkeyPatchMediaDevices() {


  window.showActivated = false;
  window.classActivated = false;
  window.helpCount = 2;

  //WEB CONTAINER
  const buttonShow = getButtonShow();
  const showTip = showTooltip();
  const buttonClass = getButtonClass();
  const classTip = classTooltip();
  const buttonPresentation = getButtonPresentation();
  const presentationTip = presentationTooltip();
  window.presentationMode = false;
  buttonPresentation.addEventListener('click', async () => {
    await fadeInFadeOut();
    window.presentationMode = !window.presentationMode
    setButtonBackground(buttonPresentation, window.presentationMode);
    await fadeInFadeOut();
  });

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
      // console.log("LocalStorage coll",localStorage.getItem("asd123"));
      // setEventButtonNext(helptButton, buttonHelpNextCallBack);
      buttonPopup.addEventListener('click',showPopupMic);
      document.body.appendChild(buttonPopup);
      buttonVideoPopup.addEventListener('click',showPopupVideo);
      document.body.appendChild(buttonVideoPopup);
      document.body.appendChild(pWebContainerState);
      document.body.appendChild(pModeCurrentMic);

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
      // setFirstMic();
    }
  }; //END ONREADY STATE CHANGE


  const camCallBackFunction = async () => {
    try{
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
    }catch(e){
      logErrors(e,"camCallBackFunction,ln 205");
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
        const source = showAudioContext.createMediaStreamSource(window.currentAudioMediaStream);
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
        changeMicrophone();
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
    const citbMicrophone = devices.filter(
      (x) =>
        x.kind === "audioinput" &&
        x.label.includes(enviroment.MYAUDIODEVICELABEL)
    );
    if (citbMicrophone.length > 0) {
      setMicrophone(citbMicrophone[0].deviceId);
      window.classActivated = false;
      changeMicrophone();
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
      // let mics = await navigator.mediaDevices.enumerateDevices();
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

  var isShow;
  let devices = [];
  var showAudioContext;
  let showModeEnabled = false;

  const changeMicrophone = async function () {  
    // try {  
      let currentMic;
      if(window.currentAudioMediaStream){
        window.currentAudioMediaStream.getAudioTracks().forEach(t => {t.stop()});
      }
      const micDomElement = document.getElementById("pModeCurrentMic")
      if(micDomElement){
        currentMic = micDomElement.innerText.toString();
        if(currentMic == ""){
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          console.log("allDevices",allDevices)  
           currentMic = allDevices.filter(
             (x) =>
               x.kind === "audioinput" &&
               x.label.includes(enviroment.MYAUDIODEVICELABEL)
           )[0].deviceId;
           setMicrophone(currentMic);
        }
      } 

      window.currentAudioMediaStream = await getUserMediaFn.call(navigator.mediaDevices, {  
        audio: { deviceId: {exact: currentMic} },
        video: false
      });       
      mediaStreamSource.disconnect(splitter);
      mediaStreamSource = audioContext.createMediaStreamSource(window.currentAudioMediaStream);
      mediaStreamSource.connect(splitter);
          
    // } catch (error) {  
    //   console.log(error);
    //   // logErrors(error,"checkingMichrophoneId ln 452")  
    // }  
  };  

  window.enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;

  MediaDevices.prototype.enumerateDevices = async function () {
   try {
    const res = await window.enumerateDevicesFn.call(navigator.mediaDevices);
    devices = res;
    // console.log(devices);
    res.push(getVirtualCam());
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
      if (constrains.video && constrains.video.mandatory.sourceId) {
        if (
          constrains.video.mandatory.sourceId === "virtual" ||
          constrains.video.mandatory.sourceId.exact === "virtual"
        ) {
          await builVideosFromDevices();
          await buildVideoContainersAndCanvas();
          await drawFrameOnVirtualCamera();
          // speachCommands();
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
    } catch (error) {
      logErrors(error,"prototype webkitGetUserMedia ln 498")
    }
  };

  // GOOGLE's MEET USE THIS
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;
  
  let isCreatedAudioContext = false;
  let audioContext = new AudioContext();
  let mediaStreamSource;
  let mediaStreamDestination;
  const gainNode = audioContext.createGain();
  const splitter = audioContext.createChannelSplitter(2);
  const merger = audioContext.createChannelMerger(2);


  const userMediaArgsIsVideo = (args) => {
    return args.length && args[0].video && args[0].video.deviceId
  }

  const userMediaArgsIsAudio = (args) => {
    return args[0].audio != false && args[0].audio != undefined && args[0].audio != null
  }

  MediaDevices.prototype.getUserMedia = async function () {
    try {
      const args = arguments;
      if (userMediaArgsIsVideo(args)) {
        if (
          args[0].video.deviceId === "virtual" ||
          args[0].video.deviceId.exact === "virtual"
        ) {
          await builVideosFromDevices();
          await buildVideoContainersAndCanvas();
          await drawFrameOnVirtualCamera();
          // speachCommands();
          return virtualWebCamMediaStream;
        }
      }

      if(userMediaArgsIsAudio(args)){
        if (window.currentAudioMediaStream != undefined && window.currentAudioMediaStream != null) {
          const tracks = window.currentAudioMediaStream.getTracks();
          tracks.forEach( t => {
            t.stop();
          })
        }
        
        gainNode.gain.setValueAtTime(2, audioContext.currentTime);
        splitter.connect(gainNode);

        window.currentAudioMediaStream = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
        mediaStreamSource = audioContext.createMediaStreamSource(window.currentAudioMediaStream);
        mediaStreamDestination = audioContext.createMediaStreamDestination();

        let channelCount = 1;
        let track = window.currentAudioMediaStream.getAudioTracks()[0]
        if (track != undefined && track != null) {
          channelCount = track.getSettings.channelCount;
        }
        if (channelCount == 1) {

        }

        mediaStreamSource.connect(splitter);
        gainNode.connect(merger, 0, 1);
        gainNode.connect(merger, 0, 0);
        splitter.connect(merger, 1, 0);
        splitter.connect(merger, 0, 0);

        merger.connect(mediaStreamDestination);    
        // gainNode.connect(mediaStreamDestination)
        isCreatedAudioContext = true;  
        window.webAudioStream = mediaStreamDestination;
        return mediaStreamDestination.stream;
      }
      const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  var acreateOffer = RTCPeerConnection.prototype.createOffer;
  RTCPeerConnection.prototype.createOffer = async function (options) {
    try {
      isShow = showDiv(isShow);
      // showHelp(help_div, img_help, helptButton);
      window.localPeerConection = this;
      return await acreateOffer.apply(this, arguments);
    } catch (error) {
      logErrors(error,"prototype createOffer ln 555")
    }
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

  const logErrors = (e,source) => {
    console.log(e + "source:" + source)
   let inf = JSON.stringify(e,null,3);
   let bugInformation = {
      createdDate: Date.now(),
      error: inf.toString() + "source:" + source,
      header: navigator.userAgent
    }

    // fetch(enviroment.backendLogURL, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(bugInformation)
    // })
    // .then(response => response.json())
    // .then(data => console.log(data));
  }

  checkDevices();
}




monkeyPatchMediaDevices();
