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
const divHelpBox = () => {
    const divHelpBox = document.createElement("div");
    divHelpBox.setAttribute("id", "help_div");
    divHelpBox.setAttribute('class', 'box');   
    return divHelpBox;
  };
const showHelp = (help_div,divHelpBox,button) =>{  
    help_div.appendChild(divHelpBox);
    divHelpBox.src = chrome.runtime.getURL (`helper/img/2.png`);
    divHelpBox.appendChild(button);  
    document.body.appendChild(help_div);
}

export {
    helptButtonNext,
    divHelpBox,
    divHelp,
    showHelp
}