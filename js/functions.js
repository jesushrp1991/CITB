const setVideoT = (mode) =>{
  document.getElementById('pVideoState').innerText = mode;
}
const setModeT = (mode) =>{
  document.getElementById('pModeState').innerText = mode;
}

const setCITBCam = (exitsCam) =>{
  document.getElementById('pModeExistsCam').innerText = exitsCam;

}

const helpNextPage1 = () =>{
  document.getElementById('help_div').style.display = 'none';
  document.getElementById('help_div1').style.display = 'block';
}

const helpNextPage2 = () =>{
  document.getElementById('help_div1').style.display = 'none';
  document.getElementById('help_div2').style.display = 'block';
}

const helpNextPage3 = () =>{
  document.getElementById('help_div2').style.display = 'none';
  document.getElementById('help_div3').style.display = 'block';
}

const helpNextPage4 = () =>{
  document.getElementById('help_div3').style.display = 'none';
  document.getElementById('help_div4').style.display = 'block';
}


export { setVideoT,
        setModeT,
        setCITBCam,
        helpNextPage1,
        helpNextPage2,
        helpNextPage3,
        helpNextPage4
      };
