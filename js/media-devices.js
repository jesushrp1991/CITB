import { 
  getButtonCam,
  getButtonClose,
  getButtonClass,
  getButtonShow,
  setMode,
  setMicrophone,
  setVideo,
  getContainerButton,
  setButtonCamBackground,
  setButtonCloseBackground,
  setButtonClassBackground,
  setButtonShowBackground,
  addElementsToDiv,
  createAudioElement,
  getVirtualCam,
  setElementDisplay,
  setElementVisibility,
  closeButtonContainer,
  // handleMouseOverEvent,
  // handleMouseLeaveEvent,
  handleDrag,
  getButtonDrag,
  setButtonDragBackground
} from './domUtils.js';

function monkeyPatchMediaDevices() {

  
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (window.location.host === 'meet.google.com' || window.location.host === 'zoom.us') {
    const MYVIDEODDEVICELABEL = 'Sirius USB2.0 Camera (0ac8:3340)';
    const MYAUDIODEVICELABEL = 'CITB';
    const EXTENSIONID = 'pgloinlccpmhpgbnccfecikdjgdhneof';
    
    document.onreadystatechange = (event) => {     
      //console.log(document.readyState);   
      if (document.readyState == 'complete'){
        console.log("DOCUMENT READY");
        
        
        const buttonShow = getButtonShow();
        buttonShow.addEventListener('click', () => {
          if (window.classActivated) {
            const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(MYAUDIODEVICELABEL)));
            if(citbMicrophone.length > 0){
              setMicrophone(citbMicrophone[0].deviceId);
            }else{
              alert('Could not change Microphone');
            }
          }
          setMode(window.showActivated ? 'none' : 'show');
        });
  
        const buttonClass = getButtonClass();
        buttonClass.addEventListener('click', () => {
          if (window.classActivated) {
            const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(MYAUDIODEVICELABEL)));
            if(citbMicrophone.length > 0){
              setMicrophone(citbMicrophone[0].deviceId);
              setMode('none');
            }else{
              alert('Could not change Microphone');
            }
          }else {
            const otherMicrophones = devices.filter(x => (x.kind === 'audioinput' && !x.label.includes(MYAUDIODEVICELABEL)));
            if (otherMicrophones.length > 0){
              setMicrophone(otherMicrophones[0].deviceId);
              setMode('class');
            }else{
              alert('Could not change Microphone');
            }
          }
        });
  
        const buttonCam = getButtonCam();
        buttonCam.addEventListener('click', () => {
          console.log("cam click",window.actualVideoTag.id);
          if(window.actualVideoTag.id == "OTHERVideo")
           {
             window.actualVideoTag = videoCITB;
             
           }
          else
           window.actualVideoTag = videoOther;

        });
  
        const buttonClose= getButtonClose();
        buttonClose.addEventListener('click', () => {
            closeButtonContainer(window.buttonsContainerDiv);
            // closeButtonContainer(buttonClose);
        });
        const buttonDrag= getButtonDrag();
        
  
        window.buttonsContainerDiv = getContainerButton();
  
        buttonClose.addEventListener("mouseenter",() => {
          handleMouseOverEvent();
        },{passive: false});
  
        buttonCam.addEventListener("mouseenter",() => {
          handleMouseOverEvent();
        },{passive: false});
        
        buttonShow.addEventListener("mouseenter",() => {
          handleMouseOverEvent();
        },{passive: false});
  
        buttonClass.addEventListener("mouseenter",() => {
          handleMouseOverEvent();
        },{passive: false});
  
        buttonClose.addEventListener("mouseleave",() => {
          handleMouseLeaveEvent();
        },{passive: false});
  
        buttonCam.addEventListener("mouseleave",() => {
          handleMouseLeaveEvent();
        },{passive: false});
        
        buttonShow.addEventListener("mouseleave",() => {
          handleMouseLeaveEvent();
        },{passive: false});
  
        buttonClass.addEventListener("mouseleave",() => {
          handleMouseLeaveEvent();
        },{passive: false});
  
        window.buttonsContainerDiv.addEventListener('mouseenter',()=>{
          handleMouseOverEvent();
        },{passive: false });
  
        window.buttonsContainerDiv.addEventListener("mouseleave",() => {
          handleMouseLeaveEvent();
        },{passive: false});
  
        window.buttonsContainerDiv.addEventListener("mouseover",() => {
          handleMouseOverEvent();
        },{passive: false});
        
        //BEGIN DRAG****///
        window.buttonsContainerDiv.addEventListener('mousedown', (e) => {
           dragMouseDown(e);
          // handleDrag(window.buttonsContainerDiv);
          // closeButtonContainer(buttonClose);
        });
        buttonDrag.addEventListener('mousedown', (e) => {
           dragMouseDown(e);
          // handleDrag(window.buttonsContainerDiv);
          // closeButtonContainer(buttonClose);
        });
        
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          window.buttonsContainerDiv.style.rigth = '';
          window.buttonsContainerDiv.style.top = (window.buttonsContainerDiv.offsetTop - pos2) + "px";
          window.buttonsContainerDiv.style.left = (window.buttonsContainerDiv.offsetLeft - pos1) + "px";
        }
  
        const handleMouseOverEvent = () =>{
          document.getElementById('buttonsContainer').style.background = 'rgba(240, 243, 250,0.8)';
          document.getElementById('buttonClose').style.display = 'block';
        };
        
        const handleMouseLeaveEvent = () =>{
          document.getElementById('buttonsContainer').style.background = 'rgb(240, 243, 250)';
          document.getElementById('buttonsContainer').style.boxShadow = 'none'
          document.getElementById('buttonClose').style.display = 'none';
        };
      
        function closeDragElement() {
          /* stop moving when mouse button is released:*/
          document.onmouseup = null;
          document.onmousemove = null;
        }
  
        //END DRAG ***/
        
        const br = document.createElement('br');
        const br0 = document.createElement('br');
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        
        addElementsToDiv(window.buttonsContainerDiv,buttonClose,br0, buttonCam, br, buttonShow, br1, buttonClass,br2,buttonDrag);
        setButtonCamBackground(buttonCam, window.citbActivated) 
        setButtonShowBackground(buttonShow, window.showActivated);
        setButtonClassBackground(buttonClass, window.classActivated);
        setButtonDragBackground(buttonDrag); 
        showDiv();
      } 
    }

    const showDiv = () => {
      if (document.getElementById('buttonsContainer'))
      document.getElementById('buttonsContainer').style.display = 'block';
    }
    
    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var currentMediaStream = new MediaStream();
    var currentCanvasMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultVideoId, defaultMode, defaultMicrophoneId,defaultAudioId;
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
    const fps = 1000/25
    const t = performance.now();
    requestAnimationFrame(drawCanvas)
    if (t - t1 >= fps) {
      canvasCITB.width = window.actualVideoTag.videoWidth;
      canvasCITB.height = window.actualVideoTag.videoHeight;
      canvasCITB.getContext('2d').drawImage(window.actualVideoTag, 0, 0, canvasCITB.width, canvasCITB.height);
      t1 = performance.now();

  const drawCanvas = () => {
    console.log("drawing canvas")
    canvasCITB.width = window.actualVideoTag.videoWidth;
    canvasCITB.height = window.actualVideoTag.videoHeight;
    canvasCITB.getContext('2d').drawImage(window.actualVideoTag, 0, 0, canvasCITB.width, canvasCITB.height);
    setTimeout(drawCanvas,35);
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
    console.log("video vide src", video, stream)
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