
function monkeyPatchMediaDevices() {
  let defaultID;

  const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;
  var currentMediaStream = new MediaStream()

  MediaDevices.prototype.enumerateDevices = async function () {
    const res = await enumerateDevicesFn.call(navigator.mediaDevices);
    // We could add "Virtual VHS" or "Virtual Median Filter" and map devices with filters.
    res.push({
      deviceId: "virtual",
      groupID: "uh",
      kind: "videoinput",
      label: "Virtual Class In The Box",
    });
    console.log(res);
    chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { devicesList: res }, function (response) {
      console.log("RESPONSE RESPONSE", response)
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
    console.log(constraints);
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

    console.log(document.getElementsByTagName('video'))
    var video = document.getElementsByTagName('video')[0]
    if (video != undefined) {
      video.srcObject = currentMediaStream
      console.log(video);
      console.log(video.srcObject)
    }
    console.log(document.getElementsByTagName('video')[0])

    console.log(document.getElementsByClassName('p2hjYe TPpRNe'));
    var divContainer = document.getElementsByClassName('p2hjYe TPpRNe')[0];
    console.log(divContainer);

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
        // Get current MediaStream
        setMediaStreamTracks()
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
  console.log('ClassInTheBoxExtensionInstalled')
}

export { monkeyPatchMediaDevices }