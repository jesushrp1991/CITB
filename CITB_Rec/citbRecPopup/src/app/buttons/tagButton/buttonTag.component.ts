import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'button-tag',
  templateUrl: './buttonTagComponent.html',
  styleUrls: ['./buttonTag.scss'],
})
export class buttonTagComponent extends BaseButton implements OnInit {
    
  ngOnInit(): void {
  }
  public active: boolean = false;
  
  public newTag = ():void =>{
    this.active = !this.active;
  }

}
