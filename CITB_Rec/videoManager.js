const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})
let container = document.createElement("div");
container.setAttribute('class',"col-4");

const readElement = () => {
    fetch(chrome.runtime.getURL('html/card.html')).then(r => r.text()).then(html => {
        console.log(html);
        // return html;
        var div = escapeHTMLPolicy.createHTML(html);  
        // Change this to div.childNodes to support multiple top-level nodes
        // return div.firstChild;
        console.log(div);
        container.innerHTML = div;
        document.getElementById('citbCardRecContainer').appendChild(container); 
    });

}

const createElementFromHTML = async() => {
    let cardHTML = await readElement();
    console.log(cardHTML);
    
    var div = escapeHTMLPolicy.createHTML(popupEditedContent);  
    // Change this to div.childNodes to support multiple top-level nodes
    // return div.firstChild;
    console.log(div);
    document.getElementById('citbCardRecContainer').appendChild(div.childNodes); 
  }

// createElementFromHTML();
readElement();
readElement();