import { setEvents } from "./eventos.js"; 
import { enviroment } from "./enviroment.js"; 
import { audioTimerLoop } from "./managers/videoManager/webcam.js"; 
import { 
  getButtonCam, 
  setButtonBackground, 
  getVirtualCam, 
  setMicrophone, 
  showDiv, 
  createWebContainerState, 
  createModeCurrentMic, 
  getButtonShowPopupMicClassMode, 
  getButtonShowPopupVideo, 
  getButtonOnOffExtension, 
  closeButtonContainer, 
} from "./domUtils.js"; 
 
import { 
  builVideosFromDevices, 
  buildVideoContainersAndCanvas, 
  drawFrameOnVirtualCamera, 
  virtualWebCamMediaStream, 
  videoCITB, 
  videoOther, 
  canChangeCameras, 
  fadeInFadeOut, 
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
  setButtonCallBack, 
} from "./managers/popupClassMode/popupClassMode.js"; 
 
import { 
  divOverlayVideo, 
  divFabVideo, 
  formWrapperVideo, 
  divHeaderVideo, 
  headerCloseVideo, 
  hHeaderVideo, 
  divContentVideo, 
  classIconVideo, 
  divTextFieldsVideo, 
  selectMicVideo, 
  labelTextVideo, 
  divButtonVideo, 
  buttonSelectVideo, 
  createPopupVideo, 
  setButtonCallBackVideo, 
} from "./managers/popupVideoMode/popupVideoMode.js"; 

function monkeyPatchMediaDevices() { 
  console.log("INYECTADO MONKEY PATCH MEDIA COLLADO"); 
 
  const isCITBCamera = (label) => { 
    const cameraArray = enviroment.MYVIDEODDEVICELABEL.split(","); 
    let returnValue = false; 
    cameraArray.forEach((camera) => { 
      if (label.includes(camera)) { 
        returnValue = true; 
      } 
    }); 
    return returnValue; 
  }; 
 
  const duplo2FirstTimeFromDuplo = (duplo) => { 
    return window.presentationMode && duplo && !window.duplo2; 
  }; 
 
  const duplo2SecondTime = (duplo) => { 
    return window.presentationMode && duplo && window.duplo2; 
  }; 
 
  const duploFirstTimeFromDuplo2 = (duplo) => { 
    return window.presentationMode && !duplo && window.duplo2; 
  }; 
 
  const duploSecondTimeFromDuplo2 = (duplo) => { 
    return window.presentationMode && !duplo && !window.duplo2; 
  }; 
 
  let betweenTransition = false; 
 
  const runInsideTransition = async (callBackFunction) => { 
    betweenTransition = true; 
    await fadeInFadeOut(); 
    callBackFunction(); 
    await fadeInFadeOut(); 
    betweenTransition = false; 
    return; 
  }; 
 
  const duploMode = async (duplo) => { 
    if (betweenTransition) { 
      return; 
    } 
    if (!canChangeCameras) { 
      betweenTransition = false; 
      alert(enviroment.messageCITBCamOffline); 
      return; 
    } 
    runInsideTransition(() => { 
      if (!window.presentationMode) { 
        window.presentationMode = true; 
      } else if (duplo2FirstTimeFromDuplo(duplo)) { 
        window.presentationMode = true; 
      } else if (duplo2SecondTime(duplo)) { 
        window.presentationMode = false; 
        window.duplo2 = false; 
      } else if (duploFirstTimeFromDuplo2(duplo)) { 
        window.presentationMode = true; 
      } else if (duploSecondTimeFromDuplo2(duplo)) { 
        window.presentationMode = false; 
      } 
      window.duplo2 = duplo; 
      setButtonBackground("citbDuploActive", window.presentationMode && !duplo); 
      setButtonBackground( 
        "citbDuploMiniActive", 
        duplo && window.presentationMode 
      ); 
      setButtonBackground("citbDuploContainerActive", window.presentationMode); 
    }); 
  }; 
 
  const presentacionCallBackFunction = async () => { 
    duploMode(false); 
  }; 
  window.presentacionCallBackFunction = presentacionCallBackFunction; 

  const presentacion2CallBackFunction = async () => { 
    duploMode(true); 
  }; 
  window.presentacion2CallBackFunction = presentacion2CallBackFunction; 
 
  const camCallBackFunction = async () => { 
    if (betweenTransition) { 
      return; 
    } 
    try { 
      if (!canChangeCameras) { 
        betweenTransition = false; 
        alert(enviroment.messageCITBCamOffline); 
        return; 
      } 
      if (window.presentationMode) { 
        await runInsideTransition(() => { 
          window.presentationMode = !window.presentationMode; 
          const duploContainerButton = 
            document.getElementById("buttonPresentation"); 
          const duplo2Button = document.getElementById("duplo2"); 
          setButtonBackground("citbDuploActive", false); 
          setButtonBackground("citbDuploContainerActive", false); 
          setButtonBackground("citbDuploMiniActive", false); 
        }); 
        return; 
      } 
      if (window.actualVideoTag.id == "OTHERVideo") { 
        await runInsideTransition(() => { 
          window.actualVideoTag = videoCITB; 
          window.citbActivated = true; 
        }); 
      } else { 
        await runInsideTransition(() => { 
          window.actualVideoTag = videoOther; 
          window.citbActivated = false; 
        }); 
      } 
      setButtonBackground("citbCamActive", window.citbActivated);  
    } catch (e) { 
      betweenTransition = false; 
      logErrors(e, "camCallBackFunction,ln 205"); 
    } 
  }; 
  window.camCallBackFunction = camCallBackFunction; 
 
  const showCallBackFunction = async () => { 
    try { 
      if (window.classActivated) { 
        await deactivateClassMode(); 
      } 
      if (showModeEnabled) { 
        if (showAudioContext != null) { 
          showAudioContext.close(); 
          showAudioContext = null; 
          showModeEnabled = false; 
          setButtonBackground("citbShowActive", showModeEnabled); 
          setTimeout(() => { 
            return; 
          }, 1000); 
        } 
      } else { 
        showAudioContext = new AudioContext(); 
        // showAudioContext = new AudioContext({ sampleRate: 48000 }); 
        const source = showAudioContext.createMediaStreamSource( 
          window.currentAudioMediaStream 
        ); 
        source.connect(showAudioContext.destination); 
        showModeEnabled = true; 
        setButtonBackground("citbShowActive", showModeEnabled); 
      } 
      return; 
    } catch (error) { 
      logErrors(error, "await showCallBackFunction ln. 251"); 
    } 
  }; 
  window.showCallBackFunction = showCallBackFunction; 
 
  const classCallBackFunction = async (isFromPopup) => { 
    try { 
      if (!checkbox_class.checked && !window.classActivated) { 
        showPopupMic(); 
      } else { 
        await changeToClassMode(); 
      } 
    } catch (error) { 
      logErrors(error, "classCallBackFunction ln 352"); 
    } 
  }; 
  window.classCallBackFunction = classCallBackFunction; 
 
  const setCITBButtonsAndListeners = () => { 
    console.log("CITBBUTTONS AND LISTENERS", citbFloatingButtons); 
 
    window.buttonCam = getButtonCam(); 
    buttonsContainerDiv = citbFloatingButtons; 
 
    citbFloatingButtons.addEventListener( 
      "citbDuploClickedEvent", 
      presentacionCallBackFunction 
    ); 
    citbFloatingButtons.addEventListener( 
      "citbDuploMiniClickedEvent", 
      presentacion2CallBackFunction 
    ); 
 
    console.log("BEFORE SET EVENTS"); 
    try { 
      setEvents( 
        buttonsContainerDiv, 
        camCallBackFunction, 
        showCallBackFunction, 
        classCallBackFunction 
      ); 
    } catch (error) { 
      console.log(error); 
    } 
 
    console.log("AFTER SET EVENTS"); 
  }; 
  const buttonOnOffExtension = getButtonOnOffExtension(); 
  const citbFloatingButtons = document.createElement("citb-floating-buttons"); 
  citbFloatingButtons.style.position = "absolute"; 
  citbFloatingButtons.style.top = "75px"; 
  citbFloatingButtons.style.right = "16px"; 
  citbFloatingButtons.style.visibility = "hidden"; 

  const setCITBPresets = () => { 
    window.presentationMode = false; 
    window.classActivated = false; 
  }; 
  setCITBPresets(); 
 
  //Activate Extension 
  window.isExtentionActive = false; 
  const executeOpenClose = () => { 
    window.isExtentionActive = !window.isExtentionActive; 
    buttonOnOffExtension.innerText = window.isExtentionActive; 
    onOffExtension(); 
  }; 
 
  const closeExtension = async () => { 
    closeButtonContainer(); 
    if (window.cameraAudioLoop != undefined) { 
      window.cameraAudioLoop(); 
      window.cameraAudioLoop = undefined; 
    } 
    if (window.classActivated) { 
      await deactivateClassMode(); 
    } 
    if (showModeEnabled) { 
      await showCallBackFunction(); 
    } 
 
    if (window.presentationMode && window.duplo2) { 
      presentacion2CallBackFunction(); 
    } 
    if (window.presentationMode && !window.duplo2) { 
      presentacionCallBackFunction(); 
    } 
    if (document.URL.includes("zoom.us")) { 
      alert( 
        "To continue on the meeting without CITB we need to reload the page" 
      ) 
        ? "" 
        : location.reload(); 
    } 
    executeOpenClose(); 
  }; 
 
  //WEB CONTAINER 
 
  var buttonsContainerDiv; 
  const buttonPopup = getButtonShowPopupMicClassMode(); 
  const buttonVideoPopup = getButtonShowPopupVideo(); 
  const pWebContainerState = createWebContainerState(); 
  const pModeCurrentMic = createModeCurrentMic(); 
 
  const div_OverlayVideo = divOverlayVideo(); 
  const div_FabVideo = divFabVideo(); 
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
      console.log("DOCUMENT COMPLETE COLLADO");
      document.body.appendChild(citbFloatingButtons); 
      setCITBButtonsAndListeners();  
      document.body.appendChild(buttonOnOffExtension); 
 
      buttonPopup.addEventListener("click", showPopupMic); 
      buttonVideoPopup.addEventListener("click", showPopupVideo); 
 
      document.body.appendChild(buttonPopup); 
      document.body.appendChild(buttonVideoPopup); 
      document.body.appendChild(pWebContainerState); 
      document.body.appendChild(pModeCurrentMic); 
      setMicrophone(enviroment.MYAUDIODEVICELABEL); 
 
      //WEB CONTAINER 
 
      setTimeout(() => { 
        setButtonBackground("citbCamActive", window.citbActivated); 
        setButtonBackground("citbShowActive", showModeEnabled); 
        setButtonBackground("citbClassActive", window.classActivated); 
        if (window.actualVideoTag == videoCITB) { 
          window.citbActivated = true; 
          setButtonBackground("citbCamActive", window.citbActivated); 
        } 
      }, 5000); 
    } 
  }; //END ONREADY STATE CHANGE 
 
  const getCITBVideoDevices = async () => { 
    const allDevices = await window.enumerateDevicesFn.call( 
      navigator.mediaDevices 
    ); 
 
    try { 
      const citbVideo = allDevices.filter((s) => isCITBCamera(s.label)); 
      return citbVideo.length > 0 ? citbVideo : []; 
    } catch (error) { 
      logErrors(error, "getCITBVideoDevices ln. 266"); 
    } 
  }; 
 
  const getCITBMicDevices = async () => { 
    const allDevices = await window.enumerateDevicesFn.call( 
      navigator.mediaDevices 
    ); 
 
    try { 
      const citbMicrophone = allDevices.filter( 
        (x) => 
          x.kind === "audioinput" && 
          x.label.includes(enviroment.MYAUDIODEVICELABEL) 
      ); 
      return citbMicrophone.length > 0 ? citbMicrophone : []; 
    } catch (error) { 
      logErrors(error, "getCITBMicDevices ln. 266"); 
    } 
  }; 
 
  let audioContext = new AudioContext(); 
  let mediaStreamSource; 
  let mediaStreamDestination; 
 
  const changeMicrophone = async function () { 
    // try { 
    let currentMic; 
    if (window.currentAudioMediaStream) { 
      window.currentAudioMediaStream.getAudioTracks().forEach((t) => { 
        t.stop(); 
      }); 
    } 
    const micDomElement = document.getElementById("pModeCurrentMic"); 
    if (micDomElement) { 
      currentMic = micDomElement.innerText.toString(); 
      if (currentMic == "") { 
        const allDevices = await navigator.mediaDevices.enumerateDevices(); 
        console.log("allDevices", allDevices); 
        currentMic = allDevices.filter( 
          (x) => 
            x.kind === "audioinput" && 
            x.label.includes(enviroment.MYAUDIODEVICELABEL) 
        )[0].deviceId; 
        setMicrophone(currentMic); 
      } 
    } 
 
    window.currentAudioMediaStream = await getUserMediaFn.call( 
      navigator.mediaDevices, 
      { 
        audio: { deviceId: { exact: currentMic } }, 
        video: false, 
      } 
    ); 
    try { 
      mediaStreamSource.disconnect(mediaStreamDestination); 
    } catch (error) { 
      console.log("error", error, "not connected to node"); 
    } 
    mediaStreamSource = audioContext.createMediaStreamSource( 
      window.currentAudioMediaStream 
    ); 
    mediaStreamSource.connect(mediaStreamDestination); 
  }; 
 
  const activateClassMode = () => { 
    try { 
      if (showModeEnabled) { 
        showCallBackFunction(); 
      } 
      const otherMicrophones = document 
        .getElementById("pModeCurrentMic") 
        .innerText.toString(); 
      if (otherMicrophones) { 
        window.classActivated = true; 
        changeMicrophone(); 
        setButtonBackground("citbClassActive", window.classActivated); 
        return true; 
      } 
      return false; 
    } catch (error) { 
      logErrors(error, "activateClassMode ln 280"); 
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
        setButtonBackground("citbClassActive", window.classActivated); 
        return true; 
      } 
      return false; 
    } catch (error) { 
      logErrors(error, "deactivateClassMode ln 298"); 
    } 
  }; 
 
  const changeToClassMode = async () => { 
    try { 
      if (window.classActivated) { 
        const classModeDeactivated = await deactivateClassMode(); 
        if (classModeDeactivated) { 
        } else { 
          alert("There is no CITB microphone"); 
        } 
      } else { 
        //activate class mode 
        if ( 
          !checkbox_class.checked || 
          selec_Mic.value != window.otherMicSelection 
        ) { 
          setMicrophone(selec_Mic.value); 
          window.otherMicSelection = selec_Mic.value; 
        } else { 
          setMicrophone(window.otherMicSelection); 
        } 
        const classModeActivated = await activateClassMode(); 
        if (classModeActivated) { 
        } else { 
          alert("There is not another microphone"); 
        } 
      } 
    } catch (error) { 
      logErrors(error, "changeToClassMode ln 318"); 
    } 
  }; 
 
  const chooseMicClassMode = async (e) => { 
    e.preventDefault(); 
    div_Fab.setAttribute("class", "fab"); 
    div_Overlay.removeAttribute("class"); 
    await changeToClassMode(); 
  }; 
 
  const closeModalClassMode = (e) => { 
    e.preventDefault(); 
    div_Fab.setAttribute("class", "fab"); 
    div_Overlay.removeAttribute("class"); 
  }; 
 
  const showPopupMic = async () => { 
    try { 
      if (!window.isExtentionActive) { 
        betweenTransition = false; 
        alert(enviroment.messageCITBExtentionOff); 
        return; 
      } 
      let usableMics = devices.filter( 
        (x) => x.kind === "audioinput" && !x.label.includes("Mezcla") 
      ); 
      usableMics = usableMics.filter((x) => !x.label.includes("Mix")); 
      usableMics = usableMics.filter( 
        (x) => !x.label.includes(enviroment.MYAUDIODEVICELABEL) 
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
      setButtonCallBack(button_Select, chooseMicClassMode); 
      setButtonCallBack(header_close, closeModalClassMode); 
    } catch (error) { 
      logErrors(error, "showPopupMic ln 364"); 
    } 
  }; 
  const chooseVideo = async (e) => { 
    e.preventDefault(); 
    window.otherMicSelected = selec_MicVideo.value; 
    await builVideosFromDevices(selec_MicVideo.value); 
    await buildVideoContainersAndCanvas(); 
    await drawFrameOnVirtualCamera(); 
    div_FabVideo.setAttribute("class", "fab"); 
    div_OverlayVideo.removeAttribute("class"); 
  }; 
 
  const closeVideo = (e) => { 
    e.preventDefault(); 
    div_FabVideo.setAttribute("class", "fab"); 
    div_OverlayVideo.removeAttribute("class"); 
  }; 
  const showPopupVideo = async () => { 
    try { 
      if (!window.isExtentionActive) { 
        betweenTransition = false; 
        alert(enviroment.messageCITBExtentionOff); 
        return; 
      } 
      let usableVideo = devices.filter( 
        (x) => 
          x.kind === "videoinput" && 
          !x.label.includes("Virtual Class In The Box") && 
          x.deviceId != window.citbVideo 
      ); 
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
      setButtonCallBackVideo(button_SelectVideo, chooseVideo); 
      setButtonCallBackVideo(close_headerVideo, closeVideo); 
    } catch (error) { 
      logErrors(error, "showPopupVideo ln 412"); 
    } 
  }; 
 
  let devices = []; 
  var showAudioContext; 
  let showModeEnabled = false; 
 
  const userMediaArgsIsVideo = (args) => { 
    return args.length && args[0].video && args[0].video.deviceId; 
  }; 
 
  const userMediaArgsIsAudio = (args) => { 
    const hasAudioAtribute = 
      args.length && 
      args[0].audio != false && 
      args[0].audio != undefined && 
      args[0].audio != null; 
 
    const hasVideoAttributes = 
      args.length && 
      args[0].video != false && 
      args[0].video != undefined && 
      args[0].video != null; 
 
    const hasAudioMandatoryFields = 
      args[0].audio.mandatory != undefined && 
      args[0].audio.mandatory != null && 
      args[0].audio.mandatory != "" && 
      args[0].audio.mandatory.sourceId != undefined && 
      args[0].audio.mandatory.sourceId != null && 
      args[0].audio.mandatory.sourceId != ""; 
 
    const hasAudioDeviceIdField = 
      args[0].audio.deviceId != undefined && 
      args[0].audio.deviceId != null && 
      args[0].audio.deviceId != ""; 
 
    console.log( 
      "userMediaArgsIsAudio", 
      hasAudioAtribute && !hasVideoAttributes 
    ); 
    return hasAudioAtribute && !hasVideoAttributes; 
    //return args[0].audio != false && args[0].audio != undefined && args[0].audio != null && args[0].audio.mandatory.sourceId != undefined && args[0].audio.mandatory.sourceId != null && args[0].audio.mandatory.sourceId != '' 
  };  
 
  window.enumerateDevicesFn = MediaDevices.prototype.enumerateDevices; 
 
  MediaDevices.prototype.enumerateDevices = async function () { 
    try { 
      const res = await window.enumerateDevicesFn.call(navigator.mediaDevices); 
      devices = res; 
      window.devices = res; 
      if (window.isExtentionActive) { 
        let micCITB = devices.filter( 
          (x) => 
            x.kind === "audioinput" && 
            x.label.includes(enviroment.MYAUDIODEVICELABEL) 
        ); 
        let outputDevices = devices.filter((x) => x.kind === "audiooutput"); 
        let result = []; 
        result[0] = getVirtualCam(); 
 
        if (micCITB && micCITB[0]) result.push(micCITB[0]); 
 
        let finalResult = [...result, ...outputDevices]; 
        return finalResult; 
      } else { 
        return res.filter((x) => { 
          if ( 
            x.kind === "audioinput" && 
            x.label.includes(enviroment.MYAUDIODEVICELABEL) 
          ) { 
            return false; 
          } 
          if (x.kind === "videoinput" && isCITBCamera(x.label)) { 
            return false; 
          } 
          return true; 
        }); 
      } 
    } catch (error) { 
      logErrors(error, "prototype enumerateDevices ln 484"); 
    } 
  }; 
 
  const setUPVideo = async () => { 
    await builVideosFromDevices(); 
    await buildVideoContainersAndCanvas(); 
    await drawFrameOnVirtualCamera(); 
    return virtualWebCamMediaStream; 
  }; 
 
  // MICROSOFT's TEAMS USE THIS 
  const webKitGUM = Navigator.prototype.webkitGetUserMedia; 
 
  Navigator.prototype.webkitGetUserMedia = async function ( 
    constrains, 
    successCallBack, 
    failureCallBack 
  ) { 
    console.log("GET USER MEDIA WEBKIT"); 
 
    try { 
      if (window.isExtentionActive) { 
        if (constrains.video && constrains.video.mandatory.sourceId) { 
          if ( 
            constrains.video.mandatory.sourceId === "virtual" || 
            constrains.video.mandatory.sourceId.exact === "virtual" 
          ) { 
            let mediaStreamResult = setUPVideo(); 
            successCallBack(mediaStreamResult); 
          } 
        } else if (constrains.audio && constrains.audio.mandatory.sourceId) { 
          const baseAudioMediaStream = await getUserMediaFn.call( 
            navigator.mediaDevices, 
            ...constrains 
          ); 
          return baseAudioMediaStream; 
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
      logErrors(error, "prototype webkitGetUserMedia ln 498"); 
    } 
  }; 
 
  // GOOGLE's MEET USE THIS 
  const getUserMediaFn = MediaDevices.prototype.getUserMedia; 
  var _controller; 
  var _audioController; 
 
  const audioTrackProcessor = (frame) => { 
    if (!_audioController) { 
      frame.close(); 
      return; 
    } 
    try { 
      _audioController.enqueue(frame); 
    } catch (error) { 
      console.log("ERROR ERROR", error); 
    } 
    //frame.close(); 
  }; 
 
  MediaDevices.prototype.getUserMedia = async function () { 
    try { 
      console.log( 
        "GET USER MEDIA PROTOTYPE", 
        window.isExtentionActive, 
        arguments 
      ); 
      const args = arguments; 
      if (window.isExtentionActive) { 
        if (userMediaArgsIsVideo(args)) { 
          if ( 
            args[0].video.deviceId === "virtual" || 
            args[0].video.deviceId.exact === "virtual" 
          ) { 
            return setUPVideo(); 
          } else { 
            return await getUserMediaFn.call( 
              navigator.mediaDevices, 
              ...arguments 
            ); 
          } 
        } else if (userMediaArgsIsAudio(args)) { 
          console.log("IS AUDIO"); 
          if ( 
            window.currentAudioMediaStream != undefined && 
            window.currentAudioMediaStream != null 
          ) { 
            const tracks = window.currentAudioMediaStream.getTracks(); 
            tracks.forEach((t) => { 
              t.stop(); 
            }); 
          } 
          var gainNode = audioContext.createGain(); 
          const splitter = audioContext.createChannelSplitter(2); 
          const merger = audioContext.createChannelMerger(2); 
 
          gainNode.gain.setValueAtTime(1, audioContext.currentTime); 
          splitter.connect(gainNode, 0); 
 
          window.currentAudioMediaStream = await getUserMediaFn.call( 
            navigator.mediaDevices, 
            ...arguments 
          ); 
          mediaStreamSource = audioContext.createMediaStreamSource( 
            window.currentAudioMediaStream 
          ); 
          mediaStreamDestination = audioContext.createMediaStreamDestination(); 
          mediaStreamSource.connect(splitter); 
          gainNode.connect(merger, 0, 1); 
          splitter.connect(merger, 1, 0); 
          merger.connect(mediaStreamDestination); 
          // gainNode.connect(mediaStreamDestination) 
          // isCreatedAudioContext = true; 
          window.webAudioStream = mediaStreamDestination; 
          console.log( 
            "mediaStreamDestination.stream", 
            mediaStreamDestination.stream 
          ); 
          return mediaStreamDestination.stream; 
        } 
      } 
      console.log("INSIDE ELSE", ...args); 
      const res = await getUserMediaFn.call(navigator.mediaDevices, ...args); 
      console.log( 
        "ANTES DE RETORNOAR CON LA EXTENSION INACTIVA", 
        res, 
        arguments, 
        args 
      ); 
      return res; 
    } catch (error) { 
      console.log(error); 
      logErrors(error, "prototype getUserMedia ln 531"); 
    } 
  }; 
  var citbConnectionCount = 0; 
  const checkCITBConnetion = async () => { 
    const citbMicrophone = await getCITBMicDevices(); 
    const CITBVideo = await getCITBVideoDevices(); 
    if (CITBVideo.length == 0) { 
      if (window.presentationMode && window.duplo2) { 
        presentacion2CallBackFunction(); 
      } 
      if (window.presentationMode && !window.duplo2) { 
        presentacionCallBackFunction(); 
      } 
    } 
    if (citbConnectionCount < 3) { 
      setTimeout(async () => { 
        await checkCITBConnetion(); 
      }, 1000); 
      citbConnectionCount += 1; 
    } else { 
      citbConnectionCount = 0; 
    } 
    if (citbMicrophone.length != 0 || CITBVideo != 0) { 
      return true; 
    } 
    return false; 
  }; 
 
  const activateCITBZoomMic = () => { 
    console.log("INSIDE SET TIMEOUT ACTIVATE MIC"); 
    const micElement = document.getElementsByClassName( 
      "audio-option-menu__pop-menu" 
    )[0]; 
    const citbMic = micElement.childNodes[1].children[0]; 
    const citbMicIsPresent = 
      citbMic.attributes["aria-label"].textContent.includes("CITB"); 
    if (citbMicIsPresent) { 
      console.log("CITB PRESENT"); 
      citbMic.click(); 
    } else { 
      setTimeout(activateCITBZoomMic, 2000); 
    } 
    console.log(citbMic); 
  }; 

  const openCloseExtension = async () => { 
    var chromeOS = /(CrOS)/.test(navigator.userAgent); 
    if (chromeOS && document.URL.includes("zoom.us")) { 
      return; 
    } 
    let isCITBConnected = await checkCITBConnetion(); 
    if (!isCITBConnected && !window.isExtentionActive) { 
      alert(enviroment.messageCITBDisconnected); 
      return; 
    } 
    if (window.isExtentionActive) { 
      await closeExtension(); 
    } else if (isCITBConnected) { 
      if (!window.isExtentionActive) { 
        window.cameraAudioLoop = audioTimerLoop( 
          drawFrameOnVirtualCamera, 
          1000 / 30 
        ); 
        showDiv(); 
        setButtonBackground("citbCamActive", 'active');
      } 
      if (document.URL.includes("zoom.us")) { 
        try { 
          const audioButton = document.getElementsByClassName( 
            "join-audio-container__btn" 
          )[0]; 
          const audioButtonMutted = 
            audioButton.attributes.arialabel.textContent.includes("unmute"); 
          if (audioButtonMutted) { 
            audioButton.click(); 
          } 
        } catch (error) { 
          console.log(error); 
        } 
        setTimeout(function () { 
          try { 
            document 
              .getElementsByClassName("join-audio-by-voip__join-btn")[0] 
              .click(); 
          } catch (error) { 
            console.log(error); 
            //do nothing, not needed 
          } 
          setTimeout(function () { 
            activateCITBZoomMic(); 
            setTimeout(() => { 
              setTimeout(() => { 
                const cameraElement = document.getElementsByClassName( 
                  "video-option-menu__pop-menu" 
                )[0]; 
                cameraElement.childNodes[1].children[0].click(); 
              }, 300); 
              executeOpenClose(); 
            }, 2000); 
          }, 500); 
        }, 1000); 
      } else { 
        executeOpenClose(); 
      } 
    } 
  }; 
 
  buttonOnOffExtension.addEventListener("click", openCloseExtension); 
  // navigator.mediaDevices.getUserMedia({ audio: true, video: true }); 
  setTimeout(() => { 
    navigator.mediaDevices.addEventListener( 
      "devicechange", 
      async function (event) { 
        console.log("DEVICE CHANGE"); 
        await navigator.mediaDevices.enumerateDevices(); 
        let isCITBConnected = await checkCITBConnetion(); 
 
        if (isCITBConnected) { 
          window.otherMicSelected != undefined 
            ? await builVideosFromDevices(window.otherMicSelected) 
            : await builVideosFromDevices(); 
          await buildVideoContainersAndCanvas(); 
          await builVideosFromDevices(); 
        } 
        if (!isCITBConnected && window.isExtentionActive) { 
          console.log("DEVICE CHANGE AFTER IF"); 
          await closeExtension(); 
        } 
      } 
    ); 
  }, 2000); 
 
  let camOffCheckCounter = 0; 
  const showCam = () => { 
    const camOff = 
      document.body.innerHTML.includes("Turn on cam") || 
      document.body.innerHTML.includes("Activar cámara"); 
    if (camOff) { 
      document.dispatchEvent( 
        new KeyboardEvent("keydown", { 
          key: "e", 
          // keyCode: 70, // example values. 
          code: "KeyE", // put everything you need in this object. 
          // which: 70, 
          shiftKey: false, // you don't need to include values 
          ctrlKey: false, // if you aren't going to use them. 
          metaKey: true, // these are here for example's sake. 
        }) 
      ); 
 
      document.dispatchEvent( 
        new KeyboardEvent("keydown", { 
          key: "e", 
          // keyCode: 70, // example values. 
          code: "KeyE", // put everything you need in this object. 
          // which: 70, 
          shiftKey: false, // you don't need to include values 
          ctrlKey: true, // if you aren't going to use them. 
          metaKey: false, // these are here for example's sake. 
        }) 
      ); 
    } 
 
    camOffCheckCounter += 1; 
    setTimeout(() => { 
      if (micOffCheckCounter < 10) { 
        unMute(); 
      } 
    }, 1000); 
  }; 
  let micOffCheckCounter = 0; 
  const unMute = () => { 
    const micOff = 
      document.body.innerHTML.includes("Turn on micro") || 
      document.body.innerHTML.includes("Activar mic"); 
    if (micOff) { 
      document.dispatchEvent( 
        new KeyboardEvent("keydown", { 
          key: "d", 
          // keyCode: 69, // example values. 
          code: "KeyD", // put everything you need in this object. 
          // which: 69, 
          shiftKey: false, // you don't need to include values 
          ctrlKey: true, // if you aren't going to use them. 
          metaKey: false, // these are here for example's sake. 
        }) 
      ); 
 
      document.dispatchEvent( 
        new KeyboardEvent("keydown", { 
          key: "d", 
          // keyCode: 69, // example values. 
          code: "KeyD", // put everything you need in this object. 
          // which: 69, 
          shiftKey: false, // you don't need to include values 
          ctrlKey: false, // if you aren't going to use them. 
          metaKey: true, // these are here for example's sake. 
        }) 
      ); 
    } 
    micOffCheckCounter += 1; 
    setTimeout(() => { 
      if (micOffCheckCounter < 10) { 
        unMute(); 
      } 
    }, 1000); 
  }; 
 
  const onOffExtension = () => { 
    camOffCheckCounter = 0; 
    micOffCheckCounter = 0; 
    var event = new Event("devicechange"); 
    // Dispatch it. 
    navigator.mediaDevices.dispatchEvent(event); 
    if (document.URL.includes("meet.google.com")) { 
      setTimeout(() => { 
        unMute(); 
        showCam(); 
        navigator.mediaDevices.dispatchEvent(event); 
      }, 500); 
    } 
  }; 
 
  const logErrors = (e, source) => { 
    console.log(e, source); 
    let inf = JSON.stringify(e, null, 3); 
    let bugInformation = { 
      createdDate: Date.now(), 
      error: inf.toString() + "source:" + source, 
      header: navigator.userAgent, 
    }; 
 
    fetch(enviroment.backendLogURL, { 
      method: "POST", 
      headers: { 
        Accept: "application/json", 
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify(bugInformation), 
    }).then((response) => response.json()); 
  }; 
} 
 
monkeyPatchMediaDevices(); 
