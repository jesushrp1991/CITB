'use strict';
if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.live.com') {
    
    const help = document.createElement('script');
    help.setAttribute("type", "module");
    help.setAttribute("src", chrome.runtime.getURL('helper/helper.js'));
    const helphead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    helphead.insertBefore(help, helphead.firstChild);
    
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/media-devices.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.firstChild);
}