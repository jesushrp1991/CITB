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

const moveDriveFileToFolder = async (destFolderId, originalDocID) => {
  await gapi.client.drive.files.update({
    fileId: originalDocID,
    addParents: destFolderId,
    enforceSingleParent: true,
  });
};

const deleteFileOrFolder = async (file_id) => {
  let result;
  await gapi.client.drive.files
    .delete({
      fileId: file_id,
    })
    .then((response) => {
      result = response;
    });
  return result;
};

const createDriveFolder = async (name) => {
  var fileMetadata = {
    name: name,
    mimeType: "application/vnd.google-apps.folder",
    parents: "root",
  };
  let result;
  await gapi.client.drive.files
    .create({
      resource: fileMetadata,
    })
    .then((response) => {
      switch (response.status) {
        case 200:
          var file = response.result;
          // console.log('Created Folder Id: ', file.id);
          result = file;
          break;
        default:
          console.log("Error creating the folder, " + response);
          break;
      }
    });
  return result;
};

const getDriveFileList = async (folder) => {
  let result = await gapi.client.drive.files.list({
    // q: "trashed=false",
    q: `trashed=false and parents='${folder}'`, //para buscar por padres
    fields:
      "nextPageToken, files(id, name, createdTime, videoMediaMetadata,mimeType,thumbnailLink)",
    // fields: 'nextPageToken, files',//All metadarta
    spaces: "drive",
  });
  return result.result.files;
};
const searchDrive = async () => {
  let result = await gapi.client.drive.files.list({
    q: "trashed=false",
    fields:
      "nextPageToken, files(id, name, createdTime, videoMediaMetadata,mimeType,thumbnailLink)",
    // fields: 'nextPageToken, files',//All metadarta
    spaces: "drive",
  });
  return result.result.files;
};

const searchDefaultFolder = async () => {
  let fileList = await getDriveFileList("root");
  let file = fileList.filter((x) => x.name === "CITB_Records");

  if (file.length > 0) {
    window.defautCITBFolderID = file[0].id;
  } else {
    window.defautCITBFolderID = await createDriveFolder("CITB_Records");
  }
};

const getLinkFileDrive = async () => {
  let fileList = await getDriveFileList(window.defautCITBFolderID);
  let file = fileList.filter((x) => x.name === window.fileName);
  let fileId = file.length > 0 ? file[0].id : 0;
  chrome.storage.sync.set({ shareLink: fileId }, () => {});
  return fileId;
};
const downloadFromDrive = (fileId, name) => {
  gapi.client.drive.files.get({ fileId: fileId, alt: "media" }).then(
    async (response) => {
      // response.body has the file data
      console.log(response);
      var blob = new Blob([response.body], {
        type: "video/webm",
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    (reason) => {
      alert(`Failed to get file: ${reason}`);
    }
  );
};

const addEventToGoogleCalendar = (linkDrive) => {
  console.log("CALENDAR",window.calendarId,linkDrive,window.fileName,window.meetStartTime,window.starTimeUpload,window.dateEnd)
  let description =
    "See video here: " +
    "https://drive.google.com/file/d/" +
    linkDrive +
    "/view?usp=sharing";
  let newEvent = {
    summary: window.fileName,
    description: description,
    start: {
      dateTime: window.starTimeUpload,
    },
    end: {
      dateTime: window.dateEnd,
    },
  };
  let request = gapi.client.calendar.events.insert({
    // 'calendarId': 'primary',
    calendarId: window.calendarId,
    resource: newEvent,
  });
  request.execute((resp) => {
    //  console.log("respuesta del calendar",resp);
  });
};

const getCalendarList = async () => {
  let result = await gapi.client.calendar.calendarList.list();
  return result.result.items;
};

const verificateAuth = () => {
  gapi.client
    .init({
      // Don't pass client nor scope as these will init auth2, which we don't want
      apiKey: environment.API_KEY,
      discoveryDocs: environment.DISCOVERY_DOCS,
    })
    .then(
      (data) => {
        chrome.identity.getAuthToken({ interactive: true }, (tokenResult) => {
          window.accessToken = tokenResult;
          uploadQueueDaemon();
          gapi.auth.setToken({
            access_token: tokenResult,
          });
          searchDefaultFolder();
        });
      },
      (error) => {
        console.log("ERROR ERROR", error);
      }
    );
};

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
  console.log("after upload actions");
  let linkDrive = await getLinkFileDrive();
  saveLinktoDB(window.fileIDUploadInProgress, linkDrive);
  delFileInDB(window.fileIDUploadInProgress);
  updateUploadStatusDB(window.fileIDUploadInProgress,'COMPLETE');
  if (window.calendarId) {
    addEventToGoogleCalendar(linkDrive);
  }
  window.uploadValue = -1;
  saveUploadProgress(-1);
  uploadQueueDaemon();
};

const startResumableUpload = async (file) => {
  console.log("Start resumable Upload");
  // let accessToken = gapi.auth.getToken().access_token;
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
    verificateAuth();
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
  // videoArrayChunks.forEach((element) => {
  //   finalArray.push(element.record[0]);
  // });
  console.timeEnd("createArray");
  if (environment.upLoadToDrive && !localDownload) {
    console.time;
    let file = prepareRecordFile(finalArray);
    console.timeEnd;
    //cambiar a update file y meet.endTime
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
    // prepareUploadToDrive(lastElement.file);
    startResumableUpload(lastElement.file);
  }
};
// setInterval(uploadQueueDaemon, environment.timerUploadQueueDaemon);

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
  getLinkFileDrive,
  verificateAuth,
  saveVideo,
  listUploadQueue,
  getDriveFileList,
  createDriveFolder,
  moveDriveFileToFolder,
  deleteFileOrFolder,
  searchDrive,
  getCalendarList,
  downloadFromDrive,
  uploadQueueDaemon
};
