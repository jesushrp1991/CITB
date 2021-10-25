import {
    enviroment
} from '../../enviroment.js'


import { 
    generateVirtualWebCamCanvas
    , generateCITBVideoContainer
    , generateOtherVideoContainer
    , generateVideoContainerWithId
} from '../../domUtils.js'

//return tab screen capture
async function captureScreen() {
    mediaConstraints = {
      video: {
        cursor: 'always',
        resizeMode: 'crop-and-scale'
      }
    }
  
    const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints)
    return screenStream
}

//return audio record
async function captureMediaDevices(mediaConstraintse) {
  const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
  
  return stream
}

async function getAudioRecord(){
    const screenStream = await captureScreen()
  const audioStream = await captureMediaDevices({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    },
    video: false
  })

  const video = generateVideoContainerWithId('CITBRecord')
  
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
   }
  
  recorder.start(200)
}

  export {
    getAudioRecord
}