'use strict';
if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.microsoft.com' || window.location.host == 'teams.live.com') {
    
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/media-devices.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.firstChild);

    // const annyangScript = document.createElement('script');
    // annyangScript.setAttribute("type", "module");
    // annyangScript.setAttribute("src", chrome.runtime.getURL('js/managers/voiceManager/annyang.min.js'));
    // const annyangScriptHead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    // head.insertBefore(annyangScript, annyangScriptHead.firstChild);
}