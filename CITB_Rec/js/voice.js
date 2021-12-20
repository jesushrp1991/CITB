import { sendMessage , close } from "./voiceActions.js"

const speachCommands = () => {
try{

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
    var playCommand = {
        '*w the box play': () => {
          beep();
          sendMessage(); 
        }
      };
    var stopCommand = {
        '*w the box stop': ()=> {
          beep();
          annyang.abort();
          close();
        }
      };
    var pauseCommands = {
        '*w the box pause': () => {
          beep();
          document.getElementsByClassName("CITBClassButton")[0].click(); 
        }
    };
    var pausaCommands = {
        '*w the box pausa': () => {
          beep();
          document.getElementsByClassName("CITBClassButton")[0].click(); 
        }
    };

      // Add our commands to annyang
      annyang.addCommands(playCommand); 
      annyang.addCommands(stopCommand); 
      annyang.addCommands(pauseCommands);
      annyang.addCommands(pausaCommands);

 

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start({ autoRestart: true, continuous: true });
      annyang.debug([true]);
      
  }catch(e){
      console.log("annyang error",e);
  }
}
speachCommands();