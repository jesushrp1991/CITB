const displayTimerBar = () =>{
    document.getElementById('recTimerPanel').style.display = 'block';
}

const hideTimerBar = () =>{
    document.getElementById('recTimerPanel').style.display = 'none';
}

const updateTimerBar = (value) => {
    let timer= `${value.timerCounter.minute}:${value.timerCounter.seconds}`;
    document.getElementById('recTimerPanel').innerHTML =  timer;
}
const checkTimer = () => {
    setInterval(()=>{
        chrome.storage.sync.get('timerCounter', function(result) {
            if (result.timerCounter.seconds > 0){
                updateTimerBar(result);
                displayTimerBar();
            }else{
                hideTimerBar();
            }
        });
    },1000)
}

export {
    checkTimer
}