import { monkeyPatchMediaDevices } from './media-devices.js';

if (window.location.host === 'meet.google.com') {
  const EXTENSIONID = 'bpdebpeagmcjmefelbfdkobnojlifbnp';

  monkeyPatchMediaDevices();

  navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,', event)
    const res = await navigator.mediaDevices.enumerateDevices();
    chrome.runtime.sendMessage(EXTENSIONID, { devicesList: res }, async function (response) {
    });
  });

}
