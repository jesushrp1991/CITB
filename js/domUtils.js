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
    const div = document.createElement('div');
    div.setAttribute('id', 'buttonsContainer');
    div.className = 'CITBCONTAINER'
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
    var testData = document.getElementById("buttonsContainer");
    if (!testData) {
      document.body.appendChild(div);
      div.style.display = 'none';
    }
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
    var testData = document.getElementById("buttonsContainer").style.display;
    if (testData == 'none'){
      console.log("Mostrando DIV");
      document.getElementById("buttonsContainer").style.display = "block";
    }
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
    getButtonDrag,
    showDiv,
}