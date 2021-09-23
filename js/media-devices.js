function monkeyPatchMediaDevices() {

  const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;
  var origAddTrack = RTCPeerConnection.prototype.addTrack;
  var origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
  var currentMediaStream = new MediaStream();
  let defaultID;

  RTCPeerConnection.prototype.addTrack = async function (track, stream) {
    console.log("ADDING TRACK", track)
    console.log("ADDING STREAM", stream)
    if (window.peerConection == undefined)
      window.peerConection = this;
    window.currentMediaStream = stream;
    window.currentTrack = track;
    await origAddTrack.apply(this, arguments);
  }

  RTCRtpSender.prototype.replaceTrack = async function (track) {
    console.log("REPLACE TRACK");
    window.rtcsender = this;
    origReplaceTrack.apply(this, arguments);
  }

  RTCPeerConnection.onTrack = function (argument) {
    console.log("ontrack", arguments)
  }

  const checking = async function () {
    chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultVideoId: true }, async function (response) {
      if (response && response.farewell) {
        if (response.farewell != defaultID) {
          defaultID = response.farewell;
          await navigator.mediaDevices.getUserMedia({ video: { deviceId: 'virtual' }, audio: false });
          const camVideoTrack = currentMediaStream.getVideoTracks()[0];
          await window.peerConection.addTrack(camVideoTrack, currentMediaStream);
          window.senders = window.peerConection.getSenders();
          window.senders.filter(x => x.track.kind === 'video').forEach(mysender => {
            mysender.replaceTrack(window.currentTrack);
          })
        }
      }
    });
  }

  setInterval(checking, 5000);

  MediaDevices.prototype.enumerateDevices = async function () {
    const res = await enumerateDevicesFn.call(navigator.mediaDevices);
    res.push({
      deviceId: "virtual",
      groupID: "uh",
      kind: "videoinput",
      label: "Virtual Class In The Box",
    });
    console.log(res);
    chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { devicesList: res }, function (response) {
      if (response.farewell) {
        defaultID = response.farewell;
        console.log("WILL CHANGE USERMEDIA", defaultID)
      }
    });
    if (defaultID != undefined) {
      setMediaStreamTracks()
    }
    return res;
  };

  async function setMediaStreamTracks() {
    const constraints = {
      video: {
        deviceId: { exact: defaultID },
      },
      audio: false,
    };
    const media = await getUserMediaFn.call(
      navigator.mediaDevices,
      constraints
    );

    let actualTracks = currentMediaStream.getTracks()
    actualTracks.forEach(t => t.enabled = false)
    media.getTracks().forEach(mt => currentMediaStream.addTrack(mt))
    actualTracks.filter(t => t.enabled == false).forEach(dt => currentMediaStream.removeTrack(dt))

    console.log("RESULTING media", currentMediaStream)
    console.log("RESULTING tracks", currentMediaStream.getTracks())
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
        console.log(defaultID);
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

export { monkeyPatchMediaDevices }