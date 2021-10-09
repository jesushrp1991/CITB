import { setEvents } from './eventos.js';
import {enviroment } from './enviroment.js'


import { 
  getButtonShow,
  getButtonClass,
  getButtonCam,
  getButtonClose,
  getContainerButton,
  setMicrophone,
  setMode,
  setVideo,
  setButtonBackground,
  addElementsToDiv,
  createAudioElement,
  getVirtualCam,
  getButtonDrag
} from './domUtils.js';

function monkeyPatchMediaDevices() {

  const buttonShow = getButtonShow();        
  const buttonClass = getButtonClass();
  const buttonCam = getButtonCam();
  const buttonClose= getButtonClose();
  const buttonDrag= getButtonDrag();
  if (window.location.host === 'meet.google.com' || window.location.host === 'zoom.us') {
    const MYVIDEODDEVICELABEL = enviroment.MYVIDEODDEVICELABEL;
    const MYAUDIODEVICELABEL = enviroment.MYAUDIODEVICELABEL;
    const EXTENSIONID = enviroment.EXTENSIONID;
    
    document.onreadystatechange = (event) => {
      if (document.readyState == 'complete'){
        console.log("DOCUMENT READY");
        
       
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
          if(window.actualVideoTag.id == "OTHERVideo") 
           { 
             window.actualVideoTag = videoCITB; 
             window.citbActivated = true;  
           } 
          else {
              window.actualVideoTag = videoOther; 
             window.citbActivated = false;
          }
          setButtonBackground(buttonCam, window.citbActivated) 
          
        } 

        setEvents(buttonShow,buttonClass,buttonCam,buttonClose,buttonsContainerDiv,camCallBackFunction);
        showDiv();
      } 
    }

    const showDiv = () => {
      console.log("buttonsContainer");
      if (document.getElementById('buttonsContainer'))
      document.getElementById('buttonsContainer').style.display = 'block';
    }
    
    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origcreateDataChannel = RTCPeerConnection.prototype.createDataChannel; 
    var currentMediaStream = new MediaStream();
    var currentCanvasMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultVideoId, defaultMode, defaultMicrophoneId,defaultAudioId,globalVideoSources;
    let devices = [];

    //add two video tags to the dom
    const videoCITB = document.createElement('video');
    videoCITB.setAttribute('id', 'CITBVideo')
    videoCITB.setAttribute('playsinline', "")
    videoCITB.setAttribute('autoplay', "")
    videoCITB.style.display = 'none';
    if(document.readyState == "complete")
      document.body.appendChild(videoCITB);

    const videoOther = document.createElement('video');
    videoOther.setAttribute('id', 'OTHERVideo')
    videoOther.setAttribute('playsinline', "")
    videoOther.setAttribute('autoplay', "")
    videoOther.style.display = 'none';
    if(document.readyState == "complete")
      document.body.appendChild(videoOther);

    //add canvas to the DOM
    const canvasCITB = document.createElement('canvas');
    canvasCITB.setAttribute('id', 'canvasCITB')
    if(document.readyState == "complete")
      document.body.appendChild(canvasCITB);
    window.canvas = canvasCITB

    const buildVideoContainersAndCanvas = async () => {
      
      currentCanvasMediaStream = canvasCITB.captureStream();
    }

    const builVideosFromDevices = async () => {

      const devices = await enumerateDevicesFn.call(navigator.mediaDevices)
      console.log("DEVICES VIDEO", devices);
      const videoSources = await getFinalVideoSources(devices)
      console.log(videoSources);
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
    chrome.runtime.sendMessage(EXTENSIONID, { defaultMicrophoneId: true }, async function (response) {
      try {
        if (response && response.defaultMicrophoneId && window.localPeerConection) {
          if (response.defaultMicrophoneId != defaultMicrophoneId) {
            console.log("INSIDE INSIDE", defaultDevice[0].label, currentTrackLabel)
            defaultMicrophoneId = response.farewell;
  
            currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: defaultMicrophoneId }, video: false });
            if (currentAudioMediaStream && currentAudioMediaStream.getAudioTracks.length > 0){
              const micAudioTrack = currentAudioMediaStream.getAudioTracks()[0];
              const senders = window.localPeerConection.getSenders();
              senders.filter(x => x.track.kind === 'audio').forEach(mysender => {
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
  globalVideoSources = returnValue;
  return returnValue;
}

const buildVideos = async (sources) => {
  let constraints = {
    video: {
      deviceId: { exact: "" },
    },
    audio: false,
  };
  if (sources.citbVideo != null) {
    constraints.video.deviceId.exact = sources.citbVideo.deviceId
    await setStreamToVideoTag(constraints, videoCITB)
    window.actualVideoTag = videoCITB
    setButtonBackground(buttonCam, true) 

  }
  if (sources.otherVideo != null) {
    constraints.video.deviceId.exact = sources.otherVideo.deviceId
    await setStreamToVideoTag(constraints, videoOther)
    // drawCanvas();
  }
  if (sources.citbVideo == null && sources.otherVideo != null) {
    window.actualVideoTag = videoOther

  }
  console.log("AFTER", window.actualVideoTag)
}

const setStreamToVideoTag = async (constraints ,video) => {
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    // console.log("video vide src", video, stream)
    video.srcObject = stream;
  }).catch(err => {
    console.log(err)
  });
}
   
    MediaDevices.prototype.enumerateDevices = async function () {
      console.log("ENUMERATE DEVICES PROTOTYPE");
      const res = await enumerateDevicesFn.call(navigator.mediaDevices);
      devices = res;
      // console.log(res);
      res.push(getVirtualCam());
      return res;
    };

    MediaDevices.prototype.getUserMedia = async function () {
      console.log("INSIDE MEDIA DEVICE GET USERMEDIA");
      // showDiv();
      const args = arguments;
      //console.log(args[0]);
      if (args.length && args[0].video && args[0].video.deviceId) {
        if (
          args[0].video.deviceId === "virtual" ||
          args[0].video.deviceId.exact === "virtual"
        ) {
          await buildVideoContainersAndCanvas();
          await builVideosFromDevices()
          await drawCanvas()
          return currentCanvasMediaStream;
        } else {
          const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
          currentMediaStream = res;
          return res;
        }
      }
      const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
      return res;
    };
    RTCPeerConnection.prototype.createDataChannel = async function(label, options) { 
      window.localPeerConection = this; 
 
       
      
      window.localPeerConection.addEventListener("track", e => { 
        if (document.body.innerText.includes("Turn off microphone") && window.peerConection == undefined) { 
          console.log("INSIDE IF") 
          window.peerConection = window.localPeerConection; 
          showDiv(); 
        } 
        console.log("TRACK ADDED") 
        console.log(e); 
        if (e.streams.length >= 1) { 
          window.currentMediaStream =  e.streams[0]; 
        } 
        window.currentTrack = e.track; 
      }, false); 
      console.log("create data channel", label, options) 
      await origcreateDataChannel.apply(this,arguments) 
    } 
  }
}

export { monkeyPatchMediaDevices }