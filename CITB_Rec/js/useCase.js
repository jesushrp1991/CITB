import { startRecordScreen } from "./rec.js";
import { prepareDB } from "./database.js";
import { recIcon } from "./tools.js";
import { addRecQueueDB } from "./database.js";

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

export { recUC };
