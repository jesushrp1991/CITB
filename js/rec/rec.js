const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})
let popupContent;
document.addEventListener('recPanel', function (e) {
    console.log("Fire event",e.detail);
    popupContent = e.detail;    
}); 

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
            audio: {
             mandatory: {
                     chromeMediaSource: 'desktop',
                     chromeMediaSourceId: streamId
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
        const request = { sources: ['window', 'screen', 'tab'] };
        const EXTENSION_ID  = "ijbdnbhhklnlmdpldichdlknfaibceaf";
        chrome.runtime.sendMessage(EXTENSION_ID, request, async (response) => {
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

document.onreadystatechange = (event) => {  
    if (document.readyState == "complete") {
        console.log("REC")
        const initPopup = () => {            
            setTimeout(()=>{
                console.log("popupContent",popupContent);
                const htmlContent = escapeHTMLPolicy.createHTML(popupContent);
                let container = document.createElement("div");
                container.innerHTML = htmlContent;
                document.body.appendChild(container);    
                document.getElementById("recPanel").addEventListener('click',recordBack);
                document.getElementById("stopPanel").addEventListener('click',stopBack);
            },300)
        }
        initPopup();
    }
}