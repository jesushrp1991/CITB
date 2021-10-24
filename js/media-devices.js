import { setEvents } from './eventos.js';
import {enviroment } from './enviroment.js';
import { setVideoT, setModeT,setCITBCam } from './functions.js';

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
  setMicrophone
} from './domUtils.js';

import {
  builVideosFromDevices
  , buildVideoContainersAndCanvas
  , drawFrameOnVirtualCamera
  , virtualWebCamMediaStream
  , videoCITB
  , videoOther
  , canChangeCameras
} from './managers/videoManager/webcam.js'


function monkeyPatchMediaDevices() {
    window.showActivated = false;
    window.classActivated = false;

    //WEB CONTAINER
    const buttonShow = getButtonShow();        
    const buttonClass = getButtonClass();
    window.buttonCam = getButtonCam();
    const buttonClose= getButtonClose();
    const buttonDrag= getButtonDrag();  

    document.onreadystatechange = (event) => {
      if (document.readyState == 'complete'){ 


        //HTML TAGS TO SYNC WHIT POPUP
        document.body.appendChild(pVideoState);
        document.body.appendChild(pModeState);
        document.body.appendChild(pWebContainerState);
        document.body.appendChild(pModeExistsCam);
        document.body.appendChild(pModeCurrentMic);
        setMicrophone(enviroment.MYAUDIODEVICELABEL);


        //WEB CONTAINER
        const buttonsContainerDiv = getContainerButton();
        const br = document.createElement('br');
        const br0 = document.createElement('br');
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        addElementsToDiv(buttonsContainerDiv,buttonClose,br0, window.buttonCam, br, buttonShow, br1, buttonClass,br2,buttonDrag);

        setButtonBackground(window.buttonCam, window.citbActivated) 
        setButtonBackground(buttonShow, window.showActivated);
        setButtonBackground(buttonClass, window.classActivated);
        setButtonBackground(buttonDrag); 
        if (window.actualVideoTag == videoCITB) {
          window.citbActivated = true;
          setVideoT('CITB');          
          setButtonBackground(window.buttonCam, window.citbActivated)
        }

        //Set if posible change camera (if there are a CITB camera)
        canChangeCameras ? setCITBCam(true) : setCITBCam(false);
        setEvents(buttonShow,buttonClass,window.buttonCam,buttonClose,buttonsContainerDiv,camCallBackFunction,showCallBackFunction,classCallBackFunction);
        showDiv();        
      } 
    }//END ONREADY STATE CHANGE

    
    const camCallBackFunction = async () => {
      if (!canChangeCameras) {return};
      if(window.actualVideoTag.id == "OTHERVideo") 
      { 
        window.actualVideoTag = videoCITB; 
        window.citbActivated = true;
        setVideoT('CITB');          
      } 
      else {
          window.actualVideoTag = videoOther; 
          window.citbActivated = false;
          setVideoT('otherVideo');
      }
      setButtonBackground(window.buttonCam, window.citbActivated)

    } 

    const getCITBMicMedia = async() =>{ 
      const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(enviroment.MYAUDIODEVICELABEL))); 
      if(citbMicrophone.length > 0){
        let constraints = { 
          video: false, 
          audio: { 
            deviceId: { exact: citbMicrophone[0].deviceId }, 
          }, 
        }; 
        let result = await navigator.mediaDevices.getUserMedia(constraints); 
        return result; 
      }else {
        return null;
      }
    }

    const showCallBackFunction = async() => {
      if(window.classActivated){
        deactivateClassMode();
      }
      if (showModeEnabled) { 
          //disable 
          if (showAudioContext != null) { 
              showAudioContext.close(); 
              showAudioContext = null; 
              showModeEnabled = false; 
              setButtonBackground(buttonShow, showModeEnabled); 
              setModeT('none'); 
          } 
      } else { 
          //enable  
          showAudioContext = new AudioContext(); 
          const CITBMicMedia = await getCITBMicMedia();  
          if (CITBMicMedia == null) {
            setButtonBackground(buttonShow, false); 
            setModeT('none'); 
            return;

          }
          const source = showAudioContext.createMediaStreamSource(CITBMicMedia); 
          source.connect(showAudioContext.destination); 
          showModeEnabled = true; 
          setButtonBackground(buttonShow, showModeEnabled); 
          setModeT('SHOW'); 
      } 
    };

    const activateClassMode = () => { 
      if(showModeEnabled){
        showCallBackFunction();
      }
      const otherMicrophones = devices.filter(x => (x.kind === 'audioinput' && !x.label.includes(enviroment.MYAUDIODEVICELABEL))); 
      if (otherMicrophones.length > 0){ 
        setMicrophone(otherMicrophones[0].deviceId); 
        window.classActivated = true; 
        setButtonBackground(buttonClass, window.classActivated) 
        return true 
      } 
      return false; 
       
    } 

    const deactivateClassMode = () => { 
      const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(enviroment.MYAUDIODEVICELABEL))); 
        if(citbMicrophone.length > 0){ 
          setMicrophone(citbMicrophone[0].deviceId); 
          window.classActivated = false; 
          setButtonBackground(buttonClass, window.classActivated) 
          return true; 
        } 
        return false 
    } 
     
    const classCallBackFunction = () => { 
      if (window.classActivated) { 
       if(deactivateClassMode()){
        setModeT('none'); 
       }else{
         alert('There is no CITB microphone');
       }            
      }else { 
        if (activateClassMode() ) { 
          setModeT('CLASS'); 
        }else{
          alert('There is not another microphone');
        }
      } 
    }  

    var isShow = false;
    const showDiv = () => {
      if (document.getElementById('buttonsContainer') && !isShow){
        document.getElementById('buttonsContainer').style.display = 'block';
        document.getElementById("pWebContainerState").innerText = "OPEN";
        isShow = true;
      }
    }
    
    var currentAudioMediaStream = new MediaStream();
    let devices = [];
    var showAudioContext; 
    let showModeEnabled = false; 
   
    //ADD <p> State of video to sync with popup </p>
    const pVideoState = document.createElement('p');
    pVideoState.setAttribute('id','pVideoState');
    pVideoState.style.display = 'none';
    
    //ADD <p> State of Mode(Class,Show or None) to sync with popup </p>
    const pModeState = document.createElement('p');
    pModeState.setAttribute('id','pModeState');
    pModeState.style.display = 'none';

    //ADD <p> State of WebContainer(show/hidden) to sync with popup </p>
    const pWebContainerState = document.createElement('p');
    pWebContainerState.setAttribute('id','pWebContainerState');
    pWebContainerState.style.display = 'none';

    //ADD <p> State if there are CITB CAM to sync with popup </p>
    const pModeExistsCam = document.createElement('p');
    pModeExistsCam.setAttribute('id','pModeExistsCam');
    pModeExistsCam.style.display = 'none';

    //ADD <p> State to manage current Mic </p>
    const pModeCurrentMic = document.createElement('p');
    pModeCurrentMic.setAttribute('id','pModeCurrentMic');
    pModeCurrentMic.style.display = 'none';

  let defaultMicrophoneId;
  const checkingMicrophoneId = async function () {  
      try { 
        let currentMic = document.getElementById('pModeCurrentMic').innerText.toString();
        if (window.localPeerConection) { 
          if (defaultMicrophoneId != currentMic) {
            defaultMicrophoneId = currentMic; 
            setMicrophone(defaultMicrophoneId);
            currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: defaultMicrophoneId }, video: false }); 
            if (currentAudioMediaStream && currentAudioMediaStream.getAudioTracks().length > 0){ 
              const micAudioTrack = currentAudioMediaStream.getAudioTracks()[0]; 
              const senders = window.localPeerConection.getSenders(); 
              const sendersWithTracks = senders.filter( s => s.track != null); 
              sendersWithTracks.filter(x => x.track.kind === 'audio').forEach(mysender => { 
                mysender.replaceTrack(micAudioTrack); 
              }); 
            } 
          } 
        } 
      } catch (error) { 
        console.log('no voy a cambiar el modo debido a este error: ', error) 
      } 
  } 
  setInterval(checkingMicrophoneId, 500) ;





  window.enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;

  MediaDevices.prototype.enumerateDevices = async function () {
    const res = await window.enumerateDevicesFn.call(navigator.mediaDevices);
    devices = res;
    res.push(getVirtualCam());
    return res;
  };
  
  // MICROSOFT's TEAMS USE THIS 
  const webKitGUM = Navigator.prototype.webkitGetUserMedia

  Navigator.prototype.webkitGetUserMedia  = async function (constrains,successCallBack,failureCallBack){ 
    if ( constrains.video && constrains.video.mandatory.sourceId) {
      if (
        constrains.video.mandatory.sourceId === "virtual" ||
        constrains.video.mandatory.sourceId.exact === "virtual"
      ) {
        await builVideosFromDevices()
        await buildVideoContainersAndCanvas();
        await drawFrameOnVirtualCamera()
        successCallBack(virtualWebCamMediaStream);
      } 
    }
    const res = await webKitGUM.call(this, constrains,successCallBack,failureCallBack);
    return res;
  } 

  // GOOGLE's MEET USE THIS
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;

  MediaDevices.prototype.getUserMedia = async function () {
    const args = arguments;

    if (args.length && args[0].video && args[0].video.deviceId) {
      if (
        args[0].video.deviceId === "virtual" ||
        args[0].video.deviceId.exact === "virtual"
      ) {
        await builVideosFromDevices()
        await buildVideoContainersAndCanvas();
        await drawFrameOnVirtualCamera()
        return virtualWebCamMediaStream;
      } else {
        return await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
      }
    }
    const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
    return res;
  };

  var origcreateDataChannel = RTCPeerConnection.prototype.createDataChannel; 
  RTCPeerConnection.prototype.createDataChannel = function(label, options) { 

    window.localPeerConection = this;
    return origcreateDataChannel.call(this, ...arguments)
  }

  var acreateOffer = RTCPeerConnection.prototype.createOffer;
  RTCPeerConnection.prototype.createOffer = async function (options) {
      window.localPeerConection = this;
      return await acreateOffer.apply(this, arguments);
  }  
  
  navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    const res = await navigator.mediaDevices.enumerateDevices();
    await buildVideoContainersAndCanvas();
    await builVideosFromDevices()
  });

  const checkDevices = () => {
    navigator.mediaDevices.enumerateDevices()
    setTimeout(() => {
      checkDevices()
    }, 1000)
  }
  checkDevices();
}

export { monkeyPatchMediaDevices }