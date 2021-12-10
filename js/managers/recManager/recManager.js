import {
    enviroment
} from '../../enviroment.js'

let recorder = null;
let chunks = [];

const captureScreen = async()=> {
  var mediaConstraints = {
    audio: true,
    video: {
       cursor: 'always',
       resizeMode: 'crop-and-scale'
     }
   }
 
   const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
   return screenStream
}

const captureRemoteAudio = () => {
  var remoteStream = new MediaStream();
  window.localPeerConection.getSenders().forEach((receiver) => {
    if(receiver.track != null){
      remoteStream.addTrack(receiver.track);
    }
  });
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
    console.log(error);
  }  
}; 
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
async function mergeFullAudio(){
  const audioContext = new AudioContext();
   
  const externalAudio = captureExternalAudio();
  const citbAudio = getCITBMicMedia();

  const audioSourceExternal = audioContext.createMediaStreamSource(externalAudio);
  const audioSourceCITB = audioContext.createMediaStreamSource(citbAudio);

  let dest = audioContext.createMediaStreamDestination();

  audioSourceExternal.connect(dest);
  audioSourceCITB.connect(dest);

  //const recorder = new MediaRecorder(dest.stream);

  return dest.stream;

}
const recordScreen = async (isRecording) => {
  if(!isRecording){
    recorder.stop();
  }
  const screenStream = await captureScreen();
  const micCITBStream = await getCITBMicMedia();
  // const remoteAudioStream = captureRemoteAudio();
  const audioStream = mergeFullAudio();

  // let combined = new MediaStream([...screenStream.getTracks(), ...micCITBStream.getTracks(),...remoteAudioStream.getTracks()]);
  let combined = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);
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
  
  recorder.start(200);

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

let isRecording = false;
const createHTML = () =>{
  const div = document.createElement("div");
  div.setAttribute("id","recvideo");
  div.style.visibility = 'visible';
  div.style.position='absolute';
  div.style.zIndex = '980';
  div.style.width = '40px';
  div.style.height='250px';
  div.style.top = '60px';
  div.style.right = '16px';
  div.style.background = 'rgb(240, 243, 250)';
  div.style.borderRadius = '20px';
  const button = document.createElement("button");
  button.textContent = "X";
  button.addEventListener('click',recordScreen)
  div.appendChild(button);
  document.body.appendChild(div);
}

createHTML();