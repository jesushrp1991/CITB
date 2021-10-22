const setVideoT = (mode) =>{
  document.getElementById('pVideoState').innerText = mode;
}
const setModeT = (mode) =>{
  document.getElementById('pModeState').innerText = mode;
}

const setCITBCam = (exitsCam) =>{
  document.getElementById('pModeExistsCam').innerText = exitsCam;

}

const helpNextPage = () =>{
  document.getElementById('help_div').style.display = 'none';
  document.getElementById('help_div1').style.display = 'block';
}


export { setVideoT, setModeT, setCITBCam, helpNextPage };
