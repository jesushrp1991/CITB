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
    let aTag = document.getElementById("collado");
    console.log("imgCount",imgCount);
    if(imgCount == 7){
        aTag.text = "Cerrar";
    }else if(imgCount >= 8){
        console.log("Cerrar!!!")
        parent.closeIFrame();
    }else{
        imgTag.src = chrome.runtime.getURL (`helper/img/${imgCount}.png`);
    }
    window.imgCount ++;
}


helpFunction();