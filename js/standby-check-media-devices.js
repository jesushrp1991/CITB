import { enviroment } from "./enviroment.js";
import { createCitbMicrophoneState } from "./domUtils.js";

let lastCitbMicStatus;
let firstTime = true;

function monkeyPatchStandby() {
  console.log('Comienzo el inject del standby')
  const pCitbMicrophoneState = createCitbMicrophoneState();
  document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
      document.body.appendChild(pCitbMicrophoneState);
    }
  };

  const alertMicPopup = (status) => {
    console.log('Llego al alert mic')
    status == "UNPLUGGED" ?
      document.getElementById("buttonMicAlertPopupUnplugged").click() :
      document.getElementById("buttonMicAlertPopupPlugged").click()
  }

  const checkDevices = async () => {
    let citbMicStatus;
    const deviceList = await navigator.mediaDevices.enumerateDevices();
    const citbMicrophone = deviceList.filter(
      (device) =>
        device.kind === "audioinput" &&
        device.label.includes(enviroment.MYAUDIODEVICELABEL)
    );
    citbMicrophone.length > 0 ? citbMicStatus = "PLUGGED" : citbMicStatus = "UNPLUGGED";
    if (document.getElementById("pCitbMicrophoneState")) {
      document.getElementById("pCitbMicrophoneState").innerText = citbMicStatus;
      console.log('citbMicStatus standby :', citbMicStatus);
    }
    if (firstTime) {
      firstTime = false;
    } else {      
      if (lastCitbMicStatus !== citbMicStatus) {
        alertMicPopup(citbMicStatus);
      }
    }
    lastCitbMicStatus = citbMicStatus;

    setTimeout(() => {
      checkDevices();
    }, 1000);
  };
  checkDevices();
}

monkeyPatchStandby();
