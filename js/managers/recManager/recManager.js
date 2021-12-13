import {
  enviroment
} from '../../enviroment.js'

let recorder = null;
let chunks = [];

const captureScreen = async()=> {
var mediaConstraints = {
  audio: { deviceId:  "default"},
  video: {
     cursor: 'always',
     resizeMode: 'crop-and-scale'
   }
 }

 const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
 return screenStream
}

const captureRemoteAudio = () => {
console.log("captureRemoteAudio",window.localPeerConection);

var remoteStream = new MediaStream();

console.log("Receivers",window.localPeerConection.getReceivers().length)

window.localPeerConection.getReceivers().forEach((receiver) => {

  console.log("getReceivers",receiver);

  remoteStream.addTrack(receiver.track);
});

console.log("remoteStream",remoteStream.getAudioTracks());
return remoteStream;
}

const getCITBMicDevices = () => {  

try {  
  const citbMicrophone = devices.filter(  
    (x) =>  
      x.kind === "audioinput" &&  
      x.label.includes(enviroment.MYAUDIODEVICELABEL)  
  );  
  return (citbMicrophone.length > 0) ? citbMicrophone : [];  
} catch (error) {  
  // logErrors(error,"getCITBMicDevices ln. 266");  
}  
};  

const getCITBMicMedia = async () => {  
try {  
  let citbMicrophone = getCITBMicDevices();  
  if (citbMicrophone.length > 0) {  
    let constraints = {  
      video: false,  
      audio: {  
        deviceId: { exact: citbMicrophone[0].deviceId },  
      },  
    };  
    let result = await navigator.mediaDevices.getUserMedia(constraints);  
    return result;  
  } else {  
    return null;  
  }  
} catch (error) {  
  // logErrors(error,"getCTBMicMedia ln. 227");  
}  
}; 


const recordScreen = async (isRecording) => {
if(!isRecording){
  recorder.stop();
}
const screenStream = await captureScreen();
const micCITBStream = await getCITBMicMedia();
const remoteAudioStream = captureRemoteAudio();

let combined = new MediaStream([...screenStream.getTracks(), ...micCITBStream.getTracks(),...remoteAudioStream.getTracks()]);
recorder = new MediaRecorder(combined);

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
}

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



export {
  recordScreen
};