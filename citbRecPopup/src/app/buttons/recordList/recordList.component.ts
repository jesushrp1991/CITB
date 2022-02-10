import { Component, Input, Output } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'record-list',
  templateUrl: './recordListComponent.html',
  styleUrls: ['./recordList.scss'],
})
export class recordListComponent extends BaseButton {
    
    public showRecordings = () => {
      const request = { recordingStatus: 'showRecList' };
      this.sendMessage(request);
    }
}
