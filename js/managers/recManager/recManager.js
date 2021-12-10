import {
    enviroment
} from '../../enviroment.js'

let recorder = null;
let chunks = [];

const captureScreen = async()=> {
  var mediaConstraints = {
     video: {
       cursor: 'always',
       resizeMode: 'crop-and-scale'
     }
   }
 
   const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
   return screenStream
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
const getOtherMicDevices = () => {  
  
  try {  
    const citbMicrophone = devices.filter(  
      (x) =>  
        x.kind === "audioinput" &&  
        x.label.includes(!enviroment.MYAUDIODEVICELABEL)  
    );  
    return (citbMicrophone.length > 0) ? citbMicrophone[0] : [];  
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
const getOtherMicMedia = async () => {  
  try {  
    let otherMicrophone = getOtherMicDevices();  
    console.log(otherMicrophone);
    if (otherMicrophone.length > 0) {  
      let constraints = {  
        video: false,  
        audio: {  
          deviceId: { exact: otherMicrophone[0].deviceId },  
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


const recordScreem = async (isRecording) => {
  if(!isRecording){
    recorder.stop();
  }
  const screenStream = await captureScreen();
  const micCITBStream = await getCITBMicMedia();
  //this will not work becouse whit CITB on there is not other mic than CITB's Mic.
  const otherMicStream = await getOtherMicMedia();

  let combined = new MediaStream([...screenStream.getTracks(), ...micCITBStream.getTracks(),...otherMicStream.getTracks()]);
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



export {
    recordScreem
};