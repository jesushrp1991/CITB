///<reference types="chrome"/>
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseButton } from './base/ButtonBase';
import {VoiceCommandComponent} from './buttons/voiceCommand/voiceCommand.component'
import { citbOpenComponent } from './buttons/citbOpenPanel/citbOpen.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseButton implements OnInit {
  ngOnInit (): void {
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
    // this.getOnOffState();
    // this.chekWebContainerState();
  }
  // Referencias a componentes hijos
  @ViewChild('voiceCommandComponent') voiceCommandComponent!: VoiceCommandComponent;
  //Fin Referencias a componentes hijos

  public voiceCommandEnabled = false;
  private _voiceVolume = 0;
  public get voiceVolume () {
    return this._voiceVolume;
  }
  public set voiceVolume (value: number) {
    // this._voiceVolume = value; 
    // console.log("change",value!);
    // const request = { recordingStatus: 'changeVoiceVolume' , volume: value};
    // this.sendMessage(request);
    // chrome.storage.local.set({voiceVolumeControl: value});
  }
  private _systemVolume = 0;
  public get systemVolume() {
    return this._systemVolume;
  }
  public set systemVolume(value: number){
    // console.log("change",value!);
    // const request = { recordingStatus: 'changeSystemVolume' , volume: value};
    // this.sendMessage(request);
    // chrome.storage.local.set({systemVolumeControl: value});
  }
  public audioEnabled = true;
  public recMode = 'recordScreen';
  public isCITBEnabled = false;
  public citbDeviceEnabled = false;
  public selectedMic = "";
  public isRecording = false;
  public isPaused = false;
  public exitsCITBDevice = true;
  public portTimer = chrome.runtime.connect({name: "portTimer"});
  public recTime = '00:00';

  //CITB variables
  // public globalState = false;
  // public isFloatingPanelShow = true;


  public restoreState = () => {
    this.window.chrome.storage.local.get('isMicEnable', (result: any) => {
      this.audioEnabled = result.isMicEnable;
      // voiceVolumeControl.disabled = !result.isMicEnable;
    });
    this.window.chrome.storage.local.get(
      'voiceVolumeControl',
      (result: any) => {
        this.voiceVolume = result.voiceVolumeControl;
      }
    );
    this.window.chrome.storage.local.get(
      'systemVolumeControl',
      (result: any) => {
        this.systemVolume = result.systemVolumeControl;
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

  // public get citbOnOffImg() {
  //   return this.isCITBEnabled
  //     ? 'assets/on.png'
  //     : 'assets/off.png';
  // }
  public citbDeviceToggle = () => {
    this.citbDeviceEnabled = !this.citbDeviceEnabled;
    this.window.chrome.storage.local.set({isCITBPanelVisible: this.citbDeviceEnabled}, () => {});
  };

  // public get floatingPanelStatus() {
  //   return this.isFloatingPanelShow
  //     ? 'assets/showPanelFlotante.svg'
  //     : 'assets/hidePanelFlotante.svg'
  // }

  public rec = (isTabForMac:any|undefined) =>{
    let idMic;
    this.audioEnabled ? idMic = this.selectedMic : idMic = null
    const request = { recordingStatus: 'rec' , idMic: idMic ,idTab : isTabForMac, recMode: this.recMode};
    console.log(request)
    //this.sendMessage(request);
}

  public startRecording = () => {
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
    const request = { recordingStatus: 'changeSystemVolume' , volume: volumenValue};
    this.sendMessage(request);
    chrome.storage.local.set({systemVolumeControl: volumenValue});
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
