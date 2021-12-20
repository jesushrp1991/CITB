import { environment } from "./config/environment.js";  
import {
  addDB,
  delDB,
  selectDB,
  showEstimatedQuota,
  prepareDB
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
  voiceClose:'voiceClose'
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
        let desktopStream = await navigator.mediaDevices.getUserMedia(constraints);
        let micStream = await navigator.mediaDevices.getUserMedia(micConstraints);

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

        
        let resultStream = new MediaStream([...desktopStream.getVideoTracks() ,...destination.stream.getAudioTracks()])
        recorder = new MediaRecorder(resultStream);

        recorder.ondataavailable = event => {
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
        recorder.start(5000);
        start();
        isRecording = true;
    }catch(e){
        console.log(e);
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
        console.log(e);
    }
}
const stopRecordScreen = () =>{
    console.log(isRecording);
    if(isRecording){
        recorder.stop();
        reset();
        isRecording = false;
        chrome.storage.sync.set({isRecording: false}, function() {
        });
    }
}

const pauseOrResume = () => {
  console.log('pause/resume',isRecording)
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(message);
    let thereAreLowDiskSpace = await showEstimatedQuota();
    if(thereAreLowDiskSpace){
      //sendMessage to popup to alert the user about insufficient disk space.
      console.log("insufficient disk space");      
    }
    switch(message.recordingStatus){
      case popupMessages.rec :
        if(!isRecording || uploadValue != 0){
          await verificateAuth();
          await prepareDB();
          await startRecordScreen(message.idMic);
        }else{
            stopRecordScreen();
            chrome.storage.sync.set({isPaused: false}, function() {
            });
        }    
        break;
      case popupMessages.pause :
        pauseOrResume();
        break;
      case popupMessages.voiceOpen :
        chrome.storage.sync.set({voice: true}, function() {
        });
        break;
      case popupMessages.voiceClose :
        chrome.storage.sync.set({voice: false}, function() {
        });
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