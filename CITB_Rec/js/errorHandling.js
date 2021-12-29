const errorHandling = (error) => {
    console.log(error);
    // window.recorder.stop();
    // window.desktopStream.getTracks().forEach(track => track.stop())
    // window.micStream.getTracks().forEach(track => track.stop())
    // window.resultStream.getTracks().forEach(track => track.stop())
    // reset();
    // window.isRecording = false;
    // chrome.storage.sync.set({isRecording: false}, function() {
    // });

}

export {
    errorHandling
}