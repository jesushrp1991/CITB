var port = chrome.runtime.connect({name: "getDriveLink"});

port.onMessage.addListener(async (msg) => {
    if (msg.calendarList){
        console.log(msg.calendarList);
        populateCalendarSelect(msg.calendarList);
    }
});


const askCalendarList = () =>{
    console.log("Pidiendo Calendar")
    port.postMessage({requestCalendarList: true});
}

let select = document.getElementById('miclist');
const populateCalendarSelect = async (calendarList) => {
    while (select.options.length > 0) {                
        select.remove(0);
    }  
    calendarList.forEach(element => {
        var option = document.createElement("option");
        option.text = element.summary;
        option.value = element.id;
        select.add(option);
    });
}

askCalendarList();