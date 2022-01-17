var portTimer = chrome.runtime.connect({name: "portTimer"});

portTimer.onMessage.addListener(async (msg) => {
    if (msg.answer && msg.answer.seconds > 0){
        updateTimerBar(msg.answer);
    }else{
        let timer = "00:00"
        document.getElementById('recTimerPanel').innerHTML =  timer;                
    }    
  });

const updateTimerBar = (value) => {
    let timer= `${value.minute}:${value.seconds}`;
    document.getElementById('recTimerPanel').innerHTML =  timer;
}


const checkTimer = () => {
    setInterval(()=>{
        portTimer.postMessage({getTimer: true});
    },1000)
}

export {
    checkTimer
}