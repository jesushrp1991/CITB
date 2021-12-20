const sendMessage = () =>{
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

export {
    sendMessage,
    close
}