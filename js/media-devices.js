import { setEvents } from './eventos.js';
import {enviroment } from './enviroment.js';
import { setMode,setVideo, setVideoT, setModeT } from './functions.js';

import { 
  getButtonShow,
  getButtonClass,
  getButtonCam,
  getButtonClose,
  getContainerButton,
  setMicrophone,
  setButtonBackground,
  addElementsToDiv,
  createAudioElement,
  getVirtualCam,
  getButtonDrag
} from './domUtils.js';

function monkeyPatchMediaDevices() {
    let canChangeCameras = true;
    let canActivateShow = true;
    let canActivateClass = true;
    const buttonShow = getButtonShow();        
    const buttonClass = getButtonClass();
    const buttonCam = getButtonCam();
    const buttonClose= getButtonClose();
    const buttonDrag= getButtonDrag();  
    window.showActivated = false;
    window.classActivated = false;

    document.onreadystatechange = (event) => {
      if (document.readyState == 'complete'){ 

        document.body.appendChild(pVideoState);
        document.body.appendChild(pModeState);

        document.body.appendChild(videoCITB);
        document.body.appendChild(videoOther);
        document.body.appendChild(canvasCITB);

        window.buttonsContainerDiv = getContainerButton();
        
        const br = document.createElement('br');
        const br0 = document.createElement('br');
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        
        addElementsToDiv(window.buttonsContainerDiv,buttonClose,br0, buttonCam, br, buttonShow, br1, buttonClass,br2,buttonDrag);
        
        setButtonBackground(buttonCam, window.citbActivated) 
        setButtonBackground(buttonShow, window.showActivated);
        setButtonBackground(buttonClass, window.classActivated);
        setButtonBackground(buttonDrag); 

        if (window.actualVideoTag == videoCITB) {
          window.citbActivated = true;
          setButtonBackground(buttonCam, window.citbActivated) 

        }

        const camCallBackFunction = () => {
          if (!canChangeCameras) {return};
          if(window.actualVideoTag.id == "OTHERVideo") 
          { 
            window.actualVideoTag = videoCITB; 
            window.citbActivated = true;
            setVideoT('CITB');          
            setButtonBackground(buttonCam, window.citbActivated);
          } 
          else {
              window.actualVideoTag = videoOther; 
              window.citbActivated = false;
              setVideoT('otherVideo');
          }
          setButtonBackground(buttonCam, window.citbActivated)
        } 
        
       const activateShowMode = () => {
          window.myAudio.muted = false;
          defaultMode = 'show';
          // setMode('show');
          setModeT('SHOW');
          window.showActivated = true;
          setButtonBackground(buttonShow, window.showActivated);

       }

        const deactivateShowMode = () => {
          window.myAudio.muted = true;   
          defaultMode = 'none';
          // setMode('none');
          setModeT('none');
          window.showActivated = false;
          setButtonBackground(buttonShow, window.showActivated);
        }

        const showCallBackFunction = () => {
          const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(enviroment.MYAUDIODEVICELABEL)));
          console.log("citbMicrophone",citbMicrophone);
          console.log("showActivated",window.showActivated);
          if(citbMicrophone.length > 0){
              if(window.showActivated){
                deactivateShowMode()
              }else{
                deactivateClassMode();
                activateShowMode();
              }
          }else{
            // alert('Could not change Microphone');
          } 
        };

        const activateClassMode = () => {
          const otherMicrophones = devices.filter(x => (x.kind === 'audioinput' && !x.label.includes(enviroment.MYAUDIODEVICELABEL)));
          if (otherMicrophones.length > 0){
            // console.log("othermic", otherMicrophones[0])
            // setMicrophone(otherMicrophones[0].deviceId);
            setModeT('CLASS');
            window.classActivated = true;
            setButtonBackground(buttonClass, window.classActivated)
            return true
          }
          return false;
          
        }

        const deactivateClassMode = () => {
          const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(enviroment.MYAUDIODEVICELABEL)));
            if(citbMicrophone.length > 0){
              // setMicrophone(citbMicrophone[0].deviceId);
              setModeT('none');
              window.classActivated = false;
              setButtonBackground(buttonClass, window.classActivated)
              return true;
            }
            return false
        }
        
        const classCallBackFunction = () => {
          if (window.classActivated) {
           deactivateClassMode();
           setMode('none');
           defaultMode = 'none';
          }else {
            if (activateClassMode() ) {
              setMode('class');
              defaultMode = 'class';
            }
          }
        } 

        setEvents(buttonShow,buttonClass,buttonCam,buttonClose,buttonsContainerDiv,camCallBackFunction,showCallBackFunction,classCallBackFunction);
        showDiv();
        createAudioElement();
        initAudioSRC();

        // const checkVideoId = () => {
        //   chrome.runtime.sendMessage(enviroment.EXTENSIONID, { defaultVideoId: true }, async function (response) {
        //       if (globalVideoSources.citbVideo == null) {
        //         setVideo('other') 
        //         return
        //       } 
        //       response.farewell == 'citb' ?   window.citbActivated = true :    window.citbActivated = false;
        //       setButtonBackground(buttonCam, window.citbActivated);
        //       window.citbActivated ? window.actualVideoTag.id == "CITBVideo" : window.actualVideoTag.id == "OTHERVideo";
        //       window.citbActivated ? window.actualVideoTag = videoCITB : window.actualVideoTag = videoOther;
        //   });
        // }
        // const checkDefaultMode = () => {
        //   chrome.runtime.sendMessage(enviroment.EXTENSIONID, { defaultMode: true }, async function (response) {
        //     if (response && response.farewell) {
        //       if (response.farewell != defaultMode) {   
        //         // console.log(response.farewell);             
        //         if(response.farewell == 'show')
        //           {
        //             showCallBackFunction();
        //           }
        //         else if (response.farewell == 'class')
        //           {
        //             classCallBackFunction();
        //           }
        //         else{
        //           deactivateClassMode();
        //           deactivateShowMode();
        //         }
        //       }
        //     }
        //   });
        // };

        // setInterval(checkVideoId,250);
        // setInterval(checkDefaultMode,250);
      } 
    }

    const showDiv = () => {
      if (document.getElementById('buttonsContainer'))
      document.getElementById('buttonsContainer').style.display = 'block';
    }
    
    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origcreateDataChannel = RTCPeerConnection.prototype.createDataChannel; 
    var currentMediaStream = new MediaStream();
    var currentCanvasMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultVideoId, defaultMicrophoneId,defaultAudioId,globalVideoSources;
    let defaultMode = 'none';
    let devices = [];
    
    //ADD <p> Magic state </p>
    const pVideoState = document.createElement('p');
    pVideoState.setAttribute('id','pVideoState');
    pVideoState.style.display = 'none';
    
    //ADD <p> Magic state </p>
    const pModeState = document.createElement('p');
    pModeState.setAttribute('id','pModeState');
    pModeState.style.display = 'none';

    //add two video tags to the dom
    const videoCITB = document.createElement('video');
    videoCITB.setAttribute('id', 'CITBVideo')
    videoCITB.setAttribute('playsinline', "")
    videoCITB.setAttribute('autoplay', "")
    videoCITB.style.display = 'none';


    videoCITB.addEventListener("pause", (event) => {
      // console.log("video has been paused", event)
    })
    videoCITB.addEventListener("ended", (event) => {
      // console.log("video has been ended", event)
    })
    videoCITB.addEventListener("error", (event) => {
      // console.log("video has been error", event)
    })

    const videoOther = document.createElement('video');
    videoOther.setAttribute('id', 'OTHERVideo')
    videoOther.setAttribute('playsinline', "")
    videoOther.setAttribute('autoplay', "")
    videoOther.style.display = 'none'; 

    const canvasCITB = document.createElement('canvas');
    canvasCITB.setAttribute('id', 'canvasCITB')
    window.canvas = canvasCITB

    const buildVideoContainersAndCanvas = async () => {
      // console.log("Cambas capture Video");
      currentCanvasMediaStream = canvasCITB.captureStream();
      // console.log("currentCanvasMediaStream",currentCanvasMediaStream.getTracks());
    }

    const builVideosFromDevices = async () => {

      const devices = await enumerateDevicesFn.call(navigator.mediaDevices)
      const videoSources = await getFinalVideoSources(devices)
      await buildVideos(videoSources)
       
    }
    let t1 = performance.now(); 
 
    const drawCanvas = () => { 
      const fps = 1000/30 
      const t = performance.now(); 
      requestAnimationFrame(drawCanvas) 
      if (t - t1 >= fps) { 
        canvasCITB.width = window.actualVideoTag.videoWidth; 
        canvasCITB.height = window.actualVideoTag.videoHeight; 
        canvasCITB.getContext('2d').drawImage(window.actualVideoTag, 0, 0, canvasCITB.width, canvasCITB.height); 
        t1 = performance.now(); 
      } 
    }

  const checkingMicrophoneId = async function () {
    chrome.runtime.sendMessage(enviroment.EXTENSIONID, { defaultMicrophoneId: true }, async function (response) {
      try {
        if (response && response.defaultMicrophoneId && window.localPeerConection) {
          if (response.defaultMicrophoneId != defaultMicrophoneId) {
            defaultMicrophoneId = response.defaultMicrophoneId;  
            currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: defaultMicrophoneId }, video: false });
            // console.log(currentAudioMediaStream, currentAudioMediaStream.getAudioTracks())
            if (currentAudioMediaStream && currentAudioMediaStream.getAudioTracks().length > 0){
              const micAudioTrack = currentAudioMediaStream.getAudioTracks()[0];
              const senders = window.localPeerConection.getSenders();
              const sendersWithTracks = senders.filter( s => s.track != null);
              // console.log(sendersWithTracks)
              sendersWithTracks.filter(x => x.track.kind === 'audio').forEach(mysender => {
                mysender.replaceTrack(micAudioTrack);
              });
            }
          }
        }
      } catch (error) {
        console.log('no voy a cambiar el modo debido a este error: ', error)
      }
    });
  }

setInterval(checkingMicrophoneId, 500)

const getFinalVideoSources = async (devices) => {
  const sources = devices;
  const videoSources = sources.filter(s => s.kind == "videoinput");
  const CITBVideo = videoSources.filter(s => s.label.includes(enviroment.MYVIDEODDEVICELABEL));
  const OTHERVIDEO = videoSources.filter(s => !s.label.includes(enviroment.MYVIDEODDEVICELABEL));
  let returnValue = {citbVideo: null, otherVideo: null}
  if (CITBVideo.length > 0){
    returnValue.citbVideo = CITBVideo[0];
  }
  if (OTHERVIDEO.length > 0){
    returnValue.otherVideo = OTHERVIDEO[0];
  }
  // console.log("GLOBAL VIDEO SOURCE",returnValue);
  globalVideoSources = returnValue;
  // console.log("GLOBAL VIDEO SOURCE",returnValue);
  return returnValue;
}

const buildVideos = async (sources) => {
  // console.log("buildVideos", sources);
  let constraints = {
    video: {
      deviceId: { exact: "" },
    },
    audio: false,
  };
  if (sources.citbVideo != null) {
    // console.log("INSIDE CITBVIDEO")
    constraints.video.deviceId.exact = sources.citbVideo.deviceId
    await setStreamToVideoTag(constraints, videoCITB)
    window.actualVideoTag = videoCITB
    window.citbActivated = true
    setButtonBackground(buttonCam, true) 
    canChangeCameras = true;
    setVideo('citb')

  }
  if (sources.otherVideo != null) {
    // console.log("INSIDE OTHER VIDEO");
    window.citbActivated = false;
    constraints.video.deviceId.exact = sources.otherVideo.deviceId
    await setStreamToVideoTag(constraints, videoOther)
    // drawCanvas();
  }
  if (sources.citbVideo == null && sources.otherVideo != null) {
    // console.log("INSIDE LAST IF")
    window.citbActivated = false;
    window.actualVideoTag = videoOther;
    setButtonBackground(buttonCam, false) 
    canChangeCameras = false;
  }
}

const setStreamToVideoTag = async (constraints ,video) => {
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
  }).catch(err => {
    console.log(err)
  });
}
   
const initAudioSRC = async () => {
  // console.log(currentAudioMediaStream, currentAudioMediaStream.getAudioTracks())
  if (currentAudioMediaStream.getAudioTracks().length == 0){
    currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: defaultMicrophoneId }, video: false });
    if (currentAudioMediaStream.getAudioTracks().length > 0){
      setAudioSrc()
    }
  }else {
    setAudioSrc()

  }
}

const setAudioSrc = () => {
  // console.log("setAudioSRC")
  if (window.myAudio){
    if (window.URL ){
      // console.log("set audio srcObject")
      window.myAudio.srcObject = currentAudioMediaStream;
    } else {
      // console.log("set audio src")
      window.myAudio.src = currentAudioMediaStream;
    }
  }
} 
    MediaDevices.prototype.enumerateDevices = async function () {
      const res = await enumerateDevicesFn.call(navigator.mediaDevices);
      devices = res;
      res.push(getVirtualCam());
      return res;
    };

    MediaDevices.prototype.getUserMedia = async function () {
      // console.log("Inside Prototype getUserMedia");
      const args = arguments;
      console.log("Arguments",args);
      if (args.length && args[0].video && args[0].video.deviceId) {
        if (
          args[0].video.deviceId === "virtual" ||
          args[0].video.deviceId.exact === "virtual"
        ) {
          await builVideosFromDevices()
          await buildVideoContainersAndCanvas();
          await drawCanvas()
          console.log("currentCanvasMediaStream",currentCanvasMediaStream);
          return currentCanvasMediaStream;
        } else {
          const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
          currentMediaStream = res;
          console.log("currentCanvasMediaStream",currentMediaStream);

          return res;
        }
      }
      const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
      return res;
    };
    RTCPeerConnection.prototype.createDataChannel = async function(label, options) { 
      window.localPeerConection = this; 
      window.localPeerConection.addEventListener("track", e => { 
        if (window.peerConection == undefined) { 
          window.peerConection = window.localPeerConection; 
          showDiv(); 
        } 
        if (e.streams.length >= 1) { 
          window.currentMediaStream =  e.streams[0]; 
        } 
        window.currentTrack = e.track; 
      }, false); 
      await origcreateDataChannel.apply(this,arguments) 
    }
    
    
    navigator.mediaDevices.addEventListener('devicechange', async function (event) {
      // console.log('device plugged or unplugged, update de info,')
      const res = await navigator.mediaDevices.enumerateDevices();
      // console.log("Lista de dispositivos",res);
      await buildVideoContainersAndCanvas();
      await builVideosFromDevices()

      chrome.runtime.sendMessage(enviroment.EXTENSIONID, { devicesList: res }, async function (response) { 
      });
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