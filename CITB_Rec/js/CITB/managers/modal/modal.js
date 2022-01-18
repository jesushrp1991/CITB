const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})

let popupContent = "";
let popupEditedContent = "";
let popupElement; 
let overlayElement;
let container = document.createElement("div");
const initPopup = () => {
    document.addEventListener('simplePopup', function (e) {
        popupContent = e.detail;    
    }); 
    
}

const showPopup = (color, title, content, button) => {
    popupEditedContent = popupContent;
    popupEditedContent = popupEditedContent.replace("{{color}}", color);
    popupEditedContent = popupEditedContent.replace("{{title}}", title);
    popupEditedContent = popupEditedContent.replace("{{content}}", content);
    popupEditedContent = popupEditedContent.replace("{{button}}", button);
    const htmlContent = escapeHTMLPolicy.createHTML(popupEditedContent);
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    popupElement = document.getElementById("favCustom");
    overlayElement = document.getElementById("overlay");
    popupElement.classList.add("active");
    overlayElement.classList.add("dark-overlay");
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
    showPopup
}