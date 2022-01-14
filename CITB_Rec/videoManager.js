import { checkUploadStatus,updateProgressBar } from './js/progressBar.js'
import { compareWhitCache } from './js/tools.js'

var id;
let isFirstRender = true;
let idCITBFolder;
var port = chrome.runtime.connect({name: "getDriveLink"});

const baseUrlPerHost = {
    whats: 'https://wa.me?text=',
    twitt: 'https://twitter.com/intent/tweet?text=',
    class: 'https://classroom.google.com/share?url=',
    gmail: 'https://mail.google.com/mail/u/0/?fs=1&su=CITB%20Record&body=',
    wakel: 'https://wakelet.com/save?self=1&media=',
};

const drawScreen = (list) =>{
    //algoritm to draw whit cache, compare and decide.
    //Esta en la libreta!!!
}

port.onMessage.addListener(async (msg) => {
    if (msg.lista){
        queueDaemon(msg.lista);
    }
    else if (msg.currentList){
        deleteElementById("fake");
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
        enableClick();
    }
    else if (msg.deletedFile){
        document.getElementById(idCITBFolder).setAttribute('class','dropzone folderSelected');
        lastSelectedFolderId = idCITBFolder;
        port.postMessage({getDriveFiles: true ,folderId: idCITBFolder });
    }
    else if (msg.searchList){
        console.log(msg.searchList)
        //deleteall
        let container = document.getElementById('citbFolderContainer');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        let containerRec = document.getElementById('citbCardRecContainer');
        while (containerRec.firstChild) {
            containerRec.removeChild(containerRec.firstChild);
        }
        msg.searchList.forEach(async (element) => {
            if(element.upload == 'folder'){
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
    let seconds,minutes;
    if(details.msDuration){
         seconds = parseInt(details.msDuration/1000);
         minutes = seconds/60;
         seconds = seconds % 60;
    }else{
        const initDate = dayjs(details.dateStart);
        const endDate = dayjs(details.dateEnd);
        minutes = endDate.diff(initDate,"minute",true);
        seconds = endDate.diff(initDate,"second",true);
    }
    minutes = Math.round(minutes);
    seconds = Math.round(seconds);
    if(minutes < 10){
        minutes = '0' + minutes;
    }
    if(seconds < 10){
        seconds = '0' + seconds
    }
    return `${minutes}:${seconds}`;
}

var folderId = 'root';
let lastSelectedFolderId = null;
let isFirstTimeFolderSelected = true;

var mouseDownTimeout;
const folder_mouseDown = (event) => {
    mouseDownTimeout = setTimeout(() => {
        let folderID = event.srcElement.id;
        event.srcElement.parentNode.classList.add("folderToRemove");

        event.srcElement.parentNode.childNodes.forEach(node => {
            const classes = node.classList;
            if (classes != undefined) {
                if (node.classList.contains("removeFolder")) {
                    node.setAttribute("id", "removeFolder" + folderID);
                    node.addEventListener("click", removeFolder)
                }
            }
            
        })
        fromMouseUp = true;
    },1000)
}
var fromMouseUp = false;
const folder_mouseUp = (event) => {
    setTimeout(() => {
        fromMouseUp = false;
    },200)
    clearTimeout(mouseDownTimeout);
}
const removeFolder = (event) => {
    event.stopPropagation();
    event.preventDefault();
    window.folderID = event.srcElement.id.replace('removeFolder', '');
    // let userConfirm = confirm("Si borra esta carpeta borrará todos los archivos dentro de la misma, ¿desea continuar?");
    document.getElementById('popupDelete').setAttribute('class','fab-citb active');
    
}
const executeRemoveFolder = (event) =>{
    event.preventDefault();    
    port.postMessage({deleteFile: true ,folderId: window.folderID });
    deleteElementById(window.folderID);
    document.getElementById('popupDelete').setAttribute('class','fab-citb');
}

const deleteElementById = (id) =>{
    let node = document.getElementById(id);
    if(node){
        node.parentNode.removeChild(node);
    }
}

const disableClick = () =>{
    document.getElementById('loading').style.display = 'block';
}
const enableClick = () =>{
    document.getElementById('loading').style.display = 'none';
}

const  folder_click = (event) =>{
    let folderID = event.srcElement.id;
    if(lastSelectedFolderId == folderID ){
        return;
    }

    if(!isFirstRender && idCITBFolder){
        document.getElementById(idCITBFolder).setAttribute('class','dropzone');
    }
    let container = document.getElementById('citbCardRecContainer');
    while (container.firstChild){
        container.removeChild(container.firstChild);
    }
    document.getElementById(folderID).classList.add('folderSelected');
    if (!fromMouseUp){
        document.getElementById(folderID).classList.remove('folderToRemove');
    }
    if(lastSelectedFolderId != folderID ){
        if(!isFirstTimeFolderSelected){
            document.getElementById(lastSelectedFolderId).setAttribute('class','dropzone');
        }
        isFirstTimeFolderSelected = false;
        lastSelectedFolderId = folderID;
    }
    disableClick();
    port.postMessage({getDriveFiles: true ,folderId: folderID });
}


const createFolderCard = async(details) => {
    const urlContent = await fetch(chrome.runtime.getURL('html/folder.html'))
    let html = await urlContent.text();
    html = html.replace("{{nombre}}",details.name);
    html = html.replace("{{idSrc}}",details.id);
    html = html.replace("{{idP}}",details.id);

    const container = document.createElement("div");
    if(isFirstRender && details.name == 'CITB_Records'){
        container.setAttribute('class',"dropzone folderSelected");
        isFirstRender = false;
        idCITBFolder = details.id;
    }
    else{
        container.setAttribute('class',"dropzone");
    }

    container.setAttribute('id',details.id);
    container.style.marginLeft = '20px';
    const div = escapeHTMLPolicy.createHTML(html);  
    
    container.innerHTML = div;
    let folderContainer = document.getElementById('citbFolderContainer');
    folderContainer.insertBefore(container,folderContainer.firstChild);

    document.getElementById(details.id).addEventListener("click", folder_click);
    document.getElementById(details.id).addEventListener("mousedown", folder_mouseDown);
    document.getElementById(details.id).addEventListener("mouseup", folder_mouseUp);


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
        deleteElementById(dragged.id);
        event.target.style.opacity = "";        
        let id = {idFile:dragged.id, idFolder:event.target.id}
        port.postMessage({moveFile: true ,id:id});
      }    
  }, false);
}

const createRecordCard = async (details) => {
    let date =  details.dateStart.substring(0, 10);
    let time = details.dateStart.substring(11, 19);
    date = moment(date, "YYYY/MM/DD").format("MM-DD-YYYY");
    const recTime = calculateRecTime(details);    
    const urlContent = await fetch(chrome.runtime.getURL('html/card.html'))
    let html = await urlContent.text();
    html = html.replace("{{cardId}}",details.id);
    html = html.replace("{{recName}}",details.name);
    html = html.replace("{{dateHour}}",time);
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
    container.setAttribute('class',"col-lg-3 col-xxl-2 col-md-4 col-sm-12");
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
    // let name = prompt ("Nombre");
    document.getElementById('fabVideo').setAttribute('class','fab-citb active');
    
}

const setNameNewFolder = (event) =>{
    event.preventDefault();
    let name  = document.getElementById('text1').value;
    console.log(name);
    if(name){
        createFolderCard({id:"fake", name: name});
        port.postMessage({addFolder: true, name : name});
    }    
    document.getElementById('text1').value = '';
    document.getElementById('fabVideo').setAttribute('class','fab-citb');
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
  
const search = () =>{
    let searchTerm = document.getElementById('form1').value;
    port.postMessage({searchDriveFiles: true ,searchTerm: searchTerm });
}
document.getElementById('searchButton').addEventListener('click',search);

const updateValue = () =>{
    let value = document.getElementById('form1').value;
    if(value == ""){
        isFirstRender = true;
        getDriveFiles();
    }  
}
document.getElementById('form1').addEventListener('input', updateValue);

document.getElementById('submitVideo').addEventListener('click', setNameNewFolder);

document.getElementById('formPopup').addEventListener('click', (event)=>{
    event.preventDefault();
});

document.getElementById('close-x').addEventListener('click', ()=>{
    document.getElementById('text1').value = '';
    document.getElementById('fabVideo').setAttribute('class','fab-citb');
});

document.getElementById('close-x-delete').addEventListener('click', ()=>{
    document.getElementById('popupDelete').setAttribute('class','fab-citb');
    document.getElementById(idCITBFolder).click();
});

document.getElementById('submitDeletePopup').addEventListener('click',executeRemoveFolder)

getDriveFiles();
startQueue();