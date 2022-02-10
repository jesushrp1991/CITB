'use strict';

    if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.microsoft.com' || window.location.host == 'teams.live.com'  || window.location.host == 'meet.jit.si') {

        console.log("SE INYECTO EL SCRIPT COLLADO!!!!")
        
        const script = document.createElement('script');
        script.setAttribute("type", "module");
        script.setAttribute("src", chrome.runtime.getURL('js/CITB/media-devices.js'));
        const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        head.insertBefore(script, head.firstChild);
    
        const annyangScript = document.createElement('script');
        annyangScript.setAttribute("type", "module");
        annyangScript.setAttribute("src", chrome.runtime.getURL('js/CITB/managers/voiceManager/annyang.min.js'));
        const annyangScriptHead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        head.insertBefore(annyangScript, annyangScriptHead.firstChild);
        
        document.onreadystatechange = (event) => {
            if (document.readyState == "complete") {
                fetch(chrome.runtime.getURL('html/actionButtons.html')).then(r => r.text()).then(html => {
                    document.dispatchEvent(new CustomEvent('floatingButtons', { detail: html }));
                });

                fetch(chrome.runtime.getURL('html/simplePopup.html')).then(r => r.text()).then(html => {
                    document.dispatchEvent(new CustomEvent('simplePopup', { detail: html }));
                });
            }
        }

        
    }
   