import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'volumen-panel',
  templateUrl: './volumenPanelComponent.html',
  styleUrls: ['./volumenPanel.scss'],
})
export class volumenPanelComponent extends BaseButton implements OnInit {
    
  ngOnInit(): void {

  }
  

}
