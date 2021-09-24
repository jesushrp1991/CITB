// background.js
let defaultMode = 'show';
const MYVIDEODDEVICELABEL = 'EasyCamera';
const MYAUDIODEVICELABEL = 'Predeterminado - Micrófono';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.clear()
  chrome.storage.sync.set({ defaultMode });
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.devicesList) {
      chrome.storage.sync.get("devicesList", ({ devicesList }) => {
        if (devicesList == undefined){
          devicesList = request.devicesList;
          chrome.storage.sync.set({devicesList});
          const microphonesList = devicesList.filter(x => x.kind == 'audioinput');
          const videosList = devicesList.filter(x => x.kind == 'videoinput');
          const existCITBMIC = microphonesList.filter(x => x.label.includes(MYAUDIODEVICELABEL))
          chrome.storage.sync.set({defaultMicrophoneId: existCITBMIC.length > 0
            ? existCITBMIC[0].deviceId : microphonesList.length > 0
            ? microphonesList[0].deviceId : undefined })
          const existCIDBCAM = videosList.filter(x => x.label.includes(MYVIDEODDEVICELABEL));
          chrome.storage.sync.set({defaultVideoId: existCIDBCAM.length > 0 
            ? existCIDBCam[0].deviceId : videosList.length > 0 
            ? videosList[0].deviceId : undefined }, () => {
              chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
                sendResponse({farewell: defaultVideoId});
              });
            })
        } else {
          if (devicesList.length > request.devicesList.length){
            console.log('se ha desconectado un dispositivo');
            chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId }) => {
              const defaultMicrophoneIndex = request.devicesList.findIndex(x => 
                (x.deviceId === defaultMicrophoneId.deviceId && x.kind === 'audioinput'));
              if (defaultMicrophoneIndex < 0){
                const microphonesList = devicesList.filter(x => x.kind == 'audioinput');
                if (microphonesList.length > 0){
                  chrome.storage.sync.set({defaultMicrophoneId: microphonesList[0].deviceId});
                }else{
                  chrome.storage.sync.set({defaultMicrophoneId: undefined});
                }
              }
            });
            chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
              const defaultVideoIndex = request.devicesList.findIndex(x => 
                (x.deviceId === defaultVideoId.deviceId && x.kind === 'videoinput'));
              if (defaultVideoIndex < 0){
                const videosList = devicesList.filter(x => x.kind == 'videoinput');
                if (videosList.length > 0){
                  chrome.storage.sync.set({defaultVideoId: videosList[0].deviceId}, () => {
                    chrome.storage.sync.set({devicesList: request.devicesList}, () => {
                      chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
                        sendResponse({farewell: defaultVideoId});
                      });
                    });
                  });
                }else{
                  chrome.storage.sync.set({defaultVideoId: undefined}, () => {
                    chrome.storage.sync.set({devicesList: request.devicesList}, () => {
                      chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
                        sendResponse({farewell: defaultVideoId});
                      });
                    });
                  });
                }
              }
            });
          } else if (devicesList.length < request.devicesList.length){
            console.log('se ha conectado un dispositivo');
            const difference = request.devicesList.filter(x => devicesList.findIndex(
              y => (x.deviceId === y.deviceId && x.kind === y.kind && x.label === y.label)) === -1)
              if (difference[0].kind === 'audioinput'){
                if (difference[0].label === MYAUDIODEVICELABEL) {
                  chrome.storage.sync.set({defaultMicrophoneId: difference[0].deviceId}, () => {
                    chrome.storage.sync.set({devicesList: request.devicesList});
                  });  
                }
              } else if (difference[0].kind == "videoinput"){
                if (difference[0].label === MYVIDEODDEVICELABEL) {
                  chrome.storage.sync.set({defaultVideoId: difference[0].deviceId}, () => {
                    chrome.storage.sync.set({devicesList: request.devicesList}, () => {
                      chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
                        sendResponse({farewell: defaultVideoId});
                      });
                    });
                  });  
                }
              }
          } else {
            chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
              sendResponse({farewell: defaultVideoId});
            });
          }
        }
      });
    } else if (request.defaultVideoId){
      chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
        sendResponse({farewell: defaultVideoId});
      });
    } else if (request.defaultMode){
      chrome.storage.sync.get("defaultMode", ({ defaultMode }) => {
        sendResponse({farewell: defaultMode});
      });
    }
  } 
);