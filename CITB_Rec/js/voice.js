import { rec,stop, close, play,pause } from "./voiceActions.js";

const speachCommands = () => {
  try {
    const beep = (frequency) => {
      if (frequency == undefined || frequency == null || frequency == 0) {
        frequency = 1760;
      }
      const rampDownTimeNum = function () {
        return parseFloat(1);
      };

      const beepContext = new AudioContext();
      const oscillator = beepContext.createOscillator();
      const gain = beepContext.createGain();
      oscillator.connect(gain);
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.5, beepContext.currentTime);

      gain.connect(beepContext.destination);
      gain.gain.exponentialRampToValueAtTime(
        0.00001,
        beepContext.currentTime + rampDownTimeNum()
      );

      oscillator.start(beepContext.currentTime);
      oscillator.stop(beepContext.currentTime + rampDownTimeNum() + 0.01);
    };
    var startCommand = {
      "*w the box start": () => {
        beep();
        rec();
      },
    };
    var stopCommand = {
      "*w the box stop": () => {
        beep();
        stop();
      },
    };
    var pauseCommands = {
      "*w the box pause": () => {
        beep();
        pause();
      },
    };
    var pauseCommands1 = {
      "*w the box paws": () => {
        beep();
        pause();
      },
    };
    var pauseCommands2 = {
      "*w the box pass": () => {
        beep();
        pause();
      },
    };
    var pauseCommands3 = {
      "*w the box spas": () => {
        beep();
        pause();
      },
    };
    var pauseCommands4 = {
      "*w the box spots": () => {
        beep();
        pause();
      },
    };
    var pauseCommands5 = {
      "*w the box house": () => {
        beep();
        pause();
      },
    };
    var pauseCommands6 = {
      "*w the box spouse": () => {
        beep();
        pause();
      },
    };
    var pauseCommands7 = {
      "*w the box space": () => {
        beep();
        pause();
      },
    };
    var pauseCommands8 = {
      "*w the box plus": () => {
        beep();
        pause();
      },
    };
    
    var playCommands = {
      "*w the box play": () => {
        beep();
        play();
      },
    };
    var playCommands1 = {
      "*w the woods play": () => {
        beep();
        play();
      },
    };
    var playCommands2 = {
      "*w the boats play": () => {
        beep();
        play();
      },
    };
    var playCommands3 = {
      "*w the box plate": () => {
        beep();
        play();
      },
    };
    var playCommands4 = {
      "*w the woods plate": () => {
        beep();
        play();
      },
    };
    var playCommands5 = {
      "*w the boats plate": () => {
        beep();
        play();
      },
    };
    var closeCommands = {
      "*w the box close": () => {
        beep();
        close();
      },
    };
    var closeCommands1 = {
      "*w the boats close": () => {
        beep();
        close();
      },
    };
    var closeCommands2 = {
      "*w the woods close": () => {
        beep();
        close();
      },
    };

    // Add our commands to annyang
    annyang.addCommands(startCommand);
    annyang.addCommands(stopCommand);
    annyang.addCommands(pauseCommands);
    annyang.addCommands(pauseCommands1);
    annyang.addCommands(pauseCommands2);
    annyang.addCommands(pauseCommands3);
    annyang.addCommands(pauseCommands4);
    annyang.addCommands(pauseCommands5);
    annyang.addCommands(pauseCommands6);
    annyang.addCommands(pauseCommands7);
    annyang.addCommands(pauseCommands8);
    annyang.addCommands(playCommands);
    annyang.addCommands(playCommands1);
    annyang.addCommands(playCommands2);
    annyang.addCommands(playCommands3);
    annyang.addCommands(playCommands4);
    annyang.addCommands(playCommands5);
    annyang.addCommands(closeCommands);
    annyang.addCommands(closeCommands1);
    annyang.addCommands(closeCommands2);

    annyang.setLanguage("en-US");
    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start({ autoRestart: true, continuous: true });
    annyang.debug([true]);  
  } catch (e) {
    console.log("annyang error", e);
  }
};
speachCommands();

setInterval(()=>{
  chrome.storage.sync.get('voice', function(result) {
    console.log("voice",result.voice);
    if(!result.voice){
      annyang.abort();
      window.close();
    }
  })
},1000);
