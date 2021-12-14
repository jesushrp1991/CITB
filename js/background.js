chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.sync.set({ extensionGlobalState: "on" });
        chrome.storage.sync.set({variable:1},()=>{});

    }else if(details.reason == "update"){
      chrome.storage.sync.set({ extensionGlobalState: "on" });
    }
});


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  chrome.action.setIcon({path: "/assets/ENCENDIDO.png"});

});
chrome.action.setIcon({
  path: {
    "19": "/assets/ENCENDIDO19x.png",
    "38": "/assets/ENCENDIDO38x.png",
  }
});

//TEST DESKTOP CAPTURE
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  const sources = message.sources;
  const tab = sender.tab;
  console.log(sources,tab,sender)
  chrome.desktopCapture.chooseDesktopMedia(sources, tab, streamId => {
    if (!streamId) {
      sendResponse({
        type: 'error',
        message: 'Failed to get stream ID'
      });
    } else {
      sendResponse({
        type: 'success',
        streamId: streamId
      });
    }
  });
  return true;
});
