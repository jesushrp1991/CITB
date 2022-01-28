import { Component, Input, Output, OnInit } from '@angular/core';
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

  public tooglePlayPause = () =>{
    this.isPaused = !this.isPaused;
    const request = { recordingStatus: 'pause' };
    this.sendMessage(request);
  }

  public getCurrentState = () =>{
    this.window.chrome.storage.sync.get('isPaused', (result : any) => {   
        if(result.isPaused ){
            this.isPaused = true;
        }    
    });
  }

  public deamonGetState = () => {
    this.window.setInterval( this.getCurrentState, 1000);
  }

}
