import { startRecordScreen } from "./rec.js";
import { prepareDB } from "./database.js";
import { recIcon } from "./tools.js";
import { addRecQueueDB } from "./database.js";
import { reset } from "./recTimer.js";
import { saveVideo, uploadQueueDaemon } from './fileManager.js'; 

const recUC = async () => {
  await prepareDB();
  window.meetStartTime = dayjs().format();
  startRecordScreen(window.idMic, window.idTab, window.recMode);
  window.isRecording = true;
  chrome.storage.sync.set({ isRecording: true }, () => {});
  recIcon();
  window.currentRecordingId = await addRecQueueDB(
    "recording",
    window.fileName,
    window.meetStartTime,
    null,
    null,
    window.calendarId
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
