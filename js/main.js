import { monkeyPatchMediaDevices } from './media-devices.js';

if (window.location.host === 'meet.google.com') {
  const extensionId = 'bpdebpeagmcjmefelbfdkobnojlifbnp';

  monkeyPatchMediaDevices();

  //Listener for detect devices changes
  navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,', event)
    const res = await navigator.mediaDevices.enumerateDevices();
    chrome.runtime.sendMessage(extensionId, { devicesList: res }, async function (response) {
    });
  });

  console.log('Listener settled')
}
