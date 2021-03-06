import {
  MYVIDEODDEVICELABEL,
  MYAUDIODEVICELABEL,
  EXTENSIONID,
  MYMICROPHONEDEVICELABEL,
} from "./constants.js";
import { getVirtualCam, setModeNone } from "./functions.js";
import {
  getButtonCam,
  getButtonClose,
  getButtonClass,
  getButtonShow,
  getContainerButton,
  addElementsToDiv,
  getButtonDrag,
  setButtonBackground,
  createAudioElement,
  showDiv,
} from "./domUtils.js";
import {
  setCloseEvent,
  setbuttonShowClickEvent,
  setbuttonClassClickEvent,
  setButtonCamClickEvent,
  mouseDragEvents,
} from "./events.js";

function monkeyPatchMediaDevices() {
  document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
      window.assignModes = () => {
        try {
          chrome.runtime.sendMessage(
            EXTENSIONID,
            { defaultMode: true },
            async function (response) {
              if (response && response.farewell) {
                window.activatedMode = response.farewell;
                window.showActivated = window.activatedMode === "show";
                if (window.myAudio != undefined) {
                  window.myAudio.muted = !window.showActivated;
                }
                window.classActivated = window.activatedMode === "class";
                setButtonBackground(buttonShow, window.showActivated);
                setButtonBackground(buttonClass, window.classActivated);
              }
            }
          );
          if (defaultVideoId && defaultVideoLabel) {
            window.citbActivated =
              defaultVideoLabel.includes(MYVIDEODDEVICELABEL);
            setButtonBackground(buttonCam, window.citbActivated);
          }
        } catch (error) {
          console.log(error);
          window.activatedMode = "none";
          window.showActivated = false;
          window.myAudio.muted = true;
          window.classActivated = false;
          setButtonBackground(buttonShow, window.showActivated);
          setButtonBackground(buttonClass, window.classActivated);
          window.citbActivated = false;
          setButtonBackground(buttonCam, window.citbActivated);
        }
      };
    }
    //Creating the web container
    const buttonCam = getButtonCam();
    const buttonClass = getButtonClass();
    const buttonShow = getButtonShow();
    const buttonClose = getButtonClose();
    const buttonDrag = getButtonDrag();
    window.buttonsContainerDiv = getContainerButton();

    setbuttonClassClickEvent(buttonClass, devices);
    setbuttonShowClickEvent(buttonShow, devices);
    setCloseEvent(buttonClose);
    setButtonCamClickEvent(buttonCam, devices,defaultVideoId);
    mouseDragEvents(
      buttonClose,
      buttonCam,
      buttonShow,
      buttonClass,
      window.buttonsContainerDiv,
      buttonDrag
    );

    const br = document.createElement("br");
    const br0 = document.createElement("br");
    const br1 = document.createElement("br");
    const br2 = document.createElement("br");

    addElementsToDiv(
      window.buttonsContainerDiv,
      buttonClose,
      br0,
      buttonCam,
      br,
      buttonShow,
      br1,
      buttonClass,
      br2,
      buttonDrag
    );
    createAudioElement();
    setModeNone(devices, window.classActivated);
  };
}

const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
const getUserMediaFn = MediaDevices.prototype.getUserMedia;
var origAddTrack = RTCPeerConnection.prototype.addTrack;
var origcreateDataChannel = RTCPeerConnection.prototype.createDataChannel;
var currentMediaStream = new MediaStream();
var currentAudioMediaStream = new MediaStream();
let defaultVideoId,
  defaultMode,
  defaultVideoLabel,
  defaultMicrophoneId,
  defaultMicrophoneLabel,
  defaultAudioId;
let devices = [];

RTCPeerConnection.prototype.createDataChannel = async function (
  label,
  options
) {
  window.peerConection = this;
  window.peerConection.addEventListener(
    "track",
    (e) => {
      if (
        document.body.innerText.includes("Turn off microphone") &&
        window.peerConection == undefined
      ) {
        console.log("INSIDE IF");
        window.peerConection = window.peerConection;
        showDiv();
      }
      console.log("TRACK ADDED");
      console.log(e);
      if (e.streams.length >= 1) {
        window.currentMediaStream = e.streams[0];
      }
      window.currentTrack = e.track;
    },
    false
  );
  console.log("create data channel", label, options);
  await origcreateDataChannel.apply(this, arguments);
};
// RTCPeerConnection.prototype.addTrack = async function (track, stream) {
//   console.log("ADDTRACK")
//   if (window.peerConection == undefined) {
//     window.peerConection = this;
//     showDiv();
//   }
//   window.currentMediaStream = stream;
//   window.currentTrack = track;
//   await origAddTrack.apply(this, arguments);
// }

const checkingVideo = async function () { 
   showDiv();
  chrome.runtime.sendMessage(EXTENSIONID, { defaultVideoId: true }, async function (response) { 
    if (response && response.farewell && window.peerConection) { 
      let videoDevices =  devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual"); 
      // console.log(videoDevices); 
      const defaultDevice =  videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId); 
      const currentTrackLabel = await window.peerConection.getSenders().filter((s) => s.track.kind == 'video')[0].track.label; 
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
// const checkingVideo = async function () {
//   showDiv();
//   if (window.peerConection) {
//     try {
//       chrome.runtime.sendMessage(
//         EXTENSIONID,
//         { defaultVideoId: true },
//         async function (response) {
//           try {
//             if (response && response.farewell) {
//               const videoDevices = devices.filter(
//                 (d) => d.kind == "videoinput" && d.deviceId != "virtual"
//               );
//               const defaultDevice = videoDevices.filter(
//                 (d) =>
//                   d.deviceId == defaultVideoId ||
//                   d.deviceId.exact == defaultVideoId
//               );
//               const peerConectionSenderVideoTracks = window.peerConection
//                 .getSenders()
//                 .filter((s) => s.track.kind == "video");
//               if (peerConectionSenderVideoTracks.length > 0) {
//                 const currentTrackLabel =
//                   peerConectionSenderVideoTracks[0].track.label;
//                 let run = false;

//                 if (defaultDevice.length > 0) {
//                   run = defaultDevice[0].label != currentTrackLabel;
//                 }

//                 if (response.farewell != defaultVideoId || run) {
//                   defaultVideoId = response.farewell;
//                   const newDefaultVideoDevice = videoDevices.filter(
//                     (x) => x.deviceId === defaultVideoId
//                   );
//                   if (newDefaultVideoDevice.length > 0) {
//                     defaultVideoLabel = [0].label;
//                   } else {
//                     throw `The devices list does not have any device matching defaultVideoId: ${defaultAudioId}`;
//                   }

//                   if (window.assignModes) {
//                     window.assignModes();
//                   } else {
//                     throw "The assign modes function is undefined";
//                   }

//                   await navigator.mediaDevices.getUserMedia({
//                     video: { deviceId: "virtual" },
//                     audio: false,
//                   });
//                   const currentMediaStreamTracks =
//                     currentMediaStream.getVideoTracks();
//                   if (currentMediaStreamTracks.length > 0) {
//                     const camVideoTrack = currentMediaStreamTracks[0];
//                     if (camVideoTrack.enabled && !camVideoTrack.muted) {
//                       window.senders = window.peerConection.getSenders();
//                       window.senders
//                         .filter((x) => x.track.kind === "video")
//                         .forEach((mysender) => {
//                           mysender.replaceTrack(camVideoTrack);
//                         });
//                     } else {
//                       throw "The current video track is disabled or muted and could not be settled";
//                     }
//                   } else {
//                     throw "The current MediaStream does not have any video track";
//                   }
//                 }
//               } else {
//                 throw "The PeerConection does not have video tracks";
//               }
//             } else {
//               throw "could not get response from Service Worker";
//             }
//           } catch (error) {
//             // console.log(error);
//           }
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };

const initAudioSRC = async () => {
  if (currentAudioMediaStream.getAudioTracks().length == 0) {
    currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: defaultMicrophoneId },
      video: false,
    });
    if (currentAudioMediaStream.getAudioTracks().length > 0) {
      setAudioSrc();
    }
  }
};

const setAudioSrc = () => {
  if (window.myAudio) {
    if (window.URL) {
      window.myAudio.srcObject = currentAudioMediaStream;
    } else {
      window.myAudio.src = currentAudioMediaStream;
    }
  }
};

const checkingMicrophoneId = async function () {
  try {
    chrome.runtime.sendMessage(
      EXTENSIONID,
      { defaultMicrophoneId: true },
      async function (response) {
        try {
          initAudioSRC();

          if (response && response.farewell && window.peerConection) {
            const audioDevices = devices.filter(
              (d) => d.kind == "audioinput" && d.deviceId != "virtual"
            );
            const defaultDevice = audioDevices.filter(
              (d) =>
                d.deviceId == defaultMicrophoneId ||
                d.deviceId.exact == defaultMicrophoneId
            );
            const currentMediaStreamTracks = window.peerConection
              .getSenders()
              .filter((s) => s.track.kind == "audio");
            if (currentMediaStreamTracks) {
              const currentTrackLabel = currentMediaStreamTracks[0].track.label;
              let run = false;

              if (defaultDevice.length > 0) {
                run = defaultDevice[0].label != currentTrackLabel;
              }

              if (response.farewell != defaultMicrophoneId || run) {
                //console.log("INSIDE INSIDE", defaultDevice[0].label, currentTrackLabel)
                defaultMicrophoneId = response.farewell;
                const newDefaultAudioDevice = devices.filter(
                  (x) => x.deviceId === defaultMicrophoneId
                );
                if (newDefaultAudioDevice.length > 0) {
                  defaultMicrophoneLabel = newDefaultAudioDevice[0].label;
                } else {
                  throw `The devices list does not have any device matching defaultVideoId: ${defaultAudioId}`;
                }

                if (window.assignModes) {
                  window.assignModes();
                } else {
                  throw "The assign modes function is undefined";
                }

                currentAudioMediaStream =
                  await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: defaultMicrophoneId },
                    video: false,
                  });
                setAudioSrc();
                const currentAudioMediaStreamTracs =
                  currentAudioMediaStream.getAudioTracks();
                if (currentAudioMediaStreamTracs.length > 0) {
                  const micAudioTrack = currentAudioMediaStreamTracs[0];
                  if (micAudioTrack.enabled && !micAudioTrack.muted) {
                    window.senders = window.peerConection.getSenders();
                    window.senders
                      .filter((x) => x.track.kind === "audio")
                      .forEach((mysender) => {
                        mysender.replaceTrack(micAudioTrack);
                      });
                  } else {
                    throw "The current audio track is disabled or muted and could not be settled";
                  }
                } else {
                  throw "The current MediaStream does not have any audio track";
                }
              }
            } else {
              throw "The PeerConection does not have audio tracks";
            }
          } else {
            throw "could not get response from Service Worker";
          }
        } catch (error) {
          // console.log(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const checkingMode = async function () {
  try {
    window.assignModes();
  } catch (error) {
    console.log(error);
  }
};

const checkingAudioDevice = () => {
  try {
    chrome.runtime.sendMessage(
      EXTENSIONID,
      { defaultAudioId: true },
      async function (response) {
        if (response && response.farewell) {
          defaultAudioId = response.farewell;
          if (window.myAudio) window.myAudio.setSinkId(defaultAudioId);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

setInterval(checkingVideo, 1000);
setInterval(checkingMode, 1000);
setInterval(checkingMicrophoneId, 1000);
setInterval(checkingAudioDevice, 1000);

MediaDevices.prototype.enumerateDevices = async function () {
  const res = await enumerateDevicesFn.call(navigator.mediaDevices);
  devices = res;
  res.push(getVirtualCam());
  // //console.log(res);
  chrome.runtime.sendMessage(
    EXTENSIONID,
    { devicesList: res },
    function (response) {
      if (response.farewell) {
        defaultVideoId = response.farewell;
        defaultVideoLabel = res.filter((x) => x.deviceId === defaultVideoId)[0]
          .label;
        //console.log("WILL CHANGE USERMEDIA", defaultVideoId)
      }
    }
  );
  if (defaultVideoId != undefined) {
    setMediaStreamTracks();
  }
  return res;
};

const setMediaStreamTracks = async () => {
  try {
    const constraints = {
      video: {
        deviceId: { exact: defaultVideoId },
      },
      audio: false,
    };
    const videoDevices = devices.filter(
      (d) => d.kind == "videoinput" && d.deviceId != "virtual"
    );
    const defaultDevice = videoDevices.filter(
      (d) => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId
    );
    const otherDevices = videoDevices.filter(
      (d) => d.deviceId != defaultVideoId && d.deviceId.exact != defaultVideoId
    );

    if (defaultDevice.length == 0) {
      let otherID =
        typeof otherDevices[0].deviceId == "string"
          ? otherDevices[0].deviceId
          : otherDevices[0].deviceId.exact;
      constraints.video.deviceId.exact = otherID;
    }

    const media = await getUserMediaFn.call(
      navigator.mediaDevices,
      constraints
    );

    let actualTracks = currentMediaStream.getTracks();
    actualTracks.forEach((t) => (t.enabled = false));
    media.getTracks().forEach((mt) => currentMediaStream.addTrack(mt));
    actualTracks
      .filter((t) => t.enabled == false)
      .forEach((dt) => currentMediaStream.removeTrack(dt));

    currentMediaStream.getTracks().forEach((t) => {
      t.applyConstraints();
      //console.log(t.getSettings())
    });

    var video = document.getElementsByTagName("video");
    for (let i = 0; i < video.length; i++) {
      if (video[i].classList.length > 1) {
        video[i].srcObject = currentMediaStream;
      }
    }
  } catch (e) {
    setTimeout(setMediaStreamTracks, 1500);
  }
};

MediaDevices.prototype.getUserMedia = async function () {
  //console.log("INSIDE MEDIA DEVICE GET USERMEDIA")
  const args = arguments;
  //console.log(args[0]);
  if (args.length && args[0].video && args[0].video.deviceId) {
    if (
      args[0].video.deviceId === "virtual" ||
      args[0].video.deviceId.exact === "virtual"
    ) {
      await setMediaStreamTracks();
      return;
    } else {
      const res = await getUserMediaFn.call(
        navigator.mediaDevices,
        ...arguments
      );
      currentMediaStream = res;
      return res;
    }
  }
  const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
  return res;
};

export { monkeyPatchMediaDevices };
