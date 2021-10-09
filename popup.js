import {enviroment } from './enviroment.js'


// Initialize select with default mode 
let buttonCam = document.getElementById('button1');
let buttonShow = document.getElementById('button2');
let buttonClass = document.getElementById('button3');
let button4WEB = document.getElementById('button4');
let showActivated = false, classActivated = false, citbActivated;
const MYVIDEODDEVICELABEL = enviroment.MYVIDEODDEVICELABEL;
const MYAUDIODEVICELABEL = enviroment.MYAUDIODEVICELABEL;
let defaultVideo, defaultVideoLabel, webContainerClosed;

let microphonesList = [];
let videosList = []

chrome.storage.sync.get("devicesList", ({ devicesList }) => {
  if (devicesList) {
    microphonesList = devicesList.filter(x => x.kind == 'audioinput');
    videosList = devicesList.filter(x => x.kind == 'videoinput');
  }
});

chrome.storage.sync.get("buttonsOpen", ({buttonsOpen}) => {
  //console.log(buttonsOpen);
  webContainerClosed = buttonsOpen;
  setButtonWebContainerBackground(buttonsOpen);
});

chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
  //console.log('asdsadasdaa');
  //console.log(defaultVideoId);
  if (defaultVideoId !== undefined) {
    defaultVideo = defaultVideoId;
    defaultVideoLabel = videosList.filter(x => x.deviceId === defaultVideoId)[0].label;
  }
});

chrome.storage.sync.get("defaultMode", ({ defaultMode }) => {
  showActivated = defaultMode === 'show';
  classActivated = defaultMode === 'class';
  setButtonShowBackground(showActivated);
  setButtonClassBackground(classActivated);
  if (defaultVideo && defaultVideoLabel) {
    citbActivated = defaultVideoLabel.includes(MYVIDEODDEVICELABEL)
    setButtonCamBackground(citbActivated)
  }
});

// const setButtonWebContainerBackground = (isClosed) => {
//   if(isClosed){
//     button4WEB.style.background='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iSWNvbnMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0M3tmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDR7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5OjM7fQ0KPC9zdHlsZT4NCjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOSwxNmMwLDAtNS44LDgtMTMsOFMzLDE2LDMsMTZzNS44LTgsMTMtOFMyOSwxNiwyOSwxNnoiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE2IiBjeT0iMTYiIHI9IjQiLz4NCjwvc3ZnPg0K")';
//   } else {
//     button4WEB.style.background='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOm5vbmU7c3Ryb2tlOiM2QzNEQjc7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzFGOTkyQTtzdHJva2Utd2lkdGg6NDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojNkE4M0JBO3N0cm9rZS13aWR0aDo0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0M3tmaWxsOiM4QThBRkY7c3Ryb2tlOiM4QThBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Q0e2ZpbGw6IzZDM0RCNztzdHJva2U6IzZDM0RCNztzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDV7ZmlsbDojQTU3NkZGO3N0cm9rZTojQTU3NkZGO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0NntmaWxsOiNGMkJCNDE7c3Ryb2tlOiNGMkJCNDE7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Q3e2ZpbGw6I0UwODgzODtzdHJva2U6I0UwODgzODtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDh7ZmlsbDojMUY5OTJBO3N0cm9rZTojMUY5OTJBO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0OXtmaWxsOiM1RUMxMUU7c3Ryb2tlOiM1RUMxMUU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMHtmaWxsOiNFM0ZBRkY7c3Ryb2tlOiNFM0ZBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMXtmaWxsOiNGRjUwOTM7c3Ryb2tlOiNGRjUwOTM7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMntmaWxsOiNCNzI1N0Y7c3Ryb2tlOiNCNzI1N0Y7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxM3tmaWxsOiM1MTg5RTU7c3Ryb2tlOiM1MTg5RTU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNHtmaWxsOiM2RUJBRkY7c3Ryb2tlOiM2RUJBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNXtmaWxsOiNFREQ5Nzc7c3Ryb2tlOiNFREQ5Nzc7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNntmaWxsOiM4QzQzRkY7c3Ryb2tlOiM4QzQzRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxN3tmaWxsOiM1MjUyQkE7c3Ryb2tlOiM1MjUyQkE7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxOHtmaWxsOm5vbmU7c3Ryb2tlOiNFM0ZBRkY7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxOXtmaWxsOiMzNTRDNzU7c3Ryb2tlOiMzNTRDNzU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMjksMTVjMCwwLTYuOCw5LTE0LDlTMSwxNSwxLDE1czYuOC05LDE0LTlTMjksMTUsMjksMTV6Ii8+DQo8Y2lyY2xlIGNsYXNzPSJzdDE4IiBjeD0iMTUiIGN5PSIxNSIgcj0iNSIvPg0KPC9zdmc+DQo=")';
//   }
// }

const setButtonCamBackground = (citbActivated) => {
  const button = document.getElementById('button1');
  if (citbActivated) {
    button.classList.remove('button1Deactivated');
    button.classList.add('button1Activated');
  } else {
    button.classList.remove('button1Activated');
    button.classList.add('button1Deactivated');
  }
}

const setButtonShowBackground = (citbActivated) => {
  const button = document.getElementById('button2');
  if (citbActivated) {
    button.classList.remove('button2Deactivated');
    button.classList.add('button2Activated');
  } else {
    button.classList.remove('button2Activated');
    button.classList.add('button2Deactivated');
  }
}

const setButtonClassBackground = (citbActivated) => {
  const button = document.getElementById('button3');
  if (citbActivated) {
    button.classList.remove('button3Deactivated');
    button.classList.add('button3Activated');
  } else {
    button.classList.remove('button3Activated');
    button.classList.add('button3Deactivated');
  }
}

buttonCam.addEventListener("click", async () => {
  //console.log('le dio clic al boton de la camara');
  if (citbActivated) {
    //console.log('esta activado',videosList);
    const otherVideos = videosList.filter(x => (x.deviceId != defaultVideo));
    //console.log('other videos length', otherVideos.length);
    if (otherVideos.length > 0) {
      //console.log('entro al if')
      chrome.storage.sync.set({ defaultVideoId: otherVideos[0].deviceId }, () => {
        //console.log('seteo el valor en el storage');
        citbActivated = false;
        setButtonCamBackground(citbActivated);
      });
    } else {
      alert('Could not change Video');
    }
  } else {
    //console.log('no esta activado')
    const citbVideo = videosList.filter(x => (x.label.includes(MYVIDEODDEVICELABEL)));
    //console.log('other videos length', citbVideo.length);
    if (citbVideo.length > 0) {
      //console.log('entro al if')
      chrome.storage.sync.set({ defaultVideoId: citbVideo[0].deviceId }, () => {
        //console.log('seteo el valor en el storage');
        citbActivated = true
        setButtonCamBackground(citbActivated);
      });
    } else {
      alert('Could not change Video');
    }
  }
});

buttonShow.addEventListener("click", async () => {
  if (classActivated) {
    const citbMicrophone = microphonesList.filter(x => (x.label.includes(MYAUDIODEVICELABEL)));
    if (citbMicrophone.length > 0) {
      chrome.storage.sync.set({ 'defaultMicrophoneId': citbMicrophone[0].deviceId });
    } else {
      alert('Could not change Microphone');
    }
  }
  chrome.storage.sync.set({ 'defaultMode': showActivated ? 'none' : 'show' }, () => {
    setButtonShowBackground(!showActivated);
    showActivated = !showActivated
  });
});

buttonClass.addEventListener("click", async () => {
  if (classActivated) {
    const citbMicrophone = microphonesList.filter(x => (x.label.includes(MYAUDIODEVICELABEL)));
    if (citbMicrophone.length > 0) {
      chrome.storage.sync.set({ 'defaultMicrophoneId': citbMicrophone[0].deviceId });
      chrome.storage.sync.set({ 'defaultMode': 'none' }, () => {
        classActivated = false;
        setButtonClassBackground(classActivated);
      });
    } else {
      alert('Could not change Microphone');
    }
  } else {
    const otherMicrophones = microphonesList.filter(x => (!x.label.includes(MYAUDIODEVICELABEL)));
    if (otherMicrophones.length > 0) {
      chrome.storage.sync.set({ 'defaultMicrophoneId': otherMicrophones[0].deviceId });
      chrome.storage.sync.set({ 'defaultMode': 'class' }, () => {
        classActivated = true;
        setButtonClassBackground(classActivated);
      });
    } else {
      alert('Could not change Microphone');
    }
  }
});

button4WEB.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.storage.sync.get("buttonsOpen", ({buttonsOpen}) => {
    //console.log(buttonsOpen);
    webContainerClosed = buttonsOpen;
    if (webContainerClosed) {
      //console.log('esta cerrado');
      webContainerClosed = !webContainerClosed;
      setButtonWebContainerBackground(webContainerClosed);
      //console.log('voy a abrirlo');
      chrome.storage.sync.set({ 'buttonsOpen': false }, () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: showContainer,
        })
      });
    } else {
      //console.log('esta abierto')
      webContainerClosed = !webContainerClosed;
      setButtonWebContainerBackground(webContainerClosed);
      //console.log('voy a cerrarlo');
      chrome.storage.sync.set({ 'buttonsOpen': true }, () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: closeContainer,
        })
      });
    }
  });
});

const showContainer = () => {
  document.getElementById('buttonsContainer').style.visibility = 'visible';
};

const closeContainer = () => {
  document.getElementById('buttonsContainer').style.visibility = 'hidden';
};
const setButtonWebContainerBackground = (isClosed) => {
  if(isClosed){
    button4WEB.style.background='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iSWNvbnMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0M3tmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDR7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5OjM7fQ0KPC9zdHlsZT4NCjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOSwxNmMwLDAtNS44LDgtMTMsOFMzLDE2LDMsMTZzNS44LTgsMTMtOFMyOSwxNiwyOSwxNnoiLz4NCjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE2IiBjeT0iMTYiIHI9IjQiLz4NCjwvc3ZnPg0K")';
  } else {
    button4WEB.style.background='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOm5vbmU7c3Ryb2tlOiM2QzNEQjc7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzFGOTkyQTtzdHJva2Utd2lkdGg6NDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojNkE4M0JBO3N0cm9rZS13aWR0aDo0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0M3tmaWxsOiM4QThBRkY7c3Ryb2tlOiM4QThBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Q0e2ZpbGw6IzZDM0RCNztzdHJva2U6IzZDM0RCNztzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDV7ZmlsbDojQTU3NkZGO3N0cm9rZTojQTU3NkZGO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0NntmaWxsOiNGMkJCNDE7c3Ryb2tlOiNGMkJCNDE7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Q3e2ZpbGw6I0UwODgzODtzdHJva2U6I0UwODgzODtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDh7ZmlsbDojMUY5OTJBO3N0cm9rZTojMUY5OTJBO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0OXtmaWxsOiM1RUMxMUU7c3Ryb2tlOiM1RUMxMUU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMHtmaWxsOiNFM0ZBRkY7c3Ryb2tlOiNFM0ZBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMXtmaWxsOiNGRjUwOTM7c3Ryb2tlOiNGRjUwOTM7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxMntmaWxsOiNCNzI1N0Y7c3Ryb2tlOiNCNzI1N0Y7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxM3tmaWxsOiM1MTg5RTU7c3Ryb2tlOiM1MTg5RTU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNHtmaWxsOiM2RUJBRkY7c3Ryb2tlOiM2RUJBRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNXtmaWxsOiNFREQ5Nzc7c3Ryb2tlOiNFREQ5Nzc7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxNntmaWxsOiM4QzQzRkY7c3Ryb2tlOiM4QzQzRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxN3tmaWxsOiM1MjUyQkE7c3Ryb2tlOiM1MjUyQkE7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxOHtmaWxsOm5vbmU7c3Ryb2tlOiNFM0ZBRkY7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3QxOXtmaWxsOiMzNTRDNzU7c3Ryb2tlOiMzNTRDNzU7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMjksMTVjMCwwLTYuOCw5LTE0LDlTMSwxNSwxLDE1czYuOC05LDE0LTlTMjksMTUsMjksMTV6Ii8+DQo8Y2lyY2xlIGNsYXNzPSJzdDE4IiBjeD0iMTUiIGN5PSIxNSIgcj0iNSIvPg0KPC9zdmc+DQo=")';
  }
}

// button4WEB.addEventListener("click", () => {
//   chrome.storage.sync.get('webContainer', ({ result }) => {
//     //console.log("Resultado inicial",result);
//     handleWeb(result);
//   });
// });