import { enviroment } from "../../enviroment.js";
const divOverlayVideo = () =>{
    const overlayDiv = document.createElement("div");
    overlayDiv.setAttribute("id", "overlay");
    return overlayDiv;
}

const divFabVideo = () => {
    const favDiv = document.createElement("div");
    favDiv.setAttribute("id", "fab");
    favDiv.setAttribute("class", "fab");
    return favDiv;
};

const formWrapperVideo = () => {
    const form = document.createElement("form");
    form.setAttribute("class", "cntt-wrapper");
    return form;
};

const divHeaderVideo = () => {
    const divHeader = document.createElement("div");
    divHeader.setAttribute("id", "fab-hdr-video");
    // divHeader.appendChild(buttonCloseVideo());
    return divHeader;
};
const headerCloseVideo = () => {
    const headerClose = document.createElement("span");
    headerClose.setAttribute("class", "close-button topright");
    headerClose.innerText = "x";
    return headerClose;
};

const hHeaderVideo = () => {
    const h3Header = document.createElement("h3");
    h3Header.textContent = enviroment.textHeaderSelectVideo;
    return h3Header;
};

const buttonCloseVideo = () => {
    const button = document.createElement("button");
    button.setAttribute("id", "fab-hdr-video-button");
    button.textContent = "X";
    return button;
}

const divContentVideo = () => {
    const contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "cntt");
    return contentDiv;
};

const classIconVideo = () => {
    const classIcon = document.createElement("button");
    classIcon.setAttribute("id", "classModalIcon");
    classIcon.setAttribute("class", "CITBCamButton active");
    return classIcon;
};

const divTextFieldsVideo = () => {
    const textFieldsDiv = document.createElement("div");
    textFieldsDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label textFields");
    return textFieldsDiv;
};

const selectMicVideo = () => {
    const select_Mic = document.createElement("select");
    select_Mic.setAttribute("id", "text1");
    select_Mic.setAttribute("class", "mdl-textfield__input");
    select_Mic.setAttribute("type", "text");
    return select_Mic;
};

const labelTextVideo = () => {
    const textLabel = document.createElement("label");
    textLabel.setAttribute("for", "text1");
    textLabel.setAttribute("class", "mdl-selectfield__label");
    return textLabel;
};

const divButtonVideo = () => {
    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "btn-wrapper");
    return buttonDiv;
};

const buttonSelectVideo = () => {
    const buttonDiv = document.createElement("button");
    buttonDiv.setAttribute("id", "submitVideo");
    buttonDiv.setAttribute("class", "mdl-button mdl-js-button mdl-button--primary");
    buttonDiv.innerText = "Seleccionar";
    return buttonDiv;
};

const addOptionsToSelectVideo = (select,usableMics) =>{
    while (select.options.length > 0) {                
        select.remove(0);
    }  
    usableMics.forEach(element => {
        var option = document.createElement("option");
        option.setAttribute('class','mdl-menu__item');
        option.text = element.label;
        option.value = element.deviceId;
        select.add(option);

    });
}


const createPopupVideo = (
    divOverlay,
    divFab,
    formWrapper,
    divHeader,
    headerCloseVideo,
    hHeader,
    divContent,
    classIcon,
    divTextFields,
    select_Mic,
    divButton,
    labelCheckBox,
    buttonSelect,
    br,
    usableMics
  ) => {
    addOptionsToSelectVideo(select_Mic,usableMics);
    divFab.appendChild(formWrapper);
    formWrapper.appendChild(divHeader);
    divHeader.appendChild(headerCloseVideo);
    divHeader.appendChild(hHeader);
    formWrapper.appendChild(divContent);
    divContent.appendChild(classIcon);
    divContent.appendChild(divTextFields);
    divTextFields.appendChild(select_Mic);
    divTextFields.appendChild(br);
    divTextFields.appendChild(labelCheckBox);
    divContent.appendChild(divButton);
    divButton.appendChild(buttonSelect);
    divFab.setAttribute('class', 'fab active');
    divOverlay.setAttribute('class','dark-overlay');
    document.body.appendChild(divOverlay);
    document.body.appendChild(divFab);

};

const setButtonCallBackVideo = (buttonSelect,headerCloseVideo,functionCallBack)=>{
    buttonSelect.addEventListener('click',functionCallBack);
    headerCloseVideo.addEventListener('click',functionCallBack);
}


export {
    divOverlayVideo,
    divFabVideo,
    formWrapperVideo,
    divHeaderVideo,
    headerCloseVideo,
    hHeaderVideo,
    divContentVideo,
    classIconVideo,
    divTextFieldsVideo,
    selectMicVideo,
    labelTextVideo,
    divButtonVideo,
    buttonCloseVideo,
    buttonSelectVideo,
    createPopupVideo,
    setButtonCallBackVideo
}