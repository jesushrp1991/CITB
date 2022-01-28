import { Component, Input } from '@angular/core';
import { BaseButton } from '../../base/ButtonBase';

@Component({
  selector: 'record-button',
  templateUrl: './recordButton.component.html',
  styleUrls: ['./recordButton.component.scss'],
})
export class RecordButtonComponent extends BaseButton {

    @Input() public recordKind: string = 'recordTab';
    public active = false;
    private _activeRecordMode: string = 'recordTab';

    @Input() public get activeRecordMode () {
        return this._activeRecordMode;
    } 
    public set activeRecordMode (value: string) {
        console.log("ACTIVE RECORD MODE", value)
        this._activeRecordMode = value; 
        this.active = ( this.activeRecordMode == this.recordKind );
        if (this.active) {
            this.changeRecMode();
        }
    } 

    private changeRecMode = () => {
        this.window.chrome.storage.local.set({ recMode: this.recordKind }, () => {});
    }

    public get recordButtonImg() {
        return this.recordKind == 'recordTab' ? 'assets/recordTab.svg' : 'assets/recordScreen.svg'
    }

}
