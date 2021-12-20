import {
    start,
    stop,
    reset
} from './js/recTimer.js'

import {
    checkUploadStatus
} from './js/progressBar.js'

const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg, (response) => {         
    });
}
const sendRecordCommand = () =>{
    const request = { recordingStatus: 'rec' };
    if(buttonRec.getAttribute('class') ==  'buttonRecOn' ){
        buttonRec.setAttribute('class','buttonRecOff');
        reset();
    }else{
        buttonRec.setAttribute('class','buttonRecOn') ;
        start();
    }  
    sendMessage(request);
}

const getCurrentState = () =>{
    chrome.storage.sync.get('isRecording', function(result) {
        if (result.isRecording ){
            console.log("Is Recording")
            buttonRec.setAttribute('class','buttonRecOn') 
            start();
        }else{
            buttonRec.setAttribute('class','buttonRecOff');
            reset();
        }
    });
    chrome.storage.sync.get('isPaused', function(result) {
        if(result.isPaused ){
            console.log("Is paused")
            buttonPlayPause.setAttribute('class','buttonPlay');
            stop();
        }else{
            buttonPlayPause.setAttribute('class','buttonPause');
        } 
    });
}

let buttonRec = document.getElementById("recButton");
buttonRec.addEventListener('click',sendRecordCommand);


const playPause = () =>{
    const request = { recordingStatus: 'pause' };
    if(buttonPlayPause.getAttribute('class') ==  'buttonPause' ){
        buttonPlayPause.setAttribute('class','buttonPlay')
        stop();
    }else{
        buttonPlayPause.setAttribute('class','buttonPause');
        start();
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
    
}
let buttonVoiceControl = document.getElementById("voiceControlButton");
buttonVoiceControl.addEventListener('click',activateVoiceControl);

checkUploadStatus();
getCurrentState();