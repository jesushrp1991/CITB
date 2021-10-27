
//POPUP div
const generatePopupDiv = () => {
   const divPopup = document.createElement("div");
   divPopup.setAttribute("id", "popup");
   divPopup.classList.add("cpopup");
   return divPopup;
}

const generartePopupSpan = () => {
    const spanPopup = document.createElement("span");
    spanPopup.classList.add("popup");
    return spanPopup;
}

const generatePopupButtonScreem = () => {
    const buttonPopup = document.createElement("button");
    divPopup.setAttribute("id", "buttonScreem");
    buttonPopup.className = "CITBButton";
    buttonPopup.classList.add("CITBCamButton");
    return buttonPopup;
}

const generatePopupButtonCam = () => {
    const buttonPopup = document.createElement("button");
    divPopup.setAttribute("id", "buttonScreem");
    buttonPopup.className = "CITBButton";
    buttonPopup.classList.add("CITBCamButton");
    return buttonPopup;
}





const createRecPopup = (
    divPopup,
    spanPopup,
    buttonScreemPopup,
    buttonCamPopup
    
) => {
    divPopup.appendChild(spanPopup);
    spanPopup.appendChild(buttonScreemPopup);
    spanPopup.appendChild(buttonCamPopup);
    document.body.appendChild(divPopup);
    
}

export {
    generatePopupDiv,
    generartePopupSpan,
    generatePopupButtonScreem,
    generatePopupButtonCam,
    createRecPopup

};



