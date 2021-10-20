const speachCommands = () => {
try{
    var commands = {
        'change camera': () => {
          console.log("Change camera");
          document.getElementsByClassName("CITBCamButton")[0].click(); 
        }
      };
    var commands2 = {
        'show mode': ()=> {
          console.log("Show Mode");
          document.getElementsByClassName("CITBShowButton")[0].click(); 
        }
      };
    var commands3 = {
        'class mode': () => {
          console.log("Class Mode");
          document.getElementsByClassName("CITBClassButton")[0].click(); 
        }
      };
    
      // Add our commands to annyang
      annyang.addCommands(commands);
      annyang.addCommands(commands2);
      annyang.addCommands(commands3);
    
      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start();
}catch(e){
    console.log("annyang error",e);
}
}

export {speachCommands}