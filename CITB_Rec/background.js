import {
   showEstimatedQuota
  ,prepareDB
  ,delLastItem
  ,getDriverLinkInQueueDB
  ,addRecQueueDB
  ,createRecQueueDB
  ,searchBylinkQueueDB
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
  ,getDriveFileList
  ,createDriveFolder
  ,moveDriveFileToFolder
} from './js/fileManager.js'

import { createListForFrontend } from './js/tools.js'

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
        // chrome.tabs.insertCSS(currTab.id,{file:"./css/material.min.css"});
        chrome.tabs.insertCSS(currTab.id, {file:"./css/popup.css"});
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
  chrome.storage.sync.get('fileName', (result) => {
    if(result.fileName != "undefined"){
      window.fileName = result.fileName;
      clearInterval(intervalFileName);
    }
  })
}

const openRecList = () => {  
    chrome.tabs.getAllInWindow(undefined,(tabs) => {
      for (var i = 0, tab; tab = tabs[i]; i++) {
        if (tab.url && tab.url.includes('videoManager.html')) {
          chrome.tabs.update(tab.id, {selected: true});
          return;
        }
      }
      chrome.tabs.create({ url: chrome.extension.getURL('videoManager.html') });  
    });
  
}
const getRecName = async() =>{
  injectFileName();
  intervalFileName = setInterval(getFileName,500);
  intervalFileName;
  await prepareDB();
  window.meetStartTime = dayjs().format();
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
          startRecordScreen(message.idMic,getRecName,message.idTab);
        }else{
            clearInterval(window.iconRecChange);
            if(intervalFileName != null){
              clearInterval(intervalFileName);
            }
            if(message.isVoiceCommandStop){
              delLastItem(3);
            }
            openRecList();
            await stopRecordScreen();
            chrome.storage.sync.set({isPaused: false}, () => {});
            chrome.browserAction.setIcon({path: "./assets/icon.png"});
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
        chrome.storage.sync.set({voice: true},() =>{
        });
        break;
      case popupMessages.voiceClose :
        chrome.storage.sync.set({voice: false},() =>{
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
        alert("AQUIIII")
        let list = await listUploadQueue();
        chrome.storage.sync.set({listRec: {list:list}}, () => {});        
        break;
      case popupMessages.showRecList :
        openRecList();
        break;
    }
    return true;
  });

  chrome.runtime.onConnect.addListener( async(port) => {
    if(port.name == 'getDriveLink'){
      port.onMessage.addListener(async(msg) => {
        if (msg.getLink){
          let driveLink = await getDriverLinkInQueueDB(msg.getLink);
          port.postMessage({answer: driveLink});
        }else if (msg.getList){
          let list = await listUploadQueue();
          port.postMessage({lista: list});
        }else if (msg.getDriveFiles){
          let folderId ;
          msg.folderId == 'root' ? folderId = window.defautCITBFolderID : folderId = msg.folderId;
          let list = await getDriveFileList(folderId);
          let listResult = createListForFrontend(list,null);          
          let listFolder = await getDriveFileList('root');
          let listFoldersResult = createListForFrontend(listFolder,'root')
          port.postMessage({currentList: listResult.concat(listFoldersResult)});
        }else if(msg.addFolder){
          let result = await createDriveFolder(msg.name);
          // let shareLink = "https://drive.google.com/file/d/" + result.id +  "/view?usp=sharing";
          let listFoldersResult = createListForFrontend([result],'root')
          port.postMessage({currentList: listFoldersResult});
          // await addRecQueueDB("folder",msg.name,null,null,shareLink,null,null);
        }else if (msg.moveFile){
          if(msg.id.idFolder.includes("https")){
            let destFolderId = await getDriverLinkInQueueDB(msg.id.idFolder);
            destFolderId =  destFolderId.match(/[-\w]{25,}/);
            let originalDocID = await getDriverLinkInQueueDB(msg.id.idFile);
            originalDocID =  originalDocID.match(/[-\w]{25,}/);
            moveDriveFileToFolder(destFolderId[0],originalDocID[0]);
          }else{
            moveDriveFileToFolder(msg.id.idFolder,msg.id.idFile);
          }
          
        }
      });
    }else if (port.name == 'portTimer'){
      port.onMessage.addListener(async(msg) => {
        if (msg.getTimer){
          let getTimer = window.timer;
          port.postMessage({answer: getTimer});
        }
      });
    }
  });


  