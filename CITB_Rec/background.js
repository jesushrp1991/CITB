import { environment } from "./config/environment.js";  
import { memorySizeOf, getReadableFileSizeString } from "./js/util.js";
import {
  createDB,
  addDB,
  delDB,
  selectDB,
  persist,
  isStoragePersisted,
  showEstimatedQuota,
  tryPersistWithoutPromtingUser,
  initStoragePersistence,
  prepareDB
} from "./js/database.js";
const popupMessages = {
  rec:'rec',
  pause:'pause'
}

const onGAPIFirstLoad = () =>{
  console.log("GAPI LOADED!!")
}
const onGAPILoad = () => {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: environment.API_KEY,
    discoveryDocs: environment.DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

const getAuthToken = () =>{
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log('got the token', token);
  })
};
const verificateAuth = () =>{
  onGAPILoad();
  getAuthToken();
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

  const startResumableUploadToDrive = (e) => {
    let accessToken = gapi.auth.getToken().access_token; // Please set access token here.
    // console.log("accessToken",accessToken)
    // document.getElementById("progress").innerHTML = "Initializing.";
    const f = e.target;
    const resource = {
      fileName: f.fileName,
      fileSize: f.fileSize,
      fileType: f.fileType,
      fileBuffer: f.result,
      accessToken: accessToken,
    };
    const upload = new ResumableUploadToGoogleDrive();
    upload.Do(resource, function (res, err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(res);
      let msg = "";
      if (res.status == "Uploading") {
        msg =
          Math.round(
            (res.progressNumber.current / res.progressNumber.end) * 100
          ) + "%";
      } else {
        msg = res.status;
      }
      console.log(msg);
    });
  }
  /* 
  ** DESKTOP REC
  */
let videoChunksArray = [];
const prepareRecordFile = () => {
    console.log("Hello download")
    var blob = new Blob(videoChunksArray, {
        type: "video/webm"
    });
    var file = new File([blob], "CITB REC " + Date() + ".webm");
    videoChunksArray = []; 
    return file;
  }

  //test only, to save in mi pc
  const download = (test) => {
    //prepare again video

    //prepare again vide
    console.log("Hello download")
    var blob = new Blob(test, {
        type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    videoChunksArray = []; 
    window.URL.revokeObjectURL(url);
}

let isRecording = false;
let isPaused = false;
let recorder;
const recordScreen = async (streamId) => {
    try{
        var constraints = {
            audio:{
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                    echoCancellation: true
                }
            },
            video: {
                optional: [],
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                    maxWidth: 2560,
                    maxHeight: 1440,
                    maxFrameRate:30
                }
            }
        }
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                console.log("dataAvailable",event.data.size);  
              //console.log(event.data.size);
                videoChunksArray.push(event.data);
                console.log(videoChunksArray);
                addDB(videoChunksArray);
                videoChunksArray = [];
                // let size = memorySizeOf(videoChunksArray);
                // let msg  = " size:" + getReadableFileSizeString(size);
                // console.log(msg);
            }
        }
        recorder.onstop = async() => {
            let save = await selectDB();
            let finalArray = [];
            save.forEach(element => {
              finalArray.push(element.record[0]);
            });
            console.log("FinalArray",finalArray);
            //END TEST
            if(environment.upLoadToDrive){
              let file = prepareRecordFile();
              console.log("file",file);
              prepareUploadToDrive(file);
            }else{
              download(finalArray);
            }
            delDB();           
        }
        recorder.start(30000);
        isRecording = true;
    }catch(e){
        console.log(e);
    }
}
const startRecordScreen = () =>{
    try{
      let userAgentData = navigator.userAgentData.platform.toLowerCase().includes('mac');
      let videoCaptureModes;
      userAgentData? videoCaptureModes = environment.videoCaptureModesForMac : videoCaptureModes = environment.videoCaptureModes;
      console.log(userAgentData,videoCaptureModes);
        chrome.desktopCapture.chooseDesktopMedia(videoCaptureModes, async (streamId) => {
            if (!streamId) {
                isRecording = false;
                chrome.storage.sync.set({isRecording: false}, function() {
                });
            } else {
                isRecording = true;
                chrome.storage.sync.set({isRecording: true}, function() {
                });
                await recordScreen(streamId);
            }
          });
    }catch(e){
        console.log(e);
    }
}
const stopRecordScreen = () =>{
    console.log(isRecording);
    if(isRecording){
        recorder.stop();
        isRecording = false;
        chrome.storage.sync.set({isRecording: false}, function() {
        });
    }
}

const pauseOrResume = () => {
  console.log("pause/resume")
  if(!isPaused && isRecording){
    recorder.pause()
    chrome.storage.sync.set({isPaused: true}, function() {
    });
  }else{
    recorder.resume();
    chrome.storage.sync.set({isPaused: false}, function() {
    });
  }
  isPaused = !isPaused;
}

const saveToDB = () =>{
  setTimeout(()=>{
    if(showEstimatedQuota()){
      console.log("hay que parar");
      pauseOrResume();
      //sendMessage to popup to alert the user about insufficient disk space.
    }
  },180000)
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(message);
    console.log('is recorfing',isRecording)
    if(showEstimatedQuota()){
      //sendMessage to popup to alert the user about insufficient disk space.
      console.log("insufficient disk space");      
    }
    switch(message.recordingStatus){
      case popupMessages.rec :
        console.log("recording")
        if(!isRecording){
          await verificateAuth();
          await prepareDB();
          await startRecordScreen();
          saveToDB();
          sendResponse({
              type: 'ok',
              message: 'Recording'
            })
        }else{
            await stopRecordScreen();
            sendResponse({
                type: 'ok',
                message: 'Stopping'
              })
            chrome.storage.sync.set({isPaused: false}, function() {
            });
        }    
        break;
      case popupMessages.pause :
        pauseOrResume();
        break;
    }
    return true;
  });
