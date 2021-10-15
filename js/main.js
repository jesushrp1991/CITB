import { monkeyPatchMediaDevices } from './media-devices.js';

  let devices = await navigator.mediaDevices.enumerateDevices();
  monkeyPatchMediaDevices();
  
  
