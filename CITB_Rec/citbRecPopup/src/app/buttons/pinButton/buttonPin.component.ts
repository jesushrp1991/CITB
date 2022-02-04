import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'button-pin',
  templateUrl: './buttonPinComponent.html',
  styleUrls: ['./buttonPin.scss'],
})
export class buttonPinComponent extends BaseButton implements OnInit {
    
  ngOnInit(): void {
  }
  
  public newPin = () =>{
    alert("Pin CLick");
  }

}
