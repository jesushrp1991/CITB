

const updateTimerBar = (value) => {
    let timer= `${value.timerCounter.minute}:${value.timerCounter.seconds}`;
    document.getElementById('recTimerPanel').innerHTML =  timer;
}
const checkTimer = () => {
    setInterval(()=>{
        chrome.storage.sync.get('timerCounter', (result) => {
            if (Object.keys(result).length !== 0 &&  result.timerCounter.seconds > 0){
                updateTimerBar(result);
            }else{
                let timer = "00:00"
                document.getElementById('recTimerPanel').innerHTML =  timer;                
            }
        });
    },1000)
}

export {
    checkTimer
}