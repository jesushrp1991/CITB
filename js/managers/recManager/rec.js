var recordedChunks = [];
var mediaRecorder;
const recCallBackFunction = (captureStream) =>{    
   try {
        console.log("recCallBack");
        var options = { mimeType: "video/webm; codecs=vp9" };        
        let media = window.actualVideoTag;
        // mediaRecorder = new MediaRecorder(media.captureStream(), options);
        mediaRecorder = new MediaRecorder(captureStream, options);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();

        setTimeout(event => {
            console.log("stopping");
            mediaRecorder.stop();
        }, 15000);

   } catch (error) {
       console.log(error);
   }
}

const startCapture = async ()=> {
    let captureStream = null;
    let currentMic; 
    if(document.getElementById("pModeCurrentMic")) 
        currentMic = document.getElementById("pModeCurrentMic").innerText.toString(); 
    console.log(currentMic);
    const displayMediaOptions = {
        video: {
            cursor: "always"
          },
          audio: {
            deviceId: currentMic,
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
    }
  
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      recCallBackFunction(captureStream);
    } catch(err) {
      console.error("Error: " + err);
    }
  }

function handleDataAvailable(event) {
    console.log("data-available");
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      console.log(recordedChunks);
      download();
    } else {
      // ...
    }
  }
  function download() {
    var blob = new Blob(recordedChunks, {
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
  
  


export{
    recCallBackFunction,
    startCapture
}