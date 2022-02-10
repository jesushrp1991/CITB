const rec = () =>{
    const request = { recordingStatus: 'rec' };
    chrome.runtime.sendMessage(request, (response) => {         
    });
}

const close = () =>{
    const request = { recordingStatus: 'voiceClose' };
    chrome.runtime.sendMessage(request, (response) => {         
    });
    annyang.abort();
    window.close();
}
const stop = () =>{
    const secondRequest = { recordingStatus: 'rec',isVoiceCommandStop: true };
    chrome.runtime.sendMessage(secondRequest, (response) => {         
    });
}

const play = () =>{
    const request = { recordingStatus: 'voiceCommand' , isVoiceCommandPause: 'play' };
    chrome.runtime.sendMessage(request, (response) => {         
    });
}
const pause = () =>{
    const request = { recordingStatus: 'voiceCommand' , isVoiceCommandPause: 'pause' };
    chrome.runtime.sendMessage(request, (response) => {         
    });
}

window.addEventListener("beforeunload", (event) => { 
    close();
 });

export {
    rec,
    close,
    stop,
    play,
    pause
}