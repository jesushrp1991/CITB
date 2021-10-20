const speachCommands = () => {
try{
    var cameraCommands = {
        'class in the box camera': () => {
        //   console.log("Change camera");
          document.getElementsByClassName("CITBCamButton")[0].click(); 
        }
      };
    var showCommands = {
        'class in the box show': ()=> {
        //   console.log("Show Mode");
          document.getElementsByClassName("CITBShowButton")[0].click(); 
        }
      };
    var classCommands = {
        'class in the box class': () => {
        //   console.log("Class Mode");
          document.getElementsByClassName("CITBClassButton")[0].click(); 
        }
      };
    
      // Add our commands to annyang
      annyang.addCommands(cameraCommands);
      annyang.addCommands(showCommands);
      annyang.addCommands(classCommands);
    
      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start();
}catch(e){
    console.log("annyang error",e);
}
}

export {speachCommands}