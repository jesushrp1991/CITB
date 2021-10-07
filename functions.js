  const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;
  // var origAddTrack = RTCPeerConnection.prototype.addTrack;
  var currentMediaStream = new MediaStream();
  var currentAudioMediaStream = new MediaStream();
  let defaultMode, defaultVideoLabel, defaultMicrophoneId, defaultMicrophoneLabel, defaultAudioId;
  let defaultVideoId = '31f3d6d2bc193caad69bae5f6c0911a4ed8e031e12d673be4fded1fd20346047';
  let devices = [];
  const id = 'pgloinlccpmhpgbnccfecikdjgdhneof';
  
  // RTCPeerConnection.prototype.addTrack = async function (track, stream) {
  //   console.log("prototype.addTrack");
  //   if (window.peerConection == undefined) {
  //     window.peerConection = this;
  //     showDiv()
  //   }        
  //   window.currentMediaStream = stream;
  //   window.currentTrack = track;
  //   await origAddTrack.apply(this, arguments);
  // }
  
  const getVirtualCam = () => {
    return {
      deviceId: "virtual",
      groupID: "uh",
      kind: "videoinput",
      label: "Virtual Class In The Box",
    }
  }

  MediaDevices.prototype.enumerateDevices = async function () {
    const res = await enumerateDevicesFn.call(navigator.mediaDevices);
    devices = res;
    res.push(getVirtualCam());
    console.log(res);
    // chrome.runtime.sendMessage({ devicesList: "res" }, function (response) {
    //   console.log("Response enumerate",response.result);
    //   if (response.defaultVideoId) {
    //     defaultVideoId = response.defaultVideoId;
    //     defaultVideoLabel = res.filter(x => x.deviceId === defaultVideoId).length > 0 ? res.filter(x => x.deviceId === defaultVideoId)[0].label : '';
    //     console.log("WILL CHANGE USERMEDIA", defaultVideoId);
    //     console.log("WILL CHANGE USERMEDIA", defaultVideoLabel);
    //   }
    // });
    // defaultVideoId = response.defaultVideoId;
    defaultVideoLabel = res.filter(x => x.deviceId === defaultVideoId).length > 0 ? res.filter(x => x.deviceId === defaultVideoId)[0].label : '';
    console.log("WILL CHANGE USERMEDIA", defaultVideoId);
    console.log("WILL CHANGE USERMEDIA", defaultVideoLabel);
    if (defaultVideoId != undefined) {
      setMediaStreamTracks()
    }
    return res;
  };

  const setMediaStreamTracks = async () => {
    try{
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

      let actualTracks = currentMediaStream.getTracks();
      actualTracks.forEach(t => t.enabled = false)
      media.getTracks().forEach(mt => currentMediaStream.addTrack(mt));
      actualTracks.filter(t => t.enabled == false).forEach(dt => currentMediaStream.removeTrack(dt));

      currentMediaStream.getTracks().forEach(t => {
        t.applyConstraints();
        //console.log(t.getSettings())
      });

      var video = document.getElementsByTagName('video')
      for (let i = 0; i < video.length; i++){
        if (video[i].classList.length > 1) {
          video[i].srcObject = currentMediaStream;  
        }
      }
    }
    catch(e)
    {
      // setTimeout(setMediaStreamTracks,1500);
    }
  }

  MediaDevices.prototype.getUserMedia = async function () {
    console.log("prototype USERMEDIA")
    const args = arguments;
    //console.log(args[0]);
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
  
 

  const checkingVideo = async function () {
      console.log("AUN NO HA LLEGADO AQUI",window);
    // chrome.runtime.sendMessage(EXTENSIONID, { defaultVideoId: true }, async function (response) {
    //   if (response && response.farewell && window.peerConection) {
        let videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual");
        // console.log(videoDevices);
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
          console.log("LLAMADA a user media en checking video");
          await navigator.mediaDevices.getUserMedia({ video: { deviceId: 'virtual' }, audio: false });
          const camVideoTrack = currentMediaStream.getVideoTracks()[0];
          window.senders = window.peerConection.getSenders();
          window.senders.filter(x => x.track.kind === 'video').forEach(mysender => {
            mysender.replaceTrack(camVideoTrack);
          })
        }
    //   }
    // });
  }


















// --------THIS IS WORKING NOT TOUCH-----------------------//
// var videoElement = document.getElementsByClassName('Gv1mTb-aTv5jf Gv1mTb-PVLJEc');
//Fujitsu
var videoSource = '31f3d6d2bc193caad69bae5f6c0911a4ed8e031e12d673be4fded1fd20346047';

const constraints = window.constraints = {
  audio: false,
  video:  {deviceId: videoSource}
};

async function init() {
  try {
    // console.log(window);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const asd = await navigator.mediaDevices.enumerateDevices(constraints);
    handleSuccess(stream);
    // e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}

function handleSuccess(stream) {
  // console.log("stream",stream);
  const video = document.querySelector('video');
  // console.log("video",video);
  const videoTracks = stream.getVideoTracks();
  // console.log("videoTrancks",videoTracks);

  // console.log('Got stream with constraints:', constraints);
  // console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}