import {
    enviroment
} from '../../enviroment.js'


import { 
     generateVideoContainerWithId
} from '../../domUtils.js'

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

//return audio record
async function captureMediaDevices(mediaConstraints) {
  const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
  
  return stream
}

//return external audio
async function captureExternalAudio(){
  const externalAudio = await chrome.tabCapture.capture({
    video: false,
    audio: true,
    audioConstraints:
    {
        mandatory:
        {
            chromeMediaSource: 'tab'
        }
    }
  });

  return externalAudio;
}

//return citb audio
async function captureCITBAudio(){
  const listDevices = await navigator.mediaDevices.enumerateDevices();
  let citbAudio = listDevices.filter(x => (x.kind === 'audioinput' && !x.label.includes(enviroment.MYAUDIODEVICELABEL))); 

  if(citbAudio){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        deviceId: citbAudio[0].deviceId
      }
    });
    return stream;
  } else {
    throw "Microphone CITB not found";
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

async function recordVirtualCam(){

}

async function recordScreem(){
  const screenStream = await captureScreen();
  const audioStream = mergeFullAudio();

  const stream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);

  recorder = new MediaRecorder(stream)
  let chunks = []

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



  export {
    recordScreem
}