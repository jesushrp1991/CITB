const sendRecordCommand = () =>{
    const request = { recording: true };
    const EXTENSION_ID  = "ijbdnbhhklnlmdpldichdlknfaibceaf";
    buttonRec.getAttribute('class') ==  'buttonRecOn' 
        ?  buttonRec.setAttribute('class','buttonRecOff')
        :  buttonRec.setAttribute('class','buttonRecOn') ;
    chrome.runtime.sendMessage(EXTENSION_ID,request, async (response) => {         
    });
}

const getCurrentState = () =>{
    chrome.storage.sync.get('isRecording', function(result) {
        result.isRecording 
            ?  buttonRec.setAttribute('class','buttonRecOn') 
            :  buttonRec.setAttribute('class','buttonRecOff');
    });
}

let buttonRec = document.getElementById("recPanel");
buttonRec.addEventListener('click',sendRecordCommand);
getCurrentState();