import { Component, Input } from '@angular/core';
import { BaseButton } from '../base/ButtonBase';

@Component({
  selector: 'voice-command',
  templateUrl: './voiceCommandComponent.html',
  styleUrls: ['./voiceCommandSVG.scss'],
})
export class VoiceCommandComponent extends BaseButton {
    @Input() public active: boolean = false;
    public voiceCommandEnabled = false;


    toggleVoiceCommands = () => {
      console.log("TOOGLEVOICE");
      this.voiceCommandEnabled = !this.voiceCommandEnabled;
      const status = this.voiceCommandEnabled ? 'voiceOpen' : 'voiceClose';
      const request = { recordingStatus: status };
  
      this.sendMessage(request);
      this.window.chrome.runtime.openOptionsPage(() => {});
    };
}
