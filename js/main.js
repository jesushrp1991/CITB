import { monkeyPatchMediaDevices } from './media-devices.js';

if (window.location.host === 'meet.google.com' || window.location.host === 'zoom.us') {
  let devices = await navigator.mediaDevices.enumerateDevices();
  if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.live.com') {
      monkeyPatchMediaDevices();
  }
  
}
