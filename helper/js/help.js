window.imgCount = 2;
const helpFunction = () => {
    let collado = document.getElementById("collado");
    console.log("collado",collado);
    collado.addEventListener("click",()=>{
        changeImg(window.imgCount);
    })
}
const changeImg = (imgCount) =>{
    let imgTag = document.getElementById("imgTag");
    console.log("imgCount",imgCount);
    if(imgCount >= 8){
        console.log("Entró");
        parent.closeIFrame();
    }else{
        imgTag.src = chrome.runtime.getURL (`helper/img/${imgCount}.png`);
    }
    window.imgCount ++;
}


helpFunction();