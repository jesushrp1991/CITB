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
  if (window.location.host === 'meet.google.com') {
    const MYVIDEODDEVICELABEL = '2K HD Camera';
    const MYAUDIODEVICELABEL = 'CITB';
    const EXTENSIONID = 'bpdebpeagmcjmefelbfdkobnojlifbnp';
    
    document.onreadystatechange = (event) => {     
      console.log(document.readyState);   
      if (document.readyState == 'complete'){
        window.assignModes = () => {
          chrome.runtime.sendMessage(EXTENSIONID, { defaultMode: true }, async function (response) {
            if (response && response.farewell){
              window.activatedMode = response.farewell;
              window.showActivated = window.activatedMode === 'show';
              if (window.myAudio != undefined){
                window.myAudio.muted = !window.showActivated;
              }
              window.classActivated = window.activatedMode === 'class';
              setButtonShowBackground(buttonShow, window.showActivated);
              setButtonClassBackground(buttonClass, window.classActivated);
              setButtonCloseBackground(buttonClose);
              setButtonDragBackground(buttonDrag);
            }
          });
          if (defaultVideoId && defaultVideoLabel) {
            window.citbActivated = defaultVideoLabel.includes(MYVIDEODDEVICELABEL)
            setButtonCamBackground(buttonCam, window.citbActivated)
            setButtonCloseBackground(buttonClose);
            setButtonDragBackground(buttonDrag);
          }
        }
  
        const setModeNone = () => {
          if (window.classActivated) {
            const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(MYAUDIODEVICELABEL)));
            if(citbMicrophone.length > 0){
              setMicrophone(citbMicrophone[0].deviceId);
            }else{
              alert('Could not change Microphone');
            }
          }
          const citbVideo = devices.filter(x => (x.kind === 'videoinput' && x.label.includes(MYVIDEODDEVICELABEL)));
            if(citbVideo.length > 0){
              setVideo(citbVideo[0].deviceId);
            }
          setMode('none');
        }
  
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
          if (window.citbActivated){
            const otherVideos = devices.filter(x => (x.kind === 'videoinput' && x.deviceId != defaultVideoId));
            if (otherVideos.length > 0){
              setVideo(otherVideos[0].deviceId);
            }else{
              alert('Could not change Video');
            }
          }else{
            const citbVideo = devices.filter(x => (x.kind === 'videoinput' && x.label.includes(MYVIDEODDEVICELABEL)));
            if(citbVideo.length > 0){
              setVideo(citbVideo[0].deviceId);
            }else{
              alert('Could not change Video');
            }
          }
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
          document.getElementById('buttonsContainer').style.background = 'rgba(0, 0, 0, 0.05)';
          document.getElementById('buttonClose').style.display = 'block';
        };
        
        const handleMouseLeaveEvent = () =>{
          document.getElementById('buttonsContainer').style.background = 'transparent';
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
        
        createAudioElement();
  
        setModeNone();
      } 
    }

    const showDiv = () => {
      if (document.getElementById('buttonsContainer'))
      document.getElementById('buttonsContainer').style.display = 'block';
    }
    
    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origAddTrack = RTCPeerConnection.prototype.addTrack;
    var currentMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultVideoId, defaultMode, defaultVideoLabel, defaultMicrophoneId, defaultMicrophoneLabel, defaultAudioId;
    let devices = [];

    RTCPeerConnection.prototype.addTrack = async function (track, stream) {
      if (window.peerConection == undefined) {
        window.peerConection = this;
        showDiv()
      }        
      window.currentMediaStream = stream;
      window.currentTrack = track;
      await origAddTrack.apply(this, arguments);
    }

    const checkingVideo = async function () {
      chrome.runtime.sendMessage(EXTENSIONID, { defaultVideoId: true }, async function (response) {
        if (response && response.farewell && window.peerConection) {
          const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual");
          const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId);
          const currentTrackLabel = window.peerConection.getSenders().filter((s) => s.track.kind == 'video')[0].track.label;
          let run = false;

          if (defaultDevice.length > 0) {
            run = defaultDevice[0].label != currentTrackLabel
          }

          if (response.farewell != defaultVideoId || run) {
            defaultVideoId = response.farewell;
            defaultVideoLabel = devices.filter(x => x.deviceId === defaultVideoId)[0].label;
            if (window.assignModes){
              window.assignModes();
            }

            await navigator.mediaDevices.getUserMedia({ video: { deviceId: 'virtual' }, audio: false });
            const camVideoTrack = currentMediaStream.getVideoTracks()[0];
            window.senders = window.peerConection.getSenders();
            window.senders.filter(x => x.track.kind === 'video').forEach(mysender => {
              mysender.replaceTrack(camVideoTrack);
            })
          }
        }
      });
    }

    const initAudioSRC = async () => {
      if (currentAudioMediaStream.getAudioTracks().length == 0){
        currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: defaultMicrophoneId }, video: false });
        if (currentAudioMediaStream.getAudioTracks().length > 0){
          setAudioSrc()
        }
      }
    }

    const setAudioSrc = () => {
      if (window.myAudio){
        if (window.URL ){
          window.myAudio.srcObject = currentAudioMediaStream;
        } else {
          window.myAudio.src = currentAudioMediaStream;
        }
      }
    } 

    const checkingMicrophoneId = async function () {
      chrome.runtime.sendMessage(EXTENSIONID, { defaultMicrophoneId: true }, async function (response) {
        initAudioSRC();

        if (response && response.farewell && window.peerConection) {
          const audioDevices = devices.filter(d => d.kind == "audioinput" && d.deviceId != "virtual")
          const defaultDevice = audioDevices.filter(d => d.deviceId == defaultMicrophoneId || d.deviceId.exact == defaultMicrophoneId)
          const currentTrackLabel = window.peerConection.getSenders().filter((s) => s.track.kind == 'audio')[0].track.label;
          let run = false

          if (defaultDevice.length > 0) {
            run = defaultDevice[0].label != currentTrackLabel
          }

          if (response.farewell != defaultMicrophoneId || run) {
            console.log("INSIDE INSIDE", defaultDevice[0].label, currentTrackLabel)
            defaultMicrophoneId = response.farewell;
            defaultMicrophoneLabel = devices.filter(x => x.deviceId === defaultMicrophoneId)[0].label;
            if (window.assignModes) {
              window.assignModes();
            }

            currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: defaultMicrophoneId }, video: false });
            setAudioSrc()
            const micAudioTrack = currentAudioMediaStream.getAudioTracks()[0];
            window.senders = window.peerConection.getSenders();
            window.senders.filter(x => x.track.kind === 'audio').forEach(mysender => {
              mysender.replaceTrack(micAudioTrack);
            })
          }
        }
      });
    }

    const checkingMode = async function () {
      chrome.runtime.sendMessage(EXTENSIONID, { defaultMode: true }, async function (response) {
        if (response && response.farewell) {
          if (response.farewell != defaultMode) {
            defaultMode = response.farewell;
            if (window.assignModes)
            window.assignModes();
          }
        }
      });
    }

    const checkingAudioDevice = () => {
      chrome.runtime.sendMessage(EXTENSIONID, { defaultAudioId: true}, async function (response) {
        if (response && response.farewell) {
          defaultAudioId = response.farewell;
          if (window.myAudio)
          window.myAudio.setSinkId(defaultAudioId);
        }
      })
    }

    setInterval(checkingVideo, 3000);
    setInterval(checkingMode, 3000);
    setInterval(checkingMicrophoneId, 3000);
    setInterval(checkingAudioDevice, 3000);

    MediaDevices.prototype.enumerateDevices = async function () {
      const res = await enumerateDevicesFn.call(navigator.mediaDevices);
      devices = res;
      res.push(getVirtualCam());
      console.log(res);
      chrome.runtime.sendMessage(EXTENSIONID, { devicesList: res }, function (response) {
        if (response.farewell) {
          defaultVideoId = response.farewell;
          defaultVideoLabel = res.filter(x => x.deviceId === defaultVideoId)[0].label;
          console.log("WILL CHANGE USERMEDIA", defaultVideoId)
        }
      });
      if (defaultVideoId != undefined) {
        setMediaStreamTracks()
      }
      return res;
    };

    const setMediaStreamTracks = async () => {
      const constraints = {
        video: {
          deviceId: { exact: defaultVideoId },
        },
        audio: false,
      };

      const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual")
      const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId)
      const otherDevices = videoDevices.filter(d => d.deviceId != defaultVideoId && d.deviceId.exact != defaultVideoId)

      if (defaultDevice.length == 0) {
        let otherID = typeof otherDevices[0].deviceId == 'string' ? otherDevices[0].deviceId : otherDevices[0].deviceId.exact
        constraints.video.deviceId.exact = otherID
      }

      const media = await getUserMediaFn.call(
        navigator.mediaDevices,
        constraints
      );

      let actualTracks = currentMediaStream.getTracks()
      actualTracks.forEach(t => t.enabled = false)
      media.getTracks().forEach(mt => currentMediaStream.addTrack(mt))
      actualTracks.filter(t => t.enabled == false).forEach(dt => currentMediaStream.removeTrack(dt))

      currentMediaStream.getTracks().forEach(t => {
        t.applyConstraints();
        console.log(t.getSettings())
      });

      var video = document.getElementsByTagName('video')
      for (let i = 0; i < checkingVideo.length; i++){
        if (video[i].classList > 1) {
          video.srcObject = currentMediaStream;  
        }
      }
    }

    MediaDevices.prototype.getUserMedia = async function () {
      console.log("INSIDE MEDIA DEVICE GET USERMEDIA")
      const args = arguments;
      console.log(args[0]);
      if (args.length && args[0].video && args[0].video.deviceId) {
        if (
          args[0].video.deviceId === "virtual" ||
          args[0].video.deviceId.exact === "virtual"
        ) {
          await setMediaStreamTracks()
          return currentMediaStream;
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