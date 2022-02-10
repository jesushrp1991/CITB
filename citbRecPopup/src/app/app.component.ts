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
  }
  // Referencias a componentes hijos
  @ViewChild('voiceCommandComponent') voiceCommandComponent!: VoiceCommandComponent;
  //Fin Referencias a componentes hijos

  public voiceCommandEnabled = false;
  public showVolumeControl = false;

  public audioEnabled = true;
  public recMode = 'recordScreen';
  public isCITBEnabled = false;
  public citbDeviceEnabled = false;
  public selectedMic = "";
  public isRecording = false;
  public exitsCITBDevice = true;

  public restoreState = () => {
    this.window.chrome.storage.local.get('recMode', (result: any) => {
      this.recMode = result.recMode;
    });
  };

  public organizedMicList: { label: string; deviceId: string }[] = [];

  populateMicSelect = async () => {
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

  public citbDeviceToggle = () => {
    this.citbDeviceEnabled = !this.citbDeviceEnabled;
    this.window.chrome.storage.local.set({isCITBPanelVisible: this.citbDeviceEnabled}, () => {});
  };

  public rec = (isTabForMac:any|undefined) =>{
    let idMic;
    this.audioEnabled ? idMic = this.selectedMic : idMic = null
    const request = { recordingStatus: 'rec' , idMic: idMic ,idTab : isTabForMac, recMode: this.recMode};
    //OJO PARA GRABAR !!!!!
    this.sendMessage(request);
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

  public checkAut = () => {
    const request = { recordingStatus: 'checkAuth' };
    this.sendMessage(request);
  }

  public redirectToCITBWeb = () =>{
    window.open("https://classinthebox.com/", "_blank");
  }

  public getCurrentState = () =>{
    console.log("checking state")
    this.window.chrome.storage.sync.get('isRecording', (result : any) => {
        if (result.isRecording ){
            this.isRecording = true;
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
