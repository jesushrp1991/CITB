import { monkeyPatchMediaDevices } from './media-devices.js';

if (window.location.host === 'meet.google.com' || window.location.host === 'zoom.us') {
  const MYVIDEODDEVICELABEL = 'Sirius USB2.0 Camera (0ac8:3340)';
  const MYMICROPHONEDEVICELABEL = 'CITB';
  const MYAUDIODEVICELABEL = 'CITB';
  const EXTENSIONID = 'pgloinlccpmhpgbnccfecikdjgdhneof';

  let devices = await navigator.mediaDevices.enumerateDevices();



  // const setVideo = (videoId) => {
  //   chrome.runtime.sendMessage(EXTENSIONID, { setDefaultVideoId: videoId }, async function (response) {
  //     if (response && response.farewell){
  //     }
  //   });
  // }

  // navigator.mediaDevices.addEventListener('devicechange', function (event) {
  //   let defaultVideoLabel = devices.filter(x => x.deviceId === defaultVideoId)[0].label;
  //   let citbActivated = defaultVideoLabel.includes(MYVIDEODDEVICELABEL);
  //   if (citbActivated){
  //     const otherVideos = devices.filter(x => (x.kind === 'videoinput' && x.deviceId != defaultVideoId));
  //     if (otherVideos.length > 0){
  //       setVideo(otherVideos[0].deviceId);
  //     }else{
  //       alert('Could not change Video');
  //     }
  //   }else{
  //     const citbVideo = devices.filter(x => (x.kind === 'videoinput' && x.label.includes(MYVIDEODDEVICELABEL)));
  //     if(citbVideo.length > 0){
  //       setVideo(citbVideo[0].deviceId);
  //     }else{
  //       alert('Could not change Video');
  //     }
  //   }
  // });


  navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,')
    const res = await navigator.mediaDevices.enumerateDevices();
    console.log("Lista de dispositivos",res);
    chrome.runtime.sendMessage(EXTENSIONID, { devicesList: res }, async function (response) { 
    });
  });

  monkeyPatchMediaDevices();

  
  
}
