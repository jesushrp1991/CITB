'use strict';
if (window.location.host === 'meet.google.com'){
    const script1 = document.createElement('script');
    script1.setAttribute("type", "module");
    script1.setAttribute("src", chrome.runtime.getURL('js/Pizzicato.min.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script1, head.lastChild);

    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/main.js'));
    head.insertBefore(script, head.lastChild);
}
