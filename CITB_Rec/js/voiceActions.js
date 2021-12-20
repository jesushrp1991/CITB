const rec = () =>{
    const request = { recordingStatus: 'rec' };
    chrome.runtime.sendMessage(request, (response) => {         
    });
}

const close = () =>{
    const request = { recordingStatus: 'voiceClose' };
    chrome.runtime.sendMessage(request, (response) => {         
    });
    const secondRequest = { recordingStatus: 'rec' };
    chrome.runtime.sendMessage(secondRequest, (response) => {         
    });
    window.close();
}

const playPause = () =>{
    const request = { recordingStatus: 'pause' , isVoiceCommand: true };
    chrome.runtime.sendMessage(request, (response) => {         
    });
}

window.addEventListener("beforeunload", function(event) { 
    const request = { recordingStatus: 'voiceClose' };
    chrome.runtime.sendMessage(request, (response) => {         
    });
 });

export {
    rec,
    close,
    playPause
}