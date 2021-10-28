// Initialize select with default mode 
// let buttonCam = document.getElementById('button1');
// let buttonShow = document.getElementById('button2');
let buttonChooseVideo = document.getElementById('button3');
let button4WEB = document.getElementById('button4');
let buttonChooseMic = document.getElementById('button5');
let showActivated = false, classActivated = false, citbActivated,webContainerActivated,canChangeCameras;

// const changeCam = () =>{
//   document.getElementsByClassName("CITBCamButton")[0].click(); 
// }
// const setButtonCamBackground = (citbActivated) => {
//   if (citbActivated) {
//     buttonCam.classList.remove('button1Deactivated');
//     buttonCam.classList.add('button1Activated');
//   } else {
//     buttonCam.classList.remove('button1Activated');
//     buttonCam.classList.add('button1Deactivated');
//   }
// }

// buttonCam.addEventListener("click", async () => {
//   if (!canChangeCameras) {return};
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: changeCam,
//   });
//   citbActivated = !citbActivated;
//   setButtonCamBackground(citbActivated);  
// });

// const setButtonShowBackground = (citbActivated) => {
//   if (citbActivated) {
//     buttonShow.classList.remove('button2Deactivated');
//     buttonShow.classList.add('button2Activated');
//   } else {
//     buttonShow.classList.remove('button2Activated');
//     buttonShow.classList.add('button2Deactivated');
//   }
// }
// const changeShow = () =>{
//   document.getElementsByClassName("CITBShowButton")[0].click(); 
// }
// buttonShow.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: changeShow,
//   });
//   showActivated = !showActivated;
//   setButtonShowBackground(showActivated); 
// });

// const setButtonClassBackground = (citbActivated) => {
//   if (citbActivated) {
//     buttonClass.classList.remove('button3Deactivated');
//     buttonClass.classList.add('button3Activated');
//   } else {
//     buttonClass.classList.remove('button3Activated');
//     buttonClass.classList.add('button3Deactivated');
//   }
// }

// const changeClass = () =>{
//   document.getElementsByClassName("CITBClassButton")[0].click(); 
// }

// buttonClass.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: changeClass,
//   });
//   classActivated = !classActivated;
//   setButtonClassBackground(classActivated);
// });
 


const showContainer = () => {
  document.getElementById('buttonsContainer').style.visibility = 'visible';
  document.getElementById("pWebContainerState").innerText = "OPEN";
};

const closeContainer = () => {
  document.getElementById('buttonsContainer').style.visibility = 'hidden';
  document.getElementById("pWebContainerState").innerText = "CLOSE";
};
const setButtonWebContainerBackground = (isOpen) => {
  if(isOpen){   
    button4WEB.className = "buttonOpen4WebContainer";
  } else {    
    button4WEB.className = "button4WebContainer";
  }
}

button4WEB.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if(webContainerActivated)
    {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: closeContainer,
      });
    }else{
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showContainer,
      });
    }
  webContainerActivated = !webContainerActivated;
  setButtonWebContainerBackground(webContainerActivated);
});

// const getVideoSate = () =>{
//   let modeActive = document.getElementById('pVideoState').innerText.toString();  
//   return modeActive;
// }
// const chekVideoState = async() => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: getVideoSate
//   },(injectionResults) => {
//     injectionResults[0].result == "CITB" ?
//                   citbActivated = true
//                 : citbActivated = false;
//     setButtonCamBackground(citbActivated);

//   });
// }
// chekVideoState();


// const getModeSate = () =>{
//   let modeActive = document.getElementById('pModeState').innerText.toString();  
//   return modeActive;
// }

// const chekModeState = async() => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: getModeSate
//   },(injectionResults) => {
//     if(injectionResults[0].result == "SHOW"){
//       showActivated = true
//       setButtonClassBackground(false);
//       setButtonShowBackground(true);
//     }else if (injectionResults[0].result == "CLASS"){
//       classActivated = true;
//       setButtonClassBackground(true);
//       setButtonShowBackground(false);
//     }else{
//       setButtonClassBackground(false);
//       setButtonShowBackground(false);
//     }
//   });
// }

// chekModeState();

const getWebContainerState = () =>{
  let isOpen = document.getElementById('pWebContainerState').innerText.toString();  
  return isOpen;
}
const chekWebContainerState = async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getWebContainerState
  },(injectionResults) => {
    injectionResults[0].result == "OPEN" ?
                  webContainerActivated = true
                : webContainerActivated = false;
    setButtonWebContainerBackground(webContainerActivated);
  });
}
chekWebContainerState();

// const getpModeExistsCamState = () =>{
//   let isOpen = document.getElementById('pModeExistsCam').innerText.toString();  
//   return isOpen;
// }
// const chekpModeExistsCamState = async() => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: getpModeExistsCamState
//   },(injectionResults) => {
//     injectionResults[0].result == "true" ?
//                   canChangeCameras = true
//                 : canChangeCameras = false;
//   });
// }
// chekpModeExistsCamState();



const choose_Mic = () =>{
  document.getElementById("buttonPopup").click(); 
}
buttonChooseMic.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: choose_Mic,
    args: [true],
  });
});

const choose_Video = () =>{
  document.getElementById("buttonPopupVideo").click(); 
}
buttonChooseVideo.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: choose_Video,
    args: [true],
  });
});
