let output = document.getElementById('demo');
let ms = 0;
let sec = 0;
let min = 0;
let time;

function timer (){
        ms++;
        if(ms >= 100){
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
        let milli = ms < 10 ? `0`+ ms : ms;
        let seconds = sec < 10 ? `0`+ sec : sec;
        let minute = min < 10 ? `0` + min : min;

        let timer= `${minute}:${seconds}:${milli}`;
        output.innerHTML =timer;
        localStorage.setItem('timeMinSaved', min);
        localStorage.setItem('timeSecSaved', sec);

};
//Start timer

const start = () => {
    var minSaved = localStorage.getItem('timeMinSaved');
    var secSaved = localStorage.getItem('timeSecSaved');
    if (minSaved) {
        min = minSaved;
    }
    if(secSaved){
        sec = secSaved;
    }
    time = setInterval(timer,10);
    document.getElementById('recTimerPanel').style.display = 'block';
}
//stop timer
const stop = () => {
    clearInterval(time);
    let minSaved = localStorage.getItem('timeMinSaved');
    minSaved = minSaved < 10 ? `0` + minSaved : minSaved;
    let secSaved = localStorage.getItem('timeSecSaved');
    secSaved = secSaved < 10 ? `0` + secSaved : secSaved;
    let timer= `${minSaved}:${secSaved}:00`;
    output.innerHTML =timer;
}
//reset timer
const reset = () =>{
    ms = 0;
    sec = 0;
    min = 0;

    output.innerHTML = `00:00:00`
    localStorage.removeItem('timeSaved');
    document.getElementById('recTimerPanel').style.display = 'none';
}

export {
    start,
    stop,
    reset
}