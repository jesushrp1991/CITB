import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit (): void {
    console.log('inside')
    try {
      this.restoreState();
    } catch (error) {
      console.log("CANNOT RESTORE STATE")
    }
    this.populateMicSelect().then(data => {

    });
  }

  public window = window as any;

  public voiceCommandEnabled = false;
  public audioEnabled = true;
  public recMode = 'recordScreen';
  public isCITBEnabled = false;
  public citbDeviceEnabled = false;
  public selectedMic = "";

  public get isRecordTabActive() {
    return this.recMode === 'recordTab';
  }

  public get onOffImg() {
    return this.audioEnabled ? '../assets/onMic.png' : '../assets/offMic.png';
  }
  public get voiceCommandImg() {
    return this.voiceCommandEnabled
      ? '../assets/COMANDOS COLOR.svg'
      : '../assets/COMANDOS GRIS.svg';
  }

  public get isRecordScreenActive() {
    return this.recMode === 'recordScreen';
  }

  public toggleVoiceCommands = () => {
    this.voiceCommandEnabled = !this.voiceCommandEnabled;
  };
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
      this.toggleVoiceControl();
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
    } else {
      this.organizedMicList = usableMic;
      if (this.organizedMicList.length > 0) {
        this.selectedMic = this.organizedMicList[0].deviceId
      }
      //show citb alert audio
      // document.getElementById('citbMissingAlert').classList.add('expanded');
    }
  };



  public sendMessage = (msg: object) => {
    this.window.chrome.runtime.sendMessage(msg);
  };

  toggleVoiceControl = () => {
    this.voiceCommandEnabled = !this.voiceCommandEnabled;
    const status = this.voiceCommandEnabled ? 'voiceOpen' : 'voiceClose';
    const request = { recordingStatus: status };

    this.sendMessage(request);
    this.window.chrome.runtime.openOptionsPage(() => {});
  };

  public get citbOnOffImg() {
    return this.isCITBEnabled
      ? '../assets/on.png'
      : '../assets/off.png';
  }

  public toggleCITBOnOff= () => {
    this.isCITBEnabled = !this.isCITBEnabled;
  };

  public citbDeviceToggle = () => {
    this.citbDeviceEnabled = !this.citbDeviceEnabled;
    this.window.chrome.storage.local.set({isCITBPanelVisible: this.citbDeviceEnabled}, () => {});
  };

  public showRecordings = () => {
    const request = { recordingStatus: 'showRecList' };
    this.sendMessage(request);
  }

  public startRecording = () => {

  }


}
