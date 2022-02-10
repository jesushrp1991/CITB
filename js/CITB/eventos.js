import { 
  closeButtonContainer
  } from './domUtils.js';

const setEvents = (buttonShow,buttonClass,buttonCam,buttonClose,buttonsContainerDiv,camCallBackFunction,showCallBackFunction,classCallBackFunction) => {
    buttonCam.addEventListener('click', camCallBackFunction);

    buttonShow.addEventListener('click', showCallBackFunction);
      
    buttonClass.addEventListener('click', classCallBackFunction);
      
    buttonClose.addEventListener('click', () => {
        closeButtonContainer(buttonsContainerDiv);
    });
    
      buttonClose.addEventListener("mouseenter",() => {
        handleMouseOverEvent();
      },{passive: false});
    
      buttonCam.addEventListener("mouseenter",() => {
        handleMouseOverEvent();
      },{passive: false});
      
      buttonShow.addEventListener("mouseenter",() => {
        handleMouseOverEvent();
      },{passive: false});
    
      buttonClass.addEventListener("mouseenter",() => {
        handleMouseOverEvent();
      },{passive: false});
    
      buttonClose.addEventListener("mouseleave",() => {
        handleMouseLeaveEvent();
      },{passive: false});
    
      buttonCam.addEventListener("mouseleave",() => {
        handleMouseLeaveEvent();
      },{passive: false});
      
      buttonShow.addEventListener("mouseleave",() => {
        handleMouseLeaveEvent();
      },{passive: false});
    
      buttonClass.addEventListener("mouseleave",() => {
        handleMouseLeaveEvent();
      },{passive: false});
    
      buttonsContainerDiv.addEventListener('mouseenter',()=>{
        handleMouseOverEvent();
      },{passive: false });
    
      buttonsContainerDiv.addEventListener("mouseleave",() => {
        handleMouseLeaveEvent();
      },{passive: false});
    
      buttonsContainerDiv.addEventListener("mouseover",() => {
        handleMouseOverEvent();
      },{passive: false});
      
      buttonsContainerDiv.addEventListener('mousedown', (e) => {
         dragMouseDown(e);
      });
      buttonDrag.addEventListener('mousedown', (e) => {
         dragMouseDown(e);
      });

      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }
    
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        buttonsContainerDiv.style.rigth = '';
        buttonsContainerDiv.style.top = (buttonsContainerDiv.offsetTop - pos2) + "px";
        buttonsContainerDiv.style.left = (buttonsContainerDiv.offsetLeft - pos1) + "px";
      }
    
      const handleMouseOverEvent = () =>{
        document.getElementById('buttonsContainer').style.background = 'rgba(240, 243, 250,0.8)';
        // document.getElementById('buttonClose').style.visibility = 'visible';
      };
      
      const handleMouseLeaveEvent = () =>{
        document.getElementById('buttonsContainer').style.background = 'rgb(240, 243, 250)';
        document.getElementById('buttonsContainer').style.boxShadow = 'none'
      };
    
      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      };
};
export { 
    setEvents
}