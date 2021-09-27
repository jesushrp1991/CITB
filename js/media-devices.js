import { 
  getButtonCam,
  getButtonClass,
  getButtonShow,
  setMode,
  setMicrophone,
  setVideo,
  getContainerButton,
  setButtonCamBackground,
  setButtonClassBackground,
  setButtonShowBackground,
  addElementsToDiv,
  createAudioElement,
  getVirtualCam
} from './domUtils.js';

function monkeyPatchMediaDevices() {
  if (window.location.host === 'meet.google.com') {
    const MYVIDEODDEVICELABEL = '2K HD Camera';
    const MYAUDIODEVICELABEL = 'CITB';
    const EXTENSIONID = 'bpdebpeagmcjmefelbfdkobnojlifbnp';
    
    document.onreadystatechange = (event) => {
  
      window.assignModes = () => {
        chrome.runtime.sendMessage(EXTENSIONID, { defaultMode: true }, async function (response) {
          if (response && response.farewell){
            window.activatedMode = response.farewell;
            window.showActivated = window.activatedMode === 'show';
            window.myAudio.muted = !window.showActivated;
            window.classActivated = window.activatedMode === 'class';
            setButtonShowBackground(buttonShow, window.showActivated);
            setButtonClassBackground(buttonClass, window.classActivated);
          }
        });
        if (defaultVideoId && defaultVideoLabel) {
          window.citbActivated = defaultVideoLabel.includes(MYVIDEODDEVICELABEL)
          setButtonCamBackground(buttonCam, window.citbActivated)
        } 
      }

      const setModeNone = () => {
        if (window.classActivated) {
          const citbMicrophone = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(MYAUDIODEVICELABEL)));
          if(citbMicrophone.length > 0){
            setMicrophone(citbMicrophone[0].deviceId);
          }else{
            alert('no se ha podido cambiar el microfono');
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
            alert('no se ha podido cambiar el microfono');
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
            alert('no se ha podido cambiar el microfono');
          }
        }else {
          const otherMicrophones = devices.filter(x => (x.kind === 'audioinput' && !x.label.includes(MYAUDIODEVICELABEL)));
          if (otherMicrophones.length > 0){
            setMicrophone(otherMicrophones[0].deviceId);
            setMode('class');
          }else{
            alert('no se ha podido cambiar el mic');
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
            alert('no se ha podido cambiar el video');
          }
        }else{
          const citbVideo = devices.filter(x => (x.kind === 'videoinput' && x.label.includes(MYVIDEODDEVICELABEL)));
          if(citbVideo.length > 0){
            setVideo(citbVideo[0].deviceId);
          }else{
            alert('no se ha podido cambiar el video');
          }
        }
      });

      const div = getContainerButton();
      const br = document.createElement('br');
      const br1 = document.createElement('br');
      addElementsToDiv(div, buttonCam, br, buttonShow, br1, buttonClass);

      createAudioElement();

      setModeNone();
    }

    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origAddTrack = RTCPeerConnection.prototype.addTrack;
    var origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
    var currentMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultVideoId, defaultMode, defaultVideoLabel, defaultMicrophoneId, defaultAudioId;
    let devices = [];

    RTCPeerConnection.prototype.addTrack = async function (track, stream) {
      if (window.peerConection == undefined) 
        window.peerConection = this;
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
            window.assignModes();

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

    const initAudioSRC = () => {
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
            window.assignModes();

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
          }
          window.assignModes();
        }
      });
    }

    const checkingAudioDevice = () => {
      chrome.runtime.sendMessage(EXTENSIONID, { defaultAudioId: true}, async function (response) {
        if (response && response.farewell) {
          defaultAudioId = response.farewell;
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

      var video = document.getElementsByTagName('video')[0]
      if (video != undefined) {
        video.srcObject = currentMediaStream
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