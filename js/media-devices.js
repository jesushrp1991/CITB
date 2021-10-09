import { setEvents } from './eventos.js';
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

  
  if (window.location.host === 'meet.google.com' || window.location.host === 'zoom.us') {
    const MYVIDEODDEVICELABEL = 'Sirius USB2.0 Camera (0ac8:3340)';
    const MYAUDIODEVICELABEL = 'CITB';
    const EXTENSIONID = 'pgloinlccpmhpgbnccfecikdjgdhneof';
    
    document.onreadystatechange = (event) => {
      if (document.readyState == 'complete'){
        console.log("DOCUMENT READY");
        
        const buttonShow = getButtonShow();        
        const buttonClass = getButtonClass();
        const buttonCam = getButtonCam();
        const buttonClose= getButtonClose();
        const buttonDrag= getButtonDrag();
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
  
  //get devices
  
const CITBCAMERALABEL = "Sirius USB2.0 Camera (0ac8:3340)"

const getFinalVideoSources = async (devices) => {
  const sources = devices;
  const videoSources = sources.filter(s => s.kind == "videoinput");
  const CITBVideo = videoSources.filter(s => s.label.includes(CITBCAMERALABEL));
  const OTHERVIDEO = videoSources.filter(s => !s.label.includes(CITBCAMERALABEL));
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
  }
  if (sources.otherVideo != null) {
    constraints.video.deviceId.exact = sources.otherVideo.deviceId
    await setStreamToVideoTag(constraints, videoOther)
    // drawCanvas();
  }
  if (sources.citbVideo == null && sources.otherVideo != null) {
    window.actualVideoTag = videoOther

  }
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
      // //console.log(res);
      // chrome.runtime.sendMessage(EXTENSIONID, { devicesList: res }, function (response) {
      //   if (response.farewell) {
      //     defaultVideoId = response.farewell;
      //     defaultVideoLabel = res.filter(x => x.deviceId === defaultVideoId).length > 0 ? res.filter(x => x.deviceId === defaultVideoId)[0].label : '';
      //     //console.log("WILL CHANGE USERMEDIA", defaultVideoId)
      //   }
      // });
      if (defaultVideoId != undefined) {
        setMediaStreamTracks()
      }
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
          // await setMediaStreamTracks()
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
  }
}

export { monkeyPatchMediaDevices }