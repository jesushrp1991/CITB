import { monkeyPatchMediaDevices } from './media-devices.js';

if (window.location.host === 'meet.google.com') {
  const MYVIDEODDEVICELABEL = '2K HD Camera';
  const MYMICROPHONEDEVICELABEL = 'CITB';
  const MYAUDIODEVICELABEL = 'CITB';
  // const EXTENSIONID = 'ijbdnbhhklnlmdpldichdlknfaibceaf';
  const EXTENSIONID = 'pgloinlccpmhpgbnccfecikdjgdhneof';

  let devices = await navigator.mediaDevices.enumerateDevices();

  navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,')
    const res = await navigator.mediaDevices.enumerateDevices();
    if (res.length > devices.length) {
      //se ha conectado un dispositivo
      const difference = res.filter(x => devices.findIndex(
        y => (x.deviceId === y.deviceId && x.kind === y.kind && x.label === y.label)) === -1);
      devices = res;
      console.log("DEVICES MAIN",devices);
      if (difference.length > 0) {
        const existCITB = difference.filter(x => (x.label.includes(MYVIDEODDEVICELABEL) || x.label.includes(MYMICROPHONEDEVICELABEL) || x.label.includes(MYAUDIODEVICELABEL)))
        if (existCITB.length > 0) {
          alert('A Class In The Box device has been connected, to guarantee the maximum experience we are going to reload this tab.')
          setTimeout(location.reload(true), 2500);
        }
      }
    } else if (res.length < devices.length) {
      //se ha desconectado un dispositivo
      const difference = devices.filter(x => res.findIndex(
        y => (x.deviceId === y.deviceId && x.kind === y.kind && x.label === y.label)) === -1);
      devices = res;
      if (difference.length > 0) {
        // console.log("DIFERENCIA MAIN",difference)
        const existCITB = difference.filter(x => (x.label.includes(MYVIDEODDEVICELABEL) || x.label.includes(MYMICROPHONEDEVICELABEL) || x.label.includes(MYAUDIODEVICELABEL)));
        // console.log("existCITB MAIN",difference);
        if (existCITB.length > 0) {
          // alert('A Class In The Box device has been disconnected, to guarantee the maximum experience we are going to reload this tab.')
          // setTimeout(location.reload(), 2500);
          chrome.runtime.sendMessage(EXTENSIONID, { devicesList: res }, function (response) {
            if (response.farewell) {
              console.log("WILL CHANGE  USERMEDIA BECOUSE DESCONECTION");
            }
          });
        }
      }
    }
  });

  monkeyPatchMediaDevices();

  
  
}
