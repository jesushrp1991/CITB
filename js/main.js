import { monkeyPatchMediaDevices } from './media-devices.js';

if (window.location.host === 'meet.google.com') {
  monkeyPatchMediaDevices();

  document.onreadystatechange = (event) => {
    const buttonShow = document.createElement('button');
    buttonShow.style.width = '50px';
    buttonShow.style.height = '50px';
    buttonShow.style.borderRadius = '50px'
    buttonShow.style.margin = '15px'
    buttonShow.style.background = 'url("./../MODO_SHOW_COLOR.svg")';
    buttonShow.addEventListener('click', () => {
      alert('show button clicked');
    })
    const buttonClass = document.createElement('button');
    buttonClass.style.width = '50px';
    buttonClass.style.height = '50px';
    buttonClass.style.borderRadius = '50px'
    buttonClass.style.margin = '15px'
    buttonClass.addEventListener('click', () => {
      alert('class button clicked');
    })
    const buttonCam = document.createElement('button');
    buttonCam.style.width = '50px';
    buttonCam.style.height = '50px';
    buttonCam.style.borderRadius = '50px'
    buttonCam.style.margin = '15px'
    buttonCam.addEventListener('click', () => {
      alert('show button clicked');
    })
    const div = document.createElement('div');
    div.appendChild(buttonShow);
    div.appendChild(buttonClass);
    div.appendChild(buttonCam);
    div.style.background = 'red';
    div.style.position = 'fixed';
    div.style.zIndex = 999;
    div.style.bottom = '10px';
    div.style.right = '10px';
    document.body.appendChild(div);
  }

  //Listener for detect devices changes
  navigator.mediaDevices.addEventListener('devicechange', async function (event) {
    console.log('device plugged or unplugged, update de info,', event)
    const res = await navigator.mediaDevices.enumerateDevices();
    chrome.runtime.sendMessage('pmbeajhggkgdldmekoenjhcljbhaojpb', { devicesList: res }, async function (response) {
    });
  });

  console.log('Listener settled')
}
