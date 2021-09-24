function monkeyPatchMediaDevices() {
  if (window.location.host === 'meet.google.com') {

    const button = document.createElement('button');
    const div = document.createElement('div');
    div.appendChild(button);
    window.document.body.appendChild(div);

    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origAddTrack = RTCPeerConnection.prototype.addTrack;
    var origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
    var currentMediaStream = new MediaStream();
    let defaultID, defaultMode;
    window.voice1 = new Pizzicato.Sound({ source: 'input' });
    window.voice2 = new Pizzicato.Sound({
      source: 'wave',
      options: {
        frequency: 440
      }
    });

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

    const checkingVideo = async function () {
      chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultVideoId: true }, async function (response) {
        if (response && response.farewell && window.peerConection) {
          const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual")
          const defaultDevice = videoDevices.filter(d => d.deviceId == defaultID || d.deviceId.exact == defaultID)
          const otherDevices = videoDevices.filter(d => d.deviceId != defaultID && d.deviceId.exact != defaultID)
          const currentTrackLabel = window.peerConection.getSenders().filter((s) => s.track.kind == 'video')[0].track.label
          let run = false
          if (defaultDevice.length > 0) {
            run = defaultDevice[0].label != currentTrackLabel
          }
          console.log("OUTSIDE OUTSIDE", defaultDevice[0].label, currentTrackLabel)

          if (response.farewell != defaultID || run) {
            console.log("INSIDE INSIDE", defaultDevice[0].label, currentTrackLabel)
            defaultID = response.farewell;
            await navigator.mediaDevices.getUserMedia({ video: { deviceId: 'virtual' }, audio: false });
            const camVideoTrack = currentMediaStream.getVideoTracks()[0];
            // await window.peerConection.addTrack(camVideoTrack, currentMediaStream);
            window.senders = window.peerConection.getSenders();
            window.senders.filter(x => x.track.kind === 'video').forEach(mysender => {
              mysender.replaceTrack(camVideoTrack);
            })
          }
        }
      });
    }

    const checkingMode = async function () {
      chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultMode: true }, async function (response) {
        if (response && response.farewell) {
          if (response.farewell != defaultMode) {
            defaultMode = response.farewell;
            if (defaultMode === 'show') {
              window.voice1.play();
              window.voice2.play();
              window.voice2.stop();
            } else {
              window.voice1.stop();
              window.voice2.stop();
            }
          }
        }
      });
    }

    setInterval(checkingVideo, 5000);
    setInterval(checkingMode, 4000);
    let devices = []
    MediaDevices.prototype.enumerateDevices = async function () {
      const res = await enumerateDevicesFn.call(navigator.mediaDevices);
      devices = res;
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

      const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual")
      const defaultDevice = videoDevices.filter(d => d.deviceId == defaultID || d.deviceId.exact == defaultID)
      const otherDevices = videoDevices.filter(d => d.deviceId != defaultID && d.deviceId.exact != defaultID)

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
}

export { monkeyPatchMediaDevices }