import { Component, Input, Output } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'citb-show-bar',
  templateUrl: './citbShowBarComponent.html',
  styleUrls: ['./citbShowBar.scss'],
})
export class citbShowBarComponent extends BaseButton {
  public isFloatingPanelShow = true;
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
}
