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

@NgModule({
  declarations: [
    AppComponent
    , VoiceCommandComponent
    , AudioToggleComponent
    , RecordButtonComponent
    , citbOpenComponent
    , recordListComponent
    , citbOnComponent
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
