const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})

let popupContent = "";
let popupEditedContent = "";
let popupElement; 
let overlayElement;
let container = document.createElement("div");

let formPopupContent = "";
let formPopupEditedContent = "";
let formPopupElement; 
let formOverlayElement;

const initPopup = () => {
    document.addEventListener('simplePopup', function (e) {
        console.log("e1",e);
        popupContent = e.detail;    
    });    
    
    document.addEventListener('formPopup', function (e) {
        console.log("e",e);
        formPopupContent = e.detail;    
    });    
}

const showPopup = (color, title, content, button) => {
    popupEditedContent = popupContent;
    popupEditedContent = popupEditedContent.replace("{{color}}", color);
    popupEditedContent = popupEditedContent.replace("{{title}}", title);
    popupEditedContent = popupEditedContent.replace("{{content}}", content);
    popupEditedContent = popupEditedContent.replace("{{button}}", button);
    const htmlContent = escapeHTMLPolicy.createHTML(popupEditedContent);
    console.log(popupEditedContent);

    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    popupElement = document.getElementById("favCustom");
    overlayElement = document.getElementById("overlay");
    popupElement.classList.add("active");
    overlayElement.classList.add("dark-overlay");
    document.getElementById("modalCloseButton").addEventListener("click", hidePopup);
    document.getElementById("modalSubmitButton").addEventListener("click", hidePopup)

}

const createSelectOptions = (usableVideo) =>{
    let optionsString = " ";
    usableVideo.forEach(element => {
        optionsString = optionsString + "<option class=\"mdl-menu__item\" value=" + element.deviceId + "\"" + ">" + element.label + "</option>"
    });
    return optionsString;
}

const showFormPopup = (color, title, usableVideo, seleccionar) => {
    console.log("FormPopup",formPopupContent)
    formPopupEditedContent = formPopupContent;
    formPopupEditedContent = formPopupEditedContent.replace("{{color}}", color);
    formPopupEditedContent = formPopupEditedContent.replace("{{title}}", title);
    formPopupEditedContent = formPopupEditedContent.replace("{{seleccionar}}", seleccionar);
    let options = createSelectOptions(usableVideo);
    console.log("Options",options);
    formPopupEditedContent = formPopupEditedContent.replace("{{dropdown}}", options);
    console.log("formPopupEditedContent",formPopupEditedContent);
    const htmlContent = escapeHTMLPolicy.createHTML(formPopupEditedContent);
    console.log(htmlContent);
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    formPopupElement = document.getElementById("favCustom");
    formOverlayElement = document.getElementById("overlay");
    formPopupElement.classList.add("active");
    formOverlayElement.classList.add("dark-overlay");
    document.getElementById("modalCloseButton").addEventListener("click", hidePopup);
    document.getElementById("modalSubmitButton").addEventListener("click", hidePopup)
    
}

const hidePopup = (e) => {
    if (e) {
        e.preventDefault();

    }
    popupEditedContent = popupContent;
    popupElement.classList.remove("active");
    overlayElement.classList.remove("dark-overlay");
    container.innerHTML = escapeHTMLPolicy.createHTML("");
    document.body.removeChild(container);
    popupElement = undefined;
    overlayElement = undefined;
}

export {
    initPopup,
    showPopup,
    showFormPopup
}