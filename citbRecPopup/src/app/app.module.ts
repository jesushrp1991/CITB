import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecordButtonComponent } from './buttons/recordScreen/recordButton.component';
import { VoiceCommandComponent } from './buttons/voiceCommand/voiceCommand.component';
import { AudioToggleComponent } from './buttons/audioToggle/audioToggle.component';
import { citbOpenComponent } from './buttons/citbOpenPanel/citbOpen.component';
import { recordListComponent } from './buttons/recordList/recordList.component';
import { citbOnComponent } from './buttons/citbOn/citbOn.component';
import { citbMicComponent } from './buttons/citbMicSelect/citbMic.component';
import { citbVideoComponent } from './buttons/citbVideoSelect/citbVideo.component';
import { citbShowBarComponent } from './buttons/citbShowBar/citbShowBar.component';
import { recordButtonComponent } from './buttons/recordButton/recordButton.component';
import { ecoAlertComponent } from './buttons/ecoAlert/ecoAlert.component';
import { VolumeControlComponent } from './buttons/volumeControl/volumeControl.component';
import { timePanelComponent } from './buttons/timePanel/timePanel.component';
import { buttonPlayComponent } from './buttons/buttonPlay/buttonPlay.component';
import { buttonStopComponent } from './buttons/buttonStop/buttonStop.component';
import { volumenPanelComponent } from './buttons/volumenPanel/volumenPanel.component';
import { buttonPinComponent } from './buttons/pinButton/buttonPin.component';
import { buttonTagComponent } from './buttons/tagButton/buttonTag.component';

@NgModule({
  declarations: [
    AppComponent
    , VoiceCommandComponent
    , AudioToggleComponent
    , RecordButtonComponent
    , citbOpenComponent
    , recordListComponent
    , citbOnComponent
    , citbMicComponent
    , citbVideoComponent
    , citbShowBarComponent
    , recordButtonComponent
    , ecoAlertComponent
    , VolumeControlComponent
    , timePanelComponent
    , buttonPlayComponent
    , buttonStopComponent
    , volumenPanelComponent
    , buttonPinComponent
    , buttonTagComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
