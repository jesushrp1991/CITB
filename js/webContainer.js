import {
  getButtonCam,
  getButtonClose,
  getButtonClass,
  getButtonShow,
  getContainerButton,
  addElementsToDiv,
  getButtonDrag,
} from "./domUtils.js";

import {
  setCloseEvent,
  setbuttonShowClickEvent,
  setbuttonClassClickEvent,
  setButtonCamClickEvent,
  mouseDragEvents,
} from "./events.js";

const setWebContainer = () => {
  const buttonCam = getButtonCam();
  const buttonClass = getButtonClass();
  const buttonShow = getButtonShow();
  const buttonClose = getButtonClose();
  const buttonDrag = getButtonDrag();
  window.buttonsContainerDiv = getContainerButton();

  setbuttonClassClickEvent(buttonClass, window.classActivated, devices);
  setbuttonShowClickEvent(
    buttonShow,
    window.classActivated,
    devices,
    window.showActivated
  );
  setCloseEvent(buttonClose);
  setButtonCamClickEvent(buttonCam, window.classActivated, devices);
  mouseDragEvents(
    buttonClose,
    buttonCam,
    buttonShow,
    buttonClass,
    buttonClose,
    window.buttonsContainerDiv,
    buttonDrag
  );

  const br = document.createElement("br");
  const br0 = document.createElement("br");
  const br1 = document.createElement("br");
  const br2 = document.createElement("br");

  return addElementsToDiv(
    window.buttonsContainerDiv,
    buttonClose,
    br0,
    buttonCam,
    br,
    buttonShow,
    br1,
    buttonClass,
    br2,
    buttonDrag
  );
};
export { setWebContainer };
