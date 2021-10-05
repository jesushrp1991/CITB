// background.js
import { getContainerButton } from './js/domUtils.js';
import imprimir from './test.js';
import webFormContainer from './webFormContainer.js';

chrome.runtime.onInstalled.addListener(() => { 
    chrome.storage.sync.clear() 
    chrome.storage.sync.set({ defaultMode:'none' }); 
    chrome.storage.sync.set({ webContainer: false });
    chrome.storage.sync.set({ defaultVideoId: 'CITB' });
    chrome.storage.sync.set({ citbCam: true });
    
}); 



// chrome.runtime.onMessageExternal.addListener( 
//     function(request, sender, sendResponse) { 
//       if (request.deviceList) {
//         console.log(request.deviceList);//OJO
//         chrome.storage.sync.get( 'defaultVideoId' ,({ defaultVideoId }) => {
//           let videoDevices = request.deviceList.filter(d => d.kind == "videoinput" && d.deviceId != "virtual");
//           const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId);
//           if (defaultDevice.length > 0) {
//             chrome.storage.sync.set({ defaultVideoId: defaultVideoId[0].deviceId});
//             chrome.storage.sync.set({ citbCam: true});
//             sendResponse({defaultDevice : defaultVideoId[0].deviceId } )
//           }else{
//             chrome.storage.sync.set({ citbCam: false}); 
//             imprimir();           
//           }
//         });         
//       chrome.scripting.executeScript({ 
//         target: { tabId: sender.tab.id }, 
//         function: webFormContainer
//       }); 
//       const css = '#buttonsContainer:hover { background-color: red; !important } #buttonsShow:hover { background-color: red; !important } #buttonsClose:hover { background-color: red; !important } #buttonsDrag:hover { background-color: red; !important } #buttonsCam:hover { background-color: red; !important }';
//       chrome.scripting.insertCSS(
//           {
//             target: {tabId: sender.tab.id},
//             css: css,
//           }
//       );
//     } else if(request.greeting === "X"){
//         sendResponse({farewell: "X back response1"});
//     }
//   } 
// ); 


chrome.runtime.onMessage.addListener( 
    function(request, sender, sendResponse) { 
      if (request.deviceList) {
        console.log(request.deviceList);//OJO
        chrome.storage.sync.get( 'defaultVideoId' ,({ defaultVideoId }) => {
          let videoDevices = request.deviceList.filter(d => d.kind == "videoinput" && d.deviceId != "virtual");
          const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId);
          if (defaultDevice.length > 0) {
            chrome.storage.sync.set({ defaultVideoId: defaultVideoId[0].deviceId});
            chrome.storage.sync.set({ citbCam: true});
            sendResponse({defaultDevice : defaultVideoId[0].deviceId } )
          }else{
            chrome.storage.sync.set({ citbCam: false}); 
            imprimir();           
          }
        });         
      chrome.scripting.executeScript({ 
        target: { tabId: sender.tab.id }, 
        function: webFormContainer
      }); 
      const css = '#buttonsContainer:hover { background-color: red; !important } #buttonsShow:hover { background-color: red; !important } #buttonsClose:hover { background-color: red; !important } #buttonsDrag:hover { background-color: red; !important } #buttonsCam:hover { background-color: red; !important }';
      chrome.scripting.insertCSS(
          {
            target: {tabId: sender.tab.id},
            css: css,
          }
      );
    }
     else if(request.greeting === "drag"){
        chrome.scripting.executeScript(
          {
            target: {tabId: sender.tab.id},
            files: ['test2.js']
          });
          sendResponse({farewell: "drag back response"});
    }else if(request.greeting === "buttonsOpen"){
        sendResponse({farewell: "closeContainer back response"});
    }
  } 
); 

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'citbCam' && changes.options?.newValue) {
    console.log("Change the citbCam");
  }
});