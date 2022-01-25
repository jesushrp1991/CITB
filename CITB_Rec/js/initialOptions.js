var port = chrome.runtime.connect({name: "getDriveLink"});
let checkboxCalendar = document.getElementById('checkboxCalendar');
let showRecords = document.getElementById('chekcBoxShowRecords');
checkboxCalendar.checked = false;

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
    calendarList = calendarList.reverse();
    while (select.options.length > 0) {                
        select.remove(0);
    }
    // chrome.storage.local.get('lastCalendar', (result)=> {
        calendarList.forEach(element => {
            var option = document.createElement("option");
            option.text = element.summary;
            option.value = element.id;
            select.add(option);
            // if(result.lastCalendar == element.id){
            if( element.primary){
                select.value = element.id; 
            }
        });
    // }); 
    chrome.storage.local.get('showRecords', (result)=> {
        showRecords.checked = result.showRecords ;
    })
    
}


const recOk = () =>{
    let fileName = document.getElementById('fileName').value;
    if(fileName == '' || fileName == undefined || fileName == null){
        document.getElementById('fileName').value = "Por favor introduzca el nombre";
        return;
    }
    else{
        let idCalendar;        
        checkboxCalendar.checked ? idCalendar = select.value : idCalendar = null;
        port.postMessage({okRec: true ,fileName:fileName ,calendarId: idCalendar,showRecords:showRecords.checked});
        // chrome.storage.local.set({lastCalendar: idCalendar});
        chrome.storage.local.set({showRecords: showRecords.checked});
        window.close();
    }
}

const buttonOK = document.getElementById('button-ok');
buttonOK.addEventListener('click',recOk);

askCalendarList();