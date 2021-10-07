const EXTENSIONID = 'idpoljbnhpbdoekiikdkmilmihmenfdl';
if (window.location.host === 'meet.google.com') {
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL('js/prototype.js'));
    const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.lastChild);

    document.onreadystatechange = async(event) => { 
      window.citbCam = true;
      const res = await navigator.mediaDevices.enumerateDevices();
      console.log("Main.js, 1!"); 
      if (document.readyState == 'complete'){ 
        console.log(" document ready complete,2"); 
        chrome.runtime.sendMessage({ deviceList : res}); 
      } 
    }; 
}