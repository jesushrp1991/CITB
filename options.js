// Initialize select with default mode 
let selectMode = document.getElementById("modeSelect");
let selectMicrophone = document.getElementById("microphoneSelect");
let selectVideo = document.getElementById("videoSelect");
let microphonesList = [];
let videosList = []

chrome.storage.sync.get("defaultMode", ({ defaultMode }) => {
  selectMode.value = defaultMode;
});

chrome.storage.sync.get("devicesList", ({ devicesList }) => {
  if (devicesList) {
    microphonesList = devicesList.filter(x => x.kind == 'audioinput');
    videosList = devicesList.filter(x => x.kind == 'videoinput');

    microphonesList.forEach(mic => {
      let option = document.createElement("option");
      option.value = mic.deviceId;
      option.text = mic.label
      selectMicrophone.appendChild(option);
    })

    videosList.forEach(video => {
      if (video.deviceId != 'virtual') {
        let option = document.createElement("option");
        option.value = video.deviceId;
        option.text = video.label
        selectVideo.appendChild(option);
      }
    })
  }
})

chrome.storage.sync.get("defaultMicrophoneId", ({ defaultMicrophoneId }) => {
  if (defaultMicrophoneId == undefined && microphonesList.length > 0) {
    chrome.storage.sync.set({ defaultMicrophoneId: microphonesList[0].deviceId });
    selectMicrophone.value = microphonesList[0].deviceId;
  } else {
    selectMicrophone.value = defaultMicrophoneId;
  }
})

chrome.storage.sync.get("defaultVideoId", ({ defaultVideoId }) => {
  if (defaultVideoId == undefined && videosList.length > 0) {
    chrome.storage.sync.set({ defaultVideoId: videosList[0].deviceId });
    selectVideo.value = videosList[0].deviceId;
  } else {
    selectVideo.value = defaultVideoId;
  }
})

selectMode.addEventListener("change", async (event) => {
  chrome.storage.sync.set({ defaultMode: selectMode.value });

  //TODO run a script that performs the actions associated with the selection mode
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: applyModeSelectionChange,
  // });
});

selectMicrophone.addEventListener("change", async (event) => {
  chrome.storage.sync.set({ defaultMicrophoneId: selectMicrophone.value });
});

selectVideo.addEventListener("change", async (event) => {
  chrome.storage.sync.set({ defaultVideoId: selectVideo.value });
});