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
    document.getElementById(idProgressBar).style.width = value+"%";
    document.getElementById(idProgressBar).innerHTML =  value+"%";

}
const checkUploadStatus = (isFromPageList,id) => {
    setInterval(()=>{
        chrome.storage.sync.get('uploadPercent', function(result) {
            if (result.uploadPercent > 0){
                updateProgressBar(result.uploadPercent,id);
                displayProgressBar();
            }else{
                if(isFromPageList){
                    updateProgressBar(100,id);
                }else{
                    hideProgressBar();
                }
            }
        });
    },1500)
}

export {
    checkUploadStatus
}

