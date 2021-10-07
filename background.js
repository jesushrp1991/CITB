// background.js
import { getContainerButton } from './js/domUtils.js';
// import imprimir from './test.js';
import webFormContainer from './webFormContainer.js';

chrome.runtime.onInstalled.addListener(() => { 
    chrome.storage.sync.clear() 
    chrome.storage.sync.set({ defaultMode:'none' }); 
    chrome.storage.sync.set({ webContainer: false });
    chrome.storage.sync.set({ defaultVideoId: 'CITB' });
    chrome.storage.sync.set({ citbCam: false });
    chrome.storage.sync.set({ devicesList: [] });
    
}); 

chrome.runtime.onMessage.addListener( 
    function(request, sender, sendResponse) { 
      if (request.deviceList) {
        chrome.scripting.executeScript(
          {
            target: {tabId: sender.tab.id},
            files: ['functions.js']
          });
        console.log(request.deviceList);//OJO
        chrome.storage.sync.get( 'defaultVideoId' ,({ defaultVideoId }) => {
          let videoDevices = request.deviceList.filter(d => d.kind == "videoinput" && d.deviceId != "virtual");
          const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId);
          if (defaultDevice.length > 0) {
            chrome.storage.sync.set({ defaultVideoId: defaultVideoId[0].deviceId});
            chrome.storage.sync.set({ citbCam: true});
            chrome.storage.sync.set({ webContainer: true});
            sendResponse({defaultDevice : defaultVideoId[0].deviceId } )
          }else{
            chrome.storage.sync.set({ citbCam: false}); 
            // imprimir();           
          }
        });         
      chrome.scripting.executeScript({ 
        target: { tabId: sender.tab.id }, 
        function: webFormContainer
      });
      chrome.scripting.executeScript({ 
        target: { tabId: sender.tab.id }, 
        files: ['events.js']
      });
      //TODO : Revisar no funciona.  
      // const css = '#buttonsContainer:hover { background-color: red; !important } #buttonsShow:hover { background-color: red; !important } #buttonsClose:hover { background-color: red; !important } #buttonsDrag:hover { background-color: red; !important } #buttonsCam:hover { background-color: red; !important }';
      // chrome.scripting.insertCSS(
      //     {
      //       target: {tabId: sender.tab.id},
      //       css: css,
      //     }
      // );
    }
    else if(request.camButton === "buttonsCamClick"){
        sendResponse({result: "drag back response"});
    }
    else if(request.hideWebContainer === "hideWebContainer"){
        chrome.storage.sync.set({hideWebContainer:true});
        sendResponse({result: "closeContainer back response"});
    }
    else if (request.getDefaultVideoId){
      chrome.storage.sync.get( 'defaultVideoId' ,({ videoID }) => {
        sendResponse({defaultVideoId:videoID});
      });
    }
    else if(request.deviceList){
      console.log(`request.deviceList is ${request.deviceList}`);
      chrome.storage.sync.set({devicesList: request.deviceList},()=>{
        chrome.storage.sync.get( 'defaultVideoId' ,({ videoID }) => {
          sendResponse({result:videoID});
        });
      });
    }
  } 
); 

chrome.storage.onChanged.addListener((changes, area) => {
  // if (area === 'citbCam' && changes.options?.newValue) {
    console.log("Change the citbCam");
  // }
});