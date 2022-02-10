import { environment } from "../config/environment.js";
import {
  uploadQueueDaemon
} from "./uploadManager.js";
import { getDBToken } from "./backService.js";

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

const setReadPermissionsToEveryOne = async (idDrive) => {
  var permissions =
  {
    'type': 'anyone',
    'role': 'reader'
  };
  await gapi.client.drive.permissions.create({
    resource: permissions,
    fileId: idDrive,
  }, (err, res) => {
    if (err) {
      // Handle error...
      console.error(err);
    } else {
      console.log('Permission ID: ', res.id)
    }
  });
}

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

const verificateAuth = () =>{
  try{
    chrome.storage.local.get("idToken", async(result)=>{
      if(result.idToken == undefined){
        window.open(environment.webBaseURL,"_blank");
      }
      else{
        const dbToken = await getDBToken(result.idToken);
        chrome.storage.local.set({ "dbToken": dbToken.token },()=>{});
        window.dbToken = dbToken;
      }
    });
    chrome.storage.local.get("authToken", async(result)=>{
      if(result.authToken == undefined){
        window.open(environment.webBaseURL,"_blank");
      }
      else{
        window.accessToken = result.authToken;
        gapi.load("client", async () =>
          gapi.auth.setToken({
            access_token: result.authToken
          })
        );
        gapi.client.init({
          discoveryDocs: environment.DISCOVERY_DOCS,
          apiKey: environment.API_KEY,
        }).then(()=>{
          uploadQueueDaemon();
          searchDefaultFolder();
        });
        return;
      }
    });
  }
  catch(error){
    console.log(error);
  }
}

export {
  getLinkFileDrive,
  verificateAuth,
  getDriveFileList,
  createDriveFolder,
  moveDriveFileToFolder,
  deleteFileOrFolder,
  searchDrive,
  getCalendarList,
  downloadFromDrive,
  addEventToGoogleCalendar,
  searchDefaultFolder,
  setReadPermissionsToEveryOne
};
