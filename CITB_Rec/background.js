import {
   showEstimatedQuota
  ,prepareDB
  ,delLastItem
  ,getDriverLinkInQueueDB
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
  ,listUploadQueue
} from './js/fileManager.js'

const popupMessages = {
  rec:'rec'
  ,pause:'pause'
  ,voiceOpen:'voiceOpen'
  ,voiceClose:'voiceClose'
  ,checkAuth:'checkAuth'
  ,localDownload:'localDownload'
  ,isVoiceCommand:'voiceCommand'
  ,getDriveLink: 'getDriveLink'
  ,listRec: 'listRec'
  ,showRecList: 'showRecList'
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

const injectFileName = () =>{
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    // console.log(tabs);
    const url = tabs[0].url;
    if (!url.includes("http")) {
      window.fileName = prompt("What's yours meet name?","CITB Rec");
      clearInterval(intervalFileName);
      return;
    }else {
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

const openRecList = () => {  
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
      for (var i = 0, tab; tab = tabs[i]; i++) {
        if (tab.url && tab.url.includes('videoManager.html')) {
          console.log("IS my page");          
          chrome.tabs.update(tab.id, {selected: true});
          return;
        }
      }
      chrome.tabs.create({ url: chrome.extension.getURL('videoManager.html') });  
    });
  
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
          window.meetStartTime = dayjs().format();
          await startRecordScreen(message.idMic);
        }else{
            if(intervalFileName != null){
              clearInterval(intervalFileName);
            }
            if(message.isVoiceCommandStop){
              delLastItem(3);
            }
            openRecList();
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
      case popupMessages.listRec :
        let list = await listUploadQueue();
        chrome.storage.sync.set({listRec: {list:list}}, () => {
          sendResponse({status: "ready"});
        });        
        break;
      case popupMessages.showRecList :
        openRecList();
        break;
    }
    return true;
  });

  chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "getDriveLink");
    port.onMessage.addListener(async(msg) => {
      if (msg.getLink){
        let driveLink = await getDriverLinkInQueueDB(msg.getLink);
        port.postMessage({answer: driveLink});
      }else if (msg.getList){
        let list = await listUploadQueue();
        port.postMessage({lista: list});
      }
    });
  });


  