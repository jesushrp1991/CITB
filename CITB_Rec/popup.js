import {
    checkUploadStatus
} from './js/progressBar.js'
import { checkTimer } from './js/timerBar.js';

const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg);
}

const rec = (isTabForMac) =>{
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
    const request = { recordingStatus: 'rec' , idMic: select.value ,idTab : isTabForMac};
    sendMessage(request);
}
const sendRecordCommand = () =>{
    let userAgentData = navigator.userAgentData.platform.toLowerCase().includes('mac');
    if(userAgentData){//quitar Negacion  para mac!!!
        chrome.tabs.getSelected(null, function(tab) {
                rec(tab.id);
        });
    }else{
        rec()
    }
    
    
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
    if(citb.length > 0){
        organizedMicList.push(citb[0]);
        organizedMicList = organizedMicList.concat(usableMic);
    }else{
        confirm("The poor noise reductions characteristics of most market's microphones will create echo. Unless you buy Class In The Boss, the noice cancellation market's lider.")
        organizedMicList = usableMic;
    }
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
    // chrome.tabs.create({active: false}, function(newTab) {
    //     chrome.tabs.create({ url: chrome.extension.getURL('videoManager.html') });

    // });
    const request = { recordingStatus: 'localDownload' };
    sendMessage(request);
}

const getShareLink = () =>{
    chrome.storage.sync.get('shareLink', function(result) {        
        let url = `https://mail.google.com/mail/u/0/?fs=1&su=CITB%20Record&body=${encodeURIComponent(result.shareLink)}&&tf=cm`
        chrome.tabs.create({active: true, url: url});
    });
}

const shareWhatsapp = () =>{
    chrome.storage.sync.get('shareLink', function(result) {
        let url = `https://wa.me?text=${encodeURIComponent(result.shareLink)}`;        
        chrome.tabs.create({active: true, url: url});
    });
}

const shareClassRoom = () =>{   
    chrome.storage.sync.get('shareLink', function(result) {   
        let url = `https://classroom.google.com/share?url=${encodeURIComponent(result.shareLink)}`;        
        chrome.tabs.create({active: true, url: url});
    });
}

const shareTwitter = () =>{   
    chrome.storage.sync.get('shareLink', function(result) {   
        let url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.shareLink)}`;        
        chrome.tabs.create({active: true, url: url});
    });
}
const shareWakelet = () =>{   
    chrome.storage.sync.get('shareLink', function(result) {   
        let url = `https://wakelet.com/save?self=1&media=${encodeURIComponent(result.shareLink)}`;        
        chrome.tabs.create({active: true, url: url});
    });
}


const checkAut = () => {
    const request = { recordingStatus: 'checkAuth' };
    sendMessage(request);
}

const showRecList = () => {
    const request = { recordingStatus: 'showRecList' };
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

let buttonRecList = document.getElementById("recListButton");
buttonRecList.addEventListener('click',showRecList);

let shareGmailButton = document.getElementById("shareGmail");
shareGmailButton.addEventListener('click',getShareLink);

let shareWhatsappButton = document.getElementById("shareWhatsapp");
shareWhatsappButton.addEventListener('click',shareWhatsapp);

let shareClassRoomButton = document.getElementById("shareClassRoom");
shareClassRoomButton.addEventListener('click',shareClassRoom);

let shareTwitterButton = document.getElementById("shareTwitter");
shareTwitterButton.addEventListener('click',shareTwitter);

let shareWakeletButton = document.getElementById("shareWakelet");
shareWakeletButton.addEventListener('click',shareWakelet);


checkAut();
populateMicSelect();
checkTimer();
checkUploadStatus();
getCurrentState();

setInterval(getCurrentState,2000);
