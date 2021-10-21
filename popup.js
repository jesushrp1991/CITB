// Initialize select with default mode 
let buttonCam = document.getElementById('button1');
let buttonShow = document.getElementById('button2');
let buttonClass = document.getElementById('button3');
let button4WEB = document.getElementById('button4');

let showActivated = false, classActivated = false, citbActivated,webContainerActivated,canChangeCameras;

const changeCam = () =>{
  document.getElementsByClassName("CITBCamButton")[0].click(); 
}
const setButtonCamBackground = (citbActivated) => {
  if (citbActivated) {
    buttonCam.classList.remove('button1Deactivated');
    buttonCam.classList.add('button1Activated');
  } else {
    buttonCam.classList.remove('button1Activated');
    buttonCam.classList.add('button1Deactivated');
  }
}

buttonCam.addEventListener("click", async () => {
  if (!canChangeCameras) {return};
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: changeCam,
  });
  citbActivated = !citbActivated;
  setButtonCamBackground(citbActivated);  
});

const setButtonShowBackground = (citbActivated) => {
  if (citbActivated) {
    buttonShow.classList.remove('button2Deactivated');
    buttonShow.classList.add('button2Activated');
  } else {
    buttonShow.classList.remove('button2Activated');
    buttonShow.classList.add('button2Deactivated');
  }
}
const changeShow = () =>{
  document.getElementsByClassName("CITBShowButton")[0].click(); 
}
buttonShow.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: changeShow,
  });
  showActivated = !showActivated;
  setButtonShowBackground(showActivated); 
});

const setButtonClassBackground = (citbActivated) => {
  if (citbActivated) {
    buttonClass.classList.remove('button3Deactivated');
    buttonClass.classList.add('button3Activated');
  } else {
    buttonClass.classList.remove('button3Activated');
    buttonClass.classList.add('button3Deactivated');
  }
}

const changeClass = () =>{
  document.getElementsByClassName("CITBClassButton")[0].click(); 
}

buttonClass.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: changeClass,
  });
  classActivated = !classActivated;
  setButtonClassBackground(classActivated);
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
    button4WEB.style.background='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOm5vbmU7c3Ryb2tlOiM2QzNEQjc7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzFGOTkyQTtzdHJva2Utd2lkdGg6NDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojNkE4M0JBO3N0cm9rZS13aWR0aDo0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0M3tmaWxsOiM4QThBRkY7c3Ryb2tlOiM4QThBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Q0e2ZpbGw6IzZDM0RCNztzdHJva2U6IzZDM0RCNztzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDV7ZmlsbDojQTU3NkZGO3N0cm9rZTojQTU3NkZGO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0NntmaWxsOiNGMkJCNDE7c3Ryb2tlOiNGMkJCNDE7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Q3e2ZpbGw6I0UwODgzODtzdHJva2U6I0UwODgzODtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDh7ZmlsbDojMUY5OTJBO3N0cm9rZTojMUY5OTJBO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0OXtmaWxsOiM1RUMxMUU7c3Ryb2tlOiM1RUMxMUU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMHtmaWxsOiNFM0ZBRkY7c3Ryb2tlOiNFM0ZBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMXtmaWxsOiNGRjUwOTM7c3Ryb2tlOiNGRjUwOTM7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMntmaWxsOiNCNzI1N0Y7c3Ryb2tlOiNCNzI1N0Y7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxM3tmaWxsOiM1MTg5RTU7c3Ryb2tlOiM1MTg5RTU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNHtmaWxsOiM2RUJBRkY7c3Ryb2tlOiM2RUJBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNXtmaWxsOiNFREQ5Nzc7c3Ryb2tlOiNFREQ5Nzc7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNntmaWxsOiM4QzQzRkY7c3Ryb2tlOiM4QzQzRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxN3tmaWxsOiM1MjUyQkE7c3Ryb2tlOiM1MjUyQkE7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxOHtmaWxsOm5vbmU7c3Ryb2tlOiNFM0ZBRkY7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxOXtmaWxsOiMzNTRDNzU7c3Ryb2tlOiMzNTRDNzU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMjksMTVjMCwwLTYuOCw5LTE0LDlTMSwxNSwxLDE1czYuOC05LDE0LTlTMjksMTUsMjksMTV6Ii8+DQo8Y2lyY2xlIGNsYXNzPSJzdDE4IiBjeD0iMTUiIGN5PSIxNSIgcj0iNSIvPg0KPC9zdmc+DQo=")';
  } else {    
    button4WEB.style.background='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iSWNvbnMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0M3tmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDR7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5OjM7fQ0KPC9zdHlsZT4NCjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOSwxNmMwLDAtNS44LDgtMTMsOFMzLDE2LDMsMTZzNS44LTgsMTMtOFMyOSwxNiwyOSwxNnoiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE2IiBjeT0iMTYiIHI9IjQiLz4NCjwvc3ZnPg0K")';
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

const getVideoSate = () =>{
  let modeActive = document.getElementById('pVideoState').innerText.toString();  
  return modeActive;
}
const chekVideoState = async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getVideoSate
  },(injectionResults) => {
    injectionResults[0].result == "CITB" ?
                  citbActivated = true
                : citbActivated = false;
    setButtonCamBackground(citbActivated);

  });
}
chekVideoState();


const getModeSate = () =>{
  let modeActive = document.getElementById('pModeState').innerText.toString();  
  return modeActive;
}

const chekModeState = async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getModeSate
  },(injectionResults) => {
    if(injectionResults[0].result == "SHOW"){
      showActivated = true
      setButtonClassBackground(false);
      setButtonShowBackground(true);
    }else if (injectionResults[0].result == "CLASS"){
      classActivated = true;
      setButtonClassBackground(true);
      setButtonShowBackground(false);
    }else{
      setButtonClassBackground(false);
      setButtonShowBackground(false);
    }
  });
}

chekModeState();

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

const getpModeExistsCamState = () =>{
  let isOpen = document.getElementById('pModeExistsCam').innerText.toString();  
  return isOpen;
}
const chekpModeExistsCamState = async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getpModeExistsCamState
  },(injectionResults) => {
    injectionResults[0].result == "true" ?
                  canChangeCameras = true
                : canChangeCameras = false;
  });
}
chekpModeExistsCamState();
