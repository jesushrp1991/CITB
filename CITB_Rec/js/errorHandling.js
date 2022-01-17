import { environment } from "../config/environment.js";  
import { reset } from './recTimer.js';
const errorHandling = (error) => {
    clearInterval(window.iconRecChange);
    setTimeout(()=>{
        chrome.browserAction.setIcon({path: "./assets/icon.png"});
    },3000);
    reset();
    window.isRecording = false;
    chrome.storage.sync.set({isRecording: false}, () => {});
    chrome.storage.sync.set({isPaused: true}, () => {}); 
    window.recorder.stop();
    if(window.desktopStream){
        window.desktopStream.getTracks().forEach(track => track.stop())
    }
    if(window.micStream){
        window.micStream.getTracks().forEach(track => track.stop())
    }
    if(window.resultStream){
        window.resultStream.getTracks().forEach(track => track.stop())
    }

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
}

export {
    errorHandling
}