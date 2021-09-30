// Initialize select with default mode 
let buttonCam = document.getElementById('button1');
let buttonShow = document.getElementById('button2');
let buttonClass = document.getElementById('button3');
let buttonWebContainer = document.getElementById('buttonWebContainer');
let showWebContainer = document.getElementById('buttonWebContainer');
let showActivated = false, classActivated = false, citbActivated;
const MYVIDEODDEVICELABEL = 'FJ Camera (04f2:b563)';
const MYAUDIODEVICELABEL = 'CITB';
let defaultVideoId, defaultVideoLabel, webContainerClosed;

let microphonesList = [];
let videosList = []

chrome.storage.sync.get("devicesList", ({ devicesList }) => {
  if (devicesList) {
    microphonesList = devicesList.filter(x => x.kind == 'audioinput');
    videosList = devicesList.filter(x => x.kind == 'videoinput');
  }
})

chrome.storage.sync.get("containerClosed", ({ containerClosed }) => {
  if (containerClosed != undefined) {
    webContainerClosed = containerClosed;
    setButtonWebContainerBackground(webContainerClosed);
  }
})

chrome.storage.sync.get("defaultVideoId", ({ defaultVideo }) => {
  if (!defaultVideo == undefined) {
    defaultVideoId = defaultVideo;
    defaultVideoLabel = videosList.filter(x => x.deviceId === defaultVideoId)[0].label;
  }
})

chrome.storage.sync.get("defaultMode", ({ defaultMode }) => {
  showActivated = defaultMode === 'show';
  classActivated = defaultMode === 'class';
  setButtonShowBackground(showActivated);
  setButtonClassBackground(classActivated);
  if (defaultVideoId && defaultVideoLabel) {
    citbActivated = defaultVideoLabel.includes(MYVIDEODDEVICELABEL)
    setButtonCamBackground(citbActivated)
  }
});

const setButtonWebContainerBackground = (webContainerClosed) => {

}

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
  if (citbActivated) {
    const otherVideos = videosList.filter(x => (x.deviceId != defaultVideoId));
    if (otherVideos.length > 0) {
      chrome.storage.sync.set({ defaultVideoId: otherVideos[0].deviceId }, () => {
        citbActivated = false;
        setButtonCamBackground(citbActivated);
      });
    } else {
      alert('Could not change Video');
    }
  } else {
    const citbVideo = videosList.filter(x => (x.label.includes(MYVIDEODDEVICELABEL)));
    if (citbVideo.length > 0) {
      chrome.storage.sync.set({ defaultVideoId: citbVideo[0].deviceId }, () => {
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

// When the button is clicked, inject setPageBackgroundColor into current page
showWebContainer.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.storage.sync.get("containerClosed", ({ containerClosed }) => {
    webContainerClosed = containerClosed;
    if (webContainerClosed) {
      webContainerClosed = !webContainerClosed;
      setButtonWebContainerBackground(webContainerClosed);
      chrome.storage.sync.set({ 'containerClosed': false }, () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: showContainer,
        })
      });
    }
    else {
      webContainerClosed = !webContainerClosed;
      setButtonWebContainerBackground(webContainerClosed);
      chrome.storage.sync.set({ 'containerClosed': true }, () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: closeContainer,
        })
      });
    }
  })
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.greeting == "hello")
      sendResponse({ farewell: "goodbye" });
  });

// The body of this function will be executed as a content script inside the
// current page
const showContainer = () => {
  console.log("Set showContainer");
  document.getElementById('buttonsContainer').style.visibility = 'visible';
};

const closeContainer = () => {
  console.log("Set closeContainer");
  document.getElementById('buttonsContainer').style.visibility = 'hidden';
};