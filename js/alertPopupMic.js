import {
  divOverlayMic,
  divFabMic,
  formWrapperMic,
  divHeaderMic,
  headerCloseMic,
  hHeaderMic,
  divContentMic,
  classIconMic,  
  divTextFieldsMic,
  labelTextMic,
  divButtonMic,  
  createPopupMic,
  setButtonCallBackMic,
} from "./managers/popupMicMode/popupMicMode.js";

import { getButtonMicAlertPopup } from "./domUtils.js";

const modalAlertCitbMicState = () => {
  console.log('Inyecto el boton')
  const buttonMicAlertPopup = getButtonMicAlertPopup();

  //POPUP SHOW ALERT CITB MIC PLUGGED/UNPLUGGED
  const div_OverlayMic = divOverlayMic();
  const div_FabMic = divFabMic();
  const form_WrapperMic = formWrapperMic();
  const div_HeaderMic = divHeaderMic();
  const close_headerMic = headerCloseMic();
  const h_HeaderMic = hHeaderMic();

  const div_ContentMic = divContentMic(); 
  const div_ButtonIconMic = classIconMic();
  const div_TextFieldsMic = divTextFieldsMic();
  const label_TextMic = labelTextMic();
  const div_ButtonMic = divButtonMic();  
  const brMic = document.createElement("br");
  const showMicAlertPopup = () => {
    try {
      createPopupMic(
        div_OverlayMic,
        div_FabMic,
        form_WrapperMic,
        div_HeaderMic,
        close_headerMic,
        h_HeaderMic,
        div_ContentMic,
        div_ButtonIconMic,
        div_TextFieldsMic,
        label_TextMic,
        div_ButtonMic,        
        brMic
      );
      setButtonCallBackMic(               
        close_headerMic,
        micAlertPopup
      );
    } catch (error) {
    //   logErrors(error, "showSimplePopup ln 458");
    }
  };
  const micAlertPopup = () => {
    div_FabMic.setAttribute("class", "fabsimple");
    div_OverlayMic.removeAttribute("class");
    // history.go(0);
    // window.location.reload();
    // console.log("pass location reload")
  };
  buttonMicAlertPopup.addEventListener("click", showMicAlertPopup);
  window.showMicAlertPopup = buttonMicAlertPopup;
    setTimeout(()=>{
    document.body.appendChild(buttonMicAlertPopup);
    },5000)
      
};

modalAlertCitbMicState();

export{
  modalAlertCitbMicState
}