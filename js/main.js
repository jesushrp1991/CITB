import { monkeyPatchMediaDevices } from './media-devices.js';
monkeyPatchMediaDevices();
console.log('voy a definir el listener')

     
navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,', event)
    const res = await navigator.mediaDevices.enumerateDevices();
    console.log(res);
    chrome.runtime.sendMessage('emmdmmooijoidllkobncpgcmedhgfbma', {devicesList: res}, function(response) {
        console.log('deviceVideoId: ',response.farewell);
      });
    //TODO update de default udio, video, and device list
});
var algo="ok"

console.log('ya defini el listener', algo)