const speachCommands = () => {
  console.log("SPEACH INIT")
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

    var cameraCommands1 = {
      '*w the box cam': () => {
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands2 = {
      'CITB camera': () => {
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands3 = {
      'CITB cam': () => {
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands4 = {
      'CITV cam': () => {
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands5 = {
      'CITV camera': () => {
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
  var showCommands1 = {
      'CITB show': ()=> {
        document.getElementsByClassName("CITBShowButton")[0].click(); 
      }
    };
    var showCommands2 = {
      'CITV show': ()=> {
        document.getElementsByClassName("CITBShowButton")[0].click(); 
      }
    };
  var classCommands1 = {
      'CITB class': () => {
        document.getElementsByClassName("CITBClassButton")[0].click(); 
      }
  };
  var classCommands2 = {
    'CITV class': () => {
      document.getElementsByClassName("CITBClassButton")[0].click(); 
    }
  }
  var estudioCommands1 = {
    'CITB duplo': () => {
      document.getElementsByClassName("CITBPresentationButton")[0].click(); 
    }
  }

  var estudioCommands3 = {
    'CITV duplo': () => {
      document.getElementsByClassName("CITBPresentationButton")[0].click(); 
    }
  }

  var estudioCommands2 = {
    '*w the box duplo': () => {
      document.getElementsByClassName("CITBPresentationButton")[0].click(); 
    }
  }
  //   var estudioCommands1 = {
  //     'regexp: /(.*)?(citb|w* in the box) (duplo)/': () => {
  //       document.getElementsByClassName("CITBPresentationButton")[0].click(); 
  //     }
  // };
 
 


      // Add our commands to annyang
      annyang.addCommands(cameraCommands);
      annyang.addCommands(cameraCommands1);
      annyang.addCommands(cameraCommands2);
      annyang.addCommands(cameraCommands3);
      annyang.addCommands(cameraCommands4);
      annyang.addCommands(cameraCommands5);

      annyang.addCommands(showCommands);
      annyang.addCommands(showCommands1);
      annyang.addCommands(showCommands2);

      annyang.addCommands(classCommands);    
      annyang.addCommands(classCommands1);    
      annyang.addCommands(classCommands2);    

      annyang.addCommands(estudioCommands1); 
      annyang.addCommands(estudioCommands2); 
      annyang.addCommands(estudioCommands3); 

      

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.debug(true);
      annyang.start();
}catch(e){
    console.log("annyang error",e);
}
}

export {speachCommands}