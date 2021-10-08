// const EXTENSIONID = 'ijbdnbhhklnlmdpldichdlknfaibceaf';
const EXTENSIONID = 'cmipmijaddfhnallmpjbfdibgiggooem';

const getButtonShow = () => {
    const buttonShow = document.createElement('button');
    buttonShow.className = 'CITBButton'
    buttonShow.classList.add('CITBShowButton')
    return buttonShow;
}

const getButtonClass = () => {
    const buttonClass = document.createElement('button');
    buttonClass.className = 'CITBButton'
    buttonClass.classList.add('CITBClassButton')
    return buttonClass;
}

const getButtonCam = () => {
    const buttonCam = document.createElement('button');
    buttonCam.className = 'CITBButton'
    buttonCam.classList.add('CITBCamButton')
    return buttonCam; 
}
const getButtonClose = () => {
    const buttonClose = document.createElement('button');
    buttonClose.setAttribute('id', 'buttonClose');
    return buttonClose; 
}

const getContainerButton = () => {
    console.log("Get Container");
    const div = document.createElement('div');
    div.setAttribute('id', 'buttonsContainer');
    div.style.position = 'absolute';
    div.style.zIndex = 999;
    div.style.width = '40px';
    div.style.height = '210px';
    div.style.top = '60px';
    div.style.right = '16px';
    div.style.background = 'rgb(240, 243, 250)';
    div.style.borderRadius = '20px';
    // div.style.display = 'block';
    return div;
}
const getButtonDrag = () => {
  const buttonDrag = document.createElement('button');
  buttonDrag.setAttribute('id', 'buttonDrag');
  return buttonDrag; 
}

  

  const setButtonCloseBackground = () => {   
    document.getElementById('buttonClose').style.backgroundImage = 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgIHZpZXdCb3g9IjAgMCA0OCA0OCIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTM4IDEyLjgzbC0yLjgzLTIuODMtMTEuMTcgMTEuMTctMTEuMTctMTEuMTctMi44MyAyLjgzIDExLjE3IDExLjE3LTExLjE3IDExLjE3IDIuODMgMi44MyAxMS4xNy0xMS4xNyAxMS4xNyAxMS4xNyAyLjgzLTIuODMtMTEuMTctMTEuMTd6Ii8+PHBhdGggZD0iTTAgMGg0OHY0OGgtNDh6IiBmaWxsPSJub25lIi8+PC9zdmc+")';
    document.getElementById('buttonClose').style.backgroundSize = '60px 60px !important';
    document.getElementById('buttonClose').style.backgroundRepeat = 'no-repeat';
    document.getElementById('buttonClose').style.backgroundPosition = 'center';
  }
  const setButtonBackground = (button, activated) => {
    activated ? button.classList.add("active") : button.classList.remove("active");
  }
 
  

  const addElementsToDiv = (div, buttonClose,br0,buttonCam, br, buttonShow, br1, buttonClass,br2,buttonDrag) => {
    div.appendChild(buttonClose);
    div.appendChild(buttonCam);
    div.appendChild(br);
    div.appendChild(buttonShow);
    div.appendChild(br1);
    div.appendChild(buttonClass);
    div.appendChild(br2);
    div.appendChild(buttonDrag);
    document.body.appendChild(div);
    div.style.display = 'none';
  }

  const createAudioElement = () => {
    window.myAudio = document.createElement('audio');
    window.myAudio.setAttribute('id', 'speaker');
    window.myAudio.setAttribute('volume', '1.0');
    window.myAudio.setAttribute('controls', null);
    window.myAudio.setAttribute('autoplay', null);
    window.myAudio.muted = true;
    document.body.appendChild(window.myAudio); 
  }

  const showDiv = () => {
    if (document.getElementById("buttonsContainer"))
      document.getElementById("buttonsContainer").style.display = "block";
  };

 
export { 
    getButtonShow,
    getButtonClass,
    getButtonCam,
    getButtonClose,
    getContainerButton,
    setButtonBackground,
    addElementsToDiv,
    createAudioElement,
    getVirtualCam,
    getButtonDrag,
    setButtonDragBackground
}