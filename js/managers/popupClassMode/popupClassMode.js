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

const headerClose = () => {
    const headerClose = document.createElement("span");
    headerClose.setAttribute("class", "close-button topright");
    headerClose.innerText = "x";
    return headerClose;
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

const classIcon = () => {
    const classIcon = document.createElement("button");
    classIcon.setAttribute("id", "classModalIcon");
    classIcon.setAttribute("class", "CITBClassButton active");
    return classIcon;
};
const classDescriptionText = () => {
    const classDescriptionText = document.createElement("p");
    classDescriptionText.setAttribute("id", "DescriptionText");
    classDescriptionText.setAttribute("class", "classDescriptionText");
    classDescriptionText.innerText = 'The '
    return classDescriptionText;
};

const CITBc = () => {
    const classDescriptionText = document.createElement("mark");
    classDescriptionText.setAttribute("class", "mark blue");
    classDescriptionText.innerText = 'C'
    return classDescriptionText;
};
const CITBi = () => {
    const classDescriptionText = document.createElement("mark");
    classDescriptionText.setAttribute("class", "mark red");
    classDescriptionText.innerText = 'I'
    return classDescriptionText;
};
const CITBt = () => {
    const classDescriptionText = document.createElement("mark");
    classDescriptionText.setAttribute("class", "mark yellow");
    classDescriptionText.innerText = 'T'
    return classDescriptionText;
};
const CITBb = () => {
    const classDescriptionText = document.createElement("mark");
    classDescriptionText.setAttribute("class", "mark green");
    classDescriptionText.innerText = 'B'
    return classDescriptionText;
};

const classDescriptionText1 = () => {
    const classDescriptionText = document.createElement("p");
    classDescriptionText.setAttribute("class", "classDescriptionText");
    classDescriptionText.innerText = ' microphone is muted.'
    return classDescriptionText;
};
const classDescriptionText2 = () => {
    const classDescriptionText = document.createElement("p");
    // classDescriptionText.setAttribute("class", "classDescriptionText2");
    classDescriptionText.innerText = ' Now select the microphone you want everybody to talk through'
    return classDescriptionText;
};

const divTextFields = () => {
    const textFieldsDiv = document.createElement("div");
    textFieldsDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label textFields");
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
const checkboxSelect = () => {
    const buttonDiv = document.createElement("input");
    buttonDiv.setAttribute("id", "checkbox");
    buttonDiv.setAttribute("type", "checkbox");
    buttonDiv.setAttribute("class", "mdl-checkbox__input");
    return buttonDiv;
};

const labelCheckBox = () => {
    const textLabel = document.createElement("label");
    textLabel.setAttribute("for", "checkbox");
    textLabel.setAttribute("class", "mdl-selectfield__label");
    textLabel.innerText = "Don't show again.";
    return textLabel;
};

const buttonSelect = () => {
    const buttonDiv = document.createElement("button");
    buttonDiv.setAttribute("id", "submit");
    buttonDiv.setAttribute("class", "mdl-button mdl-js-button mdl-button--primary");
    buttonDiv.innerText = "Seleccionar";
    return buttonDiv;
};

const addOptionsToSelect = (select,usableMics) =>{
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


const createPopup = (
    divOverlay,
    divFab,
    formWrapper,
    divHeader,
    headerClose,
    hHeader,
    divContent,
    classIcon,
    divTextFields,
    select_Mic,
    labelText,
    divButton,
    checkboxSelect,
    labelCheckBox,
    buttonSelect,
    br,
    usableMics
  ) => {
    addOptionsToSelect(select_Mic,usableMics);
    divFab.appendChild(formWrapper);
    formWrapper.appendChild(divHeader);
    divHeader.appendChild(headerClose);
    divHeader.appendChild(hHeader);
    formWrapper.appendChild(divContent);
    divContent.appendChild(classIcon);
    divContent.appendChild(divTextFields);

    let exitsDescriptionText = document.getElementById('DescriptionText');
    if(exitsDescriptionText == null || exitsDescriptionText == undefined){
        let pTag = classDescriptionText();
        let CITB_c = CITBc();
        let CITB_i = CITBi();
        let CITB_t = CITBt();
        let CITB_b = CITBb();
        let pTag1 = classDescriptionText1();
        let pTag2 = classDescriptionText2();
        divTextFields.appendChild(pTag);
        divTextFields.appendChild(CITB_c);
        divTextFields.appendChild(CITB_i);
        divTextFields.appendChild(CITB_t);
        divTextFields.appendChild(CITB_b);
        divTextFields.appendChild(pTag1);
        divTextFields.appendChild(pTag2);
    }
    divTextFields.appendChild(select_Mic);
    divTextFields.appendChild(labelText);
    divTextFields.appendChild(br);
    divTextFields.appendChild(checkboxSelect);
    divTextFields.appendChild(labelCheckBox);
    divContent.appendChild(divButton);
    divButton.appendChild(buttonSelect);
    divFab.setAttribute('class', 'fab active');
    divOverlay.setAttribute('class','dark-overlay');
    document.body.appendChild(divOverlay);
    document.body.appendChild(divFab);

};

const setButtonCallBack = (buttonSelect,functionCallBack)=>{
    buttonSelect.addEventListener('click',functionCallBack);
}


export {
    divOverlay,
    divFab,
    formWrapper,
    divHeader,
    headerClose,
    hHeader,
    divContent,
    classIcon,
    divTextFields,
    selectMic,
    labelText,
    divButton,
    checkboxSelect,
    labelCheckBox,
    buttonSelect,
    createPopup,
    setButtonCallBack
}