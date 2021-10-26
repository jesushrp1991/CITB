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

async function recordAudioWebCam(){
  const mediaConstraints = {
    video: {
      width: 1280,
      height: 720
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  }
  const stream = await captureMediaDevices(mediaConstraints);

  const video = generateVideoContainerWithId('CITBRecord');

  video.src = null
  video.srcObject = stream
  video.muted = true
  
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
    
    video.srcObject = null
    video.src = blobUrl
    video.muted = false
    
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });

   
   }
  
  recorder.start(200)
}


async function recordAudioScreen(){
    const screenStream = await captureScreen();
  const audioStream = await captureMediaDevices({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    },
    video: false
  })

  const video = generateVideoContainerWithId('CITBRecord');
  
  const stream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);

  video.src = null
  video.srcObject = stream
  video.muted = true

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

    video.srcObject = null
    video.src = blobUrl
    video.muted = false
    
    stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live') {
          track.stop();
      }
  });

   }
  
  recorder.start(200)
}

function stopRecording() {
  recorder.stream.getTracks().forEach(track => track.stop())
 }

  export {
    recordAudioScreen,
    recordAudioWebCam,
    stopRecording
}