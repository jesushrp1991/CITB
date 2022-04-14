import { closeButtonContainer } from "./domUtils.js";

const setEvents = (
  buttonsContainerDiv,
  camCallBackFunction,
  showCallBackFunction,
  classCallBackFunction
) => {
  console.log("INSIDE SET EVENTS", buttonsContainerDiv);
  buttonsContainerDiv.addEventListener(
    "citbCamClickedEvent",
    camCallBackFunction
  );
  buttonsContainerDiv.addEventListener(
    "citbShowClickedEvent",
    showCallBackFunction
  );
  buttonsContainerDiv.addEventListener(
    "citbClassClickedEvent",
    classCallBackFunction
  );

  buttonsContainerDiv.addEventListener("closeClickedEvent", () => {
    closeButtonContainer(buttonsContainerDiv);
  });

  console.log("before mouse down", buttonsContainerDiv);
  buttonsContainerDiv.addEventListener("mousedown", (e) => {
    console.log("MOUSEDOWN");
    dragMouseDown(e);
  });

  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  function dragMouseDown(e) {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    e.preventDefault();
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    buttonsContainerDiv.style.rigth = "";
    buttonsContainerDiv.style.top = buttonsContainerDiv.offsetTop - pos2 + "px";
    buttonsContainerDiv.style.left =
      buttonsContainerDiv.offsetLeft - pos1 + "px";
  }

  const handleMouseOverEvent = () => {
    document.getElementById("buttonsContainer").style.background =
      "rgba(240, 243, 250,0.8)";
    // document.getElementById('buttonClose').style.visibility = 'visible';
  };

  const handleMouseLeaveEvent = () => {
    document.getElementById("buttonsContainer").style.background =
      "rgb(240, 243, 250)";
    document.getElementById("buttonsContainer").style.boxShadow = "none";
  };

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
};
export { setEvents };
