import { monkeyPatchMediaDevices } from './media-devices.js';
import {enviroment } from './enviroment.js'

if (window.location.host === 'meet.google.com' || window.location.host === 'zoom.us') {
  const EXTENSIONID = enviroment.EXTENSIONID;

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


  if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.live.com') {
    monkeyPatchMediaDevices();
  }

  
  
}
