import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'time-panel',
  templateUrl: './timePanelComponent.html',
  styleUrls: ['./timePanel.scss'],
})
export class timePanelComponent extends BaseButton implements OnInit {
  
  ngOnInit(): void {
    this.timerController();
    this.checkTimer();
  }
  public recTime = '--:--';
  public portTimer = chrome.runtime.connect({name: "portTimer"});

    //************ TIMER CONTROLLER **********/////
    public timerController = () => {
      this.portTimer.onMessage.addListener(async (msg) => {
        if (msg.answer && msg.answer.seconds > 0){
            this.recTime = `${msg.answer.minute}:${msg.answer.seconds}`;
        }else{
          this.recTime = '00:00';           
        }    
      });
    }
  
    public checkTimer = () => {
        setInterval(()=>{
            this.portTimer.postMessage({getTimer: true});
        },1000)
    }
    //************ TIMER CONTROLLER **********//////

}