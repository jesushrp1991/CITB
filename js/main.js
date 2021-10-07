const EXTENSIONID = 'pgloinlccpmhpgbnccfecikdjgdhneof';
if (window.location.host === 'meet.google.com') {
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/prototype.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.lastChild);

    // const scriptWebForm = document.createElement('script');
    // scriptWebForm.setAttribute("type", "module");
    // scriptWebForm.setAttribute("src", chrome.runtime.getURL('webFormContainer.js'));
    // head.insertBefore(script, head.lastChild);
    
    // const scriptEvents = document.createElement('script');
    // scriptEvents.setAttribute("type", "module");
    // scriptEvents.setAttribute("src", chrome.runtime.getURL('events.js'));
    // head.insertBefore(script, head.lastChild);
    // console.log("head",head);
    
    // const scriptFunctions = document.createElement('script');
    // scriptFunctions.setAttribute("type", "module");
    // scriptFunctions.setAttribute("src", chrome.runtime.getURL('functions.js'));
    // head.insertBefore(script, head.lastChild);

    document.onreadystatechange = async(event) => { 
      window.citbCam = true;
      const res = await navigator.mediaDevices.enumerateDevices();
      console.log("Main.js, 1!"); 
      if (document.readyState == 'complete'){ 
        chrome.runtime.sendMessage(EXTENSIONID,{ deviceList : res}); 
      } 
    }; 
}