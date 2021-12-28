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
    
    const addEnglishCommands = () => {
      var startCommand = {
        "*w the box start": () => {
          beep();
          rec();
        },
      };
      var startCommand1 = {
        "*w the vaults start": () => {
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
      var stopCommand1 = {
        "*w the vaults stop": () => {
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
      var pauseCommands9 = {
        "*w the vaults pause": () => {
          beep();
          pause();
        },
      };
      
      var playCommands = {
        "*w the box play": () => {
          beep();
          setTimeout(()=>{},10000);
          play();
        },
      };
      var playCommands1 = {
        "*w the woods play": () => {
          beep();
          setTimeout(()=>{},10000);
          play();
        },
      };
      var playCommands2 = {
        "*w the boats play": () => {
          beep();
          setTimeout(()=>{},10000);
          play();
        },
      };
      var playCommands3 = {
        "*w the box plate": () => {
          beep();
          setTimeout(()=>{},10000);
          play();
        },
      };
      var playCommands4 = {
        "*w the woods plate": () => {
          beep();
          setTimeout(()=>{},10000);
          play();
        },
      };
      var playCommands5 = {
        "*w the boats plate": () => {
          beep();
          setTimeout(()=>{},10000);
          play();
        },
      };
      var playCommands6 = {
        "*w the vaults play": () => {
          beep();
          setTimeout(()=>{},10000);
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
      var closeCommands3 = {
        "*w the vaults close": () => {
          beep();
          close();
        },
      };
        // Add our commands to annyang
        annyang.addCommands(startCommand);
        annyang.addCommands(startCommand1);
        annyang.addCommands(stopCommand);
        annyang.addCommands(stopCommand1);
        annyang.addCommands(pauseCommands);
        annyang.addCommands(pauseCommands1);
        annyang.addCommands(pauseCommands2);
        annyang.addCommands(pauseCommands3);
        annyang.addCommands(pauseCommands4);
        annyang.addCommands(pauseCommands5);
        annyang.addCommands(pauseCommands6);
        annyang.addCommands(pauseCommands7);
        annyang.addCommands(pauseCommands8);
        annyang.addCommands(pauseCommands9);
        annyang.addCommands(playCommands);
        annyang.addCommands(playCommands1);
        annyang.addCommands(playCommands2);
        annyang.addCommands(playCommands3);
        annyang.addCommands(playCommands4);
        annyang.addCommands(playCommands5);
        annyang.addCommands(playCommands6);
        annyang.addCommands(closeCommands);
        annyang.addCommands(closeCommands1);
        annyang.addCommands(closeCommands2);
        annyang.addCommands(closeCommands3);

        annyang.setLanguage("en-US");

    }

    const addSpanishCommands = () =>{
        //Commandos en español

        var grabarComando = {
          "*w the box grabar": () => {
            beep();
            rec();
          },
        };

        var pararComando = {
          "*w the box parar": () => {
            beep();
            stop();
          },
        };

        var pausarComando = {
          "*w the box pausar": () => {
            beep();
            pause();
          },
        };

        var continuarComando = {
          "*w the box continuar": () => {
            beep();
            play();
          },
        };

        var cerrarComando = {
          "*w the box cerrar": () => {
            beep();
            close();
          },
        };  
        annyang.addCommands(grabarComando);
        annyang.addCommands(pararComando);
        annyang.addCommands(pausarComando);
        annyang.addCommands(continuarComando);
        annyang.addCommands(cerrarComando);

        annyang.setLanguage("es-ES");
    }


    let languages  = navigator.language.split("-");
    languages[0] == 'es' 
      ? addSpanishCommands()
      : addEnglishCommands()

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
    if(!result.voice){
      annyang.abort();
      window.close();
    }
  })
},1000);
