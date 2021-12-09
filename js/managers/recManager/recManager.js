import {
    enviroment
} from '../../enviroment.js'


// import { 
//      generateVideoContainerWithId
// } from '../../domUtils.js'

let recorder = null

//return tab screen capture
async function captureScreen() {
   var mediaConstraints = {
      video: {
        cursor: 'always',
        resizeMode: 'crop-and-scale'
      }
    }
  
    const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    return screenStream
}


//return external audio
function captureExternalAudio(){
  chrome.tabCapture.capture({
    video: false,
    audio: true,
    audioConstraints:
    {
        mandatory:
        {
            chromeMediaSource: 'tab'
        }
    }
  }, function(stream){
    return stream;
  });

  
}

//return citb audio
async function captureCITBAudio(){
  const listDevices = await navigator.mediaDevices.enumerateDevices();
  let audiosDevices = listDevices.filter(x => (x.kind === 'audioinput' && x.label.includes(enviroment.MYAUDIODEVICELABEL))); 

  if(audiosDevices){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        deviceId: audiosDevices[0].deviceId
      }
    });
    return stream;
  } else {
    throw "Microphone CITB not found";
  }


}

//return virtual cam
async function captureVirtualCam(){
  const listDevices = await navigator.mediaDevices.enumerateDevices();
  let camsDevices = listDevices.filter(x => (x.kind === 'videoinput' && 
  x.label.includes(enviroment.MYAUDIODEVICELABEL))); 

  if(camsDevices.length > 0){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: camsDevices[0].deviceId
      },
      audio: false
    });
    return stream;
  } else {
    throw "Virtual Webcam CITB not found";
  }
}

// merge citb and external audio
async function mergeFullAudio(){
  const audioContext = new AudioContext();
   
  const externalAudio = captureExternalAudio();
  const citbAudio = captureCITBAudio();

  const audioSourceExternal = audioContext.createMediaStreamSource(externalAudio);
  const audioSourceCITB = audioContext.createMediaStreamSource(citbAudio);

  dest = audioContext.createMediaStreamDestination();

  audioSourceExternal.connect(dest);
  audioSourceCITB.connect(dest);

  //const recorder = new MediaRecorder(dest.stream);

  return dest.stream;

}
let chunks = [];
async function recordVirtualCam(){
  const virtualCamStream = await captureVirtualCam();
  const audioStream = mergeFullAudio();

  const stream = new MediaStream([...virtualCamStream.getTracks(), ...audioStream.getTracks()]);

  recorder = new MediaRecorder(stream)
  

  recorder.ondataavailable = event => {
    if (event.data.size > 0) {
      chunks.push(event.data)
    }
  }
  
  recorder.onstop = () => {
    const blob = new Blob(chunks, {
      type: 'video/webm'
    })
    
    chunks = []
    const blobUrl = URL.createObjectURL(blob)

    console.log(blobUrl);
    
    stream.getTracks().forEach((track) => {
          track.stop();
    });

   }
  
  recorder.start(200);
}

async function recordScreem(isRecording){
  if(!isRecording){
    recorder.stop();
  }
  const screenStream = await captureScreen();
  // const audioStream = mergeFullAudio();

  // const stream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);

  // recorder = new MediaRecorder(stream)
  recorder = new MediaRecorder(screenStream)

  recorder.ondataavailable = event => {
    if (event.data.size > 0) {
      chunks.push(event.data)
    }
  }
  
  recorder.onstop = () => {
    download();
   }
  
  recorder.start(200);
}

function download() {
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



  export {
    recordScreem,
    recordVirtualCam
};