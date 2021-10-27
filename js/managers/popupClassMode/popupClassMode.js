import { enviroment } from "../../enviroment.js";
const divOverlay = () =>{
    const overlayDiv = document.createElement("div");
    overlayDiv.setAttribute("id", "overlay");
    return overlayDiv;
}

const divFab = () => {
    const favDiv = document.createElement("div");
    favDiv.setAttribute("id", "fab");
    favDiv.setAttribute("class", "fab");
    return favDiv;
};

const formWrapper = () => {
    const form = document.createElement("form");
    form.setAttribute("class", "cntt-wrapper");
    return form;
};

const divHeader = () => {
    const divHeader = document.createElement("div");
    divHeader.setAttribute("id", "fab-hdr");
    return divHeader;
};

const hHeader = () => {
    const h3Header = document.createElement("h3");
    h3Header.textContent = enviroment.textHeaderSelectMicClassMode;
    return h3Header;
};

const divContent = () => {
    const contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "cntt");
    return contentDiv;
};

const divTextFields = () => {
    const textFieldsDiv = document.createElement("div");
    textFieldsDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label");
    return textFieldsDiv;
};

const selectMic = () => {
    const select_Mic = document.createElement("select");
    select_Mic.setAttribute("id", "text1");
    select_Mic.setAttribute("class", "mdl-textfield__input");
    select_Mic.setAttribute("type", "text");
    return select_Mic;
};

const labelText = () => {
    const textLabel = document.createElement("label");
    textLabel.setAttribute("for", "text1");
    textLabel.setAttribute("class", "mdl-selectfield__label");
    return textLabel;
};

const divButton = () => {
    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "btn-wrapper");
    return buttonDiv;
};
const buttonSelect = () => {
    const buttonDiv = document.createElement("button");
    buttonDiv.setAttribute("id", "submit");
    buttonDiv.setAttribute("class", "mdl-button mdl-js-button mdl-button--primary");
    buttonDiv.innerText = "Select";
    return buttonDiv;
};

const addOptionsToSelect = (select,usableMics) =>{
    usableMics.forEach(element => {
        var option = document.createElement("option");
        option.setAttribute('class','mdl-menu__item');
        option.text = element.label;
        option.value = element.deviceId;
        select.add(option);

    });
}


const createPopup = (
    divOverlay,
    divFab,
    formWrapper,
    divHeader,
    hHeader,
    divContent,
    divTextFields,
    select_Mic,
    labelText,
    divButton,
    buttonSelect,
    usableMics
  ) => {
    addOptionsToSelect(select_Mic,usableMics);
    divFab.setAttribute('class', 'fab active');
    divOverlay.setAttribute('class','dark-overlay');
    document.body.appendChild(divOverlay);
    document.body.appendChild(divFab);
    divFab.appendChild(formWrapper);
    formWrapper.appendChild(divHeader);
    divHeader.appendChild(hHeader);
    formWrapper.appendChild(divContent);
    divContent.appendChild(divTextFields);
    divTextFields.appendChild(select_Mic);
    divTextFields.appendChild(labelText);
    divContent.appendChild(divButton);
    divButton.appendChild(buttonSelect);
};

const setButtonCallBack = (buttonSelect,functionCallBack)=>{
    buttonSelect.addEventListener('click',functionCallBack);
}


export {
    divOverlay,
    divFab,
    formWrapper,
    divHeader,
    hHeader,
    divContent,
    divTextFields,
    selectMic,
    labelText,
    divButton,
    buttonSelect,
    createPopup,
    setButtonCallBack
}