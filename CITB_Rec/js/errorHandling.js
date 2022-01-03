import { environment } from "../config/environment.js";  

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
    chrome.storage.sync.set({isRecording: false}, function() {
    });
    window.recorder.stop();
    window.desktopStream.getTracks().forEach(track => track.stop())
    window.micStream.getTracks().forEach(track => track.stop())
    window.resultStream.getTracks().forEach(track => track.stop())
   

}

export {
    errorHandling
}