var recordedChunks = [];
var mediaRecorder;
const recCallBackFunction = async (captureStream) =>{    
  try {
    console.log("recCallBack");
    var options = { mimeType: "audio/webm" };        
    let tracks = window.localPeerConection.getReceivers().filter( x => x.track.kind == "audio" && x.track.muted == false).map(t => t.track)
    const ac = new AudioContext();
    const sources = tracks.map(t => ac.createMediaStreamSource(new MediaStream([t])));
    const dest = ac.createMediaStreamDestination();
    sources.forEach(s => s.connect(dest));
    let stream = new MediaStream();
    let videoTracks = captureStream.getTracks()[0];
    console.log(dest, dest.stream, dest.stream.getTracks())
    let audioTracks = dest.stream.getTracks()[0];
    stream.addTrack(videoTracks);
    stream.addTrack(audioTracks);
    mediaRecorder = new MediaRecorder(stream, options);
    // mediaRecorder = new MediaRecorder(media.captureStream(), options);
    // mediaRecorder = new MediaRecorder(captureStream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

    setTimeout(event => {
        console.log("stopping");
        mediaRecorder.stop();
    }, 15000);

} catch (error) {
   console.log(error);
}

  //  try {
  //       console.log("recCallBack", captureStream, captureStream.getTracks(), captureStream.getAudioTracks());
  //       var options = { mimeType: "video/webm; codecs=vp9" };        
  //       let media = window.actualVideoTag;
  //       // mediaRecorder = new MediaRecorder(media.captureStream(), options);

  //       mediaRecorder = new MediaRecorder(captureStream, options);
  //       mediaRecorder.ondataavailable = handleDataAvailable;
  //       mediaRecorder.start();

  //       setTimeout(event => {
  //           console.log("stopping");
  //           mediaRecorder.stop();
  //       }, 15000);

  //  } catch (error) {
  //      console.log(error);
  //  }
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
          audio: true
    }
  
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      await recCallBackFunction(captureStream);
    } catch(err) {
      console.error("Error: " + err);
    }
  }

function handleDataAvailable(event) {
    console.log("data-available", event);
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
      type: recordedChunks[0].type
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