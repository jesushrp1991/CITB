import { checkUploadStatus,updateProgressBar } from './js/progressBar.js'

var id;
var port = chrome.runtime.connect({name: "getDriveLink"});

const baseUrlPerHost = {
    whatsapp: 'https://wa.me?text=',
    twitter: 'https://twitter.com/intent/tweet?text=',
    classroom: 'https://classroom.google.com/share?url=',
    gmail: 'https://mail.google.com/mail/u/0/?fs=1&su=CITB%20Record&body=',
    wakelet: 'https://wakelet.com/save?self=1&media=',

};

port.onMessage.addListener(async (msg) => {
    if (msg.answer){
        getKindShare(msg.answer)
    }else if (msg.lista){
        await queueDaemon(msg.lista);
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

const getShareType = () => {
    const linkTypes = Object.keys(baseUrlPerHost);
    console.log("linkTypes",linkTypes);
    let finalType = "";
    linkTypes.forEach(type => {
        if (id.includes(type)) {
            finalType = type;
        }
    })
    return finalType;
}


const getKindShare = (link) =>{
    console.log(link,id);
    const type = getShareType();
    const baseUrl = baseUrlPerHost[type];
    shareLink(link, baseUrl);
    // if(id.includes('gmail')) {
    //     const baseUrl = baseUrlPerHost.gmail;
    //     shareLink(link, baseUrl);
    // }
        
    // if(id.includes('classroom')) {
    //     const baseUrl = baseUrlPerHost.classroom;
    //     shareLink(link, baseUrl);
    // }
        
    // if(id.includes('twitter')) {
    //     const baseUrl = baseUrlPerHost.twitter;
    //     shareLink(link, baseUrl);
    // }
        
    // if(id.includes('whatsapp')) {
    //     const baseUrl = baseUrlPerHost.whatsapp;
    //     shareLink(link, baseUrl);
    // }
        
    // if(id.includes('wakelet')) {
    //     const baseUrl = baseUrlPerHost.wakelet;
    //     shareLink(link, baseUrl);
    // }
}

const shareLink = (link, baseUrl) => { 
    console.log(link, baseUrl);
    const url = `${baseUrl}${encodeURIComponent(link)}`;
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

const createRecordCard = async (details) => {
    let date =  details.dateStart.substring(0, 10);
    date = moment(date, "YYYY/MM/DD").format("MM/DD/YYYY");
    const recTime = calculateRecTime(details);
    const urlContent = await fetch(chrome.runtime.getURL('html/card.html'))
    let html = await urlContent.text();
        
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
    return;
}

// const waitingForRec = () => {
//     setInterval(()=>{
//         chrome.storage.sync.get('newUpload', (result) => {   
//             if(result.newUpload == "newUpload"){
//                 chrome.storage.sync.get('newUploadDetails', (result) => {  
//                     createRecordCard(result.newUploadDetails);
//                     chrome.storage.sync.set({newUpload: "uploadInProgress"}, () => {});
//                     checkUploadStatus(true,result.newUploadDetails.id);
//                     console.log("Desde Interval");
//                 }) 
//             }     
//         });
//     },5000)
// }

const startQueue = () =>{
    // port.postMessage({getList: true});
    setInterval(()=>{
        port.postMessage({getList: true});
    },1000);
}
const clear = () =>{
    let carsList = document.getElementsByClassName('col-4');
    for (let i = 0; i < carsList.length; i++) {
        carsList[i].remove();
    }
}
let cantElements = 0;
let actualUploadElementID;
let actualInterval = null;
const queueDaemon = (result) =>{
    // console.log(result,cantElements);
    if(result.length  > cantElements)
    {
        cantElements = result.length ;
        clear();
        console.log("ANTES",result);
        result.forEach(async (element) => {
            console.log("FOREACH");
            // console.log(element,actualInterval,actualUploadElementID);
            if(element.upload == 'inProgress'){
                console.log("PROGRESS");
                if(actualUploadElementID != element.id){
                    if(actualInterval != null){
                        clearInterval(actualInterval);
                    }
                    actualUploadElementID = element.id; 
                    await createRecordCard(element);
                    actualInterval = checkUploadStatus(true,actualUploadElementID);
                }                
            }else if(element.upload == 'awaiting') {
                console.log("awaiting");
                await createRecordCard(element);
                updateProgressBar(0,element.id);
            }else{
                console.log("ENDED");
                await createRecordCard(element);
                updateProgressBar(100,element.id);
            }
        })
    }
}

startQueue();

// const checkInitialState = () => {
//     console.log("INITIAL STATE")
//     const request = { recordingStatus: 'listRec'};
//     chrome.runtime.sendMessage(request);
//     setTimeout(()=>{},3000);
//     let isRunningRec = false;
//     chrome.storage.sync.get('listRec', (result) => {
//         if(result.listRec){
//             result.listRec.list.forEach(element => {
//                 if( element.upload == 'inProgress' ){
//                     console.log("Estado Inicial")
//                     createRecordCard(element);
//                     chrome.storage.sync.set({newUpload: "uploadInProgress"}, () => {});
//                     checkUploadStatus(true,element.id);               
//                     isRunningRec = true;
//                 }else{
//                     createRecordCard(element);
//                 }
//             });
//         }        
//         if(!isRunningRec)
//             waitingForRec();
//     })
// }

// checkInitialState();

