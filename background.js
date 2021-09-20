// background.js

let defaultMicrophoneId = undefined;
let defaultSpeakerId = undefined;
let defaultVideoId = undefined;
let devicesList = [];
let defaultMode = 'show';
const MYVIDEODDEVICELABEL = 'U2K HD Camera (1b3f:1167)';

chrome.runtime.onInstalled.addListener(() => {
  //TODO it would be possible to initialize defaults here
  chrome.storage.sync.clear(() => {
    console.log('limpio el cache de chrome')
  })
  chrome.storage.sync.set({ defaultMode });
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.devicesList) {
      chrome.storage.sync.get("devicesList", ({ devicesList }) => {
        if (devicesList == undefined){
          devicesList = request.devicesList;
          chrome.storage.sync.set({devicesList});
          const microphonesList = devicesList.filter(x => x.kind == 'audioinput');
          const videosList = devicesList.filter(x => x.kind == 'videoinput');
          chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId }) => {
            if (!defaultMicrophoneId) {
              chrome.storage.sync.set({defaultMicrophoneId: microphonesList[0].deviceId});
            }
          });
          const existCIDB = videosList.filter(x => x.label === MYVIDEODDEVICELABEL);
          chrome.storage.sync.set({defaultVideoId: existCIDB.length > 0 
            ? existCIDB[0].deviceId : videosList.length > 0 
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
                chrome.storage.sync.set({defaultMicrophoneId: difference[0].deviceId}, () => {
                });
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
            console.log('la lista de dispositivos no ha cambiado')
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
    }
      
  }
);