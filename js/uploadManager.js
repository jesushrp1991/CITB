import { environment } from "../config/environment.js";
import {
  getAllRecordsDB,
  getLastElementQueueDB,
  saveLinktoDB,
  delFileInDB,
  listQueueDB,
  updateFileDB,
  updateUploadStatusDB
} from "./database.js";
import { updateVideo } from "./backService.js";
import { addEventToGoogleCalendar,getLinkFileDrive, searchDefaultFolder } from './gapiManager.js';


/*
 *   Upload to Drive
 *
 */

window.uploadValue = -1;
window.fileName = "CITB Rec";

const prepareRecordFile = (finalArray) => {
  var blob = new Blob(finalArray, {
    type: "video/webm",
  });
  window.fileName = window.fileName + " " + Date() + ".webm";
  var file = new File([blob], window.fileName);
  return file;
};

const download = (test, fileName) => {
  let finalName;
  fileName ? (fileName = fileName) : (finalName = window.fileName);
  var blob = new Blob(test, {
    type: "video/webm",
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = finalName + Date() + ".webm";
  a.click();
  window.URL.revokeObjectURL(url);
};

const afterUploadSuccessActions = async () => {
  let linkDrive = await getLinkFileDrive();
  saveLinktoDB(window.fileIDUploadInProgress, linkDrive);
  delFileInDB(window.fileIDUploadInProgress);
  updateUploadStatusDB(window.fileIDUploadInProgress,"COMPLETE");
  if (window.calendarId) {
    addEventToGoogleCalendar(linkDrive);
  }
  const starTime = dayjs(window.meetStartTime);
  const endTime = dayjs(window.meetEndTime);
  const videoDuration = endTime.diff(starTime);
  updateVideo(window.dbToken,videoDuration,linkDrive,window.idVideoInBack);
  window.uploadValue = -1;
  saveUploadProgress(-1);
  uploadQueueDaemon();
};

const startResumableUpload = async (file) => {
  console.log("Start resumable Upload");
  if (
    window.accessToken == null ||
    window.accessToken == undefined ||
    window.accessToken == ""
  ) {
    window.uploadValue = -1;
    return;
  }
  window.processingVideo = true;
  if(window.defautCITBFolderID == undefined){
    // verificateAuth();
    await searchDefaultFolder();
  }
  const options = {
    accessToken: accessToken,
    fileName: window.fileName,
    mimeType: "video/webm",
    parentFolderId: window.defautCITBFolderID || "root",
  };
  let resumableUpload = new ResumableUpload2(file, options, file.size);
  await resumableUpload.initializeRequest();
  await resumableUpload.start((result) => {
    window.uploadValue = result.status;
    saveUploadProgress(window.uploadValue);
    if (result.status >= 100) {
      afterUploadSuccessActions();
    }
  });
  window.processingVideo = false;
};

const saveVideo = async (localDownload) => {
  console.log("SAVE VIDEO");
  let videoArrayChunks = await getAllRecordsDB();
  let finalArray = [];
  console.time("createArray");
  for (let index = 0; index < videoArrayChunks.length; index++) {
    const element = videoArrayChunks[index];
    finalArray.push(element.record[0]);    
  }
  console.timeEnd("createArray");
  if (environment.upLoadToDrive && !localDownload) {
    console.time;
    let file = prepareRecordFile(finalArray);
    console.timeEnd;
    window.meetEndTime = dayjs().format();
    updateFileDB(window.currentRecordingId, file, window.meetEndTime);
    uploadQueueDaemon();
  } else {
    if (finalArray.length != 0) {
      download(finalArray);
    }
  }
};

const saveUploadProgress = (value) => {
  chrome.storage.sync.set({ uploadPercent: value }, () => {});
};

window.fileIDUploadInProgress = -1;


const uploadQueueDaemon = async () => {
  let lastElement = await getLastElementQueueDB();
  if (lastElement == undefined || window.processingVideo) {
    console.log("last element undefined or is uploading video");
    return;
  }
  if (lastElement.file == "recording" && window.isRecording == false) {
    console.log("Recording false,save video");
    window.currentRecordingId = lastElement.id;
    window.fileName = lastElement.name;
    window.meetStartTime = lastElement.dateStart;
    window.calendarId = lastElement.calendarId;
    let videoArrayChunks = await getAllRecordsDB();
    window.dateEnd = dayjs()
      .subtract(videoArrayChunks.length * 100, "ms")
      .format();
    saveVideo(false);
  }
  if (typeof lastElement.file === "object" && lastElement.isUploadComplete != "COMPLETE") {
    window.fileIDUploadInProgress = lastElement.id;
    window.fileName = lastElement.name;
    window.starTimeUpload = lastElement.dateStart;
    window.calendarId = lastElement.calendarId;
    startResumableUpload(lastElement.file);
  }
};

const listUploadQueue = async () => {
  let list = await listQueueDB();
  let listResult = [];
  if (list != undefined) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      let upload;
      if (element.file && element.file == "folder") {
        upload = "folder";
      } else if (element.id === window.fileIDUploadInProgress) {
        upload = "inProgress";
      } else if (element.file == "uploaded") {
        upload = "uploaded";
      } else {
        upload = "awaiting";
      }
      window.startTimeCurrentFile = element.dateStart;
      window.endTimeCurrentFile = element.dateEnd;
      let details = {
        id: element.id,
        name: element.name,
        dateStart: element.dateStart,
        dateEnd: element.dateEnd,
        driveLink: element.driveLink,
        upload: upload,
        msDuration: element.msDuration,
      };
      listResult.push(details);
    }
  }
  return listResult;
};

export {
  saveVideo,
  listUploadQueue,
  uploadQueueDaemon
};
