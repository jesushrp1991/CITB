///<reference types="chrome"/>
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseButton } from './base/ButtonBase';
import {VoiceCommandComponent} from './buttons/voiceCommand.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseButton implements OnInit {
  ngOnInit (): void {
    console.log('inside')
    try {
      this.checkAut();
      this.restoreState();
      this.getCurrentState();
    } catch (error) {
      console.log("CANNOT RESTORE STATE")
    }
    this.populateMicSelect().then(data => {

    });
    this.deamonGetState();
    this.timerController();
    this.checkTimer();
    this.getOnOffState();
    this.chekWebContainerState();
  }
  // Referencias a componentes hijos
  @ViewChild('voiceCommandComponent') voiceCommandComponent!: VoiceCommandComponent;
  //Fin Referencias a componentes hijos

  public voiceCommandEnabled = false;
  public audioEnabled = true;
  public recMode = 'recordScreen';
  public isCITBEnabled = false;
  public citbDeviceEnabled = false;
  public selectedMic = "";
  public isFloatingPanelShow = true;
  public isRecording = false;
  public isPaused = false;
  public exitsCITBDevice = true;
  public portTimer = chrome.runtime.connect({name: "portTimer"});
  public recTime = '00:00';

  //CITB variables
  public globalState = false;

  public get isRecordTabActive() {
    return this.recMode === 'recordTab';
  }

  public get onOffImg() {
    return this.audioEnabled ? 'assets/onMic.png' : 'assets/offMic.png';
  }

  public get isRecordScreenActive() {
    return this.recMode === 'recordScreen';
  }

  public toggleAudio = () => {
    this.audioEnabled = !this.audioEnabled;
    this.window.chrome.storage.local.set(
      { isMicEnable: this.audioEnabled },
      () => {}
    );
  };

  public changeRecMode = (type: 'recordScreen' | 'recordTab') => {
    this.recMode = type;
    this.window.chrome.storage.local.set({ recMode: this.recMode }, () => {});
  };

  public restoreState = () => {
    this.window.chrome.storage.local.get('isMicEnable', (result: any) => {
      this.audioEnabled = result.isMicEnable;
      // voiceVolumeControl.disabled = !result.isMicEnable;
    });
    this.window.chrome.storage.local.get(
      'voiceVolumeControl',
      (result: any) => {
        // voiceVolumeControl.value = result.voiceVolumeControl;
      }
    );
    this.window.chrome.storage.local.get(
      'systemVolumeControl',
      (result: any) => {
        // systemVolumeControl.value = result.systemVolumeControl;
      }
    );
    this.window.chrome.storage.local.get('recMode', (result: any) => {
      this.recMode = result.recMode;
    });
  };

  public organizedMicList: { label: string; deviceId: string }[] = [];

  populateMicSelect = async () => {
    console.log("POPUPLATING")
    let micList;
    try {
      await this.window.navigator.mediaDevices.getUserMedia({ audio: true });
      micList = await this.window.navigator.mediaDevices.enumerateDevices();
    } catch (error) {
      this.voiceCommandComponent.toggleState();
    }
    micList = await this.window.navigator.mediaDevices.enumerateDevices();
    console.log(micList);
    let usableMic = (micList as any[]).filter(
      (x) => x.kind === 'audioinput' && !x.label.includes('CITB')
    );
    let citb = (micList as any[]).filter(
      (x) => x.kind === 'audioinput' && x.label.includes('CITB')
    );
    if (citb.length > 0) {
      this.organizedMicList.push(citb[0]);
      this.organizedMicList = this.organizedMicList.concat(usableMic);
      this.selectedMic = this.organizedMicList[0].deviceId;
    } else {
      this.organizedMicList = usableMic;
      if (this.organizedMicList.length > 0) {
        this.selectedMic = this.organizedMicList[0].deviceId;
      }
      this.exitsCITBDevice = false;
    }
  };

  public get citbOnOffImg() {
    return this.isCITBEnabled
      ? 'assets/on.png'
      : 'assets/off.png';
  }

  //************* CITB CAM  *********************/
  public onOfChecker = (tab:any) => {
    const url = tab.url;
    if (
      url.includes("meet.google.com") ||
      url.includes("teams.microsoft.com") ||
      url.includes("teams.live.com") ||
      url.includes("zoom.us") ||
      url.includes("meet.jit.si")
    ) {
      chrome.tabs.executeScript(tab.id,{
        code: 'isOpen = document.getElementById("buttonOnOff").innerText.toString();isOpen;'      
      },(injectionResults) => {
        injectionResults[0] == "true" ?
                    this.globalState = true
                    : this.globalState = false;
        this.globalState 
          ? this.isCITBEnabled = true 
          : this.isCITBEnabled = false;
      });
    }
    //try again each second during 5 seconds
    let onOfChekerCounter =0;
    if (onOfChekerCounter < 5) {
      onOfChekerCounter += 1;
      setTimeout(() => {
        this.onOfChecker(tab);
      }, 1000);
    } else {
      onOfChekerCounter = 0;
    }
  };

  public getOnOffState = async () => {
    chrome.tabs.getSelected((tab) => {
      this.onOfChecker(tab);
    });
  };

  public toggleCITBOnOff= () => {
    this.isCITBEnabled = !this.isCITBEnabled;
    chrome.tabs.getSelected( (tab) => {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let url = tab.url;
        let id: number = tab.id!;
        if (
          url?.includes("meet.google.com") ||
          url?.includes("teams.microsoft.com") ||
          url?.includes("teams.live.com") ||
          url?.includes("zoom.us") ||
          url?.includes("meet.jit.si")
        ) {
          chrome.tabs.executeScript(id,{
            code: 'document.getElementById("buttonOnOff").click();'
          });
        }
        setTimeout(() => {
          this.getOnOffState();
        }, 100);
      });
    });
  };

  public chooseMic = () =>{
    chrome.tabs.getSelected((tab) => {
      chrome.tabs.executeScript(tab.id!,{
        code: 'document.getElementById("buttonPopup").click();'
      });
    });
  }

  public chooseCamara = () => {
    chrome.tabs.getSelected((tab) => {
      chrome.tabs.executeScript(tab.id!,{
          code: 'document.getElementById("buttonPopupVideo").click();'
      });
    });
  }

  public toogleFloatingPanel = () => {
    this.isFloatingPanelShow = !this.isFloatingPanelShow;
    chrome.tabs.getSelected((tab) => {
      if (!this.isFloatingPanelShow) {
        chrome.tabs.executeScript(tab.id!,{
          code: 'document.getElementById("buttonsContainer").style.visibility = "hidden";document.getElementById("pWebContainerState").innerText = "CLOSE";'
        });
      } else {
        chrome.tabs.executeScript(tab.id!,{
          code:"if(document.getElementById('buttonOnOff').innerText.toString() == 'true') { document.getElementById('buttonsContainer').style.visibility = 'visible'; document.getElementById('pWebContainerState').innerText = 'OPEN' }"
        });
      }
    });
  }

  public chekWebContainerState = async () => {
    // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.getSelected((tab) => {
      const url = tab.url!;
      if (
        url.includes("meet.google.com") ||
        url.includes("teams.microsoft.com") ||
        url.includes("teams.live.com") ||
        url.includes("zoom.us") ||
        url.includes("meet.jit.si")
      ){
        chrome.tabs.executeScript(tab.id!,{
          code: 'isOpen = document.getElementById("pWebContainerState").innerText.toString(); isOpen;'
        },(injectionResults)=>{
            console.log(injectionResults)
            injectionResults[0] == "OPEN"
              ? (this.isFloatingPanelShow = true)
              : (this.isFloatingPanelShow = false);
          }
        );
      }
    });
  };
  //************* END CITB CAM  *********************/

  public citbDeviceToggle = () => {
    this.citbDeviceEnabled = !this.citbDeviceEnabled;
    this.window.chrome.storage.local.set({isCITBPanelVisible: this.citbDeviceEnabled}, () => {});
  };

  public showRecordings = () => {
    const request = { recordingStatus: 'showRecList' };
    this.sendMessage(request);
  }

  

  public get floatingPanelStatus() {
    return this.isFloatingPanelShow
      ? 'assets/showPanelFlotante.svg'
      : 'assets/hidePanelFlotante.svg'
  }

  public rec = (isTabForMac:any|undefined) =>{
    let idMic;
    this.audioEnabled ? idMic = this.selectedMic : idMic = null
    const request = { recordingStatus: 'rec' , idMic: idMic ,idTab : isTabForMac, recMode: this.recMode};
    this.sendMessage(request);
}

  public startRecording = () => {
    console.log("Recording")
    this.isRecording = !this.isRecording;
    let userAgentData = this.window.navigator.userAgentData.platform.toLowerCase().includes('mac');
    if(userAgentData){
        this.window.chrome.tabs.getSelected(null, (tab:any) => {
            this.rec(tab.id);
        });
    }else{
      this.rec(undefined)
    }
  }

  public stopRecording = () =>{
    console.log("STOP REC!!!")
    this.isRecording = !this.isRecording;
    this.rec(undefined);
  }

  public get recPanel(){
    return this.isRecording
      ? 'assets/reloj.png'
      :'assets/rec-button.png'
  }

  public tooglePlayPause = () =>{
    this.isPaused = !this.isPaused;
    const request = { recordingStatus: 'pause' };
    this.sendMessage(request);
  }
  public get isPausedState () {
    return this.isPaused
      ? 'assets/play.png'
      : 'assets/pause.png'
  }

  //************ TIMER CONTROLLER **********/////
  public timerController = () => {
    this.portTimer.onMessage.addListener(async (msg) => {
      if (msg.answer && msg.answer.seconds > 0){
          this.recTime = `${msg.answer.minute}:${msg.answer.seconds}`;
      }else{
        this.recTime = '00:00';           
      }    
    });
  }

  public checkTimer = () => {
      setInterval(()=>{
          this.portTimer.postMessage({getTimer: true});
      },1000)
  }
  //************ TIMER CONTROLLER **********//////


  //*************** Volumen Control ********/
  public changeVoiceVolume = (value : Event) => {
    console.log("change",value!);
    let volumenValue : any = (<HTMLTextAreaElement>value.target).value;
    const request = { recordingStatus: 'changeVoiceVolume' , volume: volumenValue};
    this.sendMessage(request);
    chrome.storage.local.set({voiceVolumeControl: volumenValue});
  }

  public changeSystemVolume = (value: Event) => {
    console.log("change",value!);
    let volumenValue : any = (<HTMLTextAreaElement>value.target).value;
    const request = { recordingStatus: 'changeVoiceVolume' , volume: volumenValue};
    this.sendMessage(request);
    chrome.storage.local.set({voiceVolumeControl: volumenValue});
  }
  //*************** End Volumen Control ********/

  public checkAut = () => {
    const request = { recordingStatus: 'checkAuth' };
    this.sendMessage(request);
  }

  public getCurrentState = () =>{
    console.log("checking state")
    this.window.chrome.storage.sync.get('isRecording', (result : any) => {
        if (result.isRecording ){
            this.isRecording = true;
        }
    });
    this.window.chrome.storage.sync.get('isPaused', (result : any) => {   
        if(result.isPaused ){
            this.isPaused = true;
        }    
    });
    this.window.chrome.storage.sync.get('voice', (result : any) => {
        if(result.voice){
            this.voiceCommandEnabled = true;
        }
    })
  
  }

  public deamonGetState = () => {
    this.window.setInterval( this.getCurrentState, 1000);
  }

}
