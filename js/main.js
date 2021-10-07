const EXTENSIONID = 'idpoljbnhpbdoekiikdkmilmihmenfdl';
if (window.location.host === 'meet.google.com') {
  
    document.onreadystatechange = async(event) => { 
      var origAddTrack = RTCPeerConnection.prototype.addTrack;
  
      RTCPeerConnection.prototype.addTrack = async function (track, stream) {
        console.log("prototype.addTrack");
        if (window.peerConection == undefined) {
          window.peerConection = this;
          // showDiv()
        }        
        window.currentMediaStream = stream;
        window.currentTrack = track;
        await origAddTrack.apply(this, arguments);
      }
      window.citbCam = true;
      const res = await navigator.mediaDevices.enumerateDevices();
      console.log("Main.js, entro!"); 
      if (document.readyState == 'complete'){ 
        console.log(" document ready complete!!!!"); 
        chrome.runtime.sendMessage({ deviceList : res}); 
      } 
    }; 
}