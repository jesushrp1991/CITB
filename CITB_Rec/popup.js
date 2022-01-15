// import {
//     checkUploadStatus
// } from './js/progressBar.js'
// import { checkTimer } from './js/timerBar.js';

// const sendMessage = (msg) =>{
//     chrome.runtime.sendMessage(msg);
// }

// const rec = (isTabForMac) =>{
//     if(buttonRec.getAttribute('class') ==  'buttonRecOn' ){
//         buttonRec.setAttribute('class','buttonRecOff');
//         buttonStop.setAttribute('class','stopButtonOff littleButton');
//         buttonPlayPause.setAttribute('class','buttonPauseDisable littleButton');
//         buttonRec.disabled = false;
//         buttonStop.disabled = true;
//         buttonPlayPause.disabled = true;
//     }else{
        
//         buttonRec.setAttribute('class','buttonRecOn') ;
//         buttonStop.setAttribute('class','stopButton littleButton') ;
//         buttonPlayPause.setAttribute('class','buttonPause littleButton');
//         buttonRec.disabled = true;
//         buttonStop.disabled = false;
//         buttonPlayPause.disabled = false;
//     }
//     const request = { recordingStatus: 'rec' , idMic: select.value ,idTab : isTabForMac};
//     sendMessage(request);
// }
// const sendRecordCommand = () =>{
//     let userAgentData = navigator.userAgentData.platform.toLowerCase().includes('mac');
//     if(userAgentData){
//         chrome.tabs.getSelected(null, (tab) => {
//             rec(tab.id);
//         });
//     }else{
//         rec()
//     }
    
    
// }

// const getCurrentState = () =>{
//     let isRec = false;
//     chrome.storage.sync.get('isRecording', (result) => {
//         if (result.isRecording ){
//             isRec = result.isRecording;
//             buttonRec.setAttribute('class','buttonRecOn') 
//             buttonStop.setAttribute('class','stopButton littleButton');
//             buttonRec.disabled = true;
//             buttonStop.disabled = false;
//             buttonPlayPause.disabled = false;
//         }else{
//             buttonRec.setAttribute('class','buttonRecOff');
//             buttonStop.setAttribute('class','stopButtonOff littleButton') ;
//             buttonPlayPause.setAttribute('class','buttonPauseDisable littleButton');
//             buttonRec.disabled = false;
//             buttonStop.disabled = true;
//             buttonPlayPause.disabled = true;
//         }
//     });
//     chrome.storage.sync.get('isPaused', (result) => {
//         if(!isRec){
//             buttonPlayPause.setAttribute('class','buttonPauseDisable littleButton');
//         }else{
//             if(result.isPaused ){
//                 console.log("Is paused")
//                 buttonPlayPause.setAttribute('class','buttonPauseOff littleButton');
//             }else{
//                 buttonPlayPause.setAttribute('class','buttonPause littleButton');
//             }
//         }
//     });
//     chrome.storage.sync.get('voice', (result) => {
//         if(result.voice){
//             buttonVoiceControl.setAttribute('class','voiceControl')
//         }else{
//             buttonVoiceControl.setAttribute('class','voiceControlOff');
//         }
//     })

// }


// const playPause = () =>{
//     const request = { recordingStatus: 'pause' };
//     if(buttonPlayPause.getAttribute('class').includes('buttonPauseOff')){
//         buttonPlayPause.setAttribute('class','buttonPause littleButton')
//     }else{
//         buttonPlayPause.setAttribute('class','buttonPauseOff littleButton');
//     }
//     sendMessage(request);
// }

// const activateVoiceControl = () =>{
//     const request = { recordingStatus: 'voiceOpen' };
//     if(buttonVoiceControl.getAttribute('class') ==  'voiceControlOff' ){
//         buttonVoiceControl.setAttribute('class','voiceControl')
//         sendMessage(request);
//         chrome.runtime.openOptionsPage(()=>{});
//     }else{
//         const request = { recordingStatus: 'voiceClose' };
//         sendMessage(request);
//         buttonVoiceControl.setAttribute('class','voiceControlOff');
//     }
// }

// let select = document.getElementById('miclist');
// const populateMicSelect = async () => {
//     let micList;
//     try {
//         await navigator.mediaDevices.getUserMedia({audio: true})
//         micList = await navigator.mediaDevices.enumerateDevices();
//     } catch (error) {
//         activateVoiceControl();
//     }
//     micList = await navigator.mediaDevices.enumerateDevices();
//     let usableMic = micList.filter((x) =>  x.kind === "audioinput" && !x.label.includes('CITB'));    
//     let citb = micList.filter((x) => x.kind === "audioinput" && x.label.includes('CITB'));
//     let organizedMicList = [];
//     if(citb.length > 0){
//         organizedMicList.push(citb[0]);
//         organizedMicList = organizedMicList.concat(usableMic);
//     }else{
//         organizedMicList = usableMic;
//         // confirm("The poor noise reductions characteristics of most market's microphones will create echo. Unless you buy Class In The Boss, the noice cancellation market's lider.")
//         document.getElementById('modal').style.display = 'block';
//         setInterval(()=>{
//             document.getElementById('modal').style.display = 'none';
//         },5000);
//     }
//     while (select.options.length > 0) {                
//         select.remove(0);
//     }  
//     organizedMicList.forEach(element => {
//         var option = document.createElement("option");
//         option.text = element.label;
//         option.value = element.deviceId;
//         select.add(option);
//     });
// }


// const localDownload = () => {
//     // chrome.tabs.create({active: false}, (newTab) => {
//     //     chrome.tabs.create({ url: chrome.extension.getURL('videoManager.html') });

//     // });
//     const request = { recordingStatus: 'localDownload' };
//     sendMessage(request);
// }

// const getShareLink = () =>{
//     chrome.storage.sync.get('shareLink', (result) => {  
//         let link =  "https://drive.google.com/file/d/" + result.shareLink +  "/view?usp=sharing"      
//         let url = `https://mail.google.com/mail/u/0/?fs=1&su=CITB%20Record&body=${encodeURIComponent(link)}&&tf=cm`
//         chrome.tabs.create({active: true, url: url});
//     });
// }

// const shareWhatsapp = () =>{
//     chrome.storage.sync.get('shareLink', (result) => {
//         let link =  "https://drive.google.com/file/d/" + result.shareLink +  "/view?usp=sharing"      
//         let url = `https://wa.me?text=${encodeURIComponent(link)}`;        
//         chrome.tabs.create({active: true, url: url});
//     });
// }

// const shareClassRoom = () =>{   
//     chrome.storage.sync.get('shareLink', (result) => {   
//         let link =  "https://drive.google.com/file/d/" + result.shareLink +  "/view?usp=sharing"      
//         let url = `https://classroom.google.com/share?url=${encodeURIComponent(link)}`;        
//         chrome.tabs.create({active: true, url: url});
//     });
// }

// const shareTwitter = () =>{   
//     chrome.storage.sync.get('shareLink', (result) => {   
//         let link =  "https://drive.google.com/file/d/" + result.shareLink +  "/view?usp=sharing"      
//         let url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(link)}`;        
//         chrome.tabs.create({active: true, url: url});
//     });
// }
// const shareWakelet = () =>{   
//     chrome.storage.sync.get('shareLink', (result) => {   
//         let link =  "https://drive.google.com/file/d/" + result.shareLink +  "/view?usp=sharing"      
//         let url = `https://wakelet.com/save?self=1&media=${encodeURIComponent(link)}`;        
//         chrome.tabs.create({active: true, url: url});
//     });
// }


// const checkAut = () => {
//     const request = { recordingStatus: 'checkAuth' };
//     sendMessage(request);
// }

// const showRecList = () => {
//     const request = { recordingStatus: 'showRecList' };
//     sendMessage(request);
// }

// let buttonRec = document.getElementById("recButton");
// buttonRec.addEventListener('click',sendRecordCommand);

// let buttonStop = document.getElementById("stopButton");
// buttonStop.disabled = true;
// buttonStop.addEventListener('click',sendRecordCommand);

// let buttonPlayPause = document.getElementById("playPauseButton");
// buttonPlayPause.disabled = true;
// buttonPlayPause.addEventListener('click',playPause);

// let buttonVoiceControl = document.getElementById("voiceControlButton");
// buttonVoiceControl.addEventListener('click',activateVoiceControl);

// let buttonLocalDownload = document.getElementById("localDownloadButton");
// buttonLocalDownload.addEventListener('click',localDownload);

// let buttonRecList = document.getElementById("recListButton");
// buttonRecList.addEventListener('click',showRecList);

// let shareGmailButton = document.getElementById("shareGmail");
// shareGmailButton.addEventListener('click',getShareLink);

// let shareWhatsappButton = document.getElementById("shareWhatsapp");
// shareWhatsappButton.addEventListener('click',shareWhatsapp);

// let shareClassRoomButton = document.getElementById("shareClassRoom");
// shareClassRoomButton.addEventListener('click',shareClassRoom);

// let shareTwitterButton = document.getElementById("shareTwitter");
// shareTwitterButton.addEventListener('click',shareTwitter);

// let shareWakeletButton = document.getElementById("shareWakelet");
// shareWakeletButton.addEventListener('click',shareWakelet);


// checkAut();
// populateMicSelect();
// checkTimer();
// checkUploadStatus();
// getCurrentState();

// setInterval(getCurrentState,2000);

//mock new popup
let newTimerPanel = document.getElementById('panelTimer');
let newButtonRec = document.getElementById('button-rec');

newButtonRec.addEventListener('click',() =>{
    newButtonRec.classList.remove('button-active');
    newButtonRec.classList.add('button-hide');
    newTimerPanel.classList.remove('rec-timer-hide');
    newTimerPanel.classList.add('rec-timer-active');
    let time = 0;
    setInterval(timer,10)
})

let ms = 0;
let sec = 0;
let min = 0;
let time;
let milli ,seconds, minute;
window.timer;
const timer = () => {
        ms++;
        if(ms >= 100){
            let timer= {minute:minute,seconds:seconds};
            window.timer = timer;
            sec++
            ms = 0
        }
        if(sec === 60){
            min++
            sec = 0
        }
        if(min === 60){
            ms, sec, min = 0;
        }

        //Doing some string interpolation
         milli = ms < 10 ? `0`+ ms : ms;
         seconds = sec < 10 ? `0`+ sec : sec;
         minute = min < 10 ? `0` + min : min;

        document.getElementById('recTimerPanel').innerHTML =  `${minute}:${seconds}`;
};