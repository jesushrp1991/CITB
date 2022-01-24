import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
    this.restoreState();
  }

  public window = window as any;

  public audioEnabled = true;
  public recMode = 'recordScreen'

  public get isRecordTabActive() {
    return this.recMode === 'recordTab'
  }

  public get isRecordScreenActive() {
    return this.recMode === 'recordScreen'
  }

  public toggleAudio = () => {
    this.audioEnabled = !this.audioEnabled;
    this.window.chrome.storage.local.set({isMicEnable: this.audioEnabled}, () => {});
  }

  public changeRecMode = (type: 'recordScreen' | 'recordTab') => {
    this.recMode = type;
    this.window.chrome.storage.local.set({recMode: this.recMode}, () => {});
  }

  public restoreState = () => {
    this.window.chrome.storage.local.get('isMicEnable', (result: any)=> {
      this.audioEnabled = result.isMicEnable;
      // voiceVolumeControl.disabled = !result.isMicEnable;
    });    
    this.window.chrome.storage.local.get('voiceVolumeControl', (result: any)=> {
        // voiceVolumeControl.value = result.voiceVolumeControl;
    });    
    this.window.chrome.storage.local.get('systemVolumeControl', (result: any)=> {
        // systemVolumeControl.value = result.systemVolumeControl;
    });
    this.window.chrome.storage.local.get('recMode', (result: any)=> {
      this.recMode = result.recMode
    });
  }

}
