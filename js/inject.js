'use strict';
if (window.location.host === 'meet.google.com' || window.location.host.includes('zoom.us') || window.location.host == 'teams.live.com' || window.location.host == 'teams.microsoft.com') {
    
    const script1 = document.createElement('script');
    script1.setAttribute("type", "module");
    script1.setAttribute("src", chrome.runtime.getURL('/helper/js/help.js'));
    const head1 = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head1.insertBefore(script1, head1.firstChild);
    
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/main.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.firstChild);
    
    document.onreadystatechange = (event) => {
        if (document.readyState == 'complete'){ 
            var iFrame  = document.createElement ("iframe");
            iFrame.setAttribute('id','iframe');
            iFrame.src  = chrome.runtime.getURL ("/helper/index.html");
            console.log("iframe",iFrame);
            const documentBody = document.body || document.getElementsByTagName("body")[0] ;
            documentBody.insertBefore (iFrame, documentBody.firstChild);
        
           
        }
    }
   
}