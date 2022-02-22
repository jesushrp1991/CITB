import { Component, Input } from '@angular/core';
import { BaseButton } from '../../base/ButtonBase';

@Component({
  selector: 'record-button',
  templateUrl: './recordButton.component.html',
  styleUrls: ['./recordButton.component.scss'],
})
export class RecordButtonComponent extends BaseButton {

    @Input() public recordKind: string = 'recordTabs';
    public active = false;
    private _activeRecordMode: string = 'recordTabs';

    @Input() public get activeRecordMode () {
        return this._activeRecordMode;
    } 
    public set activeRecordMode (value: string) {
        this._activeRecordMode = value; 
        this.active = ( this.activeRecordMode == this.recordKind );
        // console.log(this.active, this.activeRecordMode, this.recordKind)
        if (this.active) {
            this.changeRecMode();
        }
    } 

    private changeRecMode = () => {
        this.window.chrome.storage.local.set({ recMode: this.recordKind }, () => {});
    }

    public get recordButtonImg() {
        return this.recordKind == 'recordTabs' ? 'assets/recordTab.svg' : 'assets/recordScreen.svg'
    }

}
