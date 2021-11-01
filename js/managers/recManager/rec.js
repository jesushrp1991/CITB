import {
    builVideosFromDevices,
    buildVideoContainersAndCanvas,
    drawFrameOnVirtualCamera,
    virtualWebCamMediaStream,
    videoCITB,
    videoOther,
    canChangeCameras,
    fadeInFadeOut
  } from "../videoManager/webcam.js";

const recCallBackFunction = () =>{
    console.log("recCallBack");
    return;
    var options = { mimeType: "video/webm; codecs=vp9" };
    mediaRecorder = new MediaRecorder(window.actualVideoTag, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
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
  
  // demo: to download after 9sec
//   setTimeout(event => {
//     console.log("stopping");
//     mediaRecorder.stop();
//   }, 9000);

export{
    recCallBackFunction
}