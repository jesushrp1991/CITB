import { monkeyPatchMediaDevices } from "./media-devices.js";
import {
  EXTENSIONID,
} from "./constants.js";
import {
  filterCITBDevices,
  getListDiference
} from './functions.js';

if (window.location.host === "meet.google.com") {
  let devices = await navigator.mediaDevices.enumerateDevices();

  navigator.mediaDevices.addEventListener(
    "devicechange",
    async function (event) {
      console.log("device plugged or unplugged, update de info,");
      const res = await navigator.mediaDevices.enumerateDevices();
      if (res.length > devices.length) {
        //se ha conectado un dispositivo
        const difference = getListDiference(res);
        devices = res;
        console.log("DEVICES MAIN", devices);
        if (difference.length > 0) {
          const devicesCITB = filterCITBDevices(difference);
          if (devicesCITB.length > 0) {
            alert(
              "A Class In The Box device has been connected, to guarantee the maximum experience we are going to reload this tab."
            );
            setTimeout(location.reload(true), 2500);
          }
        }
      } else if (res.length < devices.length) {
        //se ha desconectado un dispositivo
        const difference = getListDiference(devices);
        devices = res;
        if (difference.length > 0) {
          const existCITB = filterCITBDevices(difference);
          // console.log("existCITB MAIN",difference);
          if (existCITB.length > 0) {
            // alert('A Class In The Box device has been disconnected, to guarantee the maximum experience we are going to reload this tab.')
            // setTimeout(location.reload(), 2500);
            chrome.runtime.sendMessage(
              EXTENSIONID,
              { devicesList: res },
              function (response) {
                if (response.farewell) {
                  console.log("WILL CHANGE  USERMEDIA BECOUSE DESCONECTION");
                }
              }
            );
          }
        }
      }
    }
  );

  monkeyPatchMediaDevices();
}
