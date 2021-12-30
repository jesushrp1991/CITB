import { checkUploadStatus } from './js/progressBar.js'

const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})


const createRecordCard = (details) => {
    const date =  details.dateStart.substring(1, 10);
    const initDate = dayjs(details.dateStart);
    const endDate = dayjs(details.dateEnd);
    let seconds = endDate.diff(initDate,"second",true);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    if(seconds < 10){
        seconds ='0'+ seconds;
    }
    if(minutes < 10){
        minutes ='0'+ minutes;
    }
    if(hours < 10){
        hours ='0'+ hours;
    }
    fetch(chrome.runtime.getURL('html/card.html')).then(r => r.text()).then(html => {
        html = html.replace("{{cardId}}",details.id);
        html = html.replace("{{recName}}",details.name);
        html = html.replace("{{recDuration}}",`${hours}:${minutes}:${seconds}`);
        html = html.replace("{{recDate}}",date);
        const container = document.createElement("div");
        container.setAttribute('class',"col-4");
        const div = escapeHTMLPolicy.createHTML(html);  
        container.innerHTML = div;
        document.getElementById('citbCardRecContainer').appendChild(container);
    });
}

const waitingForRec = () => {
    chrome.storage.sync.get('newUpload', (result) => {   
        if(result.newUpload == "newUpload"){
            chrome.storage.sync.get('newUploadDetails', (result) => {  
                createRecordCard(result.newUploadDetails);
                chrome.storage.sync.set({newUpload: "uploadInProgress"}, () => {});
            }) 
        }     
    });
}

const checkInitialState = () => {

}

setInterval(waitingForRec,5000);
checkUploadStatus();
checkInitialState();