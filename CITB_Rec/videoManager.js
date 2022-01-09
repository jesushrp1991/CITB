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
    id = event.srcElement.id;
    var numb = id.match(/\d/g);
    numb = numb.join("");
    port.postMessage({getLink: numb});
}

const getShareType = () => {
    const linkTypes = Object.keys(baseUrlPerHost);
    let finalType = "";
    linkTypes.forEach(type => {
        if (id.includes(type)) {
            finalType = type;
        }
    })
    return finalType;
}


const getKindShare = (link) =>{
    const type = getShareType();
    const baseUrl = baseUrlPerHost[type];
    shareLink(link, baseUrl);
}

const shareLink = (link, baseUrl) => { 
    let url;
    if(baseUrl.includes('mail.google')){
        url = `${baseUrl}${encodeURIComponent(link)}&&tf=cm`;
    }else{
        url = `${baseUrl}${encodeURIComponent(link)}`;
    }
    chrome.tabs.create({active: true, url: url});
}


const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})

const calculateRecTime = (details) =>{
    let seconds;
    if(details.msDuration){
         seconds = parseInt(details.msDuration/1000);
    }else{
        const initDate = dayjs(details.dateStart);
        const endDate = dayjs(details.dateEnd);
        seconds = endDate.diff(initDate,"second",true);
    }
    
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

const createFolderCard = async(details) => {
    const urlContent = await fetch(chrome.runtime.getURL('html/folder.html'))
    let html = await urlContent.text();
    html = html.replace("{{nombre}}",details.name);

    const container = document.createElement("div");
    container.setAttribute('class',"col-1");
    container.setAttribute('id',details.id);
    container.style.marginLeft = '20px';
    const div = escapeHTMLPolicy.createHTML(html);  
    container.innerHTML = div;
    let folderContainer = document.getElementById('citbFolderContainer');
    folderContainer.insertBefore(container,folderContainer.firstChild);
}
function dragElement(elmnt) {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      document.getElementById(elmnt.id).setAttribute('class','col-4 dragCard');

      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement(e) {
        console.log(e.target);
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
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
    container.setAttribute('id',details.id);
    const div = escapeHTMLPolicy.createHTML(html);  
    container.innerHTML = div;
    let cardContainer = document.getElementById('citbCardRecContainer');
    cardContainer.insertBefore(container,cardContainer.firstChild);

    dragElement(document.getElementById(details.id));

    document.getElementById("gmail" + details.id).addEventListener("click", reply_click);
    document.getElementById("classroom" + details.id).addEventListener("click", reply_click);
    document.getElementById("twitter" + details.id).addEventListener("click", reply_click);
    document.getElementById("whatsapp" + details.id).addEventListener("click", reply_click);
    document.getElementById("wakelet" + details.id).addEventListener("click", reply_click);
    return;
}
const startQueue = () =>{
    setInterval(()=>{
        port.postMessage({getList: true});
    },1000);
}

let actualUploadElementID;
let actualInterval = null;

const queueDaemon = (result) =>{
        result.forEach(async (element) => {
            if(element.upload == 'folder'){
                let folder = document.getElementById(element.id);
                if(folder == null){
                    createFolderCard(element);
                }
            }else if(element.upload == 'inProgress'){
                if(actualUploadElementID != element.id){
                    if(actualInterval != null){
                        clearInterval(actualInterval);
                    }
                    actualUploadElementID = element.id; 
                    let card = document.getElementById(element.id);
                    if(card == null){
                        await createRecordCard(element);
                    } 
                    actualInterval = checkUploadStatus(true,actualUploadElementID);
                }                
            }else if(element.upload == 'awaiting') {
                let card = document.getElementById(element.id);
                if(card == null){
                    await createRecordCard(element);
                } 
                updateProgressBar(0,element.id);
            }else{
                let card = document.getElementById(element.id);
                if(card == null){
                    await createRecordCard(element);
                } 
                updateProgressBar(100,element.id);
            }
        });
}

const getDriveFiles = () => {
    port.postMessage({getDriveFiles: true});
}

const addFolder = () =>{
    let name = prompt ("Nombre");
    if(name){
        port.postMessage({addFolder: true, name : name});
        createFolderCard({id:9999,name:name});
    }    
}

document.getElementById('addFolder').addEventListener('click',addFolder);



getDriveFiles();
startQueue();