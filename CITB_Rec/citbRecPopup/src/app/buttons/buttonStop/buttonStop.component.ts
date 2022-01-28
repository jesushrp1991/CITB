import { Component, Input, Output } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'button-stop',
  templateUrl: './buttonStopComponent.html',
  styleUrls: ['./buttonStop.scss'],
})
export class buttonStopComponent extends BaseButton {


  public rec = () =>{
    const request = { recordingStatus: 'rec' , idMic: null ,idTab : null, recMode: null};
    this.sendMessage(request);
  }

}
