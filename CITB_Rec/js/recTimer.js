let ms = 0;
let sec = 0;
let min = 0;
let time;
let milli ,seconds, minute;

const timer = () => {
        ms++;
        if(ms >= 100){
            let timer= {minute:minute,seconds:seconds};
            chrome.storage.sync.set({timerCounter: timer}, () => {
            });
            sec++
            ms = 0
        }
        if(sec === 60){
            min++
            sec = 0
        }
        if(min === 60){
            ms, sec, min = 0;
        }

        //Doing some string interpolation
         milli = ms < 10 ? `0`+ ms : ms;
         seconds = sec < 10 ? `0`+ sec : sec;
         minute = min < 10 ? `0` + min : min;

       
        
        localStorage.setItem('timeMinSaved', min);
        localStorage.setItem('timeSecSaved', sec);

};
//Start timer

const startTimerCount = () => {
    var minSaved = localStorage.getItem('timeMinSaved');
    var secSaved = localStorage.getItem('timeSecSaved');
    if (minSaved) {
        min = minSaved;
    }
    if(secSaved){
        sec = secSaved;
    }
    time = setInterval(timer,10);
}

//stop timer
const stopTimerCount = () => {
    clearInterval(time);
}

//reset timer
const reset = () =>{
    ms = 0;
    sec = 0;
    min = 0;
    clearInterval(time);
    let timer= {minute:0,seconds:0};
    chrome.storage.sync.set({timerCounter: timer}, () => {});
    localStorage.removeItem('timeMinSaved');
    localStorage.removeItem('timeSecSaved');
}

export {
     startTimerCount 
    ,stopTimerCount 
    ,reset
}