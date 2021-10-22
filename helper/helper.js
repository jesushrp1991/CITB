const imgHelp1 = () =>{    
    const image = document.createElement("img");
    // image.setAttribute('src', '');
    return image;
}
const divHelp = () => {
    const divHelp = document.createElement("div");
    divHelp.setAttribute("id", "help_div");
    divHelp.style.zIndex = 999;
    divHelp.style.display = "block";
    return divHelp;
  };

const showHelp = (help_div,help_img) =>{    
    help_div.appendChild(help_img);
    document.body.appendChild(help_div);
    // console.log("SHOW HGELP!!!",help_div,help_img )

}

export {
    imgHelp1,
    divHelp,
    showHelp
}