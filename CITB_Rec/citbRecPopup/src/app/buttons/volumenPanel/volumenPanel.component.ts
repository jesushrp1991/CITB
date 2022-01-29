import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'volumen-panel',
  templateUrl: './volumePanelComponent.html',
  styleUrls: ['./volumenPanel.scss'],
})
export class volumenPanelComponent extends BaseButton implements OnInit {
    
  ngOnInit(): void {
    this.restoreVolumen();
  }

  private _voiceVolume: number = 1;

  public get voiceVolume () {
    return this._voiceVolume;
  }
  public set voiceVolume (value: number) {
    this._voiceVolume = value;
    const request = { recordingStatus: 'changeVoiceVolume' , volume: value};
    this.sendMessage(request);
    chrome.storage.local.set({voiceVolumeControl: value});
  }


  private _systemVolume: number = 0.8;

  public get systemVolume () {
    return this._systemVolume;
  }
  public set systemVolume (value: number) {
    this._systemVolume = value;
    const request = { recordingStatus: 'changeSystemVolume' , volume: value};
    this.sendMessage(request);
    chrome.storage.local.set({systemVolumeControl: value});
  }

  private restoreVolumen = () => {
    this.window.chrome.storage.local.get(
      'systemVolumeControl',
      (result: any) => {
        this.systemVolume = result.systemVolumeControl;
      }
    );

    this.window.chrome.storage.local.get(
      'voiceVolumeControl',
      (result: any) => {
        this.voiceVolume = result.voiceVolumeControl;
      }
    );
  }
}
