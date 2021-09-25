import { 
  getButtonCam,
  getButtonClass,
  getButtonShow,
  setMode,
  setMicrophone,
  setVideo,
  getContainerButton
} from './domUtils.js';

function monkeyPatchMediaDevices() {
  if (window.location.host === 'meet.google.com') {
    const MYVIDEODDEVICELABEL = 'EasyCamera';
    const MYAUDIODEVICELABEL = 'Micrófono (Realtek High Definition Audio)';
    
    document.onreadystatechange = (event) => {
  
      window.assignModes = () => {
        chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultMode: true }, async function (response) {
          if (response && response.farewell){
            console.log('---todo ha ido bien', response.farewell);
            window.activatedMode = response.farewell;
            window.showActivated = window.activatedMode === 'show';
            window.classActivated = window.activatedMode === 'class';
            console.log('---class activated', window.classActivated);
            setButtonShowBackground(window.showActivated);
            setButtonClassBackground(window.classActivated);
          }
        });
        if (defaultVideoId && defaultVideoLabel) {
          window.citbActivated = defaultVideoLabel.includes(MYVIDEODDEVICELABEL)
          setButtonCamBackground(window.citbActivated)
        } 
      }

      const setButtonCamBackground = (activated) => {
        buttonCam.style.background = activated 
            ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MyIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPGc+DQoJCTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjI1MC4xIiBjeT0iMjIwLjYiIHI9IjIzLjQiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMxNi4yLDE2My4ySDE4NGMtMTAuNiwwLTE5LjEsOC42LTE5LjEsMTkuMXY3Ni41YzAsMTAuNSw4LjYsMTkuMSwxOS4xLDE5LjFoMTMyLjINCgkJCWMxMC41LDAsMTkuMS04LjYsMTkuMS0xOS4xdi03Ni41QzMzNS4zLDE3MS44LDMyNi43LDE2My4yLDMxNi4yLDE2My4yeiBNMjUwLjEsMjU2LjdjLTE5LjksMC0zNi4xLTE2LjItMzYuMS0zNi4xDQoJCQlzMTYuMi0zNi4xLDM2LjEtMzYuMXMzNi4xLDE2LjIsMzYuMSwzNi4xUzI3MCwyNTYuNywyNTAuMSwyNTYuN3oiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MS45LDI2NS4yYy01LjgtNC41LTExLjMtNi42LTE1LTguMWMtMy43LTEuNi01LjgtMi4xLTUuOC0yLjFzMS44LDEuMSw1LjMsMy4yYzMuMiwyLjEsNy45LDUuNSwxMi4zLDEwLjUNCgkJYzIuMSwyLjQsMy45LDUuNSw1LDguN2MwLjgsMy4yLDAuNSw2LjYtMS4zLDkuNWMtMy40LDYtMTEuNiwxMC41LTIwLjIsMTMuOWMtMTcuNiw2LjYtMzguNiw5LjItNTYuNywxMC4yDQoJCWMtNy4xLDAuNS0xMy45LDAuNS0yMCwwLjV2MjguMWM3LjEtMC44LDE1LTIuMSwyMy40LTMuN2MxOS40LTQuMiw0MS4yLTEwLjUsNjAuMi0yMS44YzQuNy0yLjksOS4yLTYsMTMuMS05LjcNCgkJYzMuOS0zLjcsNy40LTguMSw5LjItMTMuN2MxLjgtNS4zLDEuMy0xMS4zLTEuMS0xNS41QzM3Ny45LDI3MC4yLDM3NC43LDI2Ny4zLDM3MS45LDI2NS4yeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMsMzEzLjhjMTguOSwxMS4zLDQwLjcsMTcuNiw2MC4yLDIxLjhjNi4zLDEuMywxMi42LDIuNCwxOC40LDMuMnYxNi44bDM0LjItMjkuNGwtMzQuMi0yOS40djE0LjQNCgkJYy00LjcsMC05LjctMC4zLTE1LTAuNWMtMTguMS0xLjEtMzkuMS0zLjQtNTYuNy0xMGMtOC43LTMuMi0xNi44LTcuOS0yMC41LTEzLjdjLTEuOC0yLjktMi40LTYtMS4zLTkuNWMwLjgtMy4yLDIuNi02LjMsNC43LTguNw0KCQljNC4yLTUsOC45LTguMSwxMi4zLTEwLjVjMy4yLTIuMSw1LjMtMy4yLDUuMy0zLjJzLTIuMSwwLjUtNS44LDIuMWMtMy43LDEuNi04LjksMy43LTE1LDguMWMtMi45LDIuNC02LDUuMy04LjEsOS41DQoJCWMtMi4xLDQuMi0yLjYsMTAuMi0wLjgsMTUuNWMxLjgsNS4zLDUuNSw5LjcsOS41LDEzLjdDMTMzLjgsMzA3LjgsMTM4LjMsMzEwLjksMTQzLDMxMy44eiIvPg0KPC9nPg0KPC9zdmc+DQo=")'
            : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MC4xIiBjeT0iMjUwLjIiIHI9IjE4Ni4zIi8+DQo8Zz4NCgk8Zz4NCgkJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMjUwLjIiIGN5PSIyMjAuNSIgcj0iMjMuNCIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzE2LjMsMTYzLjFIMTg0LjFjLTEwLjYsMC0xOS4xLDguNi0xOS4xLDE5LjF2NzYuNWMwLDEwLjUsOC42LDE5LjEsMTkuMSwxOS4xaDEzMi4yDQoJCQljMTAuNSwwLDE5LjEtOC42LDE5LjEtMTkuMXYtNzYuNUMzMzUuNCwxNzEuNywzMjYuOCwxNjMuMSwzMTYuMywxNjMuMXogTTI1MC4yLDI1Ni42Yy0xOS45LDAtMzYuMS0xNi4yLTM2LjEtMzYuMQ0KCQkJczE2LjItMzYuMSwzNi4xLTM2LjFzMzYuMSwxNi4yLDM2LjEsMzYuMVMyNzAuMSwyNTYuNiwyNTAuMiwyNTYuNnoiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MiwyNjUuMWMtNS44LTQuNS0xMS4zLTYuNi0xNS04LjFjLTMuNy0xLjYtNS44LTIuMS01LjgtMi4xczEuOCwxLjEsNS4zLDMuMmMzLjIsMi4xLDcuOSw1LjUsMTIuMywxMC41DQoJCWMyLjEsMi40LDMuOSw1LjUsNSw4LjdjMC44LDMuMiwwLjUsNi42LTEuMyw5LjVjLTMuNCw2LTExLjYsMTAuNS0yMC4yLDEzLjljLTE3LjYsNi42LTM4LjYsOS4yLTU2LjcsMTAuMg0KCQljLTcuMSwwLjUtMTMuOSwwLjUtMjAsMC41djI4LjFjNy4xLTAuOCwxNS0yLjEsMjMuNC0zLjdjMTkuNC00LjIsNDEuMi0xMC41LDYwLjItMjEuOGM0LjctMi45LDkuMi02LDEzLjEtOS43DQoJCWMzLjktMy43LDcuNC04LjEsOS4yLTEzLjdjMS44LTUuMywxLjMtMTEuMy0xLjEtMTUuNUMzNzgsMjcwLjEsMzc0LjksMjY3LjIsMzcyLDI2NS4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMuMiwzMTMuN2MxOC45LDExLjMsNDAuNywxNy42LDYwLjIsMjEuOGM2LjMsMS4zLDEyLjYsMi40LDE4LjQsMy4ydjE2LjhsMzQuMi0yOS40bC0zNC4yLTI5LjR2MTQuNA0KCQljLTQuNywwLTkuNy0wLjMtMTUtMC41Yy0xOC4xLTEuMS0zOS4xLTMuNC01Ni43LTEwYy04LjctMy4yLTE2LjgtNy45LTIwLjUtMTMuN2MtMS44LTIuOS0yLjQtNi0xLjMtOS41YzAuOC0zLjIsMi42LTYuMyw0LjctOC43DQoJCWM0LjItNSw4LjktOC4xLDEyLjMtMTAuNWMzLjItMi4xLDUuMy0zLjIsNS4zLTMuMnMtMi4xLDAuNS01LjgsMi4xYy0zLjcsMS42LTguOSwzLjctMTUsOC4xYy0yLjksMi40LTYsNS4zLTguMSw5LjUNCgkJYy0yLjEsNC4yLTIuNiwxMC4yLTAuOCwxNS41czUuNSw5LjcsOS41LDEzLjdDMTM0LDMwNy43LDEzOC40LDMxMC45LDE0My4yLDMxMy43eiIvPg0KPC9nPg0KPC9zdmc+DQo=")'
      }
    
      const setButtonShowBackground = (activated) => {
        buttonShow.style.background = activated 
            ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0NSIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1NC4zLDE1NC45Yy0wLjktMC40LTItMC4zLTIuOCwwLjRsLTYxLjMsNTEuMWgtNjEuMWMtMS40LDAtMi42LDEuMi0yLjYsMi42djgyLjdjMCwxLjQsMS4yLDIuNiwyLjYsMi42DQoJCWg2MS4xbDYxLjMsNTEuMWMwLjUsMC40LDEuMSwwLjYsMS43LDAuNmMwLjQsMCwwLjctMC4xLDEuMS0wLjJjMC45LTAuNCwxLjUtMS4zLDEuNS0yLjNWMTU3LjINCgkJQzI1NS44LDE1Ni4yLDI1NS4yLDE1NS4zLDI1NC4zLDE1NC45eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMDEuMywyMTguNWMtMSwxLTEsMi42LDAsMy43YzcuMyw3LjMsMTEuNCwxNy4xLDExLjQsMjcuNGMwLDEwLjQtNCwyMC4xLTExLjQsMjcuNGMtMSwxLTEsMi42LDAsMy43DQoJCWMwLjUsMC41LDEuMiwwLjgsMS44LDAuOGMwLjcsMCwxLjMtMC4zLDEuOC0wLjhjOC4zLTguMywxMi45LTE5LjMsMTIuOS0zMS4xcy00LjYtMjIuOC0xMi45LTMxLjENCgkJQzMwMy45LDIxNy41LDMwMi4zLDIxNy41LDMwMS4zLDIxOC41eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMjYuOSwxOTYuNWMtMS0xLTIuNi0xLTMuNywwYy0xLDEtMSwyLjYsMCwzLjdjMjcuMiwyNy4yLDI3LjIsNzEuNSwwLDk4LjdjLTEsMS0xLDIuNiwwLDMuNw0KCQljMC41LDAuNSwxLjIsMC44LDEuOCwwLjhjMC43LDAsMS4zLTAuMywxLjgtMC44YzE0LjItMTQuMiwyMi0zMywyMi01M1MzNDEsMjEwLjcsMzI2LjksMTk2LjV6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM0OC44LDE3NC42Yy0xLTEtMi42LTEtMy43LDBjLTEsMS0xLDIuNiwwLDMuN2MzOS4zLDM5LjMsMzkuMywxMDMuMywwLDE0Mi42Yy0xLDEtMSwyLjYsMCwzLjcNCgkJYzAuNSwwLjUsMS4yLDAuOCwxLjgsMC44YzAuNywwLDEuMy0wLjMsMS44LTAuOEMzOTAuMSwyODMuMiwzOTAuMSwyMTUuOSwzNDguOCwxNzQuNnoiLz4NCjwvZz4NCjwvc3ZnPg0K")'
            : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MCIgY3k9IjI1MC4yIiByPSIxODYuMyIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1NC4zLDE1NC44Yy0wLjktMC40LTItMC4zLTIuOCwwLjRsLTYxLjMsNTEuMWgtNjEuMWMtMS40LDAtMi42LDEuMi0yLjYsMi42djgyLjdjMCwxLjQsMS4yLDIuNiwyLjYsMi42DQoJCWg2MS4xbDYxLjMsNTEuMWMwLjUsMC40LDEuMSwwLjYsMS43LDAuNmMwLjQsMCwwLjctMC4xLDEuMS0wLjJjMC45LTAuNCwxLjUtMS4zLDEuNS0yLjNWMTU3LjINCgkJQzI1NS44LDE1Ni4yLDI1NS4yLDE1NS4yLDI1NC4zLDE1NC44eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMDEuMywyMTguNGMtMSwxLTEsMi42LDAsMy43YzcuMyw3LjMsMTEuNCwxNy4xLDExLjQsMjcuNGMwLDEwLjQtNCwyMC4xLTExLjQsMjcuNGMtMSwxLTEsMi42LDAsMy43DQoJCWMwLjUsMC41LDEuMiwwLjgsMS44LDAuOGMwLjcsMCwxLjMtMC4zLDEuOC0wLjhjOC4zLTguMywxMi45LTE5LjMsMTIuOS0zMS4xcy00LjYtMjIuOC0xMi45LTMxLjENCgkJQzMwMy45LDIxNy40LDMwMi4zLDIxNy40LDMwMS4zLDIxOC40eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMjYuOSwxOTYuNWMtMS0xLTIuNi0xLTMuNywwYy0xLDEtMSwyLjYsMCwzLjdjMjcuMiwyNy4yLDI3LjIsNzEuNSwwLDk4LjdjLTEsMS0xLDIuNiwwLDMuNw0KCQljMC41LDAuNSwxLjIsMC44LDEuOCwwLjhjMC43LDAsMS4zLTAuMywxLjgtMC44YzE0LjItMTQuMiwyMi0zMywyMi01M0MzNDguOCwyMjkuNSwzNDEsMjEwLjcsMzI2LjksMTk2LjV6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM0OC44LDE3NC42Yy0xLTEtMi42LTEtMy43LDBjLTEsMS0xLDIuNiwwLDMuN2MzOS4zLDM5LjMsMzkuMywxMDMuMywwLDE0Mi42Yy0xLDEtMSwyLjYsMCwzLjcNCgkJYzAuNSwwLjUsMS4yLDAuOCwxLjgsMC44YzAuNywwLDEuMy0wLjMsMS44LTAuOEMzOTAuMSwyODMuMSwzOTAuMSwyMTUuOSwzNDguOCwxNzQuNnoiLz4NCjwvZz4NCjwvc3ZnPg0K")'
      }
    
      const setButtonClassBackground = (activated) => {
        console.log('activated', activated);
        buttonClass.style.background = activated 
            ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojQzZDNkM2O30KCS5zdDF7ZmlsbDojRkZGRkZGO30KCS5zdDJ7ZmlsbDojRkZGRkZGO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDo1LjU0OTU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0M3tmaWxsOiNEQzMzMzY7fQoJLnN0NHtmaWxsOiNGNEMzMTI7fQoJLnN0NXtmaWxsOiM0RUIwNTY7fQoJLnN0NntmaWxsOiM1NDdEQkU7fQoJLnN0N3tmaWxsOiNFREVERUQ7fQoJLnN0OHtmaWxsOiNEQURBREE7fQoJLnN0OXtjbGlwLXBhdGg6dXJsKCNTVkdJRF8yXyk7ZmlsbDojREFEQURBO30KPC9zdHlsZT4KPGNpcmNsZSBjbGFzcz0ic3Q0IiBjeD0iMjUwIiBjeT0iMjUwLjMiIHI9IjE4Ni4zIi8+CjxnPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE5MC42LDMyOS42YzcuMSwwLDEyLjgtNS43LDEyLjgtMTIuOGMwLTctNS43LTEyLjgtMTIuOC0xMi44Yy03LDAtMTIuOCw1LjctMTIuOCwxMi44CgkJCUMxNzcuOCwzMjMuOSwxODMuNSwzMjkuNiwxOTAuNiwzMjkuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTkwLjYsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMyMTMuOSwzNDIuNywyMDMuNSwzMzIuMiwxOTAuNiwzMzIuMnoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTEuMiwzMjkuNmM3LjEsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNy4xLDAtMTIuOCw1LjctMTIuOCwxMi44CgkJCUMyMzguNCwzMjMuOSwyNDQuMSwzMjkuNiwyNTEuMiwzMjkuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUxLjIsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMyNzQuNSwzNDIuNywyNjQuMSwzMzIuMiwyNTEuMiwzMzIuMnoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMTEuOCwzMjkuNmM3LDAsMTIuOC01LjcsMTIuOC0xMi44YzAtNy01LjctMTIuOC0xMi44LTEyLjhjLTcuMSwwLTEyLjgsNS43LTEyLjgsMTIuOAoJCQlDMjk5LDMyMy45LDMwNC44LDMyOS42LDMxMS44LDMyOS42eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMTEuOCwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzMzNS4yLDM0Mi43LDMyNC43LDMzMi4yLDMxMS44LDMzMi4yeiIvPgoJPC9nPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM0MS43LDE2NC4xdjkzLjRjMCwxMC43LTkuNCwxOS41LTIxLDE5LjVIMTc5LjNjLTExLjYsMC0yMS04LjgtMjEtMTkuNXYtOTMuNGMwLTEwLjcsOS40LTE5LjUsMjEtMTkuNWgxNDEuNQoJCUMzMzIuMywxNDQuNiwzNDEuNywxNTMuMywzNDEuNywxNjQuMXoiLz4KPC9nPgo8L3N2Zz4K")'
            : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojQzZDNkM2O30KCS5zdDF7ZmlsbDojRkZGRkZGO30KCS5zdDJ7ZmlsbDojRkZGRkZGO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDo1LjU0OTU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0M3tmaWxsOiNEQzMzMzY7fQoJLnN0NHtmaWxsOiNGNEMzMTI7fQoJLnN0NXtmaWxsOiM0RUIwNTY7fQoJLnN0NntmaWxsOiM1NDdEQkU7fQoJLnN0N3tmaWxsOiNFREVERUQ7fQoJLnN0OHtmaWxsOiNEQURBREE7fQoJLnN0OXtjbGlwLXBhdGg6dXJsKCNTVkdJRF8yXyk7ZmlsbDojREFEQURBO30KPC9zdHlsZT4KPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMjUwLjYiIGN5PSIyNTAuMiIgcj0iMTg2LjMiLz4KPGc+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTkxLjIsMzI5LjVjNy4xLDAsMTIuOC01LjcsMTIuOC0xMi44YzAtNy01LjctMTIuOC0xMi44LTEyLjhjLTcsMC0xMi44LDUuNy0xMi44LDEyLjgKCQkJQzE3OC40LDMyMy44LDE4NC4xLDMyOS41LDE5MS4yLDMyOS41eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOTEuMiwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzIxNC41LDM0Mi42LDIwNCwzMzIuMiwxOTEuMiwzMzIuMnoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTEuOCwzMjkuNWM3LjEsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNy4xLDAtMTIuOCw1LjctMTIuOCwxMi44CgkJCUMyMzksMzIzLjgsMjQ0LjcsMzI5LjUsMjUxLjgsMzI5LjV6Ii8+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1MS44LDMzMi4yYy0xMi45LDAtMjMuMywxMC41LTIzLjMsMjMuM3YxOS40aDQ2Ljd2LTE5LjRDMjc1LjEsMzQyLjYsMjY0LjcsMzMyLjIsMjUxLjgsMzMyLjJ6Ii8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzEyLjQsMzI5LjVjNywwLDEyLjgtNS43LDEyLjgtMTIuOGMwLTctNS43LTEyLjgtMTIuOC0xMi44Yy03LjEsMC0xMi44LDUuNy0xMi44LDEyLjgKCQkJQzI5OS42LDMyMy44LDMwNS40LDMyOS41LDMxMi40LDMyOS41eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMTIuNCwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzMzNS44LDM0Mi42LDMyNS4zLDMzMi4yLDMxMi40LDMzMi4yeiIvPgoJPC9nPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM0Mi4zLDE2NHY5My40YzAsMTAuNy05LjQsMTkuNS0yMSwxOS41SDE3OS45Yy0xMS42LDAtMjEtOC44LTIxLTE5LjVWMTY0YzAtMTAuNyw5LjQtMTkuNSwyMS0xOS41aDE0MS41CgkJQzMzMi45LDE0NC41LDM0Mi4zLDE1My4zLDM0Mi4zLDE2NHoiLz4KPC9nPgo8L3N2Zz4K")'
      }

      const buttonShow = getButtonShow();
      buttonShow.addEventListener('click', () => {
        if (window.classActivated) {
          const goodmic = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(MYAUDIODEVICELABEL)));
          if(goodmic.length > 0){
            setMicrophone(goodmic[0].deviceId);
          }else{
            alert('no se ha podido cambiar el microfono');
          }
        }
        setMode(window.showActivated ? 'none' : 'show');
      })
      const buttonClass = getButtonClass();
      buttonClass.addEventListener('click', () => {
        if (window.classActivated) {
          const goodmic = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(MYAUDIODEVICELABEL)));
          if(goodmic.length > 0){
            setMicrophone(goodmic[0].deviceId);
            setMode('none');
          }else{
            alert('no se ha podido cambiar el microfono');
          }
        }else {
          const remainingMics = devices.filter(x => (x.kind === 'audioinput' && x.deviceId != defaultMicrophoneId));
          if (remainingMics.length > 0){
            setMicrophone(remainingMics[0].deviceId);
            setMode('class');
          }else{
            alert('no se ha podido cambiar el mic');
          }
        }
      })
      const buttonCam = getButtonCam();
      buttonCam.addEventListener('click', () => {
        if (window.citbActivated){
          const remainingVideos = devices.filter(x => (x.kind === 'videoinput' && x.deviceId != defaultVideoId));
          if (remainingVideos.length > 0){
            setVideo(remainingVideos[0].deviceId);
          }else{
            alert('no se ha podido cambiar el video');
          }
        }else{
          const goodVideo = devices.filter(x => (x.kind === 'videoinput' && x.label.includes(MYVIDEODDEVICELABEL)));
          if(goodVideo.length > 0){
            setVideo(goodVideo[0].deviceId);
          }else{
            alert('no se ha podido cambiar el video');
          }
        }
      })
      const div = getContainerButton();
      const br = document.createElement('br');
      const br1 = document.createElement('br');
      div.appendChild(buttonCam);
      div.appendChild(br);
      div.appendChild(buttonShow);
      div.appendChild(br1);
      div.appendChild(buttonClass);
      document.body.appendChild(div);
    }

    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origAddTrack = RTCPeerConnection.prototype.addTrack;
    var origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
    var currentMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultVideoId, defaultMode, defaultVideoLabel, defaultMicrophoneId, defaultMicrophoneLabel;
    let devices = [];
    window.voice1 = new Pizzicato.Sound({ source: 'input' });
    window.voice2 = new Pizzicato.Sound({
      source: 'wave',
      options: {
        frequency: 440
      }
    });

    RTCPeerConnection.prototype.addTrack = async function (track, stream) {
      console.log("ADDING TRACK", track)
      console.log("ADDING STREAM", stream)
      if (window.peerConection == undefined) 
        window.peerConection = this;
      window.currentMediaStream = stream;
      window.currentTrack = track;
      await origAddTrack.apply(this, arguments);
    }

    RTCRtpSender.prototype.replaceTrack = async function (track) {
      console.log("REPLACE TRACK");
      window.rtcsender = this;
      origReplaceTrack.apply(this, arguments);
    }

    const checkingVideo = async function () {
      chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultVideoId: true }, async function (response) {
        if (response && response.farewell && window.peerConection) {
          const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual")
          const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId)
          const otherDevices = videoDevices.filter(d => d.deviceId != defaultVideoId && d.deviceId.exact != defaultVideoId)
          const currentTrackLabel = window.peerConection.getSenders().filter((s) => s.track.kind == 'video')[0].track.label
          let run = false
          if (defaultDevice.length > 0) {
            run = defaultDevice[0].label != currentTrackLabel
          }
          console.log("OUTSIDE OUTSIDE", defaultDevice[0].label, currentTrackLabel)

          if (response.farewell != defaultVideoId || run) {
            console.log("INSIDE INSIDE", defaultDevice[0].label, currentTrackLabel)
            defaultVideoId = response.farewell;
            defaultVideoLabel = devices.filter(x => x.deviceId === defaultVideoId)[0].label;
            window.assignModes();
            await navigator.mediaDevices.getUserMedia({ video: { deviceId: 'virtual' }, audio: false });
            const camVideoTrack = currentMediaStream.getVideoTracks()[0];
            // await window.peerConection.addTrack(camVideoTrack, currentMediaStream);
            window.senders = window.peerConection.getSenders();
            window.senders.filter(x => x.track.kind === 'video').forEach(mysender => {
              mysender.replaceTrack(camVideoTrack);
            })
          }
        }
      });
    }

    const checkingMicrophoneId = async function () {
      chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultMicrophoneId: true }, async function (response) {
        if (response && response.farewell && window.peerConection) {
          console.log('***microphoneIDchecking', response.farewell);
          const audioDevices = devices.filter(d => d.kind == "audioinput" && d.deviceId != "virtual")
          const defaultDevice = audioDevices.filter(d => d.deviceId == defaultMicrophoneId || d.deviceId.exact == defaultMicrophoneId)
          const currentTrackLabel = window.peerConection.getSenders().filter((s) => s.track.kind == 'audio')[0].track.label;
          let run = false
          if (defaultDevice.length > 0) {
            run = defaultDevice[0].label != currentTrackLabel
          }
          console.log("OUTSIDE OUTSIDE", defaultDevice[0].label, currentTrackLabel)

          if (response.farewell != defaultMicrophoneId || run) {
            console.log("INSIDE INSIDE", defaultDevice[0].label, currentTrackLabel)
            defaultMicrophoneId = response.farewell;
            defaultMicrophoneLabel = devices.filter(x => x.deviceId === defaultMicrophoneId)[0].label;
            window.assignModes();
            currentAudioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: defaultMicrophoneId }, video: false });
            const micAudioTrack = currentAudioMediaStream.getAudioTracks()[0];
            // await window.peerConection.addTrack(camVideoTrack, currentMediaStream);
            window.senders = window.peerConection.getSenders();
            window.senders.filter(x => x.track.kind === 'audio').forEach(mysender => {
              mysender.replaceTrack(micAudioTrack);
            })
          }
        }
      });
    }

    const checkingMode = async function () {
      chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultMode: true }, async function (response) {
        if (response && response.farewell) {
          if (response.farewell != defaultMode) {
            defaultMode = response.farewell;
            if (defaultMode === 'show') {
              window.voice1.play();
              window.voice2.play();
              window.voice2.stop();
            } else if (defaultMode === 'class') {
              window.voice1.stop();
              window.voice2.stop();
            } else {
              window.voice1.stop();
              window.voice2.stop();
            }
          }
          window.assignModes();
        }
      });
    }

    setInterval(checkingVideo, 3000);
    setInterval(checkingMode, 3000);
    setInterval(checkingMicrophoneId, 3000);
    MediaDevices.prototype.enumerateDevices = async function () {
      const res = await enumerateDevicesFn.call(navigator.mediaDevices);
      devices = res;
      res.push({
        deviceId: "virtual",
        groupID: "uh",
        kind: "videoinput",
        label: "Virtual Class In The Box",
      });
      console.log(res);
      chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { devicesList: res }, function (response) {
        if (response.farewell) {
          defaultVideoId = response.farewell;
          defaultVideoLabel = res.filter(x => x.deviceId === defaultVideoId)[0].label;
          console.log("WILL CHANGE USERMEDIA", defaultVideoId)
        }
      });
      if (defaultVideoId != undefined) {
        setMediaStreamTracks()
      }
      return res;
    };

    async function setMediaStreamTracks() {
      const constraints = {
        video: {
          deviceId: { exact: defaultVideoId },
        },
        audio: false,
      };

      const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual")
      const defaultDevice = videoDevices.filter(d => d.deviceId == defaultVideoId || d.deviceId.exact == defaultVideoId)
      const otherDevices = videoDevices.filter(d => d.deviceId != defaultVideoId && d.deviceId.exact != defaultVideoId)

      if (defaultDevice.length == 0) {
        let otherID = typeof otherDevices[0].deviceId == 'string' ? otherDevices[0].deviceId : otherDevices[0].deviceId.exact
        constraints.video.deviceId.exact = otherID
      }

      const media = await getUserMediaFn.call(
        navigator.mediaDevices,
        constraints
      );
      let actualTracks = currentMediaStream.getTracks()
      actualTracks.forEach(t => t.enabled = false)
      media.getTracks().forEach(mt => currentMediaStream.addTrack(mt))
      actualTracks.filter(t => t.enabled == false).forEach(dt => currentMediaStream.removeTrack(dt))

      console.log("RESULTING media", currentMediaStream)
      console.log("RESULTING tracks", currentMediaStream.getTracks())
      currentMediaStream.getTracks().forEach(t => {
        t.applyConstraints();
        console.log(t.getSettings())
      });

      var video = document.getElementsByTagName('video')[0]
      if (video != undefined) {
        video.srcObject = currentMediaStream
      }
    }

    MediaDevices.prototype.getUserMedia = async function () {
      console.log("INSIDE MEDIA DEVICE GET USERMEDIA")
      const args = arguments;
      console.log(args[0]);
      if (args.length && args[0].video && args[0].video.deviceId) {
        if (
          args[0].video.deviceId === "virtual" ||
          args[0].video.deviceId.exact === "virtual"
        ) {
          console.log(defaultVideoId);
          await setMediaStreamTracks()
          return currentMediaStream;
        } else {
          const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
          currentMediaStream = res;
          return res;
        }
      }
      const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
      return res;
    };
  }
}

export { monkeyPatchMediaDevices }