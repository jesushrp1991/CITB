const speachCommands = () => {
try{

  const idExtension = 'ijbdnbhhklnlmdpldichdlknfaibceaf';

    const rec = async() =>{
      let mic = document.getElementById("pModeCurrentMic").innerText ;
      if (mic == 'CITB' || mic == 'default'){
        await navigator.mediaDevices.getUserMedia({audio: true})
        let micList = await navigator.mediaDevices.enumerateDevices();
        let citb = micList.filter((x) => x.kind === "audioinput" && x.label.includes('CITB'));
        if(citb.length > 0)
          mic = citb[0].deviceId;
      }
      const request = { recordingStatus: 'rec' , idMic: mic ,idTab : null, recMode: 'recordScreen'};
        chrome.runtime.sendMessage(idExtension, request,()=>{});
    }
    const stop = () =>{
      const secondRequest = { recordingStatus: 'rec',isVoiceCommandStop: true };
      chrome.runtime.sendMessage(idExtension,secondRequest, (response) => {         
      });
  }
  
  const play = () =>{
      const request = { recordingStatus: 'voiceCommand' , isVoiceCommandPause: 'play' };
      chrome.runtime.sendMessage(idExtension,request, (response) => {         
      });
  }
  const pause = () =>{
      const request = { recordingStatus: 'voiceCommand' , isVoiceCommandPause: 'pause' };
      chrome.runtime.sendMessage(idExtension,request, (response) => {         
      });
  }

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

          annyang.setLanguage("en-US");

      }

  
      var cameraCommands = {
        '*w the box camera': () => {
          beep();
          document.getElementsByClassName("CITBCamButton")[0].click(); 
          sendMessage()
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
        sendMessage()

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
      document.getElementsByClassName("duplo1")[0].click(); 
    }
  }

  var estudioCommands5 = {
    'CITB duplo mini': () => {
      beep();
      document.getElementsByClassName("duplo2")[0].click(); 
    }
  }

  var estudioCommands3 = {
    'CITV duplo': () => {
      beep();
      document.getElementById("duplo1").click(); 
    }
  }

  var estudioCommands2 = {
    '*w the box duplo': () => {
      beep();
      document.getElementById("duplo1").click(); 
    }
  }

  var estudioCommands4 = {
    '*w the box duplo mini': () => {
      beep();
      document.getElementById("duplo2").click(); 
    }
  }

  var duplo1Commands = {
    'Duplo': () => {
      beep();
      document.getElementById("duplo1").click(); 
    }
  }

  var duplo2Commands = {
    'Duplo mini': () => {
      beep();
      document.getElementById("duplo2").click(); 
    }
  }
 
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
      annyang.addCommands(duplo1Commands); 
      annyang.addCommands(duplo2Commands); 

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
      annyang.addCommands(estudioCommands4); 
      annyang.addCommands(estudioCommands5); 

      addEnglishCommands()

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start({ autoRestart: true, continuous: true });
      // annyang.debug([true]);  
      
      
}catch(e){
    console.log("annyang error",e);
}
}

export {speachCommands}