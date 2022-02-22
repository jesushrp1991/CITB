import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'button-tag',
  templateUrl: './buttonTagComponent.html',
  styleUrls: ['./buttonTag.scss'],
})
export class buttonTagComponent extends BaseButton implements OnInit {
  public active: boolean = false;
  
  ngOnInit(): void {
    chrome.storage.local.get('isTagActive', (result: any)=> {
    result.isTagActive ? this.active = true : this.active = false;
  }); 

  }

  public newTag = ():void =>{
    this.active = !this.active;
    const request = { recordingStatus: "tag" };
    this.sendMessage(request);
  }

}
