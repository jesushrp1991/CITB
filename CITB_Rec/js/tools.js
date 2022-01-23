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
    return listResult.reverse();
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


const compareWhitCache = (newArray) => {
    //window.cache;
    let cache = window.cache;
    //list of new objets
    let newObjects = cache.filter(o1 => !newArray.some(o2=> o1.id === o2.id));
    let deletedObjects = newArray.filter(o1 => !cache.some(o2=> o1.id === o2.id));

    return [...newObjects,...deletedObjects];
}

const addToCache = (newArray,idFolder) => {
    let cache = window.cache;
    
    let exits = false;
    cache.forEach((element,index) => {
        if(element.id == idFolder){
            cache[index].files = newArray;
            exits = true;
        } 
    });
    if(!exits){
        cache.push({id:idFolder,files:newArray});
    }
    window.cache = cache;
}

const filterModifiableCalendars = (calendarList) =>{
    let result = [];
    calendarList.forEach(element => {
        if(element.accessRole == 'owner'){
            result.push(element);
        }
    });
    return result;
}

export {
    createListForFrontend
    ,recIcon
    ,compareWhitCache
    ,filterModifiableCalendars
}