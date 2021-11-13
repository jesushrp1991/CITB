import { enviroment } from "../../enviroment.js";

const divOverlayMic= () =>{
    const overlayDiv = document.createElement("div");
    overlayDiv.setAttribute("id", "overlay");
    return overlayDiv;
}

const divFabMic= () => {
    const favDiv = document.createElement("div");
    favDiv.setAttribute("id", "fab");
    favDiv.setAttribute("class", "fabsimple");
    return favDiv;
};

const formWrapperMic= () => {
    const form = document.createElement("form");
    form.setAttribute("class", "cntt-wrapper");
    return form;
};

const divHeaderMic= () => {
    const divHeader = document.createElement("div");
    divHeader.setAttribute("id", "fab-hdr-video");
    // divHeader.appendChild(buttonCloseVideo());
    return divHeader;
};
const headerCloseMic= () => {
    const headerClose = document.createElement("span");
    headerClose.setAttribute("class", "close-button topright");
    headerClose.innerText = "x";
    return headerClose;
};

const hHeaderMic= () => {
    const h3Header = document.createElement("h3");
    h3Header.textContent = "Alert!";
    return h3Header;
};

const divContentMic= () => {
    const contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "cntt");
    return contentDiv;
};

const classIconMic= () => {
    const classIcon = document.createElement("button");
    classIcon.setAttribute("id", "classModalIcon");
    classIcon.setAttribute("class", "CITBCamButton active");
    return classIcon;
};

const divTextFieldsMic= () => {
    const textFieldsDiv = document.createElement("div");
    textFieldsDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label textFields");
    return textFieldsDiv;
};

const labelTextMic= (text) => {
    const textLabel = document.createElement("p");
    textLabel.setAttribute("for", "text1");
    textLabel.setAttribute("class", "mdl-selectfield__label");
    textLabel.innerText = text
    return textLabel;
};

const divButtonMic= () => {
    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "btn-wrapper");
    return buttonDiv;
};

const createPopupMic= (
    divOverlay,
    divFab,
    formWrapper,
    divHeader,
    headerClosePopup,
    hHeader,
    divContent,
    classIcon,    
    divTextFields,
    label_TextPopup,
    divButton,    
    br,
  ) => {
    divFab.appendChild(formWrapper);
    formWrapper.appendChild(divHeader);
    divHeader.appendChild(headerClosePopup);
    divHeader.appendChild(hHeader);
    formWrapper.appendChild(divContent);      
    divContent.appendChild(divTextFields);
    divTextFields.appendChild(br);
    divTextFields.appendChild(label_TextPopup);
    divContent.appendChild(divButton);    
    divFab.setAttribute('class', 'fabsimple active');
    divOverlay.setAttribute('class','dark-overlay');
    document.body.appendChild(divOverlay);
    document.body.appendChild(divFab);

};

const setButtonCallBackMic= (  headerClosePopup,functionCallBack)=>{    
    headerClosePopup.addEventListener('click',functionCallBack);
}


export {
    divOverlayMic,
    divFabMic,
    formWrapperMic,
    divHeaderMic,
    headerCloseMic,
    hHeaderMic,
    divContentMic,
    classIconMic,
    divTextFieldsMic,     
    labelTextMic,
    divButtonMic,    
    createPopupMic,
    setButtonCallBackMic
}