// Initialize select with default mode 
let buttonOn = document.getElementById('button1');
let buttonChooseVideo = document.getElementById('button3');
let button4WEB = document.getElementById('button4');
let buttonChooseMic = document.getElementById('button5');
let showActivated = false, classActivated = false, citbActivated,webContainerActivated,canChangeCameras,globalState;


const getOnOffState = () =>{
  chrome.storage.sync.get('extensionGlobalState', (data) =>{
      console.log(data.extensionGlobalState);
      globalState = data.extensionGlobalState;
      if(globalState == "on"){
          buttonOn.setAttribute('class','buttonOpen4WebContainer');
      }else{
        buttonOn.setAttribute('class','button4WebContainer');
      }
  });
}
getOnOffState();

buttonOn.addEventListener("click", () =>{
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    if(globalState == 'on'){
      console.log("Set off")
      globalState = "off";
      chrome.storage.sync.set({ extensionGlobalState: "off" });
      buttonOn.setAttribute('class','button4WebContainer');
    }else{
      console.log("Set on")
      globalState = "on";
      chrome.storage.sync.set({ extensionGlobalState: "on" });
      buttonOn.setAttribute('class','buttonOpen4WebContainer');
    }
    if(url.includes('meet.google.com') || url.includes('teams.microsoft.com')||url.includes('teams.live.com')){
      alert('Debe reiniciar la videollamada para guardar los cambios');
    }
  });
    
});

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
