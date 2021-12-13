'use strict';

chrome.storage.sync.get('extensionGlobalState', (data) =>{
    
    // const scriptpopup = document.createElement('script');
    // scriptpopup.setAttribute("type", "module");
    // scriptpopup.setAttribute("src", chrome.runtime.getURL('js/alertPopup.js'));
    // const headpopup = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    // headpopup.insertBefore(scriptpopup, headpopup.firstChild);

    // if(data.extensionGlobalState == "on"){
        if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.microsoft.com' || window.location.host == 'teams.live.com'  || window.location.host == 'meet.jit.si') {
    
            // const help = document.createElement('script');
            // help.setAttribute("type", "module");
            // help.setAttribute("src", chrome.runtime.getURL('helper/helper.js'));
            // const helphead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            // helphead.insertBefore(help, helphead.firstChild);
            
            // const script = document.createElement('script');
            // script.setAttribute("type", "module");
            // script.setAttribute("src", chrome.runtime.getURL('js/media-devices.js'));
            const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            // head.insertBefore(script, head.firstChild);
        
            const annyangScript = document.createElement('script');
            annyangScript.setAttribute("type", "module");
            annyangScript.setAttribute("src", chrome.runtime.getURL('js/managers/voiceManager/annyang.min.js'));
            const annyangScriptHead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            head.insertBefore(annyangScript, annyangScriptHead.firstChild);
            
            const recScript = document.createElement('script');
            recScript.setAttribute("type", "module");
            recScript.setAttribute("src", chrome.runtime.getURL('js/rec/rec.js'));
            const recScriptHead = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            head.insertBefore(recScript, recScriptHead.lastChild);
            
            document.onreadystatechange = (event) => {
                if (document.readyState == "complete") {
                    fetch(chrome.runtime.getURL('html/actionButtons.html')).then(r => r.text()).then(html => {
                        document.dispatchEvent(new CustomEvent('floatingButtons', { detail: html }));
                    });

                    fetch(chrome.runtime.getURL('html/simplePopup.html')).then(r => r.text()).then(html => {
                        document.dispatchEvent(new CustomEvent('simplePopup', { detail: html }));
                    });

                    fetch(chrome.runtime.getURL('html/recPanel.html')).then(r => r.text()).then(html => {
                        document.dispatchEvent(new CustomEvent('recPanel', { detail: html }));
                    });
                }
            }

         
        }
    // }
});