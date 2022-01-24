import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'citbRecPopup';

  public recMode = 'recordScreen'

  public get isRecordTabActive() {
    return this.recMode === 'recordTab'
  }

  public get isRecordScreenActive() {
    return this.recMode === 'recordScreen'
  }

  public changeRecMode = (type: 'recordScreen' | 'recordTab') => {
    this.recMode = type;
  }
}
