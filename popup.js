document.getElementById('button1').addEventListener('click', async () => { 
    chrome.tabs.getSelected(null, (tab) => { 
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { 
        let url = tab.url; 
        if ( 
          url.includes("meet.google.com") || 
          url.includes("teams.microsoft.com") || 
          url.includes("teams.live.com") || 
          url.includes("zoom.us") || 
          url.includes("meet.jit.si") 
        ) { 
          chrome.tabs.executeScript(tab.id,{ 
            code: 'document.getElementById("buttonOnOff").click();' 
          }); 
        } 
        setTimeout(() => { 
          getOnOffState(); 
        }, 100); 
      }); 
    }); 
  })
// //ORIGINAL CHROME
// let buttonOn = document.getElementById('button1');
// let buttonChooseVideo = document.getElementById('button3');
// let button4WEB = document.getElementById('button4');
// let buttonChooseMic = document.getElementById('button5');
// let showActivated = false, classActivated = false, citbActivated,webContainerActivated,canChangeCameras,globalState = false;

// const getExtensionState = () =>{
//   let isOpen = document.getElementById('buttonOnOff').innerText.toString();
//   return isOpen;
// }

// var onOfChekerCounter = 0;
// const onOfChecker = (tab) => {
//   console.log(tab, onOfChekerCounter);

//   const url = tab.url;
//   if(url.includes('meet.google.com') || url.includes('teams.microsoft.com')||url.includes('teams.live.com')|| url.includes('zoom.us') || url.includes('meet.jit.si') ){
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: getExtensionState
//     },(injectionResults) => {
//       injectionResults[0].result == "true" ?
//                   globalState = true
//                   : globalState = false;
//       console.log(globalState);
//       if(globalState){
//           buttonOn.setAttribute('class','buttonOnOff');
//       }else{
//         buttonOn.setAttribute('class','buttonOnOffDeactivate');
//       }
//     });
//   }
//   //try again each second during 5 seconds
//   if (onOfChekerCounter < 5) {
//     onOfChekerCounter += 1
//     setTimeout(() => {
//       onOfChecker(tab);
//     },1000)
//   }else {
//     onOfChekerCounter = 0;
//   }

// }
// const getOnOffState = async() =>{
//   console.log("GET ON OFF STATE");
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   onOfChecker(tab);
// }
// getOnOffState();

// const clickOnOff = () =>{
//   console.log("CLICK ON OFF BUTTON")
//   document.getElementById("buttonOnOff").click();
// }

// buttonOn.addEventListener("click", async() =>{
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//     let url = tab.url;
//     if(url.includes('meet.google.com') || url.includes('teams.microsoft.com')||url.includes('teams.live.com') || url.includes('zoom.us') || url.includes('meet.jit.si')){
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: clickOnOff,
//       });
//     }
//     setTimeout(()=>{
//       getOnOffState();
//     },100);
//   });

// });

// const showContainer = () => {
//   let isOpen = document.getElementById('buttonOnOff').innerText.toString();
//   if(isOpen == "true")
//   {
//     document.getElementById('buttonsContainer').style.visibility = 'visible';
//     document.getElementById("pWebContainerState").innerText = "OPEN";
//   }
// };

// const closeContainer = () => {
//   document.getElementById('buttonsContainer').style.visibility = 'hidden';
//   document.getElementById("pWebContainerState").innerText = "CLOSE";
// };
// const setButtonWebContainerBackground = (isOpen) => {
//   if(isOpen){
//     button4WEB.className = "buttonOpen4WebContainer";
//   } else {
//     button4WEB.className = "button4WebContainer";
//   }
// }

// button4WEB.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   if(webContainerActivated)
//     {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: closeContainer,
//       });
//     }else{
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: showContainer,
//       });
//     }
//   webContainerActivated = !webContainerActivated;
//   setButtonWebContainerBackground(webContainerActivated);
// });

// const getWebContainerState = () =>{
//   let isOpen = document.getElementById('pWebContainerState').innerText.toString();
//   return isOpen;
// }
// const chekWebContainerState = async() => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: getWebContainerState
//   },(injectionResults) => {
//     injectionResults[0].result == "OPEN" ?
//                   webContainerActivated = true
//                 : webContainerActivated = false;
//     setButtonWebContainerBackground(webContainerActivated);
//   });
// }
// chekWebContainerState();

// const choose_Mic = () =>{
//   document.getElementById("buttonPopup").click();
// }
// buttonChooseMic.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: choose_Mic,
//     args: [true],
//   });
// });

// const choose_Video = () =>{
//   document.getElementById("buttonPopupVideo").click();
// }
// buttonChooseVideo.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: choose_Video,
//     args: [true],
//   });
// });


// //VERSION FIREFOX
// // Initialize select with default mode 
// let buttonOn = document.getElementById("button1"); 
// let buttonChooseVideo = document.getElementById("button3"); 
// let button4WEB = document.getElementById("button4"); 
// let buttonChooseMic = document.getElementById("button5"); 
// let showActivated = false, 
//   classActivated = false, 
//   citbActivated, 
//   webContainerActivated = true, 
//   canChangeCameras, 
//   globalState = false; 
 
// const getExtensionState = () => { 
//   let isOpen = document.getElementById("buttonOnOff").innerText.toString(); 
//   return isOpen; 
// }; 
 
// var onOfChekerCounter = 0; 
// const onOfChecker = (tab) => { 
//   const url = tab.url; 
//   if ( 
//     url.includes("meet.google.com") || 
//     url.includes("teams.microsoft.com") || 
//     url.includes("teams.live.com") || 
//     url.includes("zoom.us") || 
//     url.includes("meet.jit.si") 
//   ) { 
//     chrome.tabs.executeScript(tab.id,{ 
//       code: 'isOpen = document.getElementById("buttonOnOff").innerText.toString();isOpen;'       
//     },(injectionResults) => { 
//       injectionResults[0] == "true" ? 
//                   globalState = true 
//                   : globalState = false; 
//       if(globalState){  
//           buttonOn.setAttribute('class','buttonOnOff');  
//       }else{  
//         buttonOn.setAttribute('class','buttonOnOffDeactivate');  
//       }  
//     }); 
//   } 
//   //try again each second during 5 seconds 
//   if (onOfChekerCounter < 5) { 
//     onOfChekerCounter += 1; 
//     setTimeout(() => { 
//       onOfChecker(tab); 
//     }, 1000); 
//   } else { 
//     onOfChekerCounter = 0; 
//   } 
// }; 
// const getOnOffState = async () => { 
//   chrome.tabs.getSelected(null, (tab) => { 
//     onOfChecker(tab); 
//   }); 
// }; 
// getOnOffState(); 
 
 
 
// buttonOn.addEventListener("click", async () => { 
//   chrome.tabs.getSelected(null, (tab) => { 
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { 
//       let url = tab.url; 
//       if ( 
//         url.includes("meet.google.com") || 
//         url.includes("teams.microsoft.com") || 
//         url.includes("teams.live.com") || 
//         url.includes("zoom.us") || 
//         url.includes("meet.jit.si") 
//       ) { 
//         chrome.tabs.executeScript(tab.id,{ 
//           code: 'document.getElementById("buttonOnOff").click();' 
//         }); 
//       } 
//       setTimeout(() => { 
//         getOnOffState(); 
//       }, 100); 
//     }); 
//   }); 
// }); 
 
// const showContainer = () => { 
//   let isOpen = document.getElementById("buttonOnOff").innerText.toString(); 
//   if (isOpen == "true") { 
//     document.getElementById("buttonsContainer").style.visibility = "visible"; 
//     document.getElementById("pWebContainerState").innerText = "OPEN"; 
//   } 
// }; 
 
// const setButtonWebContainerBackground = (isOpen) => { 
//   console.log("setButtonWebContainerBackground",isOpen); 
//   if (isOpen) { 
//     button4WEB.className = "buttonOpen4WebContainer"; 
//   } else { 
//     button4WEB.className = "button4WebContainer"; 
//   } 
// }; 
 
// button4WEB.addEventListener("click", async () => { 
//   chrome.tabs.getSelected(null, (tab) => { 
//     console.log("click!!!",webContainerActivated); 
//     if (webContainerActivated) { 
//       chrome.tabs.executeScript(tab.id,{ 
//         code: 'document.getElementById("buttonsContainer").style.visibility = "hidden";document.getElementById("pWebContainerState").innerText = "CLOSE";' 
//       }); 
//     } else { 
//       chrome.tabs.executeScript(tab.id,{ 
//         code:"if(document.getElementById('buttonOnOff').innerText.toString() == 'true') { document.getElementById('buttonsContainer').style.visibility = 'visible'; document.getElementById('pWebContainerState').innerText = 'OPEN' }" 
//       }); 
//     } 
//     webContainerActivated = !webContainerActivated; 
//     setButtonWebContainerBackground(webContainerActivated); 
//     console.log("click222!!!",webContainerActivated); 
//   }); 
  
// }); 
 
// const chekWebContainerState = async () => { 
//   // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); 
//   chrome.tabs.getSelected(null, (tab) => { 
//     chrome.tabs.executeScript(tab.id,{ 
//       code: 'isOpen = document.getElementById("pWebContainerState").innerText.toString(); isOpen;' 
//     },(injectionResults)=>{ 
//         console.log(injectionResults) 
//         injectionResults[0] == "OPEN" 
//           ? (webContainerActivated = true) 
//           : (webContainerActivated = false); 
//           setButtonWebContainerBackground(webContainerActivated); 
//       } 
//     ); 
//   }); 
// }; 
// chekWebContainerState(); 
 
// buttonChooseMic.addEventListener("click", async () => { 
//   chrome.tabs.getSelected(null, (tab) => { 
//     chrome.tabs.executeScript(tab.id,{ 
//       code: 'document.getElementById("buttonPopup").click();' 
//     }); 
//   }); 
// }); 
 
// const choose_Video = () => { 
//   document.getElementById("buttonPopupVideo").click(); 
// }; 
// buttonChooseVideo.addEventListener("click", async () => { 
//   chrome.tabs.getSelected(null, (tab) => { 
//     chrome.tabs.executeScript(tab.id,{ 
//         code: 'document.getElementById("buttonPopupVideo").click();' 
//     }); 
//   }); 
// }); 