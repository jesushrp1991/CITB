import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'button-play',
  templateUrl: './buttonPlayComponent.html',
  styleUrls: ['./buttonPlay.scss'],
})
export class buttonPlayComponent extends BaseButton implements OnInit {
  ngOnInit(): void {
    this.deamonGetState();
  }
  public isPaused = false;
  @Output() isPausedChange = new EventEmitter();

  public tooglePlayPause = () => {
    this.isPaused = !this.isPaused;
    const request = { recordingStatus: 'pause' };
    this.sendMessage(request);
    this.isPausedChange.emit(this.isPaused);
  };

  public getCurrentState = () => {
    this.window.chrome.storage.sync.get('isPaused', (result: any) => {
      this.isPaused = result.isPaused;
    });
  };

  public deamonGetState = () => {
    this.window.setInterval(this.getCurrentState, 500);
  };
}
