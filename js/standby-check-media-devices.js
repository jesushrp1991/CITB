
import { enviroment } from "./enviroment.js";
import {
  getButtonShow,
  getButtonClass,
  getButtonCam,
  getButtonClose,
  getContainerButton,
  setButtonBackground,
  addElementsToDiv,
  getVirtualCam,
  getButtonDrag,
  setMicrophone,
  showDiv,
  createWebContainerState,
  createCitbMicrophoneState,
  createModeCurrentMic,
  getButtonShowPopupMicClassMode,
  getButtonShowPopupVideo,
  getButtonPresentation
} from "./domUtils.js";

import {
  divOverlay,
  divFab,
  formWrapper,
  divHeader,
  headerClose,
  hHeader,
  divContent,
  classIcon,
  divTextFields,
  selectMic,
  labelText,
  divButton,
  checkboxSelect,
  labelCheckBox,
  buttonSelect,
  createPopup,
  setButtonCallBack
} from "./managers/popupClassMode/popupClassMode.js";

import {
  divOverlayVideo,
  divFabVideo,
  formWrapperVideo,
  divHeaderVideo,
  headerCloseVideo,
  hHeaderVideo,
  buttonCloseVideo,
  divContentVideo,
  classIconVideo,
  divTextFieldsVideo,
  selectMicVideo,
  labelTextVideo,
  divButtonVideo,
  buttonSelectVideo,
  createPopupVideo,
  setButtonCallBackVideo
} from "./managers/popupVideoMode/popupVideoMode.js";

let lastCitbMicStatus;
let firstTime = true;



function monkeyPatchMediaDevices1() { 
  
  //POPUP MIC MODE
  const div_Overlay = divOverlay();
  const div_Fab = divFab();
  const form_Wrapper = formWrapper();
  const div_Header = divHeader();
  const header_close = headerClose();
  const h_Header = hHeader();
  const div_Content = divContent();
  const div_ButtonIcon = classIcon();
  const div_TextFields = divTextFields();
  const selec_Mic = selectMic();
  const label_Text = labelText();
  const div_Button = divButton();
  const checkbox_class = checkboxSelect();
  const checkbox_label = labelCheckBox();
  const button_Select = buttonSelect();
  const br = document.createElement("br");

  const buttonClose = getButtonClose();
  
  const pCitbMicrophoneState = createCitbMicrophoneState();  
  const buttonPopup = getButtonShowPopupMicClassMode();  
  
  document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {      
      document.body.appendChild(pCitbMicrophoneState);
      buttonPopup.addEventListener('click', showPopupMic);     
      document.body.appendChild(buttonPopup);
    }    
  }; 

  const alertPopup = () =>{ 
console.log('entro al alertPopup')
    if (document.getElementById("pCitbMicrophoneState")) {
      let p = document.getElementById("pWebContainerState").innerText= "CLOSE"
      console.log('p :',p);
             
    }
    document.getElementById('buttonsContainer').style.visibility = 'hidden';
    document.getElementById("pWebContainerState").innerText = "CLOSE";
    //document.getElementById("buttonClose").click
    //console.log('el alert popup',document.getElementById("pCitbMicrophoneState").innerText.toString());  
}

//alertPopup();

  const showPopupMic = async () => {
    try {
      let usableMics = [];
      
      createPopup(
        div_Overlay,
        div_Fab,
        form_Wrapper,
        div_Header,
        header_close,
        h_Header,
        div_Content,
        div_ButtonIcon,
        div_TextFields,
        selec_Mic,
        label_Text,
        div_Button,
        checkbox_class,
        checkbox_label,
        button_Select,
        br,
        usableMics
      );
      setButtonCallBack(button_Select, header_close, chooseMicClassMode);
    } catch (error) {
      console.log(error)
      //logErrors(error, "showPopupMic ln 364")
    }
  }

    
  const checkDevices = async () => {

    let citbMicStatus;
    const deviceList = await navigator.mediaDevices.enumerateDevices(); 
    console.log(deviceList)     
    const citbMicrophone = deviceList.filter(
        (device) =>
          device.kind === "audioinput" &&
          device.label.includes(enviroment.MYAUDIODEVICELABEL)
      );
      citbMicrophone.length > 0 ? citbMicStatus = "PLUGGED" :  citbMicStatus = "UNPLUGGED";
      if (document.getElementById("pCitbMicrophoneState")) {
        document.getElementById("pCitbMicrophoneState").innerText = citbMicStatus;
        console.log('citbMicStatus standby :',citbMicStatus);        
      }
     /* if (firstTime) {        
        firstTime = false;   
        console.log('firstTime ');
      }else {
        console.log('Not firstTime')
        if (lastCitbMicStatus !== citbMicStatus) {
          if (citbMicStatus == "PLUGGED"){
            alert("A CITB microphone has been connected")
          }else {
            //alert("A CITB microphone has been disconnected")
            //showPopupMic();
            alertPopup();
            importedMonkeyPatchMediaDevices.camCallBackFunction()
          }        
        }        
      }
      lastCitbMicStatus = citbMicStatus; */
        
    setTimeout(() => {
      checkDevices();
    }, 1000);
  };  
  checkDevices();
  //showPopupMic();
}

monkeyPatchMediaDevices1();
