import {enviroment } from '../../enviroment.js';

var recordedChunks = [];

var options = {
    audioBitsPerSecond : 128000,
    videoBitsPerSecond : 2500000,
    mimeType : enviroment.videoRecordMimeType
  }

const createRecord = (stream,isRecording) =>{
    if(!isRecording){
        try{
            window.mediaRecorder = new MediaRecorder(stream,options);
            addEventos();
            window.mediaRecorder.start();
            // isRecording = true;
        }catch(e){
            console.log("Error createRecord",e);
        }
    }else{
        console.log("createRecord stop");
        window.mediaRecorder.stop();
        // isRecording = false;
    }
}

const addEventos = () =>{
    let mediaRecorder = window.mediaRecorder;
    mediaRecorder.dataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleDataAvailable;
}

function handleDataAvailable(event) {
    console.log("data-available");
    if (event.data.size > 0) {
        console.log("data-available",event.data);
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

export {
    createRecord,
}