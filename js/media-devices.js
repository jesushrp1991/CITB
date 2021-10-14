import { setEvents } from './eventos.js';
import {enviroment } from './enviroment.js';
import { setVideoT, setModeT,setCITBCam, getVirtualMic } from './functions.js';

import { 
  getButtonShow,
  getButtonClass,
  getButtonCam,
  getButtonClose,
  getContainerButton,
  setButtonBackground,
  addElementsToDiv,
  getVirtualCam,
  getButtonDrag
} from './domUtils.js';

function monkeyPatchMediaDevices() {
    let canChangeCameras = true;
    window.showActivated = false;
    window.classActivated = false;

    //WEB CONTAINER
    const buttonShow = getButtonShow();        
    const buttonClass = getButtonClass();
    const buttonCam = getButtonCam();
    const buttonClose= getButtonClose();
    const buttonDrag= getButtonDrag();  

    document.onreadystatechange = (event) => {
      if (document.readyState == 'complete'){ 

        //HTML TAGS TO SYNC WHIT POPUP
        document.body.appendChild(pVideoState);
        document.body.appendChild(pModeState);
        document.body.appendChild(pWebContainerState);
        document.body.appendChild(pModeExistsCam);
        
        //HTML MEDIA TAGS TO MANAGE CAMERAS
        document.body.appendChild(videoCITB);
        document.body.appendChild(videoOther);
        document.body.appendChild(canvasCITB);

        //WEB CONTAINER
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
          setVideoT('CITB');          
          setButtonBackground(buttonCam, window.citbActivated)
        }
        //Set if posible change camera (if there are a CITB camera)
        canChangeCameras ? setCITBCam(true) : setCITBCam(false);

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
          }
          else{
            let otherMicrophone = devices.filter(x => (x.kind === 'audioinput' && !x.label.includes(enviroment.MYAUDIODEVICELABEL))); 
            let constraints = { 
              video: false, 
              audio: { 
                deviceId: { exact: otherMicrophone[0].deviceId }, 
              }, 
            }; 
            let result = await navigator.mediaDevices.getUserMedia(constraints); 
            return result; 
          }
        }

        const showCallBackFunction = async() => {
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
              const source = showAudioContext.createMediaStreamSource(CITBMicMedia); 
              source.connect(showAudioContext.destination); 
              showModeEnabled = true; 
              setButtonBackground(buttonShow, showModeEnabled); 
              setModeT('SHOW'); 
          } 
        };

        const activateClassMode = () => {
            try{
              console.log(singleDestionation);
              console.log(PCSource);
              // CITBSource.disconnect(singleDestionation);
              PCSource.connect(singleDestionation);
              setModeT('CLASS');
              window.classActivated = true;
            setButtonBackground(buttonClass, window.classActivated)
            }catch(e){
              console.log(e);
            }
        }

        const deactivateClassMode = () => {
          PCSource.disconnect(singleDestionation);
          CITBSource.connect(singleDestionation);
          setModeT('none');
          window.classActivated = false;
          setButtonBackground(buttonClass, window.classActivated);

        }
        
        const classCallBackFunction = () => {
          console.log("classCallBackFunction",window.classActivated)
          if (window.classActivated) {
           deactivateClassMode();
           defaultMode = 'none';
          }else {
            activateClassMode();
          }
        } 
        setEvents(buttonShow,buttonClass,buttonCam,buttonClose,buttonsContainerDiv,camCallBackFunction,showCallBackFunction,classCallBackFunction);
        showDiv();
      } 
    }//END ONREADY STATE CHANGE

    const showDiv = () => {
      if (document.getElementById('buttonsContainer')){
        document.getElementById('buttonsContainer').style.display = 'block';
        document.getElementById("pWebContainerState").innerText = "OPEN";
      }
    }
    
    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origcreateDataChannel = RTCPeerConnection.prototype.createDataChannel; 
    var currentMediaStream = new MediaStream();
    var currentCanvasMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultMicrophoneId,globalVideoSources;
    let defaultMode = 'none';
    let devices = [];
    const audioCTX = new AudioContext(); 
    var showAudioContext; 
    let showModeEnabled = false; 
    var source; 
    var p = navigator.mediaDevices.getUserMedia({ audio: { type: "input"}}); 
    p.then(frame => { 
      source = audioCTX.createMediaStreamSource(frame);          
     }); 
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
   
    MediaDevices.prototype.enumerateDevices = async function () {
      const res = await enumerateDevicesFn.call(navigator.mediaDevices);
      devices = res;
      res.push(getVirtualCam());
      res.push(getVirtualMic());
      return res;
    };

    MediaDevices.prototype.getUserMedia = async function () {
      const args = arguments;
      // console.log(args);
      if (args.length && args[0].video && args[0].video.deviceId) {
        if (
          args[0].video.deviceId === "virtual" ||
          args[0].video.deviceId.exact === "virtual"
        ) {
          await builVideosFromDevices()
          await buildVideoContainersAndCanvas();
          await drawCanvas()
          return currentCanvasMediaStream;
        } else {
          const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
          currentMediaStream = res;
          return res;
        }
      }
      if (args.length && args[0].audio && args[0].audio.mandatory.sourceId) {
        if (          
          args[0].audio.mandatory.sourceId === "virtualMic" ||
          args[0].audio.mandatory.sourceId.exact === "virtualMic"
        ){
          buildAudio();
          // console.log("Entro a virtual MIC");
          // console.log("singleDestination.stream",singleDestionation)
          return singleDestionation.stream;
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

     //VARIABLES PARA CLASS MODE///
     let CITBMediaStream,PCMediaStream;
     let CITBSource,PCSource;
     let classRoomAudioContext = new AudioContext();
     let singleDestionation = classRoomAudioContext.createMediaStreamDestination();

     //VARIABLES PARA CLASS MODE///
     
     //SET MEDIASTREAM///
     const buildAudio = async() => { 
       try{
        CITBMediaStream = null;
        PCMediaStream = null;
        const res = await navigator.mediaDevices.enumerateDevices();
        const citbMicrophone = res.filter(x => (x.kind === 'audioinput' && x.label == enviroment.MYAUDIODEVICELABEL)); 
        const pcMicrophone = res.filter(x => (x.kind === 'audioinput' && !x.label.includes(enviroment.MYAUDIODEVICELABEL)));

        console.log("AsdasdasdasD",citbMicrophone,pcMicrophone);

        let constraints = { 
          video: false, 
          audio: { 
            deviceId: citbMicrophone[0].deviceId ,  
          }, 
        }; 
        let constraintsPC = { 
          video: false, 
          audio: { 
            deviceId: pcMicrophone[0].deviceId , 
          }, 
        }; 
         CITBMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
         PCMediaStream = await navigator.mediaDevices.getUserMedia(constraintsPC); 

         CITBSource = classRoomAudioContext.createMediaStreamSource(CITBMediaStream);
         PCSource = classRoomAudioContext.createMediaStreamSource(PCMediaStream);  
        
         CITBSource.connect(singleDestionation);
        //  PCSource.connect(singleDestionation);    
       }catch(e){
         console.log("BuildAudio error",e);
       }
     }   
     //END SET MEDIASTREAM///
}

export { monkeyPatchMediaDevices }