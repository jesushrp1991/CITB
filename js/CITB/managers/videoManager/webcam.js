import {
    enviroment
} from '../../enviroment.js'

import { 
    setButtonBackground
} from '../../domUtils.js'

import { 
    generateVirtualWebCamCanvas
    , generateCITBVideoContainer
    , generateOtherVideoContainer
} from '../../domUtils.js'

var canChangeCameras = false;
var virtualWebCamMediaStream = new MediaStream();
const virtualWebCamCanvasVideoContainer = generateVirtualWebCamCanvas();
const videoCITB = generateCITBVideoContainer();
const videoOther = generateOtherVideoContainer();
const fps = 1000/30 
let currentAlphaValue = 0
let up = true

const fadeInFadeOut = () => {
     
    return new Promise((resolve, reject) =>{
        let done = false;
        const runLoop = () => {
            if (!done) {
                setTimeout(() =>{
                    runLoop();
                }, Math.ceil(1000/30))    
            }
            const fadeInSteps = 100 / 30 / 100

            if (up) {
                currentAlphaValue += fadeInSteps 
            }  else{
                currentAlphaValue -= fadeInSteps;
            }
            if (currentAlphaValue >= 1) {
                    currentAlphaValue = 1;
                    up = false
                    done = true
                    return resolve();
                    return
            }
            if (currentAlphaValue <= 0 ) {
                currentAlphaValue = 0;
                up = true
                done = true
                return resolve();
            }
        }
        runLoop();
    })
    
    
}

function audioTimerLoop(callback, frequency) {
    var freq = frequency / 1000;      // AudioContext time parameters are in seconds
    var aCtx = new AudioContext();
    // Chrome needs our oscillator node to be attached to the destination
    // So we create a silent Gain Node
    var silence = aCtx.createGain();
    silence.gain.value = 0;
    silence.connect(aCtx.destination);
  
    onOSCend();
  
    var stopped = false;       // A flag to know when we'll stop the loop
    function onOSCend() {
      var osc = aCtx.createOscillator();
      osc.onended = onOSCend; // so we can loop
      osc.connect(silence);
      osc.start(0); // start it now
      osc.stop(aCtx.currentTime + freq); // stop it next frame
      callback(aCtx.currentTime); // one frame is done
      if (stopped) {  // user broke the loop
        osc.onended = function() {
          aCtx.close(); // clear the audioContext
          return;
        };
      }
    };
    // return a function to stop our loop
    return function() {
        stopped = true;
    };
  }
const drawFrameOnVirtualCamera = async () => { 
    if (window.actualVideoTag == undefined) { 
        return; 
    }
    const width = window.actualVideoTag.videoWidth; 
    const height = window.actualVideoTag.videoHeight; 
    virtualWebCamCanvasVideoContainer.width = width;
    virtualWebCamCanvasVideoContainer.height = height;
    const context = virtualWebCamCanvasVideoContainer.getContext('2d');
    context.clearRect(0,0,virtualWebCamCanvasVideoContainer.width, virtualWebCamCanvasVideoContainer.height);

    if (window.presentationMode) {
        let xPositionCITB = 0
        let yPositionCITB = (0.5 * virtualWebCamCanvasVideoContainer.height / 2 )
        let widthCITB = virtualWebCamCanvasVideoContainer.width / 2
        let heightCITB = virtualWebCamCanvasVideoContainer.height / 2
        let xPositionOther = virtualWebCamCanvasVideoContainer.width / 2
        let yPositionOther = yPositionCITB;
        let widthOther = widthCITB;
        let heightOther = heightCITB;
        if (window.duplo2) {
            widthCITB = virtualWebCamCanvasVideoContainer.width
            heightCITB = virtualWebCamCanvasVideoContainer.height
            xPositionCITB = 0;
            yPositionCITB = 0;
            widthOther = widthCITB * 0.25;
            heightOther = heightCITB * 0.25;
            xPositionOther = 0
            yPositionOther = 0.75 * heightCITB;
        }
        context.drawImage(
            videoCITB
            , xPositionCITB
            , yPositionCITB
            , widthCITB
            , heightCITB
        );

        context.drawImage(
            videoOther
            , xPositionOther
            , yPositionOther
            , widthOther
            , heightOther
        );
    }else {
        context.drawImage(
            window.actualVideoTag
            , 0
            , 0
            , virtualWebCamCanvasVideoContainer.width
            , virtualWebCamCanvasVideoContainer.height
        );
    }

    context.fillStyle = `rgb(0, 0, 0, ${currentAlphaValue})`;
    context.fillRect(0,0, width, height);
}


const buildVideoContainersAndCanvas = async () => {
    virtualWebCamMediaStream = virtualWebCamCanvasVideoContainer.captureStream();
}


const builVideosFromDevices = async (videoDeviceId) => {
    const devices = window.devices;
    const videoSources = await getFinalVideoSources(devices,videoDeviceId)
    await buildVideos(videoSources)
}


const setStreamToVideoTag = async (constraints ,video) => {
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        }).catch(err => {
            // console.log(err)
        });
}


const buildVideos = async (sources) => {
    let constraints = {
      video: {
        deviceId: { exact: "" },
        aspectRatio: 1.7777777778
      },
      audio: false,
    };
    if (sources.citbVideo != null) {
      constraints.video.deviceId.exact = sources.citbVideo.deviceId
      await setStreamToVideoTag(constraints, videoCITB)
      window.actualVideoTag = videoCITB
      window.citbActivated = true
      setButtonBackground(window.buttonCam, true) 
      canChangeCameras = true;
    }
    if (sources.otherVideo != null) {
      window.citbActivated = false;
      constraints.video.deviceId.exact = sources.otherVideo.deviceId
      await setStreamToVideoTag(constraints, videoOther)
    }
    if (sources.citbVideo == null && sources.otherVideo != null) {
      window.citbActivated = false;
      window.actualVideoTag = videoOther;
      setButtonBackground(window.buttonCam, false) 
      canChangeCameras = false;
    }
}

const isCITBCamera = (label) => {
    const cameraArray = enviroment.MYVIDEODDEVICELABEL.split(",");
    let returnValue = false;
    cameraArray.forEach(camera => {
      if (label.includes(camera)){
        returnValue = true;
      }
    })
    return returnValue
   
  }

const getFinalVideoSources = async (devices,videoDeviceId) => {
    const sources = devices;
    const videoSources = sources.filter(s => s.kind == "videoinput");
    const CITBVideo = videoSources.filter(s => isCITBCamera(s.label));
    let OTHERVIDEO;
    if(videoDeviceId != undefined || videoDeviceId != null){
        OTHERVIDEO = videoSources.filter(s => s.deviceId.includes(videoDeviceId));
    }else{
        OTHERVIDEO = videoSources.filter(s => !isCITBCamera(s.label));
    }
    let returnValue = {citbVideo: null, otherVideo: null}
    if (CITBVideo.length > 0){
        for(let element of enviroment.videoDevicePriorityOrder){
            let tempDevices =  CITBVideo.filter(s=> s.label.includes(element));
            if (tempDevices.length > 0){
               returnValue.citbVideo = tempDevices[0];
               break;
            }
        };
    }
    if (OTHERVIDEO.length > 0){
      returnValue.otherVideo = OTHERVIDEO[0];
    }
    return returnValue;
}


export {
    builVideosFromDevices
    , buildVideoContainersAndCanvas
    , drawFrameOnVirtualCamera
    , virtualWebCamMediaStream
    , videoCITB
    , videoOther
    , canChangeCameras
    , fadeInFadeOut
    , audioTimerLoop
    , isCITBCamera
}