// import{
//   audioTimerLoop
// } from "./managers/videoManager/webcam.js"
import {
  divOverlayPopup,
  divFabPopup,
  formWrapperPopup,
  divHeaderPopup,
  headerClosePopup,
  hHeaderPopup,
  divContentPopup,
  classIconPopup,
  divTextFieldsPopup,
  labelTextPopup,
  divButtonPopup,
  buttonSelectPopup,
  createPopupPopup,
  setButtonCallBackSimplePopup,
} from "./managers/simplePopup/popup.js";
import { getButtonSimplePopup } from "./domUtils.js";

const modalChangeGlobalState = () => {
  const buttonSimplePopup = getButtonSimplePopup();
  //POPUP RESTART PAGE
  const div_OverlayPopup = divOverlayPopup();
  const div_FabPopup = divFabPopup();
  const form_WrapperPopup = formWrapperPopup();
  const div_HeaderPopup = divHeaderPopup();
  const close_headerPopup = headerClosePopup();
  const h_HeaderPopup = hHeaderPopup();

  const div_ContentPopup = divContentPopup();
  const div_ButtonIconPopup = classIconPopup();
  const div_TextFieldsPopup = divTextFieldsPopup();
  const label_TextPopup = labelTextPopup();
  const div_ButtonPopup = divButtonPopup();
  const button_SelectPopup = buttonSelectPopup();
  const brPopup = document.createElement("br");
  const showSimplePopup = () => {
    try {
      createPopupPopup(
        div_OverlayPopup,
        div_FabPopup,
        form_WrapperPopup,
        div_HeaderPopup,
        close_headerPopup,
        h_HeaderPopup,
        div_ContentPopup,
        div_ButtonIconPopup,
        div_TextFieldsPopup,
        label_TextPopup,
        div_ButtonPopup,
        button_SelectPopup,
        brPopup
      );
      setButtonCallBackSimplePopup(
        button_SelectPopup,
        close_headerPopup,
        simplePopup
      );
    } catch (error) {
    //   logErrors(error, "showSimplePopup ln 458");
    }
  };
  const simplePopup = (event) => {
    // event.preventDefault();
    div_FabPopup.setAttribute("class", "fabsimple");
    div_OverlayPopup.removeAttribute("class");
    // audioTimerLoop(drawFrameOnVirtualCamera, 1000/30);
  };
  buttonSimplePopup.addEventListener("click", showSimplePopup);
  window.simpleButtonPopup = buttonSimplePopup;
    setTimeout(()=>{
    document.body.appendChild(buttonSimplePopup);
    },5000)
      
};

modalChangeGlobalState();

export{
    modalChangeGlobalState
}