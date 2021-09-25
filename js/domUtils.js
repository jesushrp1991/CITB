const getButtonShow = () => {
    const buttonShow = document.createElement('button');
    buttonShow.style.width = '40px';
    buttonShow.style.height = '40px';
    buttonShow.style.borderRadius = '40px';
    buttonShow.style.margin = '5px';
    return buttonShow;
}

const getButtonClass = () => {
    const buttonClass = document.createElement('button');
    buttonClass.style.width = '40px';
    buttonClass.style.height = '40px';
    buttonClass.style.borderRadius = '40px'
    buttonClass.style.margin = '5px'
    return buttonClass;
}

const getButtonCam = () => {
    const buttonCam = document.createElement('button');
    buttonCam.style.width = '40px';
    buttonCam.style.height = '40px';
    buttonCam.style.borderRadius = '40px'
    buttonCam.style.margin = '5px'
    return buttonCam;
}

const getContainerButton = () => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.zIndex = 999;
    div.style.top = '50px';
    div.style.right = '10px';
    return div;
}

const setMicrophone = (microphone) => {
    console.log('***microphoneIDsent', microphone);
    chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { setDefaultMicrophoneId: microphone }, async function (response) {
      if (response && response.farewell){ 
      }
    });
  }

  const setMode = (mode) => {
    console.log('***voy a mandar hacia el back ', mode)
    chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { setDefaultMode: mode }, async function (response1) {
      if (response1 && response1.farewell){
        // window.assignModes();
      }
    });
  }

  const setVideo = (videoId) => {
    chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { setDefaultVideoId: videoId }, async function (response) {
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