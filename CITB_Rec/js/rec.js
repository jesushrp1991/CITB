import { environment } from "../config/environment.js";   
import { errorHandling } from './errorHandling.js'; 
import { saveVideo } from './fileManager.js'; 
import { recIcon } from './tools.js' 
 
 
import { 
    startTimerCount, 
    stopTimerCount, 
    reset 
} from './recTimer.js' 
 
import { 
    addDB,
    showEstimatedQuota
} from "./database.js"; 
 
  const verifyAvailableSpaceOnDisk = async () =>{   
    let thereAreLowDiskSpace = await showEstimatedQuota(); 
    // console.log("thereAreLowDiskSpace",thereAreLowDiskSpace); 
    if(thereAreLowDiskSpace){ 
      // console.log("hay que parar"); 
      pauseOrResume(); 
      //sendMessage to popup to alert the user about insufficient disk space. 
    } 
} 
 
const recordScreen = async (streamId,idMic,isTabForMac,recMode) => {  
  try{  
      let isMac = navigator.userAgentData.platform.toLowerCase().includes('mac');  
      let  constraints,constraintsTabAudio,constraintsDesktopVideo; 
      //MAC!!!
      if(isMac){ 
        console.log("Es MAC")
        let micConstraints;
        chrome.tabCapture.getMediaStreamId({targetTabId: isTabForMac},  async(stream)=>{
          if(recMode == 'recordTabs'){
            console.log("Es record TABS")
            constraintsTabAudio = {  
              audio:{  
                  mandatory: {  
                      chromeMediaSource: 'tab',  
                      chromeMediaSourceId: stream,  
                      echoCancellation: true  
                  }  
              },  
              video: {  
                optional: [],  
                mandatory: {  
                    chromeMediaSource: 'tab',  
                    chromeMediaSourceId: stream,  
                    maxWidth: 2560,  
                    maxHeight: 1440,  
                    maxFrameRate:30  
                }  
              }  
            }; 
            if (idMic != undefined && idMic != null && idMic != '') {  
              micConstraints = {    
                video: false,    
                audio: {    
                    deviceId: { exact: idMic },    
                },    
              }
              window.micStream = await navigator.mediaDevices.getUserMedia(micConstraints);
            }  
            //Stream del tab
            window.desktopStream = await navigator.mediaDevices.getUserMedia(constraintsTabAudio);
            //Por default silencia el tab, con esto se soluciona
            var contextTab = new AudioContext();  
            contextTab.createMediaStreamSource(window.desktopStream).connect(contextTab.destination);
            const context = new AudioContext();  
            let sourceDesktop = null;  
            if(window.desktopStream.getAudioTracks().length > 0){  
              //SOURCE 1 => TAB AUDIO 
              // let audioStreamFromTab = new MediaStream([window.desktopStream.getAudioTracks()]) 
              sourceDesktop = context.createMediaStreamSource(window.desktopStream);  
            }  
            let sourceMic = null;
            if(window.micStream && window.micStream.getAudioTracks().length >0){
              //SOURCE 2 => MIC AUDIO 
              sourceMic = context.createMediaStreamSource(window.micStream); 
            }
            //DESTINATION 
            const destination = context.createMediaStreamDestination();  
            //GAIN 
            window.desktopGain = context.createGain();  
            window.voiceGain = context.createGain();      
            window.desktopGain.gain.value = 0.6;  
            window.voiceGain.gain.value = 0.8;  
            if(sourceDesktop != null){  
              sourceDesktop.connect(window.desktopGain).connect(destination);  
            }  
            if(sourceMic != null){
              sourceMic.connect(window.voiceGain).connect(destination);
            }  
            window.resultStream = new MediaStream([...window.desktopStream.getVideoTracks() ,...destination.stream.getAudioTracks()])  
            window.recorder = new MediaRecorder(window.resultStream); 
            window.recorder.ondataavailable = event => {  
              // console.log("ON DATA AVAILABLE", videoChunksArray.length,event.data.size);  
                verifyAvailableSpaceOnDisk();  
                if (event.data.size > 0) {  
                    window.videoChunksArray.push(event.data);  
                    addDB(window.videoChunksArray);  
                    window.videoChunksArray = [];  
                }  
            }  
            window.recorder.onstop = async() => {  
              saveVideo(false);  
            }  
            window.recorder.start(environment.timeIntervalSaveDB);  
            startTimerCount();  
            window.isRecording = true;  
          }//End if recMode == RecordTabs
          //recMode == destokp
          else{
            console.log("Es record Desktop")
            constraintsTabAudio = {  
              audio:{  
                  mandatory: {  
                      chromeMediaSource: 'tab',  
                      chromeMediaSourceId: stream,  
                      echoCancellation: true  
                  }  
              },  
              video: {  
                optional: [],  
                mandatory: {  
                    chromeMediaSource: 'tab',  
                    chromeMediaSourceId: stream,  
                    maxWidth: 2560,  
                    maxHeight: 1440,  
                    maxFrameRate:30  
                }  
              }  
            }; 
            if (idMic != undefined && idMic != null && idMic != '') {  
              micConstraints = {    
                video: false,    
                audio: {    
                    deviceId: { exact: idMic },    
                },    
              }
              window.micStream = await navigator.mediaDevices.getUserMedia(micConstraints);
            }  
            //Stream del tab
            window.desktopStream = await navigator.mediaDevices.getUserMedia(constraintsTabAudio);
            //Por default silencia el tab, con esto se soluciona
            var contextTab = new AudioContext();  
            contextTab.createMediaStreamSource(window.desktopStream).connect(contextTab.destination);
            const context = new AudioContext();  
            let sourceDesktop = null;  
            if(window.desktopStream.getAudioTracks().length > 0){  
              //SOURCE 1 => TAB AUDIO 
              // let audioStreamFromTab = new MediaStream([window.desktopStream.getAudioTracks()]) 
              sourceDesktop = context.createMediaStreamSource(window.desktopStream);  
            }  
            let sourceMic = null;
            if(window.micStream && window.micStream.getAudioTracks().length >0){
              //SOURCE 2 => MIC AUDIO 
              sourceMic = context.createMediaStreamSource(window.micStream); 
            }
            //DESTINATION 
            const destination = context.createMediaStreamDestination();  
            //GAIN 
            window.desktopGain = context.createGain();  
            window.voiceGain = context.createGain();      
            window.desktopGain.gain.value = 0.6;  
            window.voiceGain.gain.value = 0.8;  

            if(sourceDesktop != null){  
              sourceDesktop.connect(window.desktopGain).connect(destination);  
            }  
            if(sourceMic != null){
              sourceMic.connect(window.voiceGain).connect(destination);
            }  

            constraints = {  
              // audio:{  
              //     mandatory: {  
              //         chromeMediaSource: 'desktop',  
              //         chromeMediaSourceId: streamId,  
              //         echoCancellation: true  
              //     }  
              // }, 
              audio:false, 
              video: {  
                  optional: [],  
                  mandatory: {  
                      chromeMediaSource: 'desktop',  
                      chromeMediaSourceId: streamId,  
                      maxWidth: 2560,  
                      maxHeight: 1440,  
                      maxFrameRate:30  
                  }  
              }  
            }  
            window.videoStreamDesktop = await navigator.mediaDevices.getUserMedia(constraints);
            console.log(window.videoStreamDesktop.getVideoTracks());
            window.resultStream = new MediaStream([...window.videoStreamDesktop.getVideoTracks() ,...destination.stream.getAudioTracks()])  
            console.log(window.resultStream);
            window.recorder = new MediaRecorder(window.resultStream); 

            window.recorder.ondataavailable = event => {  
              console.log("ON DATA AVAILABLE", event.data.size,event.data);  
                verifyAvailableSpaceOnDisk();  
                if (event.data.size > 0) {  
                    window.videoChunksArray.push(event.data);  
                    addDB(window.videoChunksArray);  
                    window.videoChunksArray = [];  
                }  
            }  
            window.recorder.onstop = async() => {  
              saveVideo(false);  
            }  
            window.recorder.start(environment.timeIntervalSaveDB);  
            startTimerCount();  
            window.isRecording = true;  
          }
        });
      }
      //WINDOWS!!!
      else{ 
        constraints = {  
          audio:{  
              mandatory: {  
                  chromeMediaSource: 'desktop',  
                  chromeMediaSourceId: streamId,  
                  echoCancellation: true  
              }  
          },  
          video: {  
              optional: [],  
              mandatory: {  
                  chromeMediaSource: 'desktop',  
                  chromeMediaSourceId: streamId,  
                  maxWidth: 2560,  
                  maxHeight: 1440,  
                  maxFrameRate:30  
              }  
          }  
        }  

        window.desktopStream = await navigator.mediaDevices.getUserMedia(constraints); 
        if (idMic != undefined && idMic != null && idMic != '') { 
          const micConstraints = {    
            video: false,    
            audio: {    
                deviceId: { exact: idMic },    
            },    
          }   
          window.micStream = await navigator.mediaDevices.getUserMedia(micConstraints);  
    
          const context = new AudioContext();  
          let sourceDesktop = null;  
          if(window.desktopStream && window.desktopStream.getAudioTracks().length > 0){
            sourceDesktop = context.createMediaStreamSource(window.desktopStream);  
          }  
          const sourceMic = context.createMediaStreamSource(window.micStream);
          const destination = context.createMediaStreamDestination();
   
          window.desktopGain = context.createGain();  
          window.voiceGain = context.createGain();  
   
          window.desktopGain.gain.value = 0.7;  
          window.voiceGain.gain.value = 0.7;  
   
          if(sourceDesktop != null){  
            sourceDesktop.connect(window.desktopGain).connect(destination);  
          }  
          sourceMic.connect(window.voiceGain).connect(destination);   
           
          window.resultStream = new MediaStream([...window.desktopStream.getVideoTracks() ,...destination.stream.getAudioTracks()])  
        }
        else {  
          // window.resultStream = window.desktopStream;  

          const context = new AudioContext();  
          let sourceDesktop = null;  
          if(window.desktopStream.getAudioTracks().length > 0){  
            sourceDesktop = context.createMediaStreamSource(window.desktopStream);  
          }  
          const destination = context.createMediaStreamDestination();  
          window.desktopGain = context.createGain();  
          window.desktopGain.gain.value = 0.7;  
          if(sourceDesktop != null){  
            sourceDesktop.connect(window.desktopGain).connect(destination);  
          }
          window.resultStream = new MediaStream([...window.desktopStream.getVideoTracks() ,...destination.stream.getAudioTracks()]);
        }  
        window.recorder = new MediaRecorder(window.resultStream); 
        window.recorder.ondataavailable = event => { 
            verifyAvailableSpaceOnDisk();  
            if (event.data.size > 0) {  
                window.videoChunksArray.push(event.data);  
                addDB(window.videoChunksArray);  
                window.videoChunksArray = [];  
            }  
        }  
        window.recorder.onstop = async() => {  
           saveVideo(false);  
        }  
        window.recorder.start(environment.timeIntervalSaveDB);  
        startTimerCount();  
        window.isRecording = true;  
      } 
  }catch(e){  
    console.log(e);  
    errorHandling(e);  
  }  
}  
const startRecordScreen = async(idMic,isTabForMac,recMode) =>{  
  console.log("recMode=>",recMode,isTabForMac);
  try{  
    if(isTabForMac){
      if(recMode == 'recordTabs'){
        // cb(); 
        window.isRecording = true;  
        chrome.storage.sync.set({isRecording: true}, ()=> {});
        await recordScreen(null,idMic,isTabForMac,recMode);
        recIcon();
      }
      else{
        console.log("SCREEN!!!");
        chrome.desktopCapture.chooseDesktopMedia(['screen','audio'], async (streamId) => {  
          if (!streamId) {  
              window.isRecording = false;  
              chrome.storage.sync.set({isRecording: false}, ()=> {  
              });  
          } else {  
              window.isRecording = true;  
              chrome.storage.sync.set({isRecording: true}, ()=> {});  
              // cb();  
              await recordScreen(streamId,idMic,isTabForMac,recMode);  
              recIcon();  
          }  
        });
      }
    }
    //windows
    else{ 
      let captureModes;
      recMode == 'recordTabs' ? captureModes = ['tab','audio'] : captureModes = ['screen','audio'];
      chrome.desktopCapture.chooseDesktopMedia(captureModes, async (streamId) => {  
          if (!streamId) {  
              window.isRecording = false;  
              chrome.storage.sync.set({isRecording: false}, ()=> {  
              });  
          } else {  
              window.isRecording = true;  
              chrome.storage.sync.set({isRecording: true}, ()=> {});  
              // cb();  
              await recordScreen(streamId,idMic);  
              recIcon();  
          }  
        });  
    }  
        
  }catch(e){  
    errorHandling(e);  
  }  
}  
const stopTracks = () =>{  
  window.desktopStream.getTracks().forEach(track => track.stop()); 
  if (window.micStream != undefined) {  
    window.micStream.getTracks().forEach(track => track.stop()); 
  }  
  if(window.videoDesktopStream != undefined){ 
    window.videoDesktopStream.getTracks().forEach(track => track.stop()); 
  } 
  window.resultStream.getTracks().forEach(track => track.stop()); 
}   
const stopRecordScreen = () =>{ 
    if(window.isRecording){ 
        window.meetEndTime = dayjs().format(); 
        window.recorder.stop(); 
        stopTracks(); 
        reset(); 
        window.isRecording = false; 
        chrome.storage.sync.set({isRecording: false},() => {}); 
    } 
} 
 
const pauseRec = () => { 
  window.recorder.pause() 
  stopTimerCount(); 
  chrome.storage.sync.set({isPaused: true}, () => { 
  }); 
  window.isPaused = !window.isPaused; 
} 
const playRec = () =>{ 
  window.recorder.resume(); 
  startTimerCount(); 
  chrome.storage.sync.set({isPaused: false}, () => { 
  }); 
  window.isPaused = !window.isPaused; 
} 
 
const pauseOrResume = async () => { 
  if(!window.isPaused && window.isRecording){ 
    pauseRec(); 
  }else{ 
    playRec(); 
  } 
} 
export { 
     recordScreen 
    ,startRecordScreen 
    ,stopRecordScreen 
    ,pauseOrResume 
    ,playRec 
    ,pauseRec 
}