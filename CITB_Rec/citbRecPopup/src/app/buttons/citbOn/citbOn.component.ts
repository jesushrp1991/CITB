import { Component, Input, Output, OnInit} from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'citb-on',
  templateUrl: './citbOnComponent.html',
  styleUrls: ['./citbOn.scss'],
})
export class citbOnComponent extends BaseButton implements OnInit{
    ngOnInit(): void {
      this.getOnOffState()
    }

    public isCITBEnabled: boolean = false;
    public globalState = false;


    public toggleCITBOnOff= () => {
      this.isCITBEnabled = !this.isCITBEnabled;
      chrome.tabs.getSelected( (tab) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          let url = tab.url;
          let id: number = tab.id!;
          if (
            url?.includes("meet.google.com") ||
            url?.includes("teams.microsoft.com") ||
            url?.includes("teams.live.com") ||
            url?.includes("zoom.us") ||
            url?.includes("meet.jit.si")
          ) {
            chrome.tabs.executeScript(id,{
              code: 'document.getElementById("buttonOnOff").click();'
            });
          }
          // setTimeout(() => {
          //   this.getOnOffState();
          // }, 100);
        });
      });
    };

    public onOfChecker = (tab:any) => {
      const url = tab.url;
      if (
        url.includes("meet.google.com") ||
        url.includes("teams.microsoft.com") ||
        url.includes("teams.live.com") ||
        url.includes("zoom.us") ||
        url.includes("meet.jit.si")
      ) {
        chrome.tabs.executeScript(tab.id,{
          code: 'isOpen = document.getElementById("buttonOnOff").innerText.toString();isOpen;'      
        },(injectionResults) => {
          injectionResults[0] == "true" ?
                      this.globalState = true
                      : this.globalState = false;
          this.globalState 
            ? this.isCITBEnabled = true 
            : this.isCITBEnabled = false;
        });
      }
      //try again each second during 5 seconds
      let onOfChekerCounter =0;
      if (onOfChekerCounter < 5) {
        onOfChekerCounter += 1;
        setTimeout(() => {
          this.onOfChecker(tab);
        }, 1000);
      } else {
        onOfChekerCounter = 0;
      }
    };
  
    public getOnOffState = async () => {
      chrome.tabs.getSelected((tab) => {
        this.onOfChecker(tab);
      });
    };
}
