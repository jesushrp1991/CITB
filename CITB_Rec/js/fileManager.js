import { environment } from "../config/environment.js";  
import { errorHandling } from './errorHandling.js'
import { 
     selectDB
    ,createRecQueueDB
    ,getLastElementIdQueueDB
    ,getNextQueueFile 
    ,saveLinktoDB
    ,delFileInDB
    ,addRecQueueDB
    ,listQueueDB
    ,removeRecordQueueDB
} from "./database.js";

const moveDriveFileToFolder = async (destFolderId,originalDocID) => {    
  await gapi.client.drive.files.update({
      fileId: originalDocID,
      addParents: destFolderId,
      enforceSingleParent:true
  });
}

const createDriveFolder = async (name) =>{
  var fileMetadata = {
    'name' : name,
    'mimeType' : 'application/vnd.google-apps.folder',
    'parents': 'root'
  };
  let result;
 await  gapi.client.drive.files.create({
          resource: fileMetadata,
        }).then((response) => {
          switch(response.status){
            case 200:
              var file = response.result;
              // console.log('Created Folder Id: ', file.id);
              result = file;
              break;
            default:
              console.log('Error creating the folder, '+response);
              break;
            }
        });
  return result;
}

const getDriveFileList = async (folder) => {
  let result = await gapi.client.drive.files.list({
    // q: "trashed=false",
    q: `trashed=false and parents='${folder}'`,//para buscar por padres    
    fields: 'nextPageToken, files(id, name, createdTime, videoMediaMetadata,mimeType,thumbnailLink)',
    // fields: 'nextPageToken, files',//All metadarta
    spaces: 'drive',
  })
  return result.result.files;  
}

const searchDefaultFolder = async() =>{
  let fileList = await getDriveFileList('root');
  let file = fileList.filter(x => x.name === 'CITB_Records');

  if(file.length > 0){
    window.folderId = file[0].id
  }else{
    window.folderId = await createDriveFolder('CITB_Records');    
  }
}

const getLinkFileDrive = async() => {
    let fileList = await getDriveFileList('root');
    let file = fileList.filter(x => x.name === window.nameToUploads);
    let fileId = file.length > 0 ? file[0].id : 0;
    // let shareLink = "https://drive.google.com/file/d/" + fileId +  "/view?usp=sharing";
    // chrome.storage.sync.set({shareLink: shareLink}, () =>{});
    // return shareLink;
    chrome.storage.sync.set({shareLink: fileId}, () =>{});
    return fileId;
}
const addEventToGoogleCalendar = (linkDrive) => {    
    let description = "See video here:" + linkDrive;
    let newEvent = {
      "summary":window.nameToUploads,
      "description": description ,
      "start": {
        "dateTime": window.starTimeUpload
      },
      "end": {
        "dateTime": window.endTimeUpload
      }
    };
    let request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': newEvent
    });
    request.execute((resp) => {
    //  console.log("respuesta del calendar",resp);
   });
  }

  const verificateAuth = () => {
    // console.log("VERIFICATE AUTH");
    gapi.client.init({
      // Don't pass client nor scope as these will init auth2, which we don't want
      apiKey: environment.API_KEY,
      discoveryDocs: environment.DISCOVERY_DOCS,
    }).then( (data) =>{
      // console.log("BEFORE IDENTITY SET ",data);
      chrome.identity.getAuthToken({interactive: true}, (tokenResult) => {
        gapi.auth.setToken({
          'access_token': tokenResult,
        });
        searchDefaultFolder();
      })
    }, (error) => {
      console.log("ERROR ERROR", error);
      errorHandling(error);
    });
  }

  
/*
  *   Upload to Drive
  *
*/ 
const prepareUploadToDrive = (obj) => {
    // const file = obj.target.files[0];
    const file = obj;
    if (file.name != "") {
      let fr = new FileReader();
      fr.fileName = file.name;
      fr.fileSize = file.size;
      fr.fileType = file.type;
      fr.readAsArrayBuffer(file);
      fr.onload = startResumableUploadToDrive;
    }
  }
  
  window.uploadValue = -1;
  const startResumableUploadToDrive = async (e) => {
    let accessToken = gapi.auth.getToken().access_token; // Please set access token here.
    const f = e.target;
    const resource = {
      fileName: f.fileName,
      fileSize: f.fileSize,
      fileType: f.fileType,
      fileBuffer: f.result,
      chunkSize: 10485760,
      accessToken: accessToken,
      folderId: window.folderId
    };
    const upload = new ResumableUploadToGoogleDrive();

    upload.Do(resource, async (res, err)=>{
      if (err) {
        console.log(err);
        errorHandling(err);
        return; 
      }
      // console.log("res.status",res.status);
      // let msg = "";
      if (res.status == "Uploading") {
        // msg =
        //   Math.round(
        //     (res.progressNumber.current / res.progressNumber.end) * 100
        //   ) + "%";
          window.uploadValue =  Math.round((res.progressNumber.current / res.progressNumber.end) * 100);
        saveUploadProgress(window.uploadValue);
      }else if(res.status == "Done"){
        let linkDrive = await getLinkFileDrive();
        // console.log("Saving Link to DB",linkDrive)
        saveLinktoDB(window.fileIDUploadInProgress,linkDrive);
        delFileInDB(window.fileIDUploadInProgress);
        addEventToGoogleCalendar(linkDrive);        
        window.uploadValue = -1;
        saveUploadProgress(-1);
        // msg = res.status;
      }
      // console.log(msg);
    });
  }
  /* 
  ** DESKTOP REC
  */
window.fileName = "CITB Rec";
const prepareRecordFile = (finalArray) => {
    var blob = new Blob(finalArray, {
        type: "video/webm"
    });
    window.fileName = window.fileName + " " + Date() + ".webm";
    var file = new File([blob], window.fileName);
    return file;
  }

  //test only, to save in mi pc
  const download = (test) => {
    var blob = new Blob(test, {
        type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = window.fileName + Date() + ".webm";
    a.click();
    window.URL.revokeObjectURL(url);
    // window.fileName = "CITB Rec";
}
function getVideoCover(file, seekTo = 0.0) {
  console.log("getting video cover for file: ", file);
  return new Promise((resolve, reject) => {
      // load the file to a video player
      const videoPlayer = document.createElement('video');
      videoPlayer.setAttribute('src', URL.createObjectURL(file));
      videoPlayer.load();
      videoPlayer.addEventListener('error', (ex) => {
          reject("error when loading video file", ex);
      });
      // load metadata of the video to get video duration and dimensions
      videoPlayer.addEventListener('loadedmetadata', () => {
          // seek to user defined timestamp (in seconds) if possible
          if (videoPlayer.duration < seekTo) {
              reject("video is too short.");
              return;
          }
          // delay seeking or else 'seeked' event won't fire on Safari
          setTimeout(() => {
            videoPlayer.currentTime = seekTo;
          }, 200);
          // extract video thumbnail once seeking is complete
          videoPlayer.addEventListener('seeked', () => {
              console.log('video is now paused at %ss.', seekTo);
              // define a canvas to have the same dimension as the video
              const canvas = document.createElement("canvas");
              canvas.width = videoPlayer.videoWidth;
              canvas.height = videoPlayer.videoHeight;
              // draw the video frame to canvas
              const ctx = canvas.getContext("2d");
              ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
              // return the canvas image as a blob
              ctx.canvas.toBlob(
                  blob => {
                      resolve(blob);
                  },
                  "image/jpeg",
                  0.75 /* quality */
              );
          });
      });
  });
}
const saveVideo = async(localDownload) =>{
  let save = await selectDB();
  let finalArray = [];
  save.forEach(element => {
    finalArray.push(element.record[0]);
  });
  // console.log("FinalArray",finalArray);
  if(environment.upLoadToDrive && !localDownload){
    let file = prepareRecordFile(finalArray);
    createRecQueueDB();
    var thumbnailGeneratedLink;
    try {
      // get the frame at 1.5 seconds of the video file
      const cover = await getVideoCover(file, 1);
      // print out the result image blob
      thumbnailGeneratedLink = URL.createObjectURL(cover);
      console.log(cover,thumbnailGeneratedLink);
      } catch (ex) {
          console.log("ERROR: ", ex);
      }
      console.log("FUERA ANTES",thumbnailGeneratedLink);

    addRecQueueDB(file,window.fileName,window.meetStartTime,window.meetEndTime,null,null,thumbnailGeneratedLink); 
    console.log("FUERA DESPUES",thumbnailGeneratedLink);

    //Crear alerta para que inicie el proceso de subida
    //Cuando este subido modificar tabla para incluir  DriveLink
  }else{
    if(finalArray.length != 0 ){
      download(finalArray);
    }
  }
}

const saveUploadProgress = (value) =>{
    chrome.storage.sync.set({uploadPercent: value}, () => {});
}

window.fileIDUploadInProgress = -1 ;

var refreshToken = 0;
const uploadQueueDaemon = async() =>{
    refreshToken++;
    /*
    ***** El token dura una hora, por si el usuario
    ***** no abre el popup en 50 min (12 veces * segundo * 50 min = 600)
    ***** no pierda el upload por error 401
    */
    if(refreshToken >= 600){
      verificateAuth();
      refreshToken = 0;
    }
    if(window.uploadValue != -1){
      return;
    }
    let lastElemenID = await getLastElementIdQueueDB();
    if(lastElemenID == undefined){
        return;
    }
    if(lastElemenID.file != "uploaded" && lastElemenID.file != "folder" ){
        // let nextFile = await getNextQueueFile(window.fileIDUploadInProgress);
        let nextFile = lastElemenID;
        window.fileIDUploadInProgress = nextFile.id;
        window.nameToUploads = nextFile.name; 
        window.starTimeUpload = nextFile.dateStart; 
        window.endTimeUpload = nextFile.dateEnd; 
        window.thumbnailForFileInProgress = nextFile.thumbnail;
        console.log("FILEMANAGER", nextFile.thumbnail);
        prepareUploadToDrive(nextFile.file);
    }
}
setInterval(uploadQueueDaemon,environment.timerUploadQueueDaemon);

const listUploadQueue = async() =>{
    let list = await listQueueDB();
    let listResult = [];
    if(list != undefined){
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        let upload;
        if(element.file &&  element.file == 'folder'){
          upload = 'folder'
        }
        else if(element.id === window.fileIDUploadInProgress){
          upload = 'inProgress';
        }else if (element.file == 'uploaded' ){
            upload = 'uploaded'
            // removeRecordQueueDB(element.id);
            // continue;
        }else{
          upload = 'awaiting';
        }
        let details = {
             id: element.id 
            ,name: element.name
            ,dateStart: element.dateStart
            ,dateEnd: element.dateEnd 
            ,driveLink : element.driveLink
            ,upload: upload
            ,msDuration: element.msDuration
            ,thumbnailLink: element.thumbnailLink
        }
        listResult.push(details);
      }
    }
    return listResult;
}

export {
     getLinkFileDrive
    ,verificateAuth
    ,saveVideo
    ,listUploadQueue
    ,getDriveFileList
    ,createDriveFolder
    ,moveDriveFileToFolder
}