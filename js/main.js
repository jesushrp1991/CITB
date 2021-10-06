const EXTENSIONID = 'idpoljbnhpbdoekiikdkmilmihmenfdl';
if (window.location.host === 'meet.google.com') {
  
    document.onreadystatechange = async(event) => { 
      window.citbCam = true;
      const res = await navigator.mediaDevices.enumerateDevices();
      console.log("Main.js, entro!"); 
      if (document.readyState == 'complete'){ 
        console.log(" document ready complete!!!!"); 
        chrome.runtime.sendMessage({ deviceList : res}, function(response) { 
          console.log(response.defaultDevice); 
        }); 
      } 
    }; 
}