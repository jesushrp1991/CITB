import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'time-panel',
  templateUrl: './timePanelComponent.html',
  styleUrls: ['./timePanel.scss'],
})
export class timePanelComponent extends BaseButton implements OnInit {
  ngOnInit(): void {
    this.checkPause();
  }
  @Input()
  get tooglePlayPause() {
    return this.isPaused;
  }
  set tooglePlayPause(value) {
    console.log("Play/Pause",value)
    this.firstTimeOpenPopup = !value;
    this.getInitialRecTime();
  }
  public recTime: number = 0;
  private isPaused = false;
  private totalPauseTime = 0;
  private portTimer = chrome.runtime.connect({ name: 'portTimer' });
  private startRecordTime = 0;
  private firstTimeOpenPopup = true;

  public checkPause = () => {
    setInterval(() => {
      this.window.chrome.storage.sync.get('isPaused', (result: any) => {
        this.isPaused = result.isPaused as boolean;
        if (this.firstTimeOpenPopup) {
          this.timerController();
          this.getInitialRecTime();
          this.calculateVideoRecordTime();
          this.firstTimeOpenPopup = false;
        }
      });
    }, 1000);
  };

  public timerController = () => {
    this.portTimer.onMessage.addListener(async (msg) => {
        this.startRecordTime = msg.answer as number;
    });
  };
  public getInitialRecTime = () => {
    this.portTimer.postMessage({ getTimer: true });
  };

  public calculateVideoRecordTime = () => {
    setInterval(() => {
      if (!this.isPaused) {
        this.window.chrome.storage.sync.get('totalPauseTime', (result: any) => {
          this.totalPauseTime = result.totalPauseTime;
          const currentDate = new Date().getTime();
          this.recTime =
            currentDate - this.startRecordTime - this.totalPauseTime;
            console.log(
              'ENTRO A PONER REC TIME',
              currentDate,
              this.startRecordTime,
              this.totalPauseTime
            );
          console.log("Resultado",this.recTime)
        });
      }
    }, 500);
  };
}
