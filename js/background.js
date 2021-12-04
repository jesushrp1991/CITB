chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.sync.set({ extensionGlobalState: "on" });

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
