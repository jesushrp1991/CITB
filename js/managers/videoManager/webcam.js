
import {
    enviroment
} from '../../enviroment.js'

import { 
    setButtonBackground
} from '../../domUtils.js'


var currentCanvasMediaStream = new MediaStream();


const canvasCITB = document.createElement('canvas');
canvasCITB.setAttribute('id', 'canvasCITB')
window.canvas = canvasCITB

//add two video tags to the dom
const videoCITB = document.createElement('video');
videoCITB.setAttribute('id', 'CITBVideo')
videoCITB.setAttribute('playsinline', "")
videoCITB.setAttribute('autoplay', "")
videoCITB.style.display = 'none';


const videoOther = document.createElement('video');
videoOther.setAttribute('id', 'OTHERVideo')
videoOther.setAttribute('playsinline', "")
videoOther.setAttribute('autoplay', "")
videoOther.style.display = 'none'; 

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
const buildVideoContainersAndCanvas = async () => {
    currentCanvasMediaStream = canvasCITB.captureStream();
}

const builVideosFromDevices = async () => {
    const devices = await window.enumerateDevicesFn.call(navigator.mediaDevices)
    const videoSources = await getFinalVideoSources(devices)
    await buildVideos(videoSources)
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
      setButtonBackground(window.buttonCam, true) 
      window.canChangeCameras = true;
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
      setButtonBackground(window.buttonCam, false) 
      window.canChangeCameras = false;
    }
  }
  
  const setStreamToVideoTag = async (constraints ,video) => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
    }).catch(err => {
      console.log(err)
    });
  }


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
    return returnValue;
}

export {
    builVideosFromDevices
    , buildVideoContainersAndCanvas
    , drawCanvas
    , currentCanvasMediaStream
    , videoCITB
    , videoOther
}