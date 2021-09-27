const extensionId = 'bpdebpeagmcjmefelbfdkobnojlifbnp';
const getButtonShow = () => {
    const buttonShow = document.createElement('button');
    buttonShow.style.width = '40px';
    buttonShow.style.height = '40px';
    buttonShow.style.borderRadius = '40px';
    buttonShow.style.backgroundColor = 'transparent';
    buttonShow.style.padding = '0px';
    buttonShow.style.border = 'none';
    buttonShow.style.margin = '0px';
    return buttonShow;
}

const getButtonClass = () => {
    const buttonClass = document.createElement('button');
    buttonClass.style.width = '40px';
    buttonClass.style.height = '40px';
    buttonClass.style.borderRadius = '40px';
    buttonClass.style.backgroundColor = 'transparent';
    buttonClass.style.padding = '0px';
    buttonClass.style.border = 'none';
    buttonClass.style.margin = '0px';
    return buttonClass;
}

const getButtonCam = () => {
    const buttonCam = document.createElement('button');
    buttonCam.style.width = '40px';
    buttonCam.style.height = '40px';
    buttonCam.style.borderRadius = '40px';
    buttonCam.style.backgroundColor = 'transparent';
    buttonCam.style.padding = '0px';
    buttonCam.style.border = 'none';
    buttonCam.style.margin = '0px';
    return buttonCam; 
}

const getContainerButton = () => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.zIndex = 999;
    div.style.top = '60px';
    div.style.right = '16px';
    return div;
}

const setMicrophone = (microphone) => {
    console.log('***microphoneIDsent', microphone);
    chrome.runtime.sendMessage(extensionId, { setDefaultMicrophoneId: microphone }, async function (response) {
      if (response && response.farewell){ 
      }
    });
  }

  const setMode = (mode) => {
    console.log('***voy a mandar hacia el back ', mode)
    chrome.runtime.sendMessage(extensionId, { setDefaultMode: mode }, async function (response1) {
      if (response1 && response1.farewell){
        // window.assignModes();
      }
    });
  }

  const setVideo = (videoId) => {
    chrome.runtime.sendMessage(extensionId, { setDefaultVideoId: videoId }, async function (response) {
      if (response && response.farewell){
        console.log('todo ha ido bien');
      }
    });
  }

export { 
    getButtonShow,
    getButtonClass,
    getButtonCam,
    getContainerButton,
    setMicrophone,
    setMode,
    setVideo,
}