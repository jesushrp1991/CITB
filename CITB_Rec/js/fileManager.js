import { environment } from "../config/environment.js";  
import { errorHandling } from './errorHandling.js'
import { 
    getAllRecordsDB
    ,getLastElementQueueDB
    ,saveLinktoDB
    ,delFileInDB
    ,addRecQueueDB
    ,listQueueDB
    ,updateFileDB
} from "./database.js";

const moveDriveFileToFolder = async (destFolderId,originalDocID) => {    
  await gapi.client.drive.files.update({
      fileId: originalDocID,
      addParents: destFolderId,
      enforceSingleParent:true
  });
}

const deleteFileOrFolder = async (file_id) => {
  let result; 
  await gapi.client.drive.files.delete({
      fileId: file_id,
  }).then((response)=>{
    result = response;
  });   
  return result
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
const searchDrive = async () => {
  let result = await gapi.client.drive.files.list({
    q: "trashed=false",
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
    window.defautCITBFolderID = file[0].id
  }else{
    window.defautCITBFolderID = await createDriveFolder('CITB_Records');    
  }
}

const getLinkFileDrive = async() => {
    let fileList = await getDriveFileList(window.defautCITBFolderID);
    let file = fileList.filter(x => x.name === window.nameToUploads);
    let fileId = file.length > 0 ? file[0].id : 0;
    chrome.storage.sync.set({shareLink: fileId}, () =>{});
    return fileId;
}
const downloadFromDrive = (fileId,name) => {
  gapi.client.drive.files.get(
      {fileId: fileId, alt: 'media'}
  ).then( async(response) => {
      // response.body has the file data
      console.log(response);
      var blob = new Blob([response.body], {
        type: "video/webm"
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
  }, (reason) => {
      alert(`Failed to get file: ${reason}`);
  });
}

const addEventToGoogleCalendar = (linkDrive) => {
    let description = "See video here: " + "https://drive.google.com/file/d/" + linkDrive +  "/view?usp=sharing";
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
      // 'calendarId': 'primary',
      'calendarId': window.calendarId,
      'resource': newEvent
    });
    request.execute((resp) => {
    //  console.log("respuesta del calendar",resp);
   });
}

const getCalendarList = async() =>{
  let result = await gapi.client.calendar.calendarList.list();
  return result.result.items;
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
      // errorHandling(error);
    });
  }

  
/*
  *   Upload to Drive
  *
*/ 
const prepareUploadToDrive = (obj) => {
    console.log("UPLOAD TO DRIVE")
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
      chunkSize: 5*1024*1024,
      accessToken: accessToken,
      folderId: window.defautCITBFolderID
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
        if(window.calendarId){
          addEventToGoogleCalendar(linkDrive);        
        }
        window.uploadValue = -1;
        saveUploadProgress(-1);
        // msg = res.status;
      }
      // console.log(msg);
    });
  }
  
window.fileName = "CITB Rec";
const prepareRecordFile = (finalArray) => {
    var blob = new Blob(finalArray, {
        type: "video/webm"
    });
    window.fileName = window.fileName + " " + Date() + ".webm";
    var file = new File([blob], window.fileName);
    return file;
  }

  const download = (test,fileName) => {
    let finalName;
    fileName? fileName = fileName : finalName = window.fileName;
    var blob = new Blob(test, {
        type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = finalName + Date() + ".webm";
    a.click();
    window.URL.revokeObjectURL(url);
}
function getVideoCover(file, seekTo = 0.0) {
  return new Promise((resolve, reject) => {
      var duration = 0;
      const videoPlayer = document.createElement('video');
      videoPlayer.setAttribute('src', URL.createObjectURL(file));
      videoPlayer.load();
      videoPlayer.addEventListener('error', (ex) => {
          reject("error when loading video file", ex);
      });
      videoPlayer.addEventListener('loadedmetadata', () => {
          duration = videoPlayer.duration;
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
              const canvas = document.createElement("canvas");
              canvas.width = videoPlayer.videoWidth;
              canvas.height = videoPlayer.videoHeight;
              // draw the video frame to canvas
              const ctx = canvas.getContext("2d");
              ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
              // return the canvas image as a blob
              ctx.canvas.toBlob(
                  blob => {
                      resolve({blob:blob, duration:duration});
                  },
                  "image/jpeg",
                  0.75 /* quality */
              );
          });
      });
  });
}
const saveVideo = async(localDownload) =>{
  let videoArrayChunks = await getAllRecordsDB();

  let finalArray = [];
  videoArrayChunks.forEach(element => {
      finalArray.push(element.record[0]);
    });
    let file = prepareRecordFile(finalArray);
    console.log(file)
    let accessToken = gapi.auth.getToken().access_token; // Please set access token here.
    const resource = {
      accessToken: accessToken,
      fileName: file.fileName,
      mimeType: "application/vnd.google-apps.video",
      parentFolderId: window.defautCITBFolderID
    };

  let resumableUpload = new ResumableUpload2();
  resumableUpload.upload(videoArrayChunks[0]); 
    for (let index = 0; index < videoArrayChunks.length; index++) {
      let result = await resumableUpload.upload(videoArrayChunks[index],file.size,resource);
      console.log(result);
  }
  
  // let videoArrayChunks = await getAllRecordsDB();
  // let finalArray = [];
  // videoArrayChunks.forEach(element => {
  //   finalArray.push(element.record[0]);
  // });
  // if(environment.upLoadToDrive && !localDownload){
  //   let file = prepareRecordFile(finalArray);
  //   console.log(file)

  //   try {
  //     } catch (ex) {
  //         console.log("ERROR: ", ex);
  //     }
  //   //cambiar a update file y meet.endTime
  //   window.meetEndTime = dayjs().format();
  //   updateFileDB(window.currentRecordingId,file,window.meetEndTime); 
  // }else{
  //   if(finalArray.length != 0 ){
  //     download(finalArray);
  //   }
  // }
}

const saveUploadProgress = (value) =>{
    chrome.storage.sync.set({uploadPercent: value}, () => {});
}

window.fileIDUploadInProgress = -1 ;

window.listUploadpsStarted = [];
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
    let lastElement = await getLastElementQueueDB();
    if(lastElement == undefined){
        return;
    }
    if(lastElement.file == 'recording' && window.isRecording == false){
      window.currentRecordingId = lastElement.id;
      window.fileName = lastElement.name;
      window.meetStartTime = lastElement.dateStart;
      window.calendarId = lastElement.calendarId;
      let videoArrayChunks = await getAllRecordsDB();
      window.meetEndTime = dayjs().subtract(videoArrayChunks.length * 100,'ms').format();
      saveVideo(false);
    }
    if(lastElement.file != "uploaded" && lastElement.file != "folder" && lastElement.file != 'recording'){
        if(!window.listUploadpsStarted.includes(lastElement.id)){
          window.fileIDUploadInProgress = lastElement.id;
          window.nameToUploads = lastElement.name; 
          window.starTimeUpload = lastElement.dateStart; 
          window.endTimeUpload = lastElement.dateEnd; 
          window.calendarId = lastElement.calendarId;
          window.listUploadpsStarted.push(lastElement.id);
          prepareUploadToDrive(lastElement.file);
        }
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
        }else{
          upload = 'awaiting';
        }
        // const videoData = await getVideoCover(element.file, 1);
        // const cover = videoData.blob;
        // let thumbnailGeneratedLink = URL.createObjectURL(cover);
        window.startTimeCurrentFile = element.dateStart;
        window.endTimeCurrentFile = element.dateEnd;
        let details = {
             id: element.id 
            ,name: element.name
            ,dateStart: element.dateStart
            ,dateEnd: element.dateEnd 
            ,driveLink : element.driveLink
            ,upload: upload
            ,msDuration: element.msDuration
            // ,thumbnailLink: thumbnailGeneratedLink
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
    ,deleteFileOrFolder
    ,searchDrive
    ,getCalendarList
    ,downloadFromDrive
}