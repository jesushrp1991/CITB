// Initialize select with default mode 
let selectMode = document.getElementById("modeSelect");
let selectMicrophone = document.getElementById("microphoneSelect");
let selectVideo = document.getElementById("videoSelect");
let microphonesList = [];
let videosList = []

chrome.storage.sync.get("defaultMode", ({ defaultMode }) => {
  console.log('defaultMode', defaultMode)
  selectMode.value = defaultMode;
});

chrome.storage.sync.get("devicesList", ({ devicesList }) => {
  console.log(devicesList);
  microphonesList = devicesList.filter(x => x.kind == 'audioinput');
  videosList = devicesList.filter(x => x.kind == 'videoinput');
  console.log(microphonesList);
  console.log(videosList);

  for (const mic of microphonesList) {
    var option = document.createElement("option");
    option.value = mic.deviceId;
    option.text = mic.label
    selectMicrophone.appendChild(option);
  }

  for (const video of videosList) {
    var option = document.createElement("option");
    option.value = video.deviceId;
    option.text = video.label
    selectVideo.appendChild(option);
  }
})

chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId}) => {
  console.log(defaultMicrophoneId);
  if (defaultMicrophoneId == undefined && microphonesList.length > 0){
    chrome.storage.sync.set({defaultMicrophoneId: microphonesList[0].deviceId});
    selectMicrophone.value = microphonesList[0].deviceId;
  } else {
    selectMicrophone.value = defaultMicrophoneId;
  }
})

chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId}) => {
  console.log(defaultVideoId);
  if (defaultVideoId == undefined && videosList.length > 0){
    chrome.storage.sync.set({defaultVideoId: videosList[0].deviceId});
    selectVideo.value = videosList[0].deviceId;
  } else {
    selectVideo.value = defaultVideoId;
  }
})

// Listener for selection change
selectMode.addEventListener("change", async (event) => {
  chrome.storage.sync.set({ defaultMode: selectMode.value });
  chrome.storage.sync.get("defaultMode", ({ defaultMode }) => {
    console.log(defaultMode)
  });

  //TODO run a script that performs the actions associated with the selection mode
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: applySelectionChange,
  // });
});

// Listener for selection change
selectMicrophone.addEventListener("change", async (event) => {
  chrome.storage.sync.set({ defaultMicrophoneId: selectMicrophone.value });
  chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId }) => {
    console.log(defaultMicrophoneId)
  });

});

// Listener for selection change
selectVideo.addEventListener("change", async (event) => {
  chrome.storage.sync.set({ defaultVideoId: selectVideo.value });
  chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
    console.log(defaultVideoId)
  });

});

//TODO function that will be executed once the mode selected changes
function applyModeSelectionChange() {
  chrome.storage.sync.get("defaultMode", ({ defaultMode }) => {
    //TODO
  });
}

function applyMicrophoneSelectionChange() {
  chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId }) => {
    //TODO
  });
}

function applyVideoSelectionChange() {
  chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
    //TODO
  });
}