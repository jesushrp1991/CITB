import { startRecordScreen } from "./rec.js";
import { prepareDB } from "./database.js";
import { recIcon } from "./tools.js";
import { addRecQueueDB } from "./database.js";
import { reset } from "./recTimer.js";
import { uploadQueueDaemon,saveVideo } from './uploadManager.js';
import { createVideo } from "./backService.js";

const recUC = async () => {
  await prepareDB();
  window.meetStartTime = dayjs().format();
  startRecordScreen(window.idMic, window.idTab, window.recMode);
  window.isRecording = true;
  chrome.storage.sync.set({ isRecording: true }, () => {});
  recIcon();
  const idVideo = await createVideo(window.dbToken,window.fileName,window.meetStartTime);
  window.idVideoInBack = idVideo._id;
  window.currentRecordingId = await addRecQueueDB(
    "recording",
    window.fileName,
    window.meetStartTime,
    null,
    null,
    window.calendarId,
    null,
    idVideo._id
  );
};

const stopTracks = () => {
  window.desktopStream.getTracks().forEach((track) => track.stop());
  if (window.micStream != undefined) {
    window.micStream.getTracks().forEach((track) => track.stop());
  }
  if (window.videoDesktopStream != undefined) {
    window.videoDesktopStream.getTracks().forEach((track) => track.stop());
  }
  window.resultStream.getTracks().forEach((track) => track.stop());
};
const stopRecordScreen = () => {
  if (window.isRecording) {
    window.meetEndTime = dayjs().format();
    if (window.recorder) {
      window.recorder.stop();
      stopTracks();
    }
    reset();
    window.isRecording = false;
    chrome.storage.sync.set({ isRecording: false }, () => {});
    chrome.storage.sync.set({ isPaused: false }, () => {});
    setTimeout(() => {
      chrome.browserAction.setIcon({ path: "./assets/icon.png" });
    }, 3000);
    saveVideo();
    uploadQueueDaemon();
  }
};

export { recUC, stopRecordScreen };
