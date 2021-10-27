
//POPUP div
const generatePopupDiv = () => {
   const divPopup = document.createElement("div");
   divPopup.setAttribute("id", "popupRec");
   divPopup.classList.add("popup");
   return divPopup;
}

const generartePopupSpan = () => {
    const spanPopup = document.createElement("span");
    spanPopup.classList.add("popup");
    return spanPopup;
}

const generatePopupButton = () => {
    const buttonPopup = document.createElement("button");
    buttonPopup.className = "CITBButton";
    buttonPopup.classList.add("CITBCamButton");
    return buttonPopup;
}





const createRecPopup = (
    divPopup,
    spanPopup,
    buttonPopup
) => {
    divPopup.appendChild(spanPopup);
    divPopup.appendChild(buttonPopup);
    document.body.appendChild(divPopup);
    divPopup.style.display = "block";
}

export {
    generatePopupDiv,
    generartePopupSpan,
    generatePopupButton,
    createRecPopup

};



