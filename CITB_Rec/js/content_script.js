
    overlayDiv = document.createElement("div");
    overlayDiv.setAttribute("id", "overlay");

     favDiv = document.createElement("div");
    favDiv.setAttribute("id", "fabVideo");
    favDiv.setAttribute("class", "fab active");

     form = document.createElement("form");
    form.setAttribute("class", "cntt-wrapper");

     divHeader = document.createElement("div");
    divHeader.setAttribute("id", "fab-hdr-video");

     headerClose = document.createElement("span");
    headerClose.setAttribute("class", "close-button topright");
    headerClose.innerText = "x";

     h3Header = document.createElement("h3");
    h3Header.textContent = "CITB";

     button = document.createElement("button");
    button.setAttribute("id", "fab-hdr-video-button");
    button.textContent = "X";

     contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "cntt");

     classIcon = document.createElement("button");
    classIcon.setAttribute("id", "classModalIcon");
    classIcon.setAttribute("class", "CITBClassButton active");

     textFieldsDiv = document.createElement("div");
    textFieldsDiv.setAttribute("class", "");

     textBox = document.createElement("input");
    textBox.setAttribute("id", "text1");
    textBox.setAttribute("class", "textbox");
    textBox.setAttribute("type", "text");

     textLabel = document.createElement("label");
    textLabel.setAttribute("for", "text1");
    textLabel.setAttribute("class", "labelName");
    textLabel.innerHTML = "What's yours meet name?";

     buttonDiv1 = document.createElement("div");
    buttonDiv1.setAttribute("class", "btn-wrapper");

     buttonDiv = document.createElement("button");
    buttonDiv.setAttribute("id", "submitVideo");
    buttonDiv.setAttribute("class", "mdl-button mdl-js-button mdl-button--primary");
    buttonDiv.innerText = "Ok";

     br = document.createElement("br");  

    favDiv.appendChild(form);
    form.appendChild(divHeader);
    divHeader.appendChild(headerClose);
    divHeader.appendChild(h3Header);
    form.appendChild(contentDiv);
    contentDiv.appendChild(classIcon);
    contentDiv.appendChild(textFieldsDiv);
    textFieldsDiv.appendChild(textLabel);
    textFieldsDiv.appendChild(textBox);
    textFieldsDiv.appendChild(br);
    
    contentDiv.appendChild(buttonDiv1);
    buttonDiv1.appendChild(buttonDiv);
    favDiv.setAttribute('class', 'fab active');
    overlayDiv.setAttribute('class','dark-overlay');
    document.body.appendChild(overlayDiv);
    document.body.appendChild(favDiv);

     saveName = (event)=>{
        event.preventDefault();
        let value = document.getElementById('text1').value;
        if(!value){
            value = 'CITB Rec';
        }
        chrome.storage.sync.set({fileName: value}, () => {});
        document.getElementById('fabVideo').remove();
        document.getElementById('overlay').remove();
        // document.getElementById('fabVideo').setAttribute('class','fab');
        // document.getElementById('text1').value = '';

    }
    
    buttonDiv.addEventListener('click',saveName);
    headerClose.addEventListener('click',saveName);





