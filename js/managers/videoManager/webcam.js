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


var canChangeCameras = true;
var virtualWebCamMediaStream = new MediaStream();
const virtualWebCamCanvasVideoContainer = generateVirtualWebCamCanvas();
const videoCITB = generateCITBVideoContainer();
const videoOther = generateOtherVideoContainer();
let timeFromLastFrame = performance.now(); 
const fps = 1000/30 
let currentAlphaValue = 0
let up = true
let fadeTimer = performance.now(); 


const fadeInFadeOut = () => {
     
    return new Promise((resolve, reject) =>{
        let done = false;
        const runLoop = () => {
            const timeCurrent = performance.now(); 
            if (!done) {
                requestAnimationFrame(runLoop);
    
            }
    
            if (timeCurrent - fadeTimer >= fps) { 
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
        }
        runLoop();  
    })
    
    
}


const drawFrameOnVirtualCamera = async () => { 
    const timeCurrent = performance.now(); 
    requestAnimationFrame(drawFrameOnVirtualCamera);
    if (timeCurrent - timeFromLastFrame >= fps) { 
        const width = window.actualVideoTag.videoWidth; 
        const height = window.actualVideoTag.videoHeight; 
        virtualWebCamCanvasVideoContainer.width = width;
        virtualWebCamCanvasVideoContainer.height = height;
        const context = virtualWebCamCanvasVideoContainer.getContext('2d');
        context.drawImage(
            window.actualVideoTag
            , 0
            , 0
            , virtualWebCamCanvasVideoContainer.width
            , virtualWebCamCanvasVideoContainer.height
        );
        context.fillStyle = `rgb(0, 0, 0, ${currentAlphaValue})`
        context.fillRect(0,0, width, height)
        timeFromLastFrame = performance.now(); 
    } 
}


const buildVideoContainersAndCanvas = async () => {
    virtualWebCamMediaStream = virtualWebCamCanvasVideoContainer.captureStream();
}


const builVideosFromDevices = async () => {
    const devices = await window.enumerateDevicesFn.call(navigator.mediaDevices)
    const videoSources = await getFinalVideoSources(devices)
    await buildVideos(videoSources)
}


const setStreamToVideoTag = async (constraints ,video) => {
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        }).catch(err => {
            console.log(err)
        });
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
    , drawFrameOnVirtualCamera
    , virtualWebCamMediaStream
    , videoCITB
    , videoOther
    , canChangeCameras
    , fadeInFadeOut
}