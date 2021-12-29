import { environment } from "../config/environment.js";  
import { errorHandling } from './errorHandling.js'
import { selectDB } from "./database.js";

const getLinkFileDrive = async() => {
    setTimeout(()=>{},5000);
    let result = await gapi.client.drive.files.list({
        // q: "mimeType='application/vnd.google-apps.file' and trashed=false",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    })
    let files = result.result.files;
    console.log("files",files);

    let file = files.filter(x => x.name === window.fileName);
    console.log("file",file);

    let fileId = file.length > 0 ? file[0].id : 0;
    let shareLink = "https://drive.google.com/file/d/" + fileId +  "/view?usp=sharing";
    console.log("shareLink",shareLink);
    chrome.storage.sync.set({shareLink: shareLink}, function() {
    });
    return shareLink;
}
const addEventToGoogleCalendar = async () => {
    let linkDrive = await getLinkFileDrive();
    let description = "See video here:" + linkDrive;
    let newEvent = {
      "summary": window.fileName,
      "description": description ,
      "start": {
        "dateTime": window.meetStartTime
      },
      "end": {
        "dateTime": window.meetEndTime
      }
    };
    let request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': newEvent
    });
    request.execute(function(resp) {
    //  console.log("respuesta del calendar",resp);
   });
  }
  const verificateAuth = () => {
    gapi.client.init({
      // Don't pass client nor scope as these will init auth2, which we don't want
      apiKey: environment.API_KEY,
      discoveryDocs: environment.DISCOVERY_DOCS,
    }).then( async () =>{
      chrome.identity.getAuthToken({interactive: true}, function(tokenResult) {
        gapi.auth.setToken({
          'access_token': tokenResult,
        });
      })
    }, function(error) {
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
      accessToken: accessToken,
      // folderId: 'CITB_REC'
    };
    const upload = new ResumableUploadToGoogleDrive();
    upload.Do(resource, (res, err)=>{
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
        addEventToGoogleCalendar();        
        window.uploadValue = -1;
        saveUploadProgress(-1);
        msg = res.status;
        // fileName = "CITB Rec";
      }
      console.log(msg);
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
    fileName = window.fileName + " " + Date() + ".webm";
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
    prepareUploadToDrive(file);
  }else{
    if(finalArray.length != 0 ){
      download(finalArray);
    }
  }
}

const saveUploadProgress = (value) =>{
    chrome.storage.sync.set({uploadPercent: value}, function() {
    });
  }
  
export {
     getLinkFileDrive
    ,verificateAuth
    ,saveVideo
}