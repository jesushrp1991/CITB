// Initialize select with default mode 
// let buttonCam = document.getElementById('button1');
// let buttonShow = document.getElementById('button2');
let buttonChooseVideo = document.getElementById('button3');
let button4WEB = document.getElementById('button4');
let buttonChooseMic = document.getElementById('button5');
let showActivated = false, classActivated = false, citbActivated,webContainerActivated,canChangeCameras;

const showContainer = `
  document.getElementById('buttonsContainer').style.visibility = 'visible';
  document.getElementById("pWebContainerState").innerText = "OPEN";
`

const closeContainer = `
  document.getElementById('buttonsContainer').style.visibility = 'hidden';
  document.getElementById("pWebContainerState").innerText = "CLOSE";
`

const setButtonWebContainerBackground = (isOpen) => {
  if(isOpen){   
    button4WEB.className = "buttonOpen4WebContainer";
  } else {    
    button4WEB.className = "button4WebContainer";
  }
}

button4WEB.addEventListener("click", async () => {
  if(webContainerActivated)
    {
      browser.tabs.executeScript({
  
        code: closeContainer,
      });
    }else{
      browser.tabs.executeScript({
  
        code: showContainer,
      });
    }
  webContainerActivated = !webContainerActivated;
  setButtonWebContainerBackground(webContainerActivated);
});

const getWebContainerState =`
  document.getElementById('pWebContainerState').innerText.toString();  
`
const chekWebContainerState = async() => {
  browser.tabs.executeScript({
    code: getWebContainerState
  },(injectionResults) => {
    injectionResults[0].result == "OPEN" ?
                  webContainerActivated = true
                : webContainerActivated = false;
    setButtonWebContainerBackground(webContainerActivated);
  });
}
chekWebContainerState();

const choose_Mic = `
  document.getElementById("buttonPopup").click(); 
`
buttonChooseMic.addEventListener("click", async () => {
  browser.tabs.executeScript({
    code: choose_Mic
  });
});

const choose_Video = `
  document.getElementById("buttonPopupVideo").click(); 
`
buttonChooseVideo.addEventListener("click", async () => {
  browser.tabs.executeScript({
    code: choose_Video
  });
});
