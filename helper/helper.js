const helptButtonNext = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext1");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Next';
    return helptButtonNext;
  }; 

const divHelp = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div");
    divHelp.setAttribute('class', 'container');  
    return divHelp;
  };
const imgHelp = () => {
    const divHelpBox = document.createElement("img");
    divHelpBox.setAttribute("id", "box");
    divHelpBox.setAttribute('class', 'box');   
    return divHelpBox;
  };
const showHelp = (help_div,divHelpBox,button) =>{  
    setEventButtonNext(button);
    help_div.appendChild(divHelpBox);
    divHelpBox.src = "chrome-extension://pgloinlccpmhpgbnccfecikdjgdhneof/helper/img/1.png";
    help_div.appendChild(button);  
    document.body.appendChild(help_div);
}

const setEventButtonNext = (button,setEventButtonNextFunction) =>{
  button.addEventListener('click', setEventButtonNextFunction);
}

export {
    helptButtonNext,
    imgHelp,
    divHelp,
    showHelp,
    setEventButtonNext
}