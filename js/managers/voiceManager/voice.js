const speachCommands = () => {
  console.log("SPEACH INIT")
try{
  
      var cameraCommands = {
        '*w the box camera': () => {
          beep();
          document.getElementsByClassName("CITBCamButton")[0].click(); 
        }
      };
    var showCommands = {
        '*w the box show': ()=> {
          beep();
          document.getElementsByClassName("CITBShowButton")[0].click(); 
        }
      };
    var classCommands = {
        '*w the box class': () => {
          beep();
          document.getElementsByClassName("CITBClassButton")[0].click(); 
        }
    };

    var cameraCommands1 = {
      '*w the box cam': () => {
        beep();
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands2 = {
      'CITB camera': () => {
        beep();
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands3 = {
      'CITB cam': () => {
        beep();
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands4 = {
      'CITV cam': () => {
        beep();
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
    var cameraCommands5 = {
      'CITV camera': () => {
        beep();
        document.getElementsByClassName("CITBCamButton")[0].click(); 
      }
    };
  var showCommands1 = {
      'CITB show': ()=> {
        beep();
        document.getElementsByClassName("CITBShowButton")[0].click(); 
      }
    };
    var showCommands2 = {
      'CITV show': ()=> {
        beep();
        document.getElementsByClassName("CITBShowButton")[0].click(); 
      }
    };
  var classCommands1 = {
      'CITB class': () => {
        beep();
        document.getElementsByClassName("CITBClassButton")[0].click(); 
      }
  };
  var classCommands2 = {
    'CITV class': () => {
      beep();
      document.getElementsByClassName("CITBClassButton")[0].click(); 
    }
  }
  var estudioCommands1 = {
    'CITB duplo': () => {
      beep();
      document.getElementsByClassName("CITBPresentationButton")[0].click(); 
    }
  }

  var estudioCommands3 = {
    'CITV duplo': () => {
      beep();
      document.getElementsByClassName("CITBPresentationButton")[0].click(); 
    }
  }

  var estudioCommands2 = {
    '*w the box duplo': () => {
      beep();
      document.getElementsByClassName("CITBPresentationButton")[0].click(); 
    }
  }
  //   var estudioCommands1 = {
  //     'regexp: /(.*)?(citb|w* in the box) (duplo)/': () => {
  //       document.getElementsByClassName("CITBPresentationButton")[0].click(); 
  //     }
  // };
 
  const beep = (frequency) => {
    if (frequency == undefined || frequency == null || frequency == 0) {
        frequency = 1760
    }
    const rampDownTimeNum = function(){
    return parseFloat(1)
    }

    const beepContext = new AudioContext();
    const oscillator = beepContext.createOscillator();
    const gain = beepContext.createGain();
    oscillator.connect(gain);
    oscillator.type = "sine";
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.5, beepContext.currentTime);


    gain.connect(beepContext.destination);
    gain.gain.exponentialRampToValueAtTime(0.00001, beepContext.currentTime + rampDownTimeNum());



    oscillator.start(beepContext.currentTime);
    oscillator.stop(beepContext.currentTime + rampDownTimeNum() + .01);
}


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
      annyang.start({ autoRestart: true, continuous: true });
      
}catch(e){
    console.log("annyang error",e);
}
}

export {speachCommands}