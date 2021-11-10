chrome.runtime.onInstalled.addListener(function(details){  
    if(details.reason == "install"){
        console.log("This is a first install!");
        chrome.storage.sync.set({ extensionGlobalState: "on" });

    }else if(details.reason == "update"){
      chrome.storage.sync.set({ extensionGlobalState: "on" });
    }
});