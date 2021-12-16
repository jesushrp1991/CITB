const API_KEY = 'AIzaSyDhLKHKTBWjlDSrRLPY_-kvgV0xcJH7qd0';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

const getAuthToken = () =>{
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log('got the token', token);
  })
};


/*
  *   Upload to Drive
  *
*/ 
  function run(obj) {
    // const file = obj.target.files[0];
    const file = obj;
    if (file.name != "") {
      let fr = new FileReader();
      fr.fileName = file.name;
      fr.fileSize = file.size;
      fr.fileType = file.type;
      fr.readAsArrayBuffer(file);
      fr.onload = resumableUpload;
    }
  }

  function resumableUpload(e) {
    accessToken = gapi.auth.getToken().access_token; // Please set access token here.
    // console.log("accessToken",accessToken)
    // document.getElementById("progress").innerHTML = "Initializing.";
    const f = e.target;
    const resource = {
      fileName: f.fileName,
      fileSize: f.fileSize,
      fileType: f.fileType,
      fileBuffer: f.result,
      accessToken: accessToken,
    };
    const ru = new ResumableUploadToGoogleDrive();
    ru.Do(resource, function (res, err) {
      if (err) {
        console.log(err);
        return;
      }
    //   console.log(res);
    //   let msg = "";
    //   if (res.status == "Uploading") {
    //     msg =
    //       Math.round(
    //         (res.progressNumber.current / res.progressNumber.end) * 100
    //       ) + "%";
    //   } else {
    //     msg = res.status;
    //   }
    //   document.getElementById("progress").innerText = msg;
    });
  }

getAuthToken()

  /* 
  ** DESKTOP REC
  */
let chunks = [];
const download = () => {
    console.log("Hello download")
    var blob = new Blob(chunks, {
        type: "video/webm"
    });
    var file = new File([blob], "CITB REC " + Date() + ".webm");
    run(file);
    // var url = URL.createObjectURL(blob);
    // var a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style = "display: none";
    // a.href = url;
    // a.download = "test.webm";
    // a.click();
    // window.URL.revokeObjectURL(url);
}
  
const captureScreen = async()=> {
    var mediaConstraints = {
    audio: true,
    video: true
    }

    const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    return screenStream
}

let isRecording = false;
let recorder;
const recordScreen = async (streamId) => {
    try{
        var constraints = {
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
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                console.log("insert chunck")
                chunks.push(event.data)
            }
        }
        recorder.onstop = () => {
            download();
        }
        recorder.start();
        isRecording = true;
    }catch(e){
        console.log(e);
    }
}
const recordBack = () =>{
    try{
        const request = ['screen','audio'];
        chrome.desktopCapture.chooseDesktopMedia(request, async (streamId) => {
            if (!streamId) {
                isRecording = false;
                chrome.storage.sync.set({isRecording: false}, function() {
                });
            } else {
                isRecording = true;
                chrome.storage.sync.set({isRecording: true}, function() {
                });
                await recordScreen(streamId);
            }
          });
    }catch(e){
        console.log(e);
    }
}
const stopBack = () =>{
    console.log(isRecording);
    if(isRecording){
        recorder.stop();
        isRecording = false;
        chrome.storage.sync.set({isRecording: false}, function() {
        });
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('is recorfing',isRecording)
    if(!isRecording){
        await recordBack();
        sendResponse({
            type: 'ok',
            message: 'Recording'
          })
    }else{
        await stopBack();
        sendResponse({
            type: 'ok',
            message: 'Stopping'
          })
    }    
    return true;
  });