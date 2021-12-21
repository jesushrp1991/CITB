import { environment } from "./config/environment.js";  
import {
  addDB,
  delDB,
  selectDB,
  showEstimatedQuota,
  prepareDB,
  delLastItem
} from "./js/database.js";
import {
  start,
  stop,
  reset
} from './js/recTimer.js'

const popupMessages = {
  rec:'rec',
  pause:'pause',
  voiceOpen:'voiceOpen',
  voiceClose:'voiceClose',
  checkAuth:'checkAuth',
}

const onGAPIFirstLoad = () =>{
  console.log("GAPI LOADED!!")
}
let token;
const onGAPILoad = () => {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: environment.API_KEY,
    discoveryDocs: environment.DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    chrome.identity.getAuthToken({interactive: true}, function(tokenResult) {
      gapi.auth.setToken({
        'access_token': tokenResult,
      });
      token = tokenResult;
    })
    createDriverFolder();
  }, function(error) {
    errorHandling(error);
  });
}
let createFolderOptions = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    mimeType: "application/vnd.google-apps.folder",
    name: "CITB_Rec",
  }),
};

const createDriverFolder = async() =>{
  const response = await fetch("https://www.googleapis.com/drive/v3/files", createFolderOptions);
  const json = await response.json();
}
// const getAuthToken = () =>{
//   chrome.identity.getAuthToken({interactive: true}, function(token) {
//     console.log('got the token', token);
//   })
// };
const verificateAuth = () =>{
  onGAPILoad();
  // getAuthToken();
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
  
  let uploadValue = 0;
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
      folderId: 'CITB_REC'
    };
    const upload = new ResumableUploadToGoogleDrive();
    upload.Do(resource, (res, err)=>{
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
        uploadValue =  Math.round((res.progressNumber.current / res.progressNumber.end) * 100);
        saveUploadProgress(uploadValue);
      } else {
        saveUploadProgress(-1);
        msg = res.status;
        
      }
      console.log(msg);
    });
    
  }
  /* 
  ** DESKTOP REC
  */
const prepareRecordFile = (finalArray) => {
    console.log("Hello download")
    var blob = new Blob(finalArray, {
        type: "video/webm"
    });
    var file = new File([blob], "CITB REC " + Date() + ".webm");
    return file;
  }

  //test only, to save in mi pc
  const download = (test) => {
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
    window.URL.revokeObjectURL(url);
}

let isRecording = false;
let isPaused = false;
let recorder;
let videoChunksArray = [];
let resultStream;
let desktopStream;
let micStream;
const recordScreen = async (streamId,idMic) => {
    try{
        const constraints = {
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
        const micConstraints = {  
          video: false,  
          audio: {  
              deviceId: { exact: idMic },  
          },  
        } 
        desktopStream = await navigator.mediaDevices.getUserMedia(constraints);
        micStream = await navigator.mediaDevices.getUserMedia(micConstraints);

        const context = new AudioContext();
        const sourceDesktop = context.createMediaStreamSource(desktopStream);
        const sourceMic = context.createMediaStreamSource(micStream);
        const destination = context.createMediaStreamDestination();

        const desktopGain = context.createGain();
        const voiceGain = context.createGain();

        desktopGain.gain.value = 0.7;
        voiceGain.gain.value = 0.7;

        sourceDesktop.connect(desktopGain).connect(destination);
        sourceMic.connect(voiceGain).connect(destination);

        
        resultStream = new MediaStream([...desktopStream.getVideoTracks() ,...destination.stream.getAudioTracks()])
        recorder = new MediaRecorder(resultStream);

        recorder.ondataavailable = event => {
          console.log("ON DATA AVAILABLE", videoChunksArray.length);
            verifyAvailableSpaceOnDisk();
            if (event.data.size > 0) {
                videoChunksArray.push(event.data);
                addDB(videoChunksArray);
                videoChunksArray = [];
            }
        }
        recorder.onstop = async() => {
            let save = await selectDB();
            let finalArray = [];
            save.forEach(element => {
              finalArray.push(element.record[0]);
            });
            console.log("FinalArray",finalArray);
            
            if(environment.upLoadToDrive){
              let file = prepareRecordFile(finalArray);
              console.log("file",file);
              prepareUploadToDrive(file);
            }else{
              download(finalArray);
            }
            delDB();           
        }
        recorder.start(1000);
        start();
        isRecording = true;
    }catch(e){
      errorHandling(error);
    }
}
const startRecordScreen = (idMic) =>{
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
                await recordScreen(streamId,idMic);
            }
          });
    }catch(e){
      errorHandling(error);
    }
}
const stopRecordScreen = () =>{
    console.log(isRecording);
    if(isRecording){
        recorder.stop();
        desktopStream.getTracks().forEach(track => track.stop())
        micStream.getTracks().forEach(track => track.stop())
        resultStream.getTracks().forEach(track => track.stop())
        reset();
        isRecording = false;
        chrome.storage.sync.set({isRecording: false}, function() {
        });
    }
}

const pauseOrResume = async () => {
  const records = await selectDB();
  console.log(records.length, records);
  console.log('pause/resume',isRecording);
  console.log(videoChunksArray.length);
  // videoChunksArray.length = videoChunksArray.length - 5;
  // console.log(videoChunksArray.length);

  // videoChunksArray.push(event.data);
  // addDB(videoChunksArray);
  if(!isPaused && isRecording){
    recorder.pause()
    stop();
    chrome.storage.sync.set({isPaused: true}, function() {
    });
  }else{
    recorder.resume();
    start();
    chrome.storage.sync.set({isPaused: false}, function() {
    });
  }
  isPaused = !isPaused;
}

const verifyAvailableSpaceOnDisk = async () =>{  
    let thereAreLowDiskSpace = await showEstimatedQuota();
    // console.log("thereAreLowDiskSpace",thereAreLowDiskSpace);
    if(thereAreLowDiskSpace){
      console.log("hay que parar");
      pauseOrResume();
      //sendMessage to popup to alert the user about insufficient disk space.
    }
}

const saveUploadProgress = (value) =>{
  chrome.storage.sync.set({uploadPercent: value}, function() {
  });
}

const errorHandling = (error) => {
    console.log(error);
    recorder.stop();
    desktopStream.getTracks().forEach(track => track.stop())
    micStream.getTracks().forEach(track => track.stop())
    resultStream.getTracks().forEach(track => track.stop())
    reset();
    isRecording = false;
    chrome.storage.sync.set({isRecording: false}, function() {
    });

}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(message);
    let thereAreLowDiskSpace = await showEstimatedQuota();
    if(thereAreLowDiskSpace){
      //sendMessage to popup to alert the user about insufficient disk space.
      console.log("insufficient disk space");      
    }
    switch(message.recordingStatus){
      case popupMessages.rec :
        if(!isRecording && uploadValue == 0){
          await prepareDB();
          await startRecordScreen(message.idMic);
        }else{
            await stopRecordScreen();
            chrome.storage.sync.set({isPaused: false}, function() {
            });
        }    
        break;
      case popupMessages.pause :
        pauseOrResume();
        if(message.isVoiceCommand)
          delLastItem();
        break;
      case popupMessages.voiceOpen :
        chrome.storage.sync.set({voice: true}, function() {
        });
        break;
      case popupMessages.voiceClose :
        chrome.storage.sync.set({voice: false}, function() {
        });
        break;
      case popupMessages.checkAuth :
        await verificateAuth();
        break;
    }
    return true;
  });

  chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
         console.log("message recieved" + msg);
         port.postMessage(uploadValue);
    });
})