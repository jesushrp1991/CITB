import { monkeyPatchMediaDevices } from './media-devices.js';
monkeyPatchMediaDevices();
     
//Listener for detect devices changes
navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,', event)
    const res = await navigator.mediaDevices.enumerateDevices();
    chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', {devicesList: res}, async function(response) {
      if (response)  
      console.log('deviceVideoId: ',response.farewell);
        await navigator.mediaDevices.getUserMedia({ video: { deviceId: 'virtual' }, audio: false });
      });
});

console.log('Listener settled')