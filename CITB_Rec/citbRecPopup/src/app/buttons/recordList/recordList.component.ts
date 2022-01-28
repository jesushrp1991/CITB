import { Component, Input, Output } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'record-list',
  templateUrl: './recordListComponent.html',
  styleUrls: ['./recordList.scss'],
})
export class recordListComponent extends BaseButton {
    // private _active: boolean = false;
    // @Input() public get active() {
    //   return this._active;
    // };
    // public set active(enabled: boolean) {
    //   this._active = enabled;
    //   this.voiceCommandEnabled = enabled;
    // };

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
