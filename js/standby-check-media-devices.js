import { enviroment } from "./enviroment.js";
import { createCitbMicrophoneState } from "./domUtils.js";

let lastCitbMicStatus;
let firstTime = true;

function monkeyPatchMediaDevices1() {  
  console.log('Comienzo el inject del standby')
  const pCitbMicrophoneState = createCitbMicrophoneState();  
  document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {      
      document.body.appendChild(pCitbMicrophoneState);      
    }    
  }; 
    
  const checkDevices = async () => {
    let citbMicStatus;
    const deviceList = await navigator.mediaDevices.enumerateDevices();      
    const citbMicrophone = deviceList.filter(
        (device) =>
          device.kind === "audioinput" &&
          device.label.includes(enviroment.MYAUDIODEVICELABEL)
      );
      citbMicrophone.length > 0 ? citbMicStatus = "PLUGGED" :  citbMicStatus = "UNPLUGGED";
      if (document.getElementById("pCitbMicrophoneState")) {
        document.getElementById("pCitbMicrophoneState").innerText = citbMicStatus;
        console.log('citbMicStatus standby :',citbMicStatus);        
      }
     /* if (firstTime) {        
        firstTime = false;   
        console.log('firstTime ');
      }else {
        console.log('Not firstTime')
        if (lastCitbMicStatus !== citbMicStatus) {
          if (citbMicStatus == "PLUGGED"){
            alert("A CITB microphone has been connected")
          }else {
            //alert("A CITB microphone has been disconnected")
            //showPopupMic();
            alertPopup();
            importedMonkeyPatchMediaDevices.camCallBackFunction()
          }        
        }        
      }
      lastCitbMicStatus = citbMicStatus; */
        
    setTimeout(() => {
      checkDevices();
    }, 1000);
  };  
  checkDevices();  
}

monkeyPatchMediaDevices1();
