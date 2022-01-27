import { Component, Input, Output } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'audio-toggle',
  templateUrl: './audioToggle.component.html',
  styleUrls: ['./audioToggle.component.scss'],
})
export class AudioToggleComponent extends BaseButton {
  @Input() public active: boolean = true;
  public get state(): string {
    return this.active ? 'on' : 'off';
  }

  public toggleAudio = () => {
    this.active = !this.active;
    this.window.chrome.storage.local.set(
      { isMicEnable: this.active },
      () => {}
    );
  };
}
