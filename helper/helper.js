const helptButtonNext1 = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext1");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Next';
    return helptButtonNext;
  };

const helptButtonNext2 = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext2");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Next';
    return helptButtonNext;
  };

const helptButtonNext3 = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext3");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Next';
    return helptButtonNext;
  };

const helptButtonNext4 = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext4");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Next';
    return helptButtonNext;
  };

const helptButtonNext5 = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext5");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Next';
    return helptButtonNext;
  };

const helptButtonNext6 = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext6");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Next';
    return helptButtonNext;
  };

const helptButtonNext7 = () => {
    const helptButtonNext = document.createElement("button");
    helptButtonNext.setAttribute("id", "helptButtonNext7");
    helptButtonNext.setAttribute("class", "helptButtonNextClass");
    helptButtonNext.textContent = 'Close';
    return helptButtonNext;
  };

const divHelp = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div");
    divHelp.setAttribute('class', 'helpImg1');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "block";    
    return divHelp;
  };
const divHelp1 = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div1");
    divHelp.setAttribute('class', 'helpImg2');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "none";    
    return divHelp;
  };

const divHelp2 = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div2");
    divHelp.setAttribute('class', 'helpImg3');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "none";    
    return divHelp;
  };

const divHelp3 = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div3");
    divHelp.setAttribute('class', 'helpImg4');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "none";    
    return divHelp;
  };

const divHelp4 = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div4");
    divHelp.setAttribute('class', 'helpImg5');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "none";    
    return divHelp;
  };

const divHelp5 = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div5");
    divHelp.setAttribute('class', 'helpImg6');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "none";    
    return divHelp;
  };

  const divHelp6 = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div6");
    divHelp.setAttribute('class', 'helpImg7');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "none";    
    return divHelp;
  };

const showHelp = (help_div,button) =>{  
  console.log("SHOW HGELP!!!",help_div,button )

    help_div.appendChild(button);  
    document.body.appendChild(help_div);


}

export {
    helptButtonNext1,
    helptButtonNext2,
    helptButtonNext3,
    helptButtonNext4,
    helptButtonNext5,
    helptButtonNext6,
    helptButtonNext7,
    divHelp,
    divHelp1,
    divHelp2,
    divHelp3,
    divHelp4,
    divHelp5,
    divHelp6,
    showHelp
}