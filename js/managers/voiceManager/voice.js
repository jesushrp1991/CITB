const speachCommands = () => {
try{
      var cameraCommands = {
        '*w the box camera': () => {
          document.getElementsByClassName("CITBCamButton")[0].click(); 
        }
      };
    var showCommands = {
        '*w the box show': ()=> {
          document.getElementsByClassName("CITBShowButton")[0].click(); 
        }
      };
    var classCommands = {
        '*w the box class': () => {
          document.getElementsByClassName("CITBClassButton")[0].click(); 
        }
    };
      // Add our commands to annyang
      annyang.addCommands(cameraCommands);
      annyang.addCommands(showCommands);
      annyang.addCommands(classCommands);    
      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.debug(true);
      annyang.start();
}catch(e){
    console.log("annyang error",e);
}
}

export {speachCommands}