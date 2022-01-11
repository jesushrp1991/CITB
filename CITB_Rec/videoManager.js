import { checkUploadStatus,updateProgressBar } from './js/progressBar.js'

var id;
var port = chrome.runtime.connect({name: "getDriveLink"});

const baseUrlPerHost = {
    whats: 'https://wa.me?text=',
    twitt: 'https://twitter.com/intent/tweet?text=',
    class: 'https://classroom.google.com/share?url=',
    gmail: 'https://mail.google.com/mail/u/0/?fs=1&su=CITB%20Record&body=',
    wakel: 'https://wakelet.com/save?self=1&media=',
};

port.onMessage.addListener(async (msg) => {
    if (msg.lista){
        queueDaemon(msg.lista);
    }else if (msg.currentList){
        msg.currentList.forEach(async (element) => {
            let result = document.getElementById(element.id);
            if(result){
                //nada...
            }
            else if(element.upload == 'folder'){
               createFolderCard(element);
            }
            else{
                await createRecordCard(element);
                updateProgressBar(100,element.id);
            }
        });
    }
  });

const reply_click = (event) =>{   
    id = event.srcElement.id;
    let driveID = "https://drive.google.com/file/d/" + id.slice(5) +  "/view?usp=sharing";
    getKindShare(driveID);
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

var folderId = 'root';
const  folder_click = (event) =>{
    let container = document.getElementById('citbCardRecContainer');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    let foldersContainer = document.getElementById('citbFolderContainer');
    Array.from(foldersContainer.children).map((child)=>{
        child.setAttribute('class','dropzone');
    })

    let id = event.srcElement.id;
    document.getElementById(id).setAttribute('class','dropzone folderSelected');
    folderId = id;
    port.postMessage({getDriveFiles: true ,folderId: folderId });
    // alert(`FOLDER CLICK ${event.srcElement.id}`)
}
const createFolderCard = async(details) => {
    const urlContent = await fetch(chrome.runtime.getURL('html/folder.html'))
    let html = await urlContent.text();
    html = html.replace("{{nombre}}",details.name);
    html = html.replace("{{idSrc}}",details.id);
    html = html.replace("{{idP}}",details.id);

    const container = document.createElement("div");
    container.setAttribute('class',"col-1 dropzone");
    container.setAttribute('id',details.id);
    container.style.marginLeft = '20px';
    const div = escapeHTMLPolicy.createHTML(html);  
    
    container.innerHTML = div;
    let folderContainer = document.getElementById('citbFolderContainer');
    folderContainer.insertBefore(container,folderContainer.firstChild);

    document.getElementById(details.id).addEventListener("click", folder_click);

}

var dragged;
const dragElement = (element) => {

    document.addEventListener("drag", (event) => {
    }, false);

    document.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData('text/plain',null)
        dragged = event.target;
        event.target.style.opacity = .5;
    }, false);

    document.addEventListener("dragend", (event) => {
        event.target.style.opacity = "";
    }, false);

    document.addEventListener("dragover", (event) => {
        event.preventDefault();
        if ( event.target.className.includes("dropzone")) {
        }
    }, false);

    document.addEventListener("dragenter", (event) => {
        if ( event.target.className.includes("dropzone")) {
            event.target.style.opacity = .5;
        }
    }, false);

    document.addEventListener("dragleave", (event) => {
        if ( event.target.className.includes("dropzone")) {
            event.target.style.opacity = "";
        }
  }, false);

  document.addEventListener("drop", (event) => {
      event.preventDefault();
      if ( event.target.className.includes("dropzone")) {
        let node = document.getElementById(dragged.id);
        node.parentNode.removeChild(node);
        event.target.style.opacity = "";
        
        let id = {idFile:dragged.id, idFolder:event.target.id}
        port.postMessage({moveFile: true ,id:id});
      }    
  }, false);
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
    html = html.replace("{{classRoomcardId}}","class" + details.id);
    html = html.replace("{{twittercardId}}","twitt" + details.id);
    html = html.replace("{{whatsAppcardId}}","whats" + details.id);
    html = html.replace("{{wakeletcardId}}","wakel" + details.id);
    if(details.thumbnailLink){
        html = html.replace("{{thumbnailLink}}", details.thumbnailLink);
    }else{
        html = html.replace("{{thumbnailLink}}", '/assets/defaultThumbnail.jpg');
    }

    const container = document.createElement("div");
    container.setAttribute('class',"col-4");
    container.setAttribute('id',details.id);
    const div = escapeHTMLPolicy.createHTML(html);  
    container.innerHTML = div;
    let cardContainer = document.getElementById('citbCardRecContainer');
    cardContainer.insertBefore(container,cardContainer.firstChild);
    

    dragElement(document.getElementById(details.id));
    document.getElementById(details.id).setAttribute("draggable",true);
    document.getElementById("gmail" + details.id).addEventListener("click", reply_click);
    document.getElementById("class" + details.id).addEventListener("click", reply_click);
    document.getElementById("twitt" + details.id).addEventListener("click", reply_click);
    document.getElementById("whats" + details.id).addEventListener("click", reply_click);
    document.getElementById("wakel" + details.id).addEventListener("click", reply_click);
    return;
}
const startQueue = () =>{
    setInterval(()=>{
        port.postMessage({getList: true});
    },3000);
}

let actualUploadElementID;
let actualInterval = null;

const queueDaemon = (result) =>{
        result.forEach(async (element) => {
            if(element.upload == "folder"){
                let folder = document.getElementById(element.id);
                if(folder == null){
                    createFolderCard(element);
                }
            }else if(element.upload == "inProgress"){
                if(actualUploadElementID != element.id){
                    if(actualInterval != null){
                        clearInterval(actualInterval);
                    }
                    actualUploadElementID = element.id; 
                    let card = document.getElementById(element.id);
                    if(card == null){
                        await createRecordCard(element);
                    }                   
                    actualInterval = checkUploadStatus(true,element.id);
                }                
            }else if(element.upload == "awaiting") {
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
    port.postMessage({getDriveFiles: true ,folderId: folderId });
}

const addFolder = () =>{
    let name = prompt ("Nombre");
    if(name){
        port.postMessage({addFolder: true, name : name});
    }    
}

document.getElementById('addFolder').addEventListener('click',addFolder);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting){
        let element = document.getElementById(request.greeting);
        element.parentElement.removeChild(element);
        getDriveFiles();
      }
    }
  );
  

getDriveFiles();
startQueue();