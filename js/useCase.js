import { startRecordScreen } from "./rec.js";
import { prepareDB } from "./database.js";
import { recIcon } from "./tools.js";
import { addRecQueueDB } from "./database.js";
import { reset } from "./recTimer.js";
import { uploadQueueDaemon, saveVideo } from "./uploadManager.js";
import { createVideo } from "./backService.js";
import { stopTracks, openRecList } from "./tools.js";
import { delLastItem } from "./database.js";
import { addMark, addTag, tagEndTime } from "./backService.js";
import { 
  startTimerCount 
 ,stopTimerCount 
} from './recTimer.js'

const recCommandStart = async (message) => {
  if (!window.isRecording && !message.isVoiceCommandStop) {
    window.idMic = message.idMic;
    window.idTab = message.idTab;
    window.recMode = message.recMode;
    chrome.tabs.create({
      url: chrome.extension.getURL("./html/initialOptions.html"),
    });
  } else {
    clearInterval(window.iconRecChange);
    if (message.isVoiceCommandStop) {
      delLastItem(3);
    }
    if (window.showRecords) {
      openRecList();
    }
    await stopRecordScreen();
  }
};

const recUC = async () => {
  await prepareDB();
  startRecordScreen(window.idMic, window.idTab, window.recMode);
};

const afterInitActions = async() => {
  console.log("INICIOO!!!!",new Date().getTime());
  window.isRecording = true;
  chrome.storage.sync.set({ isRecording: true }, () => {});
  recIcon();
  console.log(
    "GUARDANDO STARTIME EN BD",
    window.fileName,
    window.meetStartTime
  );
  const idVideo = await createVideo(
    window.dbToken,
    window.fileName,
    window.meetStartTime
  );
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

const stopRecordScreen = () => {
  if (window.isRecording) {
    if (window.recorder) {

      window.meetEndTime = dayjs().format();
      window.recorder.stop();
      stopTracks();
      reset();
      window.currentRecordingTime=0;
      window.totalPauseTime = 0;
      window.initialRecordTimeInMS = 0;
    }
    // reset();
    window.isRecording = false;
    chrome.storage.sync.set({ isRecording: false }, () => {});
    chrome.storage.sync.set({ isPaused: false }, () => {});
    chrome.storage.sync.set({totalPauseTime: 0}, () => {});
    setTimeout(() => {
      chrome.browserAction.setIcon({ path: "./assets/icon.png" });
    }, 3000);
    saveVideo();
    uploadQueueDaemon();
  }
};

let isFirstTag = undefined;
let idTag;
const getPinTagTime = () => {
  let currentTime = new Date().getTime();
  let timeInMS = currentTime - window.initialRecordTimeInMS - window.totalPauseTime
  return Math.trunc(timeInMS/1000) ;
}
const addTagUC = async () => {
  if (window.isRecording) {
    if (isFirstTag == undefined || isFirstTag == true) {
      isFirstTag = false;
      const timeOpenFirstTag = getPinTagTime();
      idTag = await addTag(window.dbToken, window.idVideoInBack, timeOpenFirstTag);
      chrome.storage.local.set({isTagActive: true}, () => {});

    } else {
      isFirstTag = true;
      const endTime = getPinTagTime();
      tagEndTime(window.dbToken, window.idVideoInBack, idTag._id, endTime);
      chrome.storage.local.set({isTagActive: false}, () => {});
    }
  }
};

const addMarkUC = () => {
  if (window.isRecording) {
    let time = getPinTagTime();
    console.log("TIMERRR",time)
    addMark(window.dbToken, window.idVideoInBack, time);
  }
};

export {
  recUC,
  stopRecordScreen,
  recCommandStart,
  addTagUC,
  addMarkUC,
  afterInitActions,
};
