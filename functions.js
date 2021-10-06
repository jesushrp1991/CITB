        // var origAddTrack = RTCPeerConnection.prototype.addTrack;
        // RTCPeerConnection.prototype.addTrack = async function (track, stream) {
        //         console.log("this",this);
        //         console.log("arguments",arguments);
        //         if (window.peerConection == undefined) {
        //                 window.peerConection = this;
        //         } 
        //         window.currentMediaStream = stream;
        //         window.currentTrack = track;
        //         await origAddTrack.apply(this, arguments);
        // }
        // const checkVideo = async() =>{
        //         chrome.runtime.sendMessage({ getDefaultVideoId: true }, async function (response) {
        //                 let videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual");
        //                 const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId);
        //                 const currentTrackLabel = window.peerConection.getSenders().filter((s) => s.track.kind == 'video')[0].track.label;
        //                 let run = false;
              
        //                 if (defaultDevice.length > 0) {
        //                   run = defaultDevice[0].label != currentTrackLabel
        //                 }
              
        //                 if (response.farewell != defaultVideoId || run) {
        //                   defaultVideoId = response.farewell;
        //                   defaultVideoLabel = devices.filter(x => x.deviceId === defaultVideoId)[0].label;
        //                   if (window.assignModes){
        //                     window.assignModes();
        //                   }
              
        //                   await navigator.mediaDevices.getUserMedia({ video: { deviceId: 'virtual' }, audio: false });
        //                   const camVideoTrack = currentMediaStream.getVideoTracks()[0];
        //                   window.senders = window.peerConection.getSenders();
        //                   window.senders.filter(x => x.track.kind === 'video').forEach(mysender => {
        //                     mysender.replaceTrack(camVideoTrack);
        //                   })
        //                 }
        //         });
        //         document.getElementById('buttonCam').style.backgroundImage = window.citbCam 
        //         ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MyIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPGc+DQoJCTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjI1MC4xIiBjeT0iMjIwLjYiIHI9IjIzLjQiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMxNi4yLDE2My4ySDE4NGMtMTAuNiwwLTE5LjEsOC42LTE5LjEsMTkuMXY3Ni41YzAsMTAuNSw4LjYsMTkuMSwxOS4xLDE5LjFoMTMyLjINCgkJCWMxMC41LDAsMTkuMS04LjYsMTkuMS0xOS4xdi03Ni41QzMzNS4zLDE3MS44LDMyNi43LDE2My4yLDMxNi4yLDE2My4yeiBNMjUwLjEsMjU2LjdjLTE5LjksMC0zNi4xLTE2LjItMzYuMS0zNi4xDQoJCQlzMTYuMi0zNi4xLDM2LjEtMzYuMXMzNi4xLDE2LjIsMzYuMSwzNi4xUzI3MCwyNTYuNywyNTAuMSwyNTYuN3oiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MS45LDI2NS4yYy01LjgtNC41LTExLjMtNi42LTE1LTguMWMtMy43LTEuNi01LjgtMi4xLTUuOC0yLjFzMS44LDEuMSw1LjMsMy4yYzMuMiwyLjEsNy45LDUuNSwxMi4zLDEwLjUNCgkJYzIuMSwyLjQsMy45LDUuNSw1LDguN2MwLjgsMy4yLDAuNSw2LjYtMS4zLDkuNWMtMy40LDYtMTEuNiwxMC41LTIwLjIsMTMuOWMtMTcuNiw2LjYtMzguNiw5LjItNTYuNywxMC4yDQoJCWMtNy4xLDAuNS0xMy45LDAuNS0yMCwwLjV2MjguMWM3LjEtMC44LDE1LTIuMSwyMy40LTMuN2MxOS40LTQuMiw0MS4yLTEwLjUsNjAuMi0yMS44YzQuNy0yLjksOS4yLTYsMTMuMS05LjcNCgkJYzMuOS0zLjcsNy40LTguMSw5LjItMTMuN2MxLjgtNS4zLDEuMy0xMS4zLTEuMS0xNS41QzM3Ny45LDI3MC4yLDM3NC43LDI2Ny4zLDM3MS45LDI2NS4yeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMsMzEzLjhjMTguOSwxMS4zLDQwLjcsMTcuNiw2MC4yLDIxLjhjNi4zLDEuMywxMi42LDIuNCwxOC40LDMuMnYxNi44bDM0LjItMjkuNGwtMzQuMi0yOS40djE0LjQNCgkJYy00LjcsMC05LjctMC4zLTE1LTAuNWMtMTguMS0xLjEtMzkuMS0zLjQtNTYuNy0xMGMtOC43LTMuMi0xNi44LTcuOS0yMC41LTEzLjdjLTEuOC0yLjktMi40LTYtMS4zLTkuNWMwLjgtMy4yLDIuNi02LjMsNC43LTguNw0KCQljNC4yLTUsOC45LTguMSwxMi4zLTEwLjVjMy4yLTIuMSw1LjMtMy4yLDUuMy0zLjJzLTIuMSwwLjUtNS44LDIuMWMtMy43LDEuNi04LjksMy43LTE1LDguMWMtMi45LDIuNC02LDUuMy04LjEsOS41DQoJCWMtMi4xLDQuMi0yLjYsMTAuMi0wLjgsMTUuNWMxLjgsNS4zLDUuNSw5LjcsOS41LDEzLjdDMTMzLjgsMzA3LjgsMTM4LjMsMzEwLjksMTQzLDMxMy44eiIvPg0KPC9nPg0KPC9zdmc+DQo=")'
        //         : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MC4xIiBjeT0iMjUwLjIiIHI9IjE4Ni4zIi8+DQo8Zz4NCgk8Zz4NCgkJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMjUwLjIiIGN5PSIyMjAuNSIgcj0iMjMuNCIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzE2LjMsMTYzLjFIMTg0LjFjLTEwLjYsMC0xOS4xLDguNi0xOS4xLDE5LjF2NzYuNWMwLDEwLjUsOC42LDE5LjEsMTkuMSwxOS4xaDEzMi4yDQoJCQljMTAuNSwwLDE5LjEtOC42LDE5LjEtMTkuMXYtNzYuNUMzMzUuNCwxNzEuNywzMjYuOCwxNjMuMSwzMTYuMywxNjMuMXogTTI1MC4yLDI1Ni42Yy0xOS45LDAtMzYuMS0xNi4yLTM2LjEtMzYuMQ0KCQkJczE2LjItMzYuMSwzNi4xLTM2LjFzMzYuMSwxNi4yLDM2LjEsMzYuMVMyNzAuMSwyNTYuNiwyNTAuMiwyNTYuNnoiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MiwyNjUuMWMtNS44LTQuNS0xMS4zLTYuNi0xNS04LjFjLTMuNy0xLjYtNS44LTIuMS01LjgtMi4xczEuOCwxLjEsNS4zLDMuMmMzLjIsMi4xLDcuOSw1LjUsMTIuMywxMC41DQoJCWMyLjEsMi40LDMuOSw1LjUsNSw4LjdjMC44LDMuMiwwLjUsNi42LTEuMyw5LjVjLTMuNCw2LTExLjYsMTAuNS0yMC4yLDEzLjljLTE3LjYsNi42LTM4LjYsOS4yLTU2LjcsMTAuMg0KCQljLTcuMSwwLjUtMTMuOSwwLjUtMjAsMC41djI4LjFjNy4xLTAuOCwxNS0yLjEsMjMuNC0zLjdjMTkuNC00LjIsNDEuMi0xMC41LDYwLjItMjEuOGM0LjctMi45LDkuMi02LDEzLjEtOS43DQoJCWMzLjktMy43LDcuNC04LjEsOS4yLTEzLjdjMS44LTUuMywxLjMtMTEuMy0xLjEtMTUuNUMzNzgsMjcwLjEsMzc0LjksMjY3LjIsMzcyLDI2NS4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMuMiwzMTMuN2MxOC45LDExLjMsNDAuNywxNy42LDYwLjIsMjEuOGM2LjMsMS4zLDEyLjYsMi40LDE4LjQsMy4ydjE2LjhsMzQuMi0yOS40bC0zNC4yLTI5LjR2MTQuNA0KCQljLTQuNywwLTkuNy0wLjMtMTUtMC41Yy0xOC4xLTEuMS0zOS4xLTMuNC01Ni43LTEwYy04LjctMy4yLTE2LjgtNy45LTIwLjUtMTMuN2MtMS44LTIuOS0yLjQtNi0xLjMtOS41YzAuOC0zLjIsMi42LTYuMyw0LjctOC43DQoJCWM0LjItNSw4LjktOC4xLDEyLjMtMTAuNWMzLjItMi4xLDUuMy0zLjIsNS4zLTMuMnMtMi4xLDAuNS01LjgsMi4xYy0zLjcsMS42LTguOSwzLjctMTUsOC4xYy0yLjksMi40LTYsNS4zLTguMSw5LjUNCgkJYy0yLjEsNC4yLTIuNiwxMC4yLTAuOCwxNS41czUuNSw5LjcsOS41LDEzLjdDMTM0LDMwNy43LDEzOC40LDMxMC45LDE0My4yLDMxMy43eiIvPg0KPC9nPg0KPC9zdmc+DQo=")'
        //         document.getElementById('buttonCam').style.backgroundSize = '60px 60px !important';
        //         document.getElementById('buttonCam').style.backgroundRepeat = 'no-repeat';
        //         document.getElementById('buttonCam').style.backgroundPosition = 'center';
                
        // };



        
// var videoElement = document.querySelector('video');
// // var audioSelect = document.querySelector('select#audioSource');
// // var videoSelect = document.querySelector('select#videoSource');

// function getDevices() {
//   // AFAICT in Safari this only gets default devices until gUM is called :/
//   return navigator.mediaDevices.enumerateDevices();
// }

// function gotDevices(deviceInfos) {
//   window.deviceInfos = deviceInfos; // make available to console
//   console.log('Available input and output devices:', deviceInfos);
//   for (const deviceInfo of deviceInfos) {
//     const option = document.createElement('option');
//     option.value = deviceInfo.deviceId;
//     if (deviceInfo.kind === 'audioinput') {
//       option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
//       audioSelect.appendChild(option);
//     } else if (deviceInfo.kind === 'videoinput') {
//       option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
//       videoSelect.appendChild(option);
//     }
//   }
// }

// function getStream() {
//   if (window.stream) {
//     window.stream.getTracks().forEach(track => {
//       track.stop();
//     });
//   }
//   const audioSource = audioSelect.value;
//   const videoSource = videoSelect.value;
//   const constraints = {
//     audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
//     video: {deviceId: videoSource ? {exact: videoSource} : undefined}
//   };
//   return navigator.mediaDevices.getUserMedia(constraints).
//     then(gotStream).catch(handleError);
// }

// function gotStream(stream) {
//   window.stream = stream; // make stream available to console
//   audioSelect.selectedIndex = [...audioSelect.options].
//     findIndex(option => option.text === stream.getAudioTracks()[0].label);
//   videoSelect.selectedIndex = [...videoSelect.options].
//     findIndex(option => option.text === stream.getVideoTracks()[0].label);
//   videoElement.srcObject = stream;
// }

// function handleError(error) {
//   console.error('Error: ', error);
// }

        

const testFunction = () =>{
        console.log("Test function");
}
        