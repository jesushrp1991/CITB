const displayProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'block';
}

const hideProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'none';
}

const updateProgressBar = (value,id) => {
    let idProgressBar = 'progressBar';
    if(id){
        idProgressBar = idProgressBar + id
    }
    console.log(idProgressBar,value);
    document.getElementById(idProgressBar).style.width = value+"%";
    document.getElementById(idProgressBar).innerHTML =  value+"%";

}
const checkUploadStatus = (isFromPageList,id) => {
    let interval = setInterval(()=>{
                    chrome.storage.sync.get('uploadPercent', (result) => {
                        if (result.uploadPercent > 0){
                            updateProgressBar(result.uploadPercent,id);
                            displayProgressBar();
                        }else{
                            if (result.uploadPercent == -1){
                                updateProgressBar(100,id);
                            }else if (isFromPageList){
                                updateProgressBar(2,id);
                            }else{
                                hideProgressBar();
                            }
                        }
                    });
                },1500);
    return interval;

}

export {
    checkUploadStatus,
    updateProgressBar
}

