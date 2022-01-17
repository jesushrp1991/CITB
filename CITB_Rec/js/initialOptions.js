var port = chrome.runtime.connect({name: "getDriveLink"});

port.onMessage.addListener(async (msg) => {
    if (msg.calendarList){
        populateCalendarSelect(msg.calendarList);
    }
});


const askCalendarList = () =>{
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

const recOk = () =>{
    let fileName = document.getElementById('fileName').value;
    if(fileName == '' || fileName == undefined || fileName == null){
        document.getElementById('fileName').value = "Por favor introduzca el nombre";
        return;
    }
    else{
        let idCalendar;
        let checkboxCalendar = document.getElementById('checkboxCalendar');
        checkboxCalendar.checked ? idCalendar = select.value : idCalendar = null;
        port.postMessage({okRec: true ,fileName:fileName ,calendarId: idCalendar});
        window.close();
    }
}

const buttonOK = document.getElementById('button-ok');
buttonOK.addEventListener('click',recOk);

askCalendarList();