import { Component, Input, Output } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'rec-button',
  templateUrl: './recordButtonComponent.html',
  styleUrls: ['./recordButton.scss'],
})
export class recordButtonComponent extends BaseButton {
    private isMicActive : boolean = true;
    
    @Input() public get micStatus() {
      return this.isMicActive;
    };

    public set micStatus(enabled: boolean) {
      this.isMicActive = enabled;
      console.log("Cambio el estado del mic",this.isMicActive)
    };

    // @Output() public toggleState = () => {
    //   this.toggleVoiceCommands();
    // }


    // public voiceCommandEnabled = false;

    // toggleVoiceCommands = () => {
    //   console.log("TOOGLEVOICE");
    //   this.voiceCommandEnabled = !this.voiceCommandEnabled;
    //   const status = this.voiceCommandEnabled ? 'voiceOpen' : 'voiceClose';
    //   const request = { recordingStatus: status };
  
    //   this.sendMessage(request);
    //   this.window.chrome.runtime.openOptionsPage(() => {});
    // };
}
