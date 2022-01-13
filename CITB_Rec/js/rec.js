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
    selectDB, 
    showEstimatedQuota, 
    prepareDB, 
    delLastItem 
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
 
  const recordScreen = async (streamId,idMic) => { 
    try{ 
        let isMac = navigator.userAgentData.platform.toLowerCase().includes('mac'); 
        let mediaSource; 
        isMac ?  mediaSource = 'tab' :  mediaSource = 'desktop'; 
        const constraints = { 
          audio:{ 
              mandatory: { 
                  chromeMediaSource: mediaSource, 
                  chromeMediaSourceId: streamId, 
                  echoCancellation: true 
              } 
          }, 
          video: { 
              optional: [], 
              mandatory: { 
                  chromeMediaSource: mediaSource, 
                  chromeMediaSourceId: streamId, 
                  maxWidth: 2560, 
                  maxHeight: 1440, 
                  maxFrameRate:30 
              } 
          } 
        } 
        window.desktopStream = await navigator.mediaDevices.getUserMedia(constraints); 
        if(isMac){ 
          var context = new AudioContext(); 
          context.createMediaStreamSource(window.desktopStream).connect(context.destination); 
        } 
         
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
          if(window.desktopStream.getAudioTracks().length > 0){ 
            sourceDesktop = context.createMediaStreamSource(window.desktopStream); 
          } 
          const sourceMic = context.createMediaStreamSource(window.micStream); 
          const destination = context.createMediaStreamDestination(); 
   
          const desktopGain = context.createGain(); 
          const voiceGain = context.createGain(); 
   
          desktopGain.gain.value = 0.7; 
          voiceGain.gain.value = 0.7; 
   
          if(sourceDesktop != null){ 
            sourceDesktop.connect(desktopGain).connect(destination); 
          } 
          sourceMic.connect(voiceGain).connect(destination); 
   
           
          window.resultStream = new MediaStream([...window.desktopStream.getVideoTracks() ,...destination.stream.getAudioTracks()]) 
        }else { 
          window.resultStream = window.desktopStream; 
        } 
       
 
        
        window.recorder = new MediaRecorder(window.resultStream); 
 
        window.recorder.ondataavailable = event => { 
          // console.log("ON DATA AVAILABLE", videoChunksArray.length); 
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
    }catch(e){ 
      console.log(e); 
      errorHandling(e); 
    } 
} 
const startRecordScreen = async(idMic,cb,isTabForMac) =>{ 
    try{ 
      if(isTabForMac){         
        window.isRecording = true; 
        chrome.storage.sync.set({isRecording: true}, ()=> {}); 
        cb(); 
        chrome.tabCapture.getMediaStreamId({targetTabId: isTabForMac},  (streamId)=>{ 
           recordScreen(streamId,idMic); 
           recIcon(); 
        }); 
      }else{ 
        chrome.desktopCapture.chooseDesktopMedia(environment.videoCaptureModes, async (streamId) => { 
            if (!streamId) { 
                window.isRecording = false; 
                chrome.storage.sync.set({isRecording: false}, ()=> { 
                }); 
            } else { 
                window.isRecording = true; 
                chrome.storage.sync.set({isRecording: true}, ()=> {}); 
                cb(); 
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
    window.desktopStream.getTracks().forEach(track => track.stop()) 
    if (window.micStream != undefined) { 
      window.micStream.getTracks().forEach(track => track.stop()) 
    } 
    window.resultStream.getTracks().forEach(track => track.stop()) 
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