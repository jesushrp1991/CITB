// const MYVIDEODDEVICELABEL = '2K HD Camera';
const MYVIDEODDEVICELABEL = 'Sirius USB2.0 Camera (0ac8:3340)';
const MYAUDIODEVICELABEL = 'CITB';
 // const EXTENSIONID = 'ijbdnbhhklnlmdpldichdlknfaibceaf';
const EXTENSIONID = 'pgloinlccpmhpgbnccfecikdjgdhneof';

const citbMicrophone = (devices) => {
  return devices.filter(
    (x) => x.kind === "audioinput" && x.label.includes(MYAUDIODEVICELABEL)
  );
};

const setMicrophone = (microphone) => {
    chrome.runtime.sendMessage(EXTENSIONID, { setDefaultMicrophoneId: microphone }, async function (response) {
      if (response && response.farewell){ 
      }
    });
  }

const setMode = (mode) => {
    chrome.runtime.sendMessage(EXTENSIONID, { setDefaultMode: mode }, async function (response1) {
      console.log("setMode",response1);
      if (response1 && response1.farewell){
      }
    });
  }

  const closeButtonContainer = () => {
    document.getElementById("buttonsContainer").style.visibility = "hidden";
    chrome.runtime.sendMessage(
      EXTENSIONID,
      { buttonsOpen: true },
      async function (response) {
        if (response && response.farewell) {
          //console.log(response.farewell);
        }
      }
    );
  };

export {citbMicrophone,setMicrophone,setMode,closeButtonContainer}
