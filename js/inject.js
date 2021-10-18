'use strict';
// console.log("Host",window.location.host);
if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.live.com') {
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/main.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.firstChild);
    
    // //Inject Gesture Detector
    // const scriptGesture = document.createElement('script');
    // scriptGesture.setAttribute("type", "module");
    // scriptGesture.setAttribute("src", chrome.runtime.getURL('js/managers/gestureManager/gesture.js'));
    // head.insertBefore(script, head.firstChild);
}