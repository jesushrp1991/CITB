import {
  MYVIDEODDEVICELABEL,
  MYAUDIODEVICELABEL,
  EXTENSIONID,
  MYMICROPHONEDEVICELABEL,
} from "./constants.js";

// const citbMicrophone = (devices) => {
//   return devices.filter(
//     (x) => x.kind === "audioinput" && x.label.includes(MYAUDIODEVICELABEL)
//   );
// };

const citbMicrophone = (devices, sortKind, includeString, compare) => {
  console.log("compare", compare);
  switch (compare) {
    case compare.iqual:
      return devices.filter(
        (x) => x.kind === sortKind && x.label.includes(includeString)
      );
    case compare.distinct:
      return devices.filter(
        (x) => x.kind === sortKind && !x.label.includes(includeString)
      );
  }
};

const setMicrophone = (microphone) => {
  chrome.runtime.sendMessage(
    EXTENSIONID,
    { setDefaultMicrophoneId: microphone },
    async function (response) {
      if (response && response.farewell) {
      }
    }
  );
};

const setVideo = (videoId) => {
  chrome.runtime.sendMessage(EXTENSIONID, { setDefaultVideoId: videoId }, async function (response) {
    if (response && response.farewell){
    }
  });
}

const setMode = (mode) => {
  chrome.runtime.sendMessage(
    EXTENSIONID,
    { setDefaultMode: mode },
    async function (response1) {
      console.log("setMode", response1);
      if (response1 && response1.farewell) {
      }
    }
  );
};

const closeButtonContainer = () => {
  document.getElementById("buttonsContainer").style.visibility = "hidden";
  chrome.runtime.sendMessage(
    EXTENSIONID,
    { buttonsOpen: true },
    async function (response) {
      if (response && response.farewell) {
        //console.log(response.farewell);
      }
    }
  );
};

const filterCITBDevices = (listToFilter) => {
  return listToFilter.filter(
    (x) =>
      x.label.includes(MYVIDEODDEVICELABEL) ||
      x.label.includes(MYMICROPHONEDEVICELABEL) ||
      x.label.includes(MYAUDIODEVICELABEL)
  );
};

const getListDiference = (listToFilter) => {
  return listToFilter.filter((x) =>
    devices.filter(
      (x) =>
        devices.findIndex(
          (y) =>
            x.deviceId === y.deviceId &&
            x.kind === y.kind &&
            x.label === y.label
        ) === -1
    )
  );
};

const getVirtualCam = () => {
  return {
    deviceId: "virtual",
    groupID: "uh",
    kind: "videoinput",
    label: "Virtual Class In The Box",
  }
}
const setModeNone = (classActivated) => {
  if (classActivated) {
    const citbMicrophone = devices.filter(
      (x) =>
        x.kind === "audioinput" && x.label.includes(MYAUDIODEVICELABEL)
    );
    if (citbMicrophone.length > 0) {
      setMicrophone(citbMicrophone[0].deviceId);
    } else {
      alert("Could not change Microphone");
    }
  }
  const citbVideo = devices.filter(
    (x) =>
      x.kind === "videoinput" && x.label.includes(MYVIDEODDEVICELABEL)
  );
  if (citbVideo.length > 0) {
    setVideo(citbVideo[0].deviceId);
  }
  setMode("none");
};

const compare = {
  iqual: "iqual",
  distinct: "distinct",
};

export {
  citbMicrophone,
  setMicrophone,
  setVideo,
  setMode,
  closeButtonContainer,
  compare,
  filterCITBDevices,
  getListDiference,
  getVirtualCam,
  setModeNone
};
