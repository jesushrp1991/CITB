import { checkTimer } from './js/timerBar.js';

window.recMode = 'recordTabs';
const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg);
}
const rec = (isTabForMac) =>{
    let idMic;
    let checkboxMic = document.getElementById('checkboxMic');
    checkboxMic.checked ? idMic = select.value : idMic = null
    const request = { recordingStatus: 'rec' , idMic: idMic ,idTab : isTabForMac, recMode: window.recMode};
    sendMessage(request);
}
const sendRecordCommand = () =>{
    let userAgentData = navigator.userAgentData.platform.toLowerCase().includes('mac');
    if(userAgentData){
        chrome.tabs.getSelected(null, (tab) => {
            rec(tab.id);
        });
    }else{
        rec()
    }
}

const getCurrentState = () =>{
    chrome.storage.sync.get('isRecording', (result) => {
        if (result.isRecording ){
            displayRecordingMode();
        }else{
            displayNotRecordingMode();
        }
    });
    chrome.storage.sync.get('isPaused', (result) => {        
        if(result.isPaused ){
            buttonPlayPause.setAttribute('class','play-icon icons');
        }else{
            buttonPlayPause.setAttribute('class','pause-icon icons');
        }        
    });
    chrome.storage.sync.get('voice', (result) => {
        if(result.voice){
            buttonVoiceControl.setAttribute('class','voiceControl icons')
        }else{
            buttonVoiceControl.setAttribute('class','voiceControlOff icons');
        }
    })
    chrome.storage.sync.get('isCITBPanelVisible', (result) => {
        window.isCITBPanelVisible = result.isCITBPanelVisible;
        if(result.isCITBPanelVisible){
            citbButtonsContainer.classList.remove('show');
        }
        else{
            citbButtonsContainer.classList.add('show');
        }
    });

}


const playPause = () =>{
    const request = { recordingStatus: 'pause' };
    if(buttonPlayPause.getAttribute('class').includes('pause-icon')){
        buttonPlayPause.setAttribute('class','play-icon icons')
    }else{
        buttonPlayPause.setAttribute('class','pause-icon icons');
    }
    sendMessage(request);
}

const activateVoiceControl = () =>{
    const request = { recordingStatus: 'voiceOpen' };
    if(buttonVoiceControl.getAttribute('class').includes('voiceControlOff')){
        buttonVoiceControl.setAttribute('class','voiceControl icons')
        sendMessage(request);
        chrome.runtime.openOptionsPage(()=>{});
    }else{
        const request = { recordingStatus: 'voiceClose' };
        sendMessage(request);
        buttonVoiceControl.setAttribute('class','voiceControlOff icons');
    }
}

let select = document.getElementById('miclist');
const populateMicSelect = async () => {
    let micList;
    try {
        await navigator.mediaDevices.getUserMedia({audio: true})
        micList = await navigator.mediaDevices.enumerateDevices();
    } catch (error) {
        activateVoiceControl();
    }
    micList = await navigator.mediaDevices.enumerateDevices();
    let usableMic = micList.filter((x) =>  x.kind === "audioinput" && !x.label.includes('CITB'));    
    let citb = micList.filter((x) => x.kind === "audioinput" && x.label.includes('CITB'));
    let organizedMicList = [];
    if(citb.length > 0){
        organizedMicList.push(citb[0]);
        organizedMicList = organizedMicList.concat(usableMic);
    }else{
        organizedMicList = usableMic;
        // document.getElementById('citbMissingAlert').style.visibility = 'visible';
        $("#citbMissingAlert").toggle();
        // setInterval(()=>{
        //     document.getElementById('modal').style.display = 'none';
        // },5000);
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

const checkAut = () => {
    const request = { recordingStatus: 'checkAuth' };
    sendMessage(request);
}

const showRecList = () => {
    const request = { recordingStatus: 'showRecList' };
    sendMessage(request);
}

let buttonRec = document.getElementById('button-rec');
let newTimerPanel = document.getElementById('panelTimer');

const displayRecordingMode = () =>{
    if(document.getElementById('citbMissingAlert').style.display == 'block'){
        buttonRec.classList.remove('panel-timer-container');
        buttonRec.classList.add('panel-timer-container-alert');
    }
    buttonRec.classList.remove('button-active');
    buttonRec.classList.add('button-hide');
    newTimerPanel.classList.remove('rec-timer-hide');
    newTimerPanel.classList.add('rec-timer-active');
}
buttonRec.addEventListener('click',() =>{
    displayRecordingMode();
    sendRecordCommand();
})

const displayNotRecordingMode = () =>{
    buttonRec.classList.remove('button-hide');
    buttonRec.classList.add('button-active');
    newTimerPanel.classList.remove('rec-timer-active');
    newTimerPanel.classList.add('rec-timer-hide');
}
let buttonStop = document.getElementById("stopButton");
buttonStop.addEventListener('click',()=>{
    displayNotRecordingMode()
;    sendRecordCommand();
});

let buttonPlayPause = document.getElementById("playPauseButton");
buttonPlayPause.disabled = true;
buttonPlayPause.addEventListener('click',playPause);

let buttonVoiceControl = document.getElementById("voiceControlButton");
buttonVoiceControl.addEventListener('click',activateVoiceControl);

let buttonRecList = document.getElementById("recListButton");
buttonRecList.addEventListener('click',showRecList);

let recordTabs = document.getElementById("recordTabs");
let recordScreen = document.getElementById("recordScreen");


recordTabs.addEventListener('click',()=>{
    recordTabs.classList.add('selected-icon');
    recordScreen.classList.remove('selected-icon');
    window.recMode = 'recordTabs'
});

recordScreen.addEventListener('click',()=>{
    recordScreen.classList.add('selected-icon');
    recordTabs.classList.remove('selected-icon');
    window.recMode = 'recordScreen'
});

const checkCITBPanelStatus = () =>{
    if(window.isCITBPanelVisible){
        citbButtonsContainer.classList.remove('expanded');
    }
    else{
        citbButtonsContainer.classList.add('expanded');
    }
   window.isCITBPanelVisible = !window.isCITBPanelVisible;
   chrome.storage.sync.set({isCITBPanelVisible: window.isCITBPanelVisible}, () => {});
}

let citbOptions = document.getElementById('citbOptions');
citbOptions.addEventListener('click',checkCITBPanelStatus)



checkAut();
populateMicSelect();
checkTimer();
getCurrentState();
setInterval(getCurrentState,2000);

