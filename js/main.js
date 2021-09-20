import { monkeyPatchMediaDevices } from './media-devices.js';
monkeyPatchMediaDevices();
     
//Listener for detect devices changes
navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,', event)
    const res = await navigator.mediaDevices.enumerateDevices();
    chrome.runtime.sendMessage('emmdmmooijoidllkobncpgcmedhgfbma', {devicesList: res}, function(response) {
        console.log('deviceVideoId: ',response.farewell);
      });
});

console.log('Listener settled')