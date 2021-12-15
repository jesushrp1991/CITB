let chunks = [];
const download = () => {
    console.log("Hello download")
    var blob = new Blob(chunks, {
        type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
}
  
const captureScreen = async()=> {
    var mediaConstraints = {
    audio: true,
    video: true
    }

    const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    return screenStream
}

let isRecording = false;
let recorder;
const recordScreen = async (streamId) => {
    try{
        if(isRecording){
            recorder.stop();
        }
        var constraints = {
            audio:{
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                    echoCancellation: true
                }
            },
            video: {
                optional: [],
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                    maxWidth: 2560,
                    maxHeight: 1440,
                    maxFrameRate:30
                }
            }
        }
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                console.log("insert chunck")
                chunks.push(event.data)
            }
        }
        recorder.onstop = () => {
            download();
        }
        recorder.start();
        isRecording = true;
    }catch(e){
        console.log(e);
    }
}
const recordBack = () =>{
    try{
        console.log("recordBack")
        const request = { sources: ['screen','audio'] };
        chrome.runtime.sendMessage(request, async (response) => {
            console.log(response);
            await recordScreen(response.streamId);
        });
    }catch(e){
        console.log(e);
    }
}
const stopBack = () =>{
    console.log(isRecording);
    if(isRecording){
        recorder.stop();
        isRecording = false;

    }
}

document.getElementById("recPanel").addEventListener('click',recordBack);
document.getElementById("stopPanel").addEventListener('click',stopBack);