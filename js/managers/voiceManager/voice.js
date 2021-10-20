const speachCommands = () => {
try{
      var cameraCommands = {
        '*w the box camera': () => {
        //   console.log("Change camera");
          document.getElementsByClassName("CITBCamButton")[0].click(); 
        }
      };
    var showCommands = {
        '*w the box show': ()=> {
        //   console.log("Show Mode");
          document.getElementsByClassName("CITBShowButton")[0].click(); 
        }
      };
    var classCommands = {
        '*w the box class': () => {
        //   console.log("Class Mode");
          document.getElementsByClassName("CITBClassButton")[0].click(); 
        }
    };
    // var cameraSimilarCommands1 = {
    //     'class in the box come': () => {
    //     //   console.log("Change camera");
    //       document.getElementsByClassName("CITBCamButton")[0].click(); 
    //     }
    //   };
    // var cameraSimilarCommands2 = {
    //     'class in the box came': () => {
    //     //   console.log("Change camera");
    //       document.getElementsByClassName("CITBCamButton")[0].click(); 
    //     }
    //   };
    // var cameraSimilarCommands3 = {
    //     'class in the box calm': () => {
    //     //   console.log("Change camera");
    //       document.getElementsByClassName("CITBCamButton")[0].click(); 
    //     }
    //   };
    // var cameraSimilarCommands4 = {
    //     'class in the box chem': () => {
    //     //   console.log("Change camera");
    //       document.getElementsByClassName("CITBCamButton")[0].click(); 
    //     }
    //   };
    // var cameraSimilarCommands5 = {
    //     'class in the box camera': () => {
    //     //   console.log("Change camera");
    //       document.getElementsByClassName("CITBCamButton")[0].click(); 
    //     }
    //   };
    // var showCommands = {
    //     'class in the box show': ()=> {
    //     //   console.log("Show Mode");
    //       document.getElementsByClassName("CITBShowButton")[0].click(); 
    //     }
    //   };
    // var classCommands = {
    //     'class in the box class': () => {
    //     //   console.log("Class Mode");
    //       document.getElementsByClassName("CITBClassButton")[0].click(); 
    //     }
    //   };
    
      // Add our commands to annyang
      annyang.addCommands(cameraCommands);
      // annyang.addCommands(cameraSimilarCommands1);
      // annyang.addCommands(cameraSimilarCommands2);
      // annyang.addCommands(cameraSimilarCommands3);
      // annyang.addCommands(cameraSimilarCommands4);
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