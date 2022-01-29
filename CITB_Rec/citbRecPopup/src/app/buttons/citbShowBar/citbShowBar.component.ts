import { Component, Input, Output ,OnInit} from '@angular/core';
import { BaseButton } from 'src/app/base/ButtonBase';

@Component({
  selector: 'citb-show-bar',
  templateUrl: './citbShowBarComponent.html',
  styleUrls: ['./citbShowBar.scss'],
})
export class citbShowBarComponent extends BaseButton implements OnInit {

  ngOnInit (): void {
    this.chekWebContainerState();
   }

  public isFloatingPanelShow = false;

  public get active() {
    return this.isFloatingPanelShow;
  };

  public toogleFloatingPanel = () => {
    this.isFloatingPanelShow = !this.isFloatingPanelShow;
    chrome.tabs.getSelected((tab) => {
      if (!this.isFloatingPanelShow) {
        chrome.tabs.executeScript(tab.id!,{
          code: 'document.getElementById("buttonsContainer").style.visibility = "hidden";document.getElementById("pWebContainerState").innerText = "CLOSE";'
        });
      } else {
        chrome.tabs.executeScript(tab.id!,{
          code:"if(document.getElementById('buttonOnOff').innerText.toString() == 'true') { document.getElementById('buttonsContainer').style.visibility = 'visible'; document.getElementById('pWebContainerState').innerText = 'OPEN' }"
        });
      }
    });
  }

  public chekWebContainerState = async () => {
    chrome.tabs.getSelected((tab) => {
      const url = tab.url!;
      if (
        url.includes("meet.google.com") ||
        url.includes("teams.microsoft.com") ||
        url.includes("teams.live.com") ||
        url.includes("zoom.us") ||
        url.includes("meet.jit.si")
      ){
        chrome.tabs.executeScript(tab.id!,{
          code: 'isOpen = document.getElementById("pWebContainerState").innerText.toString(); isOpen;'
        },(injectionResults)=>{
            injectionResults[0] == "OPEN"
              ? (this.isFloatingPanelShow = true)
              : (this.isFloatingPanelShow = false);
          }
        );
      }
    });
  };

}
