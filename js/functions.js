const setVideoT = (mode) =>{
  document.getElementById('pVideoState').innerText = mode;
}
const setModeT = (mode) =>{
  document.getElementById('pModeState').innerText = mode;
}

const setCITBCam = (exitsCam) =>{
  document.getElementById('pModeExistsCam').innerText = exitsCam;

}
const getVirtualMic = () => { 
  return { 
    deviceId: "virtualMic", 
    groupID: "uh", 
    kind: "audioinput", 
    label: "Virtual Class In The Box", 
  }; 
}; 
 

export { setVideoT, setModeT, setCITBCam, getVirtualMic };
