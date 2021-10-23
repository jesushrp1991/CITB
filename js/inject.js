'use strict';
<<<<<<< HEAD
if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.live.com') {
    
    const help = document.createElement('script');
    help.setAttribute("type", "module");
    help.setAttribute("src", chrome.runtime.getURL('helper/helper.js'));
    const helphead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    helphead.insertBefore(help, helphead.firstChild);
    
=======
if (window.location.host === 'meet.google.com'){

>>>>>>> f6df13b762f40f667cf676b26c1e289b07b4e527
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/main.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.firstChild);
<<<<<<< HEAD
    
    const annyangScript = document.createElement('script');
    annyangScript.setAttribute("type", "module");
    annyangScript.setAttribute("src", chrome.runtime.getURL('js/managers/voiceManager/annyang.min.js'));
    const annyangScriptHead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    annyangScriptHead.insertBefore(annyangScript, annyangScriptHead.firstChild);

=======
>>>>>>> f6df13b762f40f667cf676b26c1e289b07b4e527
}