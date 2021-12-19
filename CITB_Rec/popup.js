const sendMessage = (msg) =>{
    chrome.runtime.sendMessage(msg, (response) => {         
    });
}

const sendRecordCommand = () =>{
    const request = { recordingStatus: 'rec' };
    buttonRec.getAttribute('class') ==  'buttonRecOn' 
        ?  buttonRec.setAttribute('class','buttonRecOff')
        :  buttonRec.setAttribute('class','buttonRecOn') ;
    sendMessage(request);
}

const getCurrentState = () =>{
    chrome.storage.sync.get('isRecording', function(result) {
        result.isRecording 
            ?  buttonRec.setAttribute('class','buttonRecOn') 
            :  buttonRec.setAttribute('class','buttonRecOff');
    });
    chrome.storage.sync.get('isPaused', function(result) {
        result.isPaused 
            ?  buttonPlayPause.setAttribute('class','buttonPlay') 
            :  buttonPlayPause.setAttribute('class','buttonPause');
    });
}

let buttonRec = document.getElementById("recButton");
buttonRec.addEventListener('click',sendRecordCommand);


const playPause = () =>{
    const request = { recordingStatus: 'pause' };
    buttonPlayPause.getAttribute('class') ==  'buttonPause' 
        ?  buttonPlayPause.setAttribute('class','buttonPlay')
        :  buttonPlayPause.setAttribute('class','buttonPause');
    sendMessage(request);
}

let buttonPlayPause = document.getElementById("playPauseButton");
buttonPlayPause.addEventListener('click',playPause);


const displayProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'block';
}

const hideProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'none';
}

const updateProgressBar = (value) => {
    console.log(value,typeof(value));

    document.getElementById('progressBar').style.width = value;
    document.getElementById('progressBar').innerHTML =  value+"%";

}

var port = chrome.extension.connect({
    name: "Sample Communication"
});

port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
});

const checkUploadStatus = () => {
    setInterval(()=>{
        console.log("timeout check upload")
        chrome.storage.sync.get('uploadPercent', function(result) {
            if (result.uploadPercent > 0){
                updateProgressBar(result.uploadPercent);
                displayProgressBar();
            }
            if(result.uploadProgress >= 99 || result.uploadProgress == 0 ){
                hideProgressBar();
            }
        });
    },1500)
}

checkUploadStatus();
getCurrentState();