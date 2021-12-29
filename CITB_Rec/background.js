import {
  showEstimatedQuota,
  prepareDB,
  delLastItem
} from "./js/database.js";

import {
   startRecordScreen
  ,stopRecordScreen
  ,pauseOrResume
  ,playRec
  ,pauseRec
} from './js/rec.js'

import {
  getLinkFileDrive
  ,verificateAuth
  ,saveVideo
} from './js/fileManager.js'

// import {
//   errorHandling
// } from './js/errorHandling.js'

const popupMessages = {
  rec:'rec',
  pause:'pause',
  voiceOpen:'voiceOpen',
  voiceClose:'voiceClose',
  checkAuth:'checkAuth',
  localDownload:'localDownload',
  isVoiceCommand:'voiceCommand',
  getDriveLink: 'getDriveLink'
}

const onGAPIFirstLoad = () =>{
  // console.log("GAPI LOADED!!")
}

window.meetStartTime ;
window.meetEndTime ;
window.isRecording = false;
window.isPaused = false;
window.recorder;
window.videoChunksArray = [];
window.resultStream;
window.desktopStream;
window.micStream;

function injectFileName() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currTab = tabs[0];
    if (currTab) { // Sanity check
      chrome.tabs.insertCSS(currTab.id,{file:"./css/alertify.min.css"});
      chrome.tabs.insertCSS(currTab.id, {file:"./css/default.min.css"});
      
      chrome.tabs.executeScript(
        currTab.id,
        // {code: "document.body.style.backgroundColor='red'"}
        {file:"./js/external/alertify.min.js"}
      )
      chrome.tabs.executeScript(
        currTab.id,
        // {code: "document.body.style.backgroundColor='red'"}
        {file:"./js/content_script.js"}
      )
    }
  });
}
let intervalFileName = null;

const getFileName = () => {
  chrome.storage.sync.get('fileName', function(result) {
    if(result.fileName != "undefined"){
      window.fileName = result.fileName;
      clearInterval(intervalFileName);
    }
  })
}


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    let thereAreLowDiskSpace = await showEstimatedQuota();
    if(thereAreLowDiskSpace){
      prompt("Insufficient disk space");      
    }
    switch(message.recordingStatus){
      case popupMessages.rec :
        if(!window.isRecording && !message.isVoiceCommandStop){
          window.fileName = "CITB Rec";
          chrome.storage.sync.set({fileName: "undefined"}, () => {});
          injectFileName();
          intervalFileName = setInterval(getFileName,500);
          intervalFileName;
          await prepareDB();
          // fileName = prompt("What's yours meet name?");
          window.meetStartTime = dayjs().format();
          await startRecordScreen(message.idMic);
        }else{
            if(intervalFileName != null){
              clearInterval(intervalFileName);
            }
            if(message.isVoiceCommandStop){
              delLastItem(3);
            }
            chrome.tabs.create({active: false}, function(newTab) {
              chrome.tabs.create({ url: chrome.extension.getURL('videoManager.html') });
      
            });
            await stopRecordScreen();
              chrome.storage.sync.set({isPaused: false}, function() {
            });
        }    
        break;
      case popupMessages.pause :
        pauseOrResume();
        break;
      case popupMessages.isVoiceCommand :
        if(message.isVoiceCommandPause == 'pause'){
          pauseRec();          
        }else{
          playRec();
        }
        delLastItem();
        break;
      case popupMessages.voiceOpen :
        chrome.storage.sync.set({voice: true}, function() {
        });
        break;
      case popupMessages.voiceClose :
        chrome.storage.sync.set({voice: false}, function() {
        });
        delLastItem();
        break;
      case popupMessages.checkAuth :
        await verificateAuth();
        break;
      case popupMessages.localDownload :
        saveVideo(true);
        break;
      case popupMessages.getDriveLink :
        let drivelink = getLinkFileDrive();
        chrome.storage.sync.set({drivelink: drivelink}, () => {});
        break;
    }
    return true;
  });

  const errorHandling = (error) => {
    console.log(error);
    // window.recorder.stop();
    // window.desktopStream.getTracks().forEach(track => track.stop())
    // window.micStream.getTracks().forEach(track => track.stop())
    // window.resultStream.getTracks().forEach(track => track.stop())
    // reset();
    // window.isRecording = false;
    // chrome.storage.sync.set({isRecording: false}, function() {
    // });
  }

  