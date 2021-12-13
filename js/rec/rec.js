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
const recordScreen = async () => {
    if(isRecording){
        recorder.stop();
    }
    
    const screenStream = await captureScreen();
    // const micCITBStream = await getCITBMicMedia();
    // const remoteAudioStream = captureRemoteAudio();
    // let combined = new MediaStream([...screenStream.getTracks(), ...micCITBStream.getTracks(),...remoteAudioStream.getTracks()]);
    // recorder = new MediaRecorder(combined);
    recorder = new MediaRecorder(screenStream);

    recorder.ondataavailable = event => {
    if (event.data.size > 0) {
        console.log("insert chunck")
        chunks.push(event.data)
    }
    }

    recorder.onstop = () => {
        download();
    }

    recorder.start(200);
    isRecording = !isRecording;
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
                document.getElementById("recPanel").addEventListener('click',recordScreen);
            },300)
        }
        initPopup();
    }
}