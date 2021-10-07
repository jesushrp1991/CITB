    document.getElementById('buttonCam').addEventListener("click",() => {
      console.log("ExtensionID",EXTENSIONID);
      chrome.runtime.sendMessage({camButton: "buttonsCamClick"}, async function(response) { 
        console.log(response.result); 
        checkingVideo();
        // init();
      }); 
    },{passive: false});
    
    document.getElementById('buttonShow').addEventListener("mouseenter",() => {
      handleMouseOverEvent();
    },{passive: false});

    document.getElementById('buttonsClass').addEventListener("mouseenter",() => {
      handleMouseOverEvent();
    },{passive: false});
    
    document.getElementById('buttonClose').addEventListener("mouseleave",() => {
      handleMouseLeaveEvent();
    },{passive: false});

    document.getElementById('buttonClose').addEventListener('click', () => {
      console.log("CLOSE!!!");
      window.buttonsContainerDiv.style.visibility = 'hidden';

      chrome.runtime.sendMessage({hideWebContainer: "hideWebContainer"}, function(response) { 
        if (response && response.result){
          console.log(response.result); 
          window.buttonsContainerDiv.style.visibility = 'hidden';
        }
      }); 
    });

    document.getElementById('buttonCam').addEventListener("mouseleave",() => {
      handleMouseLeaveEvent();
    },{passive: false});
    
    document.getElementById('buttonShow').addEventListener("mouseleave",() => {
      handleMouseLeaveEvent();
    },{passive: false});

    document.getElementById('buttonsClass').addEventListener("mouseleave",() => {
      handleMouseLeaveEvent();
    },{passive: false});
    
    document.getElementById('buttonDrag').addEventListener('mousedown', (e) => {
      dragMouseDown(e);
    });

    buttonsContainerDiv.addEventListener('mouseenter',()=>{
      handleMouseOverEvent();
    },{passive: false });

    buttonsContainerDiv.addEventListener("mouseleave",() => {
      handleMouseLeaveEvent();
    },{passive: false});          

    window.buttonsContainerDiv.addEventListener('mouseover', (e) => {
      handleMouseOverEvent();
    });          
    window.buttonsContainerDiv.addEventListener('mousedown', (e) => {
        dragMouseDown(e);
    });          

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      window.buttonsContainerDiv.style.rigth = '';
      window.buttonsContainerDiv.style.top = (window.buttonsContainerDiv.offsetTop - pos2) + "px";
      window.buttonsContainerDiv.style.left = (window.buttonsContainerDiv.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
    const handleMouseOverEvent = () =>{
        buttonsContainerDiv.style.background = 'rgba(240, 243, 250,0.8)';
        buttonClose.style.display = 'block';
      };
      
     const handleMouseLeaveEvent = () =>{
        buttonsContainerDiv.style.background = 'rgb(240, 243, 250)';
        buttonsContainerDiv.style.boxShadow = 'none'
        buttonClose.style.display = 'none';
      };