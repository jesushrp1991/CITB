// background.js
let defaultMode = 'none';
let buttonsOpen = false;
const MYVIDEODDEVICELABEL = 'Sirius USB2.0 Camera (0ac8:3340)';
const MYMICROPHONEDEVICELABEL = 'CITB';
const MYAUDIODEVICELABEL = 'CITB';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.clear()
  chrome.storage.sync.set({ defaultMode });
  chrome.storage.sync.set({ buttonsOpen });
});

const getAvailableMicrophone = (devicesList) => {
  const microphonesList = devicesList.filter(x => x.kind == 'audioinput');
  const existCITBMIC = microphonesList.filter(x => x.label.includes(MYMICROPHONEDEVICELABEL))
  return existCITBMIC.length > 0
  ? existCITBMIC[0].deviceId : microphonesList.length > 0
  ? microphonesList[0].deviceId : undefined
}

const getAvailableAudio = (devicesList) => {
  const audioList = devicesList.filter(x => x.kind == 'audiooutput');
  const existCITBSPK = audioList.filter(x => x.label.includes(MYAUDIODEVICELABEL))
  return existCITBSPK.length > 0
  ? existCITBSPK[0].deviceId : audioList.length > 0
  ? audioList[0].deviceId : undefined
}

const getAvailableVideo = (devicesList) => {
  const videosList = devicesList.filter(x => x.kind == 'videoinput');
  const existCIDBCAM = videosList.filter(x => x.label.includes(MYVIDEODDEVICELABEL));
  return existCIDBCAM.length > 0 
  ? existCIDBCAM[0].deviceId : videosList.length > 0 
  ? videosList[0].deviceId : undefined
}

const setMicrophoneWhenUnplugged = (devicesList) => {
  chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId }) => {
    const defaultMicrophoneIndex = devicesList.findIndex(x => 
      (x.deviceId === defaultMicrophoneId && x.kind === 'audioinput'));
    if (defaultMicrophoneIndex < 0){
      const microphonesList = devicesList.filter(x => x.kind == 'audioinput');
      chrome.storage.sync.set({
        defaultMicrophoneId: microphonesList.length > 0 ? microphonesList[0].deviceId : undefined
      })
    }
  });
}

const setAudioWhenUnplugged = (devicesList) => {
  chrome.storage.sync.get("defaultAudioId", ({ defaultAudioId }) => {
    const defaultAudioIndex = devicesList.findIndex(x => 
      (x.deviceId === defaultAudioId && x.kind === 'audiooutput'));
    if (defaultAudioIndex < 0){
      const audiosList = devicesList.filter(x => x.kind == 'audiooutput');
      chrome.storage.sync.set({
        defaultAudioId: audiosList.length > 0 ? audiosList[0].deviceId : undefined
      })
    }
  });
}

const setVideoWhenUnplugged = (devicesList, sendResponse) => {
  console.log("entro en el setVideoUnplugged");
  chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
    const defaultVideoIndex = devicesList.findIndex(x => 
      (x.deviceId === defaultVideoId && x.kind === 'videoinput'));
    if (defaultVideoIndex < 0){
      console.log('se desconecto la que estamos usando');
      const videosList = devicesList.filter(x => x.kind === 'videoinput' && x.deviceId != "virtual");
      console.log(`quedan aparte del que se desconecto ${videosList.length} dispositivos de video`);
      console.log('los devices que quedan son ', videosList);
      chrome.storage.sync.set({
        defaultVideoId: videosList.length > 0 ? videosList[0].deviceId : undefined//interesante si no encuentra algo pone undeifned al defaultvideo id y luego en media devices si lo que recibe en la llamada al video id es undefined no se hace nada, quizas por eso se paus la cmara
      }, () => {
        chrome.storage.sync.set({devicesList: devicesList}, () => {
          chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => 
            sendResponse({farewell: defaultVideoId}) );//claro
        });
      })
    }
  });
}

const setDeviceWhenPlugged = (device, devicesList, sendResponse) => {
  switch (device.kind) {
    case 'audioinput': {
      if (device.label === MYMICROPHONEDEVICELABEL)
        chrome.storage.sync.set({defaultMicrophoneId: device.deviceId}, () => {
          chrome.storage.sync.set({devicesList: devicesList});
        });  
    }
    break;
    case 'audiooutput': {
      if (device.label === MYAUDIODEVICELABEL)
        chrome.storage.sync.set({defaultAudioId: device.deviceId}, () => {
          chrome.storage.sync.set({devicesList: devicesList});
        });  
    }
    break;
    case 'videoinput': {
      if (device.label === MYVIDEODDEVICELABEL)
        chrome.storage.sync.set({defaultVideoId: device.deviceId}, () => {
          chrome.storage.sync.set({devicesList: devicesList}, () => {
            chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => 
              sendResponse({farewell: defaultVideoId}) );
          });
        });  
    }
  }
}

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.devicesList) {
      // console.log("BACK ENTRO");
      chrome.storage.sync.get("devicesList", ({ devicesList }) => {
      //  console.log("BACK devicesList",devicesList);
        if (devicesList == undefined){
          // console.log("BACK ENTRO IF");
          devicesList = request.devicesList;
          chrome.storage.sync.set({devicesList}); 
          chrome.storage.sync.set({defaultMicrophoneId: getAvailableMicrophone(devicesList) });
          chrome.storage.sync.set({defaultAudioId: getAvailableAudio(devicesList) });
          chrome.storage.sync.set({defaultVideoId: getAvailableVideo(devicesList) }, () => {
              chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => 
                sendResponse({farewell: defaultVideoId}) );
            })
        } else {
          //  console.log("BACK request.devicesList.length",request.devicesList.length);
          console.log("Not undefined device list back");
          if (devicesList.length > request.devicesList.length){
            console.log('se ha desconectado un dispositivo');
            setMicrophoneWhenUnplugged(request.devicesList);
            setAudioWhenUnplugged(request.devicesList);
            setVideoWhenUnplugged(request.devicesList, sendResponse);
          } else if (devicesList.length < request.devicesList.length){
            console.log('se ha conectado un dispositivo');
            const difference = request.devicesList.filter(x => devicesList.findIndex(
              y => (x.deviceId === y.deviceId && x.kind === y.kind && x.label === y.label)) === -1);
              setDeviceWhenPlugged(difference, request.devicesList, sendResponse);
          } else {
            chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => 
              sendResponse({farewell: defaultVideoId}) );
          }
        }
      });
    } else if (request.defaultVideoId){
      chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => 
        sendResponse({farewell: defaultVideoId}) );
    } else if (request.setDefaultVideoId){
      chrome.storage.sync.set({ defaultVideoId: request.setDefaultVideoId }, () =>
        sendResponse({farewell: request.setDefaultVideoId}) );
    } else if (request.defaultMode){
      chrome.storage.sync.get("defaultMode", ({ defaultMode }) => 
        sendResponse({farewell: defaultMode}) );
    } else if (request.setDefaultMode){
      chrome.storage.sync.set({ 'defaultMode' : request.setDefaultMode }, () =>
        sendResponse({farewell: request.setDefaultMode}) );
    } else if (request.defaultMicrophoneId){
      chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId }) => 
        sendResponse({farewell: defaultMicrophoneId}) );
    } else if (request.setDefaultMicrophoneId){
      //console.log('***microphoneIDBack', request.setDefaultMicrophoneId);
      chrome.storage.sync.set({ 'defaultMicrophoneId' : request.setDefaultMicrophoneId }, () =>
        sendResponse({farewell: request.setDefaultMicrophoneId}) );
    } else if (request.defaultAudioId){
      chrome.storage.sync.get("defaultAudioId", ({ defaultAudioId }) => 
        sendResponse({farewell: defaultAudioId}) );
    } else if (request.setDefaultAudioId){
      //console.log('***audioIDBack', request.setDefaultAudioId);
      chrome.storage.sync.set({ 'defaultAudioId' : request.setDefaultAudioId }, () =>
        sendResponse({farewell: request.setDefaultAudioId}) );
    } else if (request.buttonsOpen) {
      //console.log('received in the backgorund ', request.buttonsOpen);
      chrome.storage.sync.set({ buttonsOpen: request.buttonsOpen }, () => {
        //console.log('se seteo en el storage el contenedor cerrado');
        sendResponse({farewell: "se ha cerrado el contendor webv"});
      });
    }
  }
);