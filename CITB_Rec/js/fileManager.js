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
} from "./database.js";

const getDriveFileList = async () => {
  let result = await gapi.client.drive.files.list({
    q: "trashed=false",
    fields: 'nextPageToken, files(id, name, createdTime, videoMediaMetadata)',
    spaces: 'drive',
  })
  return result.result.files;  
}

const getLinkFileDrive = async() => {
    // setTimeout(()=>{},5000);
    let fileList = await getDriveFileList();
    let file = fileList.filter(x => x.name === window.nameToUploads);
    let fileId = file.length > 0 ? file[0].id : 0;
    let shareLink = "https://drive.google.com/file/d/" + fileId +  "/view?usp=sharing";
    // console.log("getLinkFileDrive shareLink",shareLink);
    chrome.storage.sync.set({shareLink: shareLink}, () =>{
    });
    return shareLink;
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
        // console.log("TOKEN RESULT", tokenResult);
        gapi.auth.setToken({
          'access_token': tokenResult,
        });
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
  const startResumableUploadToDrive = (e) => {
    let accessToken = gapi.auth.getToken().access_token; // Please set access token here.
    const f = e.target;
    const resource = {
      fileName: f.fileName,
      fileSize: f.fileSize,
      fileType: f.fileType,
      fileBuffer: f.result,
      chunkSize: 10485760,
      accessToken: accessToken,
      // folderId: 'CITB_REC'
    };
    const upload = new ResumableUploadToGoogleDrive();

    upload.Do(resource, async (res, err)=>{
      if (err) {
        console.log(err);
        return;
      }
      // console.log("res.status",res.status);
      let msg = "";
      if (res.status == "Uploading") {
        msg =
          Math.round(
            (res.progressNumber.current / res.progressNumber.end) * 100
          ) + "%";
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
        msg = res.status;
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
    addRecQueueDB(file,window.fileName,window.meetStartTime,window.meetEndTime,null); 
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
    if(lastElemenID.file != "uploaded" ){
        let nextFile = await getNextQueueFile(window.fileIDUploadInProgress);
        console.log("nextFile",nextFile);
        window.fileIDUploadInProgress = nextFile.id;
        window.nameToUploads = nextFile.name; 
        window.starTimeUpload = nextFile.dateStart; 
        window.endTimeUpload = nextFile.dateEnd; 
        prepareUploadToDrive(nextFile.file);
    }
}
setInterval(uploadQueueDaemon,environment.timerUploadQueueDaemon);

const listUploadQueue = async() =>{
    let list = await listQueueDB();
    let listResult = [];
    if(list != undefined){
      list.forEach((element)=>{
        let upload;
        if(element.id === window.fileIDUploadInProgress){
          upload = 'inProgress';
        }else if (element.file == 'uploaded' ){
            upload = 'uploaded'
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
        }
        listResult.push(details);
      });
    }
    return listResult;
}

export {
     getLinkFileDrive
    ,verificateAuth
    ,saveVideo
    ,listUploadQueue
    ,getDriveFileList
}