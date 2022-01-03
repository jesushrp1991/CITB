const errorHandling = (error) => {
    console.log(error);
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