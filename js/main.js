const EXTENSIONID = 'idpoljbnhpbdoekiikdkmilmihmenfdl';
if (window.location.host === 'www.granma.cu') {
  
    document.onreadystatechange = async(event) => { 
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