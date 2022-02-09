import {
   showEstimatedQuota
  ,delLastItem
  ,getDriverLinkInQueueDB
} from "./js/database.js";

import {
  stopRecordScreen
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
  ,deleteFileOrFolder
  ,searchDrive
  ,getCalendarList
  ,downloadFromDrive
} from './js/fileManager.js'

import { filterModifiableCalendars, createListForFrontend } from './js/tools.js';
import { initialCleanUp } from './js/errorHandling.js'
import { recUC } from './js/useCase.js';

initialCleanUp();

chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
      chrome.storage.sync.set({ extensionGlobalState: "on" });

  }else if(details.reason == "update"){
    chrome.storage.sync.set({ extensionGlobalState: "on" });
  }
});

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
  ,changeVoiceVolume: 'changeVoiceVolume'
  ,changeSystemVolume: 'changeSystemVolume'
  ,token: 'token'
  ,dbToken: 'dbToken'
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

const recCommandStart = async(message) => {
  if(!window.isRecording && !message.isVoiceCommandStop){
    window.idMic = message.idMic;
    window.idTab = message.idTab;
    window.recMode = message.recMode;
    chrome.tabs.create({ url: chrome.extension.getURL('./html/initialOptions.html') });
    // getRecName();
  }else{
      clearInterval(window.iconRecChange);
      if(message.isVoiceCommandStop){
        delLastItem(3);
      }
      if(window.showRecords){
        openRecList();
      }
      await stopRecordScreen();
      chrome.storage.sync.set({isPaused: false}, () => {});
      setTimeout(()=>{
        chrome.browserAction.setIcon({path: "./assets/icon.png"});
      },3000);
  } 
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("message received ", message)
    let thereAreLowDiskSpace = await showEstimatedQuota();
    if(thereAreLowDiskSpace){
      prompt("Insufficient disk space");      
    }
    switch(message.recordingStatus){
      case popupMessages.rec :
        recCommandStart(message);   
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
        chrome.storage.sync.set({listRec: {list:list}}, () => {});        
        break;
      case popupMessages.showRecList :
        openRecList();
        break;
      case popupMessages.changeVoiceVolume :
        if(window.voiceGain != undefined){
          window.voiceGain.gain.value = message.volume;
        }else{
          window.InitialVoiceGain = message.volume;
        }
        break;
      case popupMessages.changeSystemVolume :
        if(window.desktopGain != undefined){
          window.desktopGain.gain.value = message.volume;
        }else{
          window.InitialDesktopGain = message.volume;
        }
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
        }
        else if (msg.getList){
          let list = await listUploadQueue();
          port.postMessage({lista: list});
        }
        else if (msg.getDriveFiles){
          let folderId ;
          msg.folderId == 'root' ? folderId = window.defautCITBFolderID : folderId = msg.folderId;
          let list = await getDriveFileList(folderId);
          let listResult = createListForFrontend(list,null);          
          let listFolder = await getDriveFileList('root');
          let listFoldersResult = createListForFrontend(listFolder,'root')
          port.postMessage({currentList: listResult.concat(listFoldersResult)});
        }
        else if(msg.addFolder){
          let result = await createDriveFolder(msg.name);
          let listFoldersResult = createListForFrontend([result],'root')
          port.postMessage({currentList: listFoldersResult});
        }
        else if (msg.moveFile){
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
        else if (msg.deleteFile){
          let response = await deleteFileOrFolder(msg.folderId);
          if(response){
            port.postMessage({deletedFile: true});
          }
        }
        else if (msg.searchDriveFiles){
          let list = await searchDrive();
          let listFolders = createListForFrontend(list,'root'); 
          let listFiles = createListForFrontend(list,null);
          let allFiles = [...listFolders,...listFiles];
          let result = allFiles.filter(x => x.name.includes(msg.searchTerm));
          port.postMessage({searchList: result});
        }
        else if (msg.requestCalendarList){
          let list = await getCalendarList();
          list = filterModifiableCalendars(list);
          port.postMessage({calendarList: list});
        }
        else if (msg.okRec){
          window.fileName = msg.fileName;
          window.calendarId = msg.calendarId;
          window.showRecords = msg.showRecords;
          recUC();
        }
        else if (msg.downloadFromDrive){
          downloadFromDrive(msg.fileID,msg.name);
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

  chrome.runtime.onMessageExternal.addListener(
    (message, sender, sendResponse) =>{
      
      console.log(message);
      message.idTab = sender.tab.id;

      switch(message.recordingStatus){
        case popupMessages.token :
          chrome.storage.local.set({ "authToken": message.token.token },()=>{});
        break;
        case popupMessages.dbtoken :
          chrome.storage.local.set({ "dbToken": message.dbToken.dbToken },()=>{});
        break;
        case popupMessages.rec :
          recCommandStart(message);   
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

      }
    });


  