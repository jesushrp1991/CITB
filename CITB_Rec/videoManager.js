import { checkUploadStatus } from './js/progressBar.js'

var id;
var port = chrome.runtime.connect({name: "getDriveLink"});
port.onMessage.addListener(function(msg) {
    if (msg.answer){
        console.log("msg.answer",msg.answer)
        getKindShare(msg.answer)
    }
  });

const reply_click = (event) =>{    
    // alert(event.srcElement.id)
    id = event.srcElement.id;
    console.log(id);
    var numb = id.match(/\d/g);
    numb = numb.join("");
    console.log("numb",numb)
    port.postMessage({getLink: numb});
}
const getKindShare = (link) =>{
    console.log(link,id);
    if(id.includes('gmail'))
        getShareLink(link);
    if(id.includes('classroom'))
        shareClassRoom(link);
    if(id.includes('twitter'))
        shareTwitter(link);
    if(id.includes('whatsapp'))
        shareWhatsapp();
    if(id.includes('wakelet'))
        shareWakelet(link);    
}
const getShareLink = (link) =>{
    chrome.storage.sync.get('shareLink', function(result) {        
        let url = `https://mail.google.com/mail/u/0/?fs=1&su=CITB%20Record&body=${encodeURIComponent(link)}&&tf=cm`
        chrome.tabs.create({active: true, url: url});
    });
}

const shareWhatsapp = (link) =>{
    let url = `https://wa.me?text=${encodeURIComponent(link)}`;        
    chrome.tabs.create({active: true, url: url});
}

const shareClassRoom = (link) =>{    
    let url = `https://classroom.google.com/share?url=${encodeURIComponent(link)}`;        
    chrome.tabs.create({active: true, url: url});
}

const shareTwitter = (link) =>{ 
    let url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(link)}`;        
    chrome.tabs.create({active: true, url: url});
}
const shareWakelet = (link) =>{     
    let url = `https://wakelet.com/save?self=1&media=${encodeURIComponent(link)}`;        
    chrome.tabs.create({active: true, url: url});
}


const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})

const calculateRecTime = (details) =>{
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
    return `${hours}:${minutes}:${seconds}`;
}

const createRecordCard = (details) => {
    const date =  details.dateStart.substring(1, 10);
    const recTime = calculateRecTime(details);
    fetch(chrome.runtime.getURL('html/card.html')).then(r => r.text()).then(html => {
        
        html = html.replace("{{cardId}}",details.id);
        html = html.replace("{{recName}}",details.name);
        html = html.replace("{{recDuration}}",recTime);
        html = html.replace("{{recDate}}",date);
        html = html.replace("{{progressBarId}}","progressBar" + details.id);
        html = html.replace("{{gmailcardId}}","gmail" + details.id);
        html = html.replace("{{classRoomcardId}}","classroom" + details.id);
        html = html.replace("{{twittercardId}}","twitter" + details.id);
        html = html.replace("{{whatsAppcardId}}","whatsapp" + details.id);
        html = html.replace("{{wakeletcardId}}","wakelet" + details.id);

        const container = document.createElement("div");
        container.setAttribute('class',"col-4");
        const div = escapeHTMLPolicy.createHTML(html);  
        container.innerHTML = div;
        document.getElementById('citbCardRecContainer').appendChild(container);
        document.getElementById("gmail" + details.id).addEventListener("click", reply_click);
        document.getElementById("classroom" + details.id).addEventListener("click", reply_click);
        document.getElementById("twitter" + details.id).addEventListener("click", reply_click);
        document.getElementById("whatsapp" + details.id).addEventListener("click", reply_click);
        document.getElementById("wakelet" + details.id).addEventListener("click", reply_click);
    });
}

const waitingForRec = () => {
    setInterval(()=>{
        chrome.storage.sync.get('newUpload', (result) => {   
            if(result.newUpload == "newUpload"){
                chrome.storage.sync.get('newUploadDetails', (result) => {  
                    createRecordCard(result.newUploadDetails);
                    chrome.storage.sync.set({newUpload: "uploadInProgress"}, () => {});
                    checkUploadStatus(true,result.newUploadDetails.id);
                    console.log("Desde Interval");
                }) 
            }     
        });
    },5000)
}

const checkInitialState = () => {
    console.log("INITIAL STATE")
    const request = { recordingStatus: 'listRec'};
    chrome.runtime.sendMessage(request);
    setTimeout(()=>{},3000);
    let isRunningRec = false;
    chrome.storage.sync.get('listRec', (result) => {
        if(result.listRec){
            result.listRec.list.forEach(element => {
                if( element.upload == 'inProgress' ){
                    console.log("Estado Inicial")
                    createRecordCard(element);
                    chrome.storage.sync.set({newUpload: "uploadInProgress"}, () => {});
                    checkUploadStatus(true,element.id);               
                    isRunningRec = true;
                }else{
                    createRecordCard(element);
                }
            });
        }        
        if(!isRunningRec)
            waitingForRec();
    })
}

checkInitialState();
