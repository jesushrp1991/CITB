'use strict';
    if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.microsoft.com' || window.location.host == 'teams.live.com'  || window.location.host == 'meet.jit.si') {

        const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;        
        const recScript = document.createElement('script');
        recScript.setAttribute("type", "module");
        recScript.setAttribute("src", chrome.runtime.getURL('js/rec/rec.js'));
        head.insertBefore(recScript, head.lastChild);
            
        
        document.addEventListener('readystatechange', (event) => {
            if (document.readyState == "complete") {
                fetch(chrome.runtime.getURL('html/recPanel.html')).then(r => r.text()).then(html => {
                    document.dispatchEvent(new CustomEvent('recPanel', { detail: html }));
                });
            }
        })

        
    }