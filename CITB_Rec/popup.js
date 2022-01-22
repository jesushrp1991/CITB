import { checkTimer } from './js/timerBar.js';

window.recMode = 'recordTabs';
const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg);
}
const rec = (isTabForMac) =>{
    let idMic;
    isMicEnable ? idMic = select.value : idMic = null
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
}

let citbButtonsContainer = document.getElementById('citbButtonsContainer');
let isCITBPanelVisible;
const initialCITBPanelStatus = () =>{
    chrome.storage.sync.get('isCITBPanelVisible', (result) => {
        isCITBPanelVisible = result.isCITBPanelVisible;
        if(result.isCITBPanelVisible){
            citbButtonsContainer.classList.add('expanded');
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
        $("#citbMissingAlert").toggle();
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

    audioPanel.style.display = 'none';
    volumeControl.style.display = 'block';
    chrome.storage.sync.get('isMicEnable', (result)=> {
        console.log("mic",result)
        if(result == undefined){
            voiceVolumeControl.disabled = false;    
        }
        else{
            voiceVolumeControl.disabled = result.isMicEnable;    
            isMicEnable = result.isMicEnable;    
        }
    });
    
    chrome.storage.local.get('voiceVolumeControl', (result)=> {
        voiceVolumeControl.value = result.voiceVolumeControl;
    });    
    chrome.storage.local.get('systemVolumeControl', (result)=> {
        systemVolumeControl.value = result.systemVolumeControl;
    });
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

    // audioPanel.style.display = 'none';
    audioPanel.style.display = 'block';
    volumeControl.style.display = 'none';
    chrome.storage.local.set({voiceVolumeControl: 0.5});
    chrome.storage.local.set({systemVolumeControl: 0.5});
    voiceVolumeControl.disabled = false;
    // chrome.storage.sync.set({isMicEnable: true}, () => {});

}
let buttonStop = document.getElementById("stopButton");
buttonStop.addEventListener('click',()=>{
    displayNotRecordingMode();
    sendRecordCommand();
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
    if(isCITBPanelVisible){
        citbButtonsContainer.classList.remove('expanded');
        // citbButtonsContainer.setAttribute('class','')
        citbButtonsContainer.style.border = 'none';
    }
    else{
        citbButtonsContainer.classList.add('expanded');
        // citbButtonsContainer.setAttribute('class','expanded');
        citbButtonsContainer.style.border = '';

    }
    isCITBPanelVisible = !isCITBPanelVisible;
    chrome.storage.local.set({isCITBPanelVisible: isCITBPanelVisible}, () => {});
}

let citbOptions = document.getElementById('citbOptions');
citbOptions.addEventListener('click',checkCITBPanelStatus)

let isMicEnable;
let checkboxMic = document.getElementById('checkboxMic');
checkboxMic.addEventListener('click',()=>{
    console.log("isMicEnable",isMicEnable)
    if (isMicEnable == undefined){
        checkboxMic.classList.remove('mic-on')
        checkboxMic.classList.add('mic-off')
        isMicEnable = false;
        chrome.storage.sync.set({isMicEnable: isMicEnable}, () => {});
        return;
    } 
    else if (isMicEnable){
        checkboxMic.classList.remove('mic-on')
        checkboxMic.classList.add('mic-off')
        isMicEnable = false;
        chrome.storage.sync.set({isMicEnable: isMicEnable}, () => {});
    } 
    else{
        checkboxMic.classList.remove('mic-off')
        checkboxMic.classList.add('mic-on')
    }
    isMicEnable = !isMicEnable;
    chrome.storage.sync.set({isMicEnable: isMicEnable}, () => {});
})

let volumeControl = document.getElementById('volumeControl');
let audioPanel = document.getElementById('audioPanel');

let voiceVolumeControl = document.getElementById('voiceVolumeControl');
voiceVolumeControl.addEventListener('change',()=>{
    const request = { recordingStatus: 'changeVoiceVolume' , volume: voiceVolumeControl.value};
    sendMessage(request);
    chrome.storage.local.set({voiceVolumeControl: voiceVolumeControl.value});
})

let systemVolumeControl = document.getElementById('systemVolumeControl');
systemVolumeControl.addEventListener('change',()=>{
    console.log(systemVolumeControl.value);
    const request = { recordingStatus: 'changeSystemVolume' , volume: systemVolumeControl.value};
    sendMessage(request);
    chrome.storage.local.set({systemVolumeControl: systemVolumeControl.value});
})

checkAut();
populateMicSelect();
checkTimer();
getCurrentState();
initialCITBPanelStatus();
setInterval(getCurrentState,2000);

