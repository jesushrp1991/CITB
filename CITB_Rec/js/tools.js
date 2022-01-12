const createListForFrontend = (list,carpetaBase) =>{
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
                element.videoMediaMetadata ?
                     durationMillis = element.videoMediaMetadata.durationMillis
                    : durationMillis = 128000; //ficticial duration.
                console.log("TOOLSwindow.thumbnailForFileInProgress",window.thumbnailForFileInProgress)
                element.thumbnailLink ?
                     thumbnail= element.thumbnailLink
                    :thumbnail= window.thumbnailForFileInProgress;
                
                let details = {
                    id: element.id 
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
    return listResult;
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

export {
    createListForFrontend
    ,recIcon
}