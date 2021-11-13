'use strict';

let firstTime = true;
let isCitbMicrophonePlugged;
let lastCitbMicStatus;
let globalState;

//const MYAUDIODEVICELABEL ="CITB"
//const MYAUDIODEVICELABEL = "Comunicaciones - Micrófono (Realtek High Definition Audio)"
const MYAUDIODEVICELABEL = "Micrófono (DroidCam Virtual Audio)"

const alertPopup = () =>{  
    const test = document.getElementById("buttonSimplePopup"); 
    test.click() 
}


const getExtensionGlobalState = () => { 
    chrome.storage.sync.get('extensionGlobalState', (data) => {
      globalState = data.extensionGlobalState;   
      console.log(globalState);      
    })   
}

getExtensionGlobalState();

const checkMediaDevice = async () => {
    const devicesList = await navigator.mediaDevices.enumerateDevices();    
    let result = devicesList.filter((device) =>
        device.kind === "audioinput" &&
        device.label.includes(MYAUDIODEVICELABEL)
    );
    result.length > 0 ? isCitbMicrophonePlugged = true : isCitbMicrophonePlugged = false
    console.log('isCitbMicrophonePlugged :', isCitbMicrophonePlugged);
    /*if (firstTime) {        
        firstTime = false;   
        console.log('firstTime ');
      }else {
        console.log('Not firstTime')
        getExtensionGlobalState();
        console.log('globalState ',globalState);
        if (lastCitbMicStatus !== isCitbMicrophonePlugged) {
          if (isCitbMicrophonePlugged ){
            alert(`The CITB microphone has been connected.
            To start using CITB, click on the extension ON/OFF icon`)
          }else {
            if (globalState == 'on') {
                chrome.storage.sync.set({ extensionGlobalState: "off" })
                alert(`The CITB microphone has been disconnected.
                The page will be reloaded to apply changes`);
                window.location.reload();
              }else 
                alert("The CITB microphone has been disconnected")
          }        
        }        
      }
      lastCitbMicStatus = isCitbMicrophonePlugged; */
      setTimeout(() => {
        checkMediaDevice();
      }, 1000);
}

checkMediaDevice();

const injection = () => {
    chrome.storage.sync.get('extensionGlobalState', (data) => {
        console.log('inicio el inject')
        const scriptpopup = document.createElement('script');
        scriptpopup.setAttribute("type", "module");
        scriptpopup.setAttribute("src", chrome.runtime.getURL('js/alertPopup.js'));
        const headpopup = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        headpopup.insertBefore(scriptpopup, headpopup.firstChild);

        const scriptAlertMic = document.createElement('script');
        scriptAlertMic.setAttribute("type", "module");
        scriptAlertMic.setAttribute("src", chrome.runtime.getURL('js/alertPopupMic.js'));
        const headAlertMic = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        headAlertMic.insertBefore(scriptAlertMic, headAlertMic.firstChild);

        /*const scriptCheckMedia = document.createElement('script');
        scriptCheckMedia.setAttribute("type", "module");
        scriptCheckMedia.setAttribute("src", chrome.runtime.getURL('js/standby-check-media-devices.js'));
        const headCheckMedia = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        headCheckMedia.insertBefore(scriptCheckMedia, headCheckMedia.firstChild);*/

        console.log('extensionGlobalState :', data.extensionGlobalState);

        if (data.extensionGlobalState == "on") {
            if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.microsoft.com' || window.location.host == 'teams.live.com') {
                if (isCitbMicrophonePlugged) {
                    // const help = document.createElement('script');
                    // help.setAttribute("type", "module");
                    // help.setAttribute("src", chrome.runtime.getURL('helper/helper.js'));
                    // const helphead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    // helphead.insertBefore(help, helphead.firstChild);

                    const script = document.createElement('script');
                    script.setAttribute("type", "module");
                    script.setAttribute("src", chrome.runtime.getURL('js/media-devices.js'));
                    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    head.insertBefore(script, head.firstChild);

                    const annyangScript = document.createElement('script');
                    annyangScript.setAttribute("type", "module");
                    annyangScript.setAttribute("src", chrome.runtime.getURL('js/managers/voiceManager/annyang.min.js'));
                    const annyangScriptHead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    head.insertBefore(annyangScript, annyangScriptHead.firstChild);
                }else {
                    chrome.storage.sync.set({ extensionGlobalState: "off" })
                   
                }

            }
        }
    })
}
setTimeout(injection, 2000);