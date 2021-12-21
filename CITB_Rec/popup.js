import {
    checkUploadStatus
} from './js/progressBar.js'
import { checkTimer } from './js/timerBar.js'

const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg, (response) => {         
    });
}
const sendRecordCommand = () =>{
    const request = { recordingStatus: 'rec' , idMic: select.value};
    if(buttonRec.getAttribute('class') ==  'buttonRecOn' ){
        buttonRec.setAttribute('class','buttonRecOff');
        buttonStop.setAttribute('class','stopButtonOff littleButton');
        buttonRec.disabled = false;
        buttonStop.disabled = true;

    }else{
        buttonRec.setAttribute('class','buttonRecOn') ;
        buttonStop.setAttribute('class','stopButton littleButton') ;
        buttonRec.disabled = true;
        buttonStop.disabled = false;
    }
    sendMessage(request);
}

let buttonRec = document.getElementById("recButton");
buttonRec.addEventListener('click',sendRecordCommand);

let buttonStop = document.getElementById("stopButton");
buttonStop.disabled = true;
buttonStop.addEventListener('click',sendRecordCommand);


const getCurrentState = () =>{
    chrome.storage.sync.get('isRecording', function(result) {
        if (result.isRecording ){
            console.log("Is Recording")
            buttonRec.setAttribute('class','buttonRecOn') 
            buttonStop.setAttribute('class','stopButton littleButton');
            buttonRec.disabled = true;
             buttonStop.disabled = false;
        }else{
            buttonRec.setAttribute('class','buttonRecOff');
            buttonStop.setAttribute('class','stopButtonOff littleButton') ;
            buttonRec.disabled = false;
             buttonStop.disabled = true;
        }
    });
    chrome.storage.sync.get('isPaused', function(result) {
        if(result.isPaused ){
            console.log("Is paused")
            buttonPlayPause.setAttribute('class','buttonPause littleButton');
        }else{
            buttonPlayPause.setAttribute('class','buttonPauseOff littleButton');
        } 
    });
    chrome.storage.sync.get('voice', function(result) {
        if(result.voice){
            buttonVoiceControl.setAttribute('class','voiceControl')
        }else{
            buttonVoiceControl.setAttribute('class','voiceControlOff');
        }
    })

}

const playPause = () =>{
    const request = { recordingStatus: 'pause' };
    if(buttonPlayPause.getAttribute('class').includes('buttonPause')){
        buttonPlayPause.setAttribute('class','buttonPauseOff littleButton')
    }else{
        buttonPlayPause.setAttribute('class','buttonPause littleButton');
    }
    sendMessage(request);
}

let buttonPlayPause = document.getElementById("playPauseButton");
buttonPlayPause.addEventListener('click',playPause);


var port = chrome.extension.connect({
    name: "Sample Communication"
});

port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
});


const activateVoiceControl = () =>{
    const request = { recordingStatus: 'voiceOpen' };
    if(buttonVoiceControl.getAttribute('class') ==  'voiceControlOff' ){
        buttonVoiceControl.setAttribute('class','voiceControl')
        chrome.runtime.openOptionsPage(
            ()=>{
                sendMessage(request);
            }
          )
    }else{
        buttonVoiceControl.setAttribute('class','voiceControlOff');
    }
}
let buttonVoiceControl = document.getElementById("voiceControlButton");
buttonVoiceControl.addEventListener('click',activateVoiceControl);

let select = document.getElementById('miclist');
const populateMicSelect = async () => {
    let micList = await navigator.mediaDevices.enumerateDevices();
    let usableMic = micList.filter((x) =>  x.kind === "audioinput");      
    while (select.options.length > 0) {                
        select.remove(0);
    }  
    usableMic.forEach(element => {
        var option = document.createElement("option");
        option.text = element.label;
        option.value = element.deviceId;
        select.add(option);
    });
}


const localDownload = () => {
    const request = { recordingStatus: 'localDownload' };
    sendMessage(request);
}

let buttonLocalDownload = document.getElementById("localDownloadButton");
buttonLocalDownload.addEventListener('click',localDownload);

const checkAut = () => {
    const request = { recordingStatus: 'checkAuth' };
    sendMessage(request);
}

checkAut();
populateMicSelect();
checkTimer();
checkUploadStatus();
getCurrentState();