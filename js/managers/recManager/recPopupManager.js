
//POPUP WRAPPER
const generatePopupWrapper = () => {
   const pWrap = document.createElement("div");
   pWrap.setAttribute('id', 'popwrap');
   return pWrap;
}

//POPUP BOX
const generatePopupBox = () => {
    const pBox = document.createElement("div");
    pBox.setAttribute('id', 'popbox');
    return pBox;
}

// POPUP TITLE
const generatePopupTitle = () => {
   const pTitle = document.createElement("h1");
   pTitle.setAttribute('id', 'poptitle');
   return pTitle;
}

// POPUP TEXT
const generatePopupText = () => {
    var pText = document.createElement("p");
    pText.setAttribute('id', 'poptext');
    return pText;
}

// POPUP CLOSE BUTTON
const generatePopupClose = () => {
    const pClose = document.createElement("div");
    pClose.setAttribute('id', 'popclose');
    pClose.innerHTML = "&#9746;";
    return  pClose;
}

const createRecPopup = (
    popwrap,
    popbox,
    poptitle,
    poptext,
    popclose
) => {
    document.body.appendChild(popwrap);
    popwrap.appendChild(popbox);
    popbox.appendChild(poptitle);
    popbox.appendChild(poptext);
    popbox.appendChild(popclose);
}

export {
    generatePopupWrapper,
    generatePopupBox,
    generatePopupTitle,
    generatePopupText,
    generatePopupClose,
    createRecPopup

};



