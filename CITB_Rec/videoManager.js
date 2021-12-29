const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})


const readElement = () => {
    fetch(chrome.runtime.getURL('html/card.html')).then(r => r.text()).then(html => {
        const container = document.createElement("div");
        container.setAttribute('class',"col-4");
        const div = escapeHTMLPolicy.createHTML(html);  
        console.log(div);
        container.innerHTML = div;
        document.getElementById('citbCardRecContainer').appendChild(container);
    });

}

readElement();