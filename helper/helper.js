const imgHelp1 = () =>{    
    const image = document.createElement("img");
    return image;
}
const divHelp = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div");
    divHelp.setAttribute('class', 'helpImg1');
    divHelp.style.zIndex = 999;
    divHelp.style.display = "block";
    
    return divHelp;
  };

const showHelp = (help_div) =>{    
    document.body.appendChild(help_div);
    // console.log("SHOW HGELP!!!",help_div,help_img )

}

export {
    divHelp,
    showHelp
}