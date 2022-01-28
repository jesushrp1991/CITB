import { Component, Input, Output } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'citb-on',
  templateUrl: './citbOnComponent.html',
  styleUrls: ['./citbOn.scss'],
})
export class citbOnComponent extends BaseButton {
    private _active: boolean = false;
    @Input() public get active() {
      return this._active;
    };
    public set active(enabled: boolean) {
      this._active = enabled;
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

    public toggleCITBOnOff= () => {
      // this.isCITBEnabled = !this.isCITBEnabled;
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
          // setTimeout(() => {
          //   this.getOnOffState();
          // }, 100);
        });
      });
    };
}
