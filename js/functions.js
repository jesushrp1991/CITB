import { enviroment } from "./enviroment.js";

const setMode = (mode) => {  
  chrome.runtime.sendMessage(
    enviroment.EXTENSIONID,
    { setDefaultMode: mode },
    async function (response1) {
      if (response1 && response1.farewell) {
      }
    }
  );
};

const setVideo = (videoId) => {
  chrome.runtime.sendMessage(enviroment.EXTENSIONID, {
    setDefaultVideoId: videoId,
  });
};

const setVideoT = (videoId) =>{
  document.getElementById('pVideoState').innerText = videoId;
}
const setModeT = (mode) =>{
  document.getElementById('pModeState').innerText(mode);
}

export { setMode, setVideo, setVideoT, setModeT };
