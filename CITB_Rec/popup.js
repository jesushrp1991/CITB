import {
    countVideoRecordTime,
    stopVideoRecordTime,
} from './js/util.js'

import {
    checkUploadStatus
} from './js/progressBar.js'

const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg, (response) => {         
    });
}
let isRec = true;

const sendRecordCommand = () =>{
    countVideoRecordTime(isRec);
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
            countVideoRecordTime(isRec);
        }else{
            buttonRec.setAttribute('class','buttonRecOff');
        }
    });
    chrome.storage.sync.get('isPaused', function(result) {
        result.isPaused 
            ?  buttonPlayPause.setAttribute('class','buttonPlay') 
            :  buttonPlayPause.setAttribute('class','buttonPause');
    });
}

let buttonRec = document.getElementById("recButton");
buttonRec.addEventListener('click',sendRecordCommand);


const playPause = () =>{
    const request = { recordingStatus: 'pause' };
    if(buttonPlayPause.getAttribute('class') ==  'buttonPause' ){
        buttonPlayPause.setAttribute('class','buttonPlay')
        isRec = true;
    }else{
        buttonPlayPause.setAttribute('class','buttonPause');
        isRec = false;
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