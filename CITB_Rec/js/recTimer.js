const countVideoRecordTime = (isRec) =>{
    var countDownDate = localStorage.getItem('startDate');
    if (countDownDate) {
        countDownDate = new Date(countDownDate);
    } else {
        countDownDate = new Date();
        localStorage.setItem('startDate', countDownDate);
    }
    // Update the count down every 1 second
    var x = setInterval(function() {
        console.log("Is rec",isRec) 
        if(isRec)
        {
            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = now - countDownDate.getTime();

            // Time calculations for days, hours, minutes and seconds
            // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            // document.getElementById("demo").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
            document.getElementById("demo").innerHTML =  hours + "h " + minutes + "m " + seconds + "s ";
            displayVideoRecCounter();
        }else{
            if(countDownDate){
                countDownDate = localStorage.getItem('startDate');
                countDownDate = new Date(countDownDate).getTime();
                var now = new Date().getTime();
                var result = now-countDownDate;
                result = new Date(result);
                alert(result);
                localStorage.setItem('startDate', );
            }
        }
    }, 1000);
    return x;
}
const stopVideoRecordTime = () =>{
    var countDownDate = localStorage.getItem('startDate');
    if(countDownDate){
        localStorage.removeItem('startDate');
        hideVideoRecCounter();
    }
}

const displayVideoRecCounter = () => {
    document.getElementById('recTimerPanel').style.display = 'block';
}

const hideVideoRecCounter = () => {
    document.getElementById('recTimerPanel').style.display = 'none';
}

export {
    countVideoRecordTime,
    stopVideoRecordTime,
}