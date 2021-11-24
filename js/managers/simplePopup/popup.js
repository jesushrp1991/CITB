import { enviroment } from "../../enviroment.js";
const divOverlayPopup= () =>{
    const overlayDiv = document.createElement("div");
    overlayDiv.setAttribute("id", "overlay");
    return overlayDiv;
}

const divFabPopup= () => {
    const favDiv = document.createElement("div");
    favDiv.setAttribute("id", "fab");
    favDiv.setAttribute("class", "fabsimple");
    return favDiv;
};

const formWrapperPopup= () => {
    const form = document.createElement("form");
    form.setAttribute("class", "cntt-wrapper");
    return form;
};

const divHeaderPopup= () => {
    const divHeader = document.createElement("div");
    divHeader.setAttribute("id", "fab-hdr-video");
    // divHeader.appendChild(buttonCloseVideo());
    return divHeader;
};
const headerClosePopup= () => {
    const headerClose = document.createElement("span");
    headerClose.setAttribute("class", "close-button topright");
    headerClose.innerText = "x";
    return headerClose;
};

const hHeaderPopup= () => {
    const h3Header = document.createElement("h3");
    h3Header.textContent = "Alert!";
    return h3Header;
};

const divContentPopup= () => {
    const contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "cntt");
    return contentDiv;
};

const classIconPopup= () => {
    const classIcon = document.createElement("button");
    classIcon.setAttribute("id", "classModalIcon");
    classIcon.setAttribute("class", "CITBCamButton active");
    return classIcon;
};

const divTextFieldsPopup= () => {
    const textFieldsDiv = document.createElement("div");
    textFieldsDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label textFields");
    return textFieldsDiv;
};

const labelTextPopup= () => {
    const textLabel = document.createElement("p");
    textLabel.setAttribute("for", "text1");
    textLabel.setAttribute("class", "mdl-selectfield__label");
    textLabel.innerText = enviroment.messageRestartConference
    return textLabel;
};

const divButtonPopup= () => {
    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "btn-wrapper");
    return buttonDiv;
};

const buttonSelectPopup= () => {
    const buttonDiv = document.createElement("button");
    buttonDiv.setAttribute("id", "submitVideo");
    buttonDiv.setAttribute("class", "mdl-button mdl-js-button mdl-button--primary");
    buttonDiv.innerText = "Restart";
    return buttonDiv;
};

const createPopupPopup= (
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
    buttonSelect,
    br
  ) => {
    divFab.appendChild(formWrapper);
    formWrapper.appendChild(divHeader);
    divHeader.appendChild(headerClosePopup);
    divHeader.appendChild(hHeader);
    formWrapper.appendChild(divContent);
    // divContent.appendChild(classIcon);
    divContent.appendChild(divTextFields);
    divTextFields.appendChild(br);
    divTextFields.appendChild(label_TextPopup);
    divContent.appendChild(divButton);
    divButton.appendChild(buttonSelect);
    divFab.setAttribute('class', 'fabsimple active');
    divOverlay.setAttribute('class','dark-overlay');
    document.body.appendChild(divOverlay);
    document.body.appendChild(divFab);

};

const setButtonCallBackSimplePopup= (buttonSelect,headerClosePopup,functionCallBack)=>{
    buttonSelect.addEventListener('click',functionCallBack);
    headerClosePopup.addEventListener('click',functionCallBack);
}


export {
    divOverlayPopup,
    divFabPopup,
    formWrapperPopup,
    divHeaderPopup,
    headerClosePopup,
    hHeaderPopup,
    divContentPopup,
    classIconPopup,
    divTextFieldsPopup,
    // selectMicPopup,
    labelTextPopup,
    divButtonPopup,
    buttonSelectPopup,
    createPopupPopup,
    setButtonCallBackSimplePopup
}