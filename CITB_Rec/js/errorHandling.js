import { environment } from "../config/environment.js";  
import { reset } from './recTimer.js';
import { recIcon } from './tools.js';
const errorHandling = (error) => {
    console.log(error);
    let inf = JSON.stringify(error,null,3);  
    let bugInformation = {  
        createdDate: Date.now(),  
        error: inf.toString() + "source: CITB_REC",  
        header: navigator.userAgent  
    }      
    fetch(environment.backendLogURL, {  
        method: 'POST',  
        headers: {  
            'Accept': 'application/json',  
            'Content-Type': 'application/json'  
        },  
        body: JSON.stringify(bugInformation)  
    }).then(response => response.json());  
    reset();
    window.isRecording = false;
    chrome.storage.sync.set({isRecording: false}, () => {});
    window.recorder.stop();
    window.desktopStream.getTracks().forEach(track => track.stop())
    window.micStream.getTracks().forEach(track => track.stop())
    window.resultStream.getTracks().forEach(track => track.stop())
    recIcon();
}

export {
    errorHandling
}