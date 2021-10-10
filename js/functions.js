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

export { setMode, setVideo };