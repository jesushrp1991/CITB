import { getAllVideos } from "./backService.js";

const createListForFrontend = async(list,carpetaBase) =>{
    let listResult = [];
    if(carpetaBase == 'root'){
        for (const element of list) {            
            if(element.mimeType == "application/vnd.google-apps.folder"){
                let shareLink = "https://drive.google.com/file/d/" + element.id +  "/view?usp=sharing";                
                let details = {
                id: element.id 
                ,name: element.name
                ,dateStart: element.createdTime
                ,dateEnd: null
                ,driveLink : shareLink
                ,upload: "folder"
                ,msDuration: null
                ,thumbnailLink: null
                }
                listResult.push(details);
            }
        }      
    }
    else{
        for (const element of list) {
            if(element.mimeType == 'video/webm'){
                let shareLink = "https://drive.google.com/file/d/" + element.id +  "/view?usp=sharing";
                let durationMillis;
                let thumbnail;
                let id = await getIdFromBack(element.id);
                console.log(element.id,id);
                if( element.videoMediaMetadata ){
                    durationMillis = element.videoMediaMetadata.durationMillis
                }else{
                    const initDate = dayjs(window.startTimeCurrentFile);
                    const endDate = dayjs(window.endTimeCurrentFile);
                    let millisecond = endDate.diff(initDate,"millisecond",true);
                    durationMillis = millisecond;
                }
                element.thumbnailLink ?
                     thumbnail= element.thumbnailLink
                    :thumbnail= window.thumbnailForFileInProgress;
                
                let details = {
                    id: id
                    ,name: element.name
                    ,dateStart: element.createdTime
                    ,dateEnd: null
                    ,driveLink : shareLink
                    ,upload: "uploaded"
                    ,msDuration: durationMillis
                    ,thumbnailLink: thumbnail
                }
                listResult.push(details);
            }
        }
    }
    return listResult.reverse();
}

const getIdFromBack = async (idDrive) => {
    let videosBack = await getAllVideos(window.dbToken);
    for (let index = 0; index < videosBack.length; index++) {
        if(videosBack[index].videoLink == idDrive){
            return videosBack[index]._id;
        }    
    }
    return idDrive;
}

const recIcon = () =>{
    window.iconRecChange = setInterval(()=>{
        chrome.browserAction.setIcon({path: "./assets/recOn.svg"});
        setTimeout(()=>{
            chrome.browserAction.setIcon({path: "./assets/recOff.svg"});
        },500);        
    },1000);
    window.iconRecChange;
}


const filterModifiableCalendars = (calendarList) =>{
    let result = [];
    calendarList.forEach(element => {
        if(element.accessRole == 'owner' || element.accessRole == 'writer'){
            result.push(element);
        }
    });
    return result;
}

const stopTracks = () => {
    window.desktopStream.getTracks().forEach((track) => track.stop());
    if (window.micStream != undefined) {
      window.micStream.getTracks().forEach((track) => track.stop());
    }
    if (window.videoDesktopStream != undefined) {
      window.videoDesktopStream.getTracks().forEach((track) => track.stop());
    }
    window.resultStream.getTracks().forEach((track) => track.stop());
  };

const openRecList = () => {  
    chrome.tabs.getAllInWindow(undefined,(tabs) => {
        for (var i = 0, tab; tab = tabs[i]; i++) {
        if (tab.url && tab.url.includes('videoManager.html')) {
            chrome.tabs.update(tab.id, {selected: true});
            return;
        }
        }
        chrome.tabs.create({ url: chrome.extension.getURL('videoManager.html') });  
    });
}
export {
    createListForFrontend
    ,recIcon
    ,filterModifiableCalendars
    ,stopTracks
    ,openRecList
}