import {
    checkUploadStatus
} from './js/progressBar.js'
import { checkTimer } from './js/timerBar.js';

const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg, (response) => {         
    });
}
const sendRecordCommand = () =>{
    if(buttonRec.getAttribute('class') ==  'buttonRecOn' ){
        buttonRec.setAttribute('class','buttonRecOff');
        buttonStop.setAttribute('class','stopButtonOff littleButton');
        buttonPlayPause.setAttribute('class','buttonPauseDisable littleButton');
        buttonRec.disabled = false;
        buttonStop.disabled = true;
        buttonPlayPause.disabled = true;
    }else{
        
        buttonRec.setAttribute('class','buttonRecOn') ;
        buttonStop.setAttribute('class','stopButton littleButton') ;
        buttonPlayPause.setAttribute('class','buttonPause littleButton');
        buttonRec.disabled = true;
        buttonStop.disabled = false;
        buttonPlayPause.disabled = false;
    }
    const request = { recordingStatus: 'rec' , idMic: select.value };
    sendMessage(request);
}

const getCurrentState = () =>{
    let isRec = false;
    chrome.storage.sync.get('isRecording', function(result) {
        if (result.isRecording ){
            isRec = result.isRecording;
            buttonRec.setAttribute('class','buttonRecOn') 
            buttonStop.setAttribute('class','stopButton littleButton');
            buttonRec.disabled = true;
            buttonStop.disabled = false;
            buttonPlayPause.disabled = false;
        }else{
            buttonRec.setAttribute('class','buttonRecOff');
            buttonStop.setAttribute('class','stopButtonOff littleButton') ;
            buttonPlayPause.setAttribute('class','buttonPauseDisable littleButton');
            buttonRec.disabled = false;
            buttonStop.disabled = true;
            buttonPlayPause.disabled = true;
        }
    });
    chrome.storage.sync.get('isPaused', function(result) {
        if(!isRec){
            buttonPlayPause.setAttribute('class','buttonPauseDisable littleButton');
        }else{
            if(result.isPaused ){
                console.log("Is paused")
                buttonPlayPause.setAttribute('class','buttonPauseOff littleButton');
            }else{
                buttonPlayPause.setAttribute('class','buttonPause littleButton');
            }
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
    if(buttonPlayPause.getAttribute('class').includes('buttonPauseOff')){
        buttonPlayPause.setAttribute('class','buttonPause littleButton')
    }else{
        buttonPlayPause.setAttribute('class','buttonPauseOff littleButton');
    }
    sendMessage(request);
}

const activateVoiceControl = () =>{
    const request = { recordingStatus: 'voiceOpen' };
    if(buttonVoiceControl.getAttribute('class') ==  'voiceControlOff' ){
        buttonVoiceControl.setAttribute('class','voiceControl')
        sendMessage(request);
        chrome.runtime.openOptionsPage(()=>{});
    }else{
        const request = { recordingStatus: 'voiceClose' };
        sendMessage(request);
        buttonVoiceControl.setAttribute('class','voiceControlOff');
    }
}

let select = document.getElementById('miclist');
const populateMicSelect = async () => {
    let micList = await navigator.mediaDevices.enumerateDevices();
    let usableMic = micList.filter((x) =>  x.kind === "audioinput" && !x.label.includes('CITB'));    
    let citb = micList.filter((x) => x.kind === "audioinput" && x.label.includes('CITB'));
    let organizedMicList = [];
    console.log(citb);
    if(citb.length > 0){
        organizedMicList.push(citb[0]);
        organizedMicList = organizedMicList.concat(usableMic);
    }else{
        organizedMicList = usableMic;
    }
    console.log(organizedMicList);
    
    while (select.options.length > 0) {                
        select.remove(0);
    }  
    organizedMicList.forEach(element => {
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

const getShareLink = () =>{
    chrome.storage.sync.get('isRecording', function(result) {
        var formattedBody = "Hola! \n te comparto mi grabación hecha con CITB_REC \n" + result.drivelink;
        var email = prompt("Email to share.");
        var mailToLink = "mailto:" + email + "?body=" + encodeURIComponent(formattedBody);     

        console.log(mailToLink);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = mailToLink;
        a.click();
        a.parentNode.removeChild(a);
        
    });


}


const checkAut = () => {
    const request = { recordingStatus: 'checkAuth' };
    sendMessage(request);
}

let buttonRec = document.getElementById("recButton");
buttonRec.addEventListener('click',sendRecordCommand);

let buttonStop = document.getElementById("stopButton");
buttonStop.disabled = true;
buttonStop.addEventListener('click',sendRecordCommand);

let buttonPlayPause = document.getElementById("playPauseButton");
buttonPlayPause.disabled = true;
buttonPlayPause.addEventListener('click',playPause);

let buttonVoiceControl = document.getElementById("voiceControlButton");
buttonVoiceControl.addEventListener('click',activateVoiceControl);

let buttonLocalDownload = document.getElementById("localDownloadButton");
buttonLocalDownload.addEventListener('click',localDownload);

let buttonShare = document.getElementById("shareButton");
buttonShare.addEventListener('click',getShareLink);


checkAut();
populateMicSelect();
checkTimer();
checkUploadStatus();
getCurrentState();

setInterval(getCurrentState,2000);
