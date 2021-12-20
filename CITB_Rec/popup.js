import {
    countVideoRecordTime,
    stopVideoRecordTime,
} from './js/recTimer.js'

import {
    checkUploadStatus
} from './js/progressBar.js'

const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg, (response) => {         
    });
}
let isRec = true;
let intervalCounter;

const sendRecordCommand = () =>{
    intervalCounter = countVideoRecordTime(isRec);
    const request = { recordingStatus: 'rec' };
    buttonRec.getAttribute('class') ==  'buttonRecOn' 
        ?  buttonRec.setAttribute('class','buttonRecOff')
        :  buttonRec.setAttribute('class','buttonRecOn') ;
    sendMessage(request);
}

const getCurrentState = () =>{
    chrome.storage.sync.get('isRecording', function(result) {
        if (result.isRecording ){
            buttonRec.setAttribute('class','buttonRecOn') 
            isRec = true;
            intervalCounter = countVideoRecordTime(isRec);
        }else{
            buttonRec.setAttribute('class','buttonRecOff');
            stopVideoRecordTime();
        }
    });
    chrome.storage.sync.get('isPaused', function(result) {
        if(result.isPaused ){
            isRec = false;
            buttonPlayPause.setAttribute('class','buttonPlay') 
        }else{
            isRec = true;
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
        isRec = false;
        clearInterval(intervalCounter);
        intervalCounter = countVideoRecordTime(isRec);
    }else{
        buttonPlayPause.setAttribute('class','buttonPause');
        isRec = true;
        clearInterval(intervalCounter);
        intervalCounter = countVideoRecordTime(isRec);
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



checkUploadStatus();
getCurrentState();