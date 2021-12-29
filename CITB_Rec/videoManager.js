const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
})


const createRecordCard = () => {
    fetch(chrome.runtime.getURL('html/card.html')).then(r => r.text()).then(html => {
        html = html.replace("{{cardId}}","id1");
        html = html.replace("{{recName}}","Collado");
        const container = document.createElement("div");
        container.setAttribute('class',"col-4");
        const div = escapeHTMLPolicy.createHTML(html);  
        container.innerHTML = div;
        document.getElementById('citbCardRecContainer').appendChild(container);
    });
}

const waitingForRec = () => {
    chrome.storage.sync.get('newRecord', (result) => {        
        createRecordCard();
    });
}

setInterval(waitingForRec,5000);