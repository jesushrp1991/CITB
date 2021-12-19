const displayProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'block';
}

const hideProgressBar = () =>{
    document.getElementById('progreesBarContainer').style.display = 'none';
}

const updateProgressBar = (value) => {
    console.log(value,typeof(value));

    document.getElementById('progressBar').style.width = value;
    document.getElementById('progressBar').innerHTML =  value+"%";

}
const checkUploadStatus = () => {
    setInterval(()=>{
        console.log("timeout check upload")
        chrome.storage.sync.get('uploadPercent', function(result) {
            if (result.uploadPercent > 0){
                updateProgressBar(result.uploadPercent);
                displayProgressBar();
            }
            if(result.uploadProgress >= 99 || result.uploadProgress == 0 ){
                hideProgressBar();
            }
        });
    },1500)
}

export {
    checkUploadStatus
}

