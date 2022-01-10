const createListForFrontend = (list,base) =>{
    let listResult = [];
    if(base == 'root'){
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
                let details = {
                id: element.id 
                ,name: element.name
                ,dateStart: element.createdTime
                ,dateEnd: null
                ,driveLink : shareLink
                ,upload: "uploaded"
                ,msDuration: element.videoMediaMetadata.durationMillis
                ,thumbnailLink: element.thumbnailLink
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