const displayProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'block';
}

const hideProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'none';
}

const updateProgressBar = (value) => {
    document.getElementById('progressBar').style.width = value+"%";
    document.getElementById('progressBar').innerHTML =  value+"%";

}
const checkUploadStatus = () => {
    setInterval(()=>{
        chrome.storage.sync.get('uploadPercent', function(result) {
            if (result.uploadPercent > 0){
                updateProgressBar(result.uploadPercent);
                displayProgressBar();
            }else{
                hideProgressBar();
            }
        });
    },1500)
}

export {
    checkUploadStatus
}

