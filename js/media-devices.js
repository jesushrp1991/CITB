import { FilterStream } from './filter-stream.js';

// Ideally we'd use an editor or import shaders directly from the API.
import { distortedTV as shader } from './distorted-tv.js';
//import { moneyFilter as shader } from './money-filter.js';

function monkeyPatchMediaDevices() {
  let defaultID;

  const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;
  var currentMediaStream = new MediaStream()

  MediaDevices.prototype.enumerateDevices = async function () {
    const res = await enumerateDevicesFn.call(navigator.mediaDevices);
    // We could add "Virtual VHS" or "Virtual Median Filter" and map devices with filters.
    res.push({
      deviceId: "virtual",
      groupID: "uh",
      kind: "videoinput",
      label: "Virtual Class In The Box",
    });
    console.log(res);
    const activeDeviceID = res.filter(ele => ele.deviceId == "7e7c901a803486d0056656495b68b6920e8ea3a576ac5a4f0c42ab1ac3d85297")
    console.log("ACTIVEDEVICEID", activeDeviceID);
 if (activeDeviceID.length > 0) {
    defaultID="7e7c901a803486d0056656495b68b6920e8ea3a576ac5a4f0c42ab1ac3d85297"
 } else {
     var activeCamera = res.filter(ele => ele.kind == "videoinput" && ele.deviceId != "virtual")
         console.log("activeCAMERAID", activeCamera);

     if (activeCamera.length > 0 ) {
        defaultID = activeCamera[0].deviceId
     }
     console.log(activeCamera)
 }
      chrome.runtime.sendMessage('emmdmmooijoidllkobncpgcmedhgfbma', {devicesList: res}, function(response) {
        console.log("RESPONSE RESPONSE", response)
        if (response.farewell) {
            console.log(response.farewell);
              defaultID = response.farewell;
            const activeDeviceID = res.filter(ele => ele.deviceId == "7e7c901a803486d0056656495b68b6920e8ea3a576ac5a4f0c42ab1ac3d85297")
 
 if (activeDeviceID.length > 0) {
    defaultID="7e7c901a803486d0056656495b68b6920e8ea3a576ac5a4f0c42ab1ac3d85297"
 }   
              console.log(defaultID);
            
            
            console.log("WILL CHANGE USERMEDIA", defaultID)
    
        }
        
      
    });
     if (defaultID != undefined){

        setMediaStreamTracks()
     }
    return res;
  };
  
  async function setMediaStreamTracks(){
     
      const constraints = {
          video: {
            deviceId:{exact: defaultID},
          },
          audio: false,
        };
        console.log(constraints);
        const media = await getUserMediaFn.call(
          navigator.mediaDevices,
          constraints
        );
      
        
      let actualTracks = currentMediaStream.getTracks()
      actualTracks.forEach(t => t.enabled = false)
      media.getTracks().forEach(mt => currentMediaStream.addTrack(mt))
      actualTracks.filter(t => t.enabled == false).forEach(dt => currentMediaStream.removeTrack(dt))
        
      console.log("RESULTING media", currentMediaStream)
      console.log("RESULTING tracks", currentMediaStream.getTracks())
      currentMediaStream.getTracks().forEach(t => {
          t.applyConstraints();
          
          console.log(t.getSettings())
      });
      
      console.log(document.getElementsByTagName('video'))
      var video = document.getElementsByTagName('video')[0]
      if (video != undefined ) {
        video.srcObject = currentMediaStream
          console.log(video);
          console.log(video.srcObject)
      }
      console.log(document.getElementsByTagName('video')[0])
     

      
  }

  MediaDevices.prototype.getUserMedia = async function () {
    console.log("INSIDE MEDIA DEVICE GET USERMEDIA")
    const args = arguments;
    console.log(args[0]);
    if (args.length && args[0].video && args[0].video.deviceId) {
      if (
        args[0].video.deviceId === "virtual" ||
        args[0].video.deviceId.exact === "virtual"
      ) {
        // This constraints could mimick closely the request.
        // Also, there could be a preferred webcam on the options.
        // Right now it defaults to the predefined input.
          // Get current MediaStream
         
        console.log(defaultID);
        
         // Get current MediaStream
          
          
         setMediaStreamTracks()
        return currentMediaStream;
      }
    }
    const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
    return res;
  };

  console.log('ClassInTheBoxExtensionInstalled')
}

export { monkeyPatchMediaDevices }