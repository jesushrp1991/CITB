const annyangScript = document.createElement('script');
annyangScript.setAttribute("type", "module");
annyangScript.setAttribute("src", chrome.runtime.getURL('js/managers/voiceManager/annyang.min.js'));
const annyangScriptHead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(annyangScript, annyangScriptHead.firstChild);