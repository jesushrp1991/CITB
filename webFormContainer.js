const webFormContainer = () =>{
    const getButtonShow = () => {
        const buttonShow = document.createElement('button');
        buttonShow.setAttribute('id', 'buttonShow');
        buttonShow.style.width = '40px';
        buttonShow.style.height = '40px';
        buttonShow.style.borderRadius = '40px';
        buttonShow.style.backgroundColor = 'transparent';
        buttonShow.style.padding = '0px';
        buttonShow.style.border = 'none';
        buttonShow.style.margin = '0px';
        return buttonShow;
    }
    
    const getButtonClass = () => {
        const buttonClass = document.createElement('button');
        buttonClass.setAttribute('id', 'buttonsClass');
        buttonClass.style.width = '40px';
        buttonClass.style.height = '40px';
        buttonClass.style.borderRadius = '40px';
        buttonClass.style.backgroundColor = 'transparent';
        buttonClass.style.padding = '0px';
        buttonClass.style.border = 'none';
        buttonClass.style.margin = '0px';
        return buttonClass;
    }
    
    const getButtonCam = () => {
        const buttonCam = document.createElement('button');
        buttonCam.setAttribute('id', 'buttonCam');
        buttonCam.style.width = '40px';
        buttonCam.style.height = '40px';
        buttonCam.style.borderRadius = '40px';
        buttonCam.style.backgroundColor = 'transparent';
        buttonCam.style.padding = '0px';
        buttonCam.style.border = 'none';
        buttonCam.style.margin = '0px';
        return buttonCam; 
    }
    const getButtonClose = () => {
        const buttonClose = document.createElement('button');
        buttonClose.setAttribute('id', 'buttonClose');
        buttonClose.style.width = '20px';
        buttonClose.style.height = '20px';
        buttonClose.style.borderRadius = '20px';
        buttonClose.style.backgroundColor = 'transparent';
        buttonClose.style.padding = '0px';
        buttonClose.style.border = 'none';
        buttonClose.style.margin = '0px';
        buttonClose.style.position = 'absolute';
        buttonClose.style.left = 'calc(50% - 10px)';
        buttonClose.style.bottom = '10px';
        buttonClose.style.display = 'none';
        return buttonClose; 
    }
    
    const getContainerButton = () => {
        const div = document.createElement('div');
        div.setAttribute('id', 'buttonsContainer');
        div.style.position = 'absolute';
        div.style.zIndex = 999;
        div.style.width = '40px';
        div.style.height = '210px';
        div.style.top = '60px';
        div.style.right = '16px';
        div.style.background = 'rgb(240, 243, 250)';
        div.style.borderRadius = '20px';
        div.style.display = 'block';
        return div;
    }
    const getButtonDrag = () => {
      const buttonDrag = document.createElement('button');
      buttonDrag.setAttribute('id', 'buttonDrag');
      buttonDrag.style.width = '20px';
      buttonDrag.style.height = '20px';
      buttonDrag.style.borderRadius = '20px';
      buttonDrag.style.backgroundColor = 'transparent';
      buttonDrag.style.padding = '0px';
      buttonDrag.style.border = 'none';
      buttonDrag.style['margin-top'] = '10px';
      buttonDrag.style['margin-left'] = '9px';
      return buttonDrag; 
    }
    
    const setButtonCloseBackground = (button) => {   
        button.style.backgroundImage = 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgIHZpZXdCb3g9IjAgMCA0OCA0OCIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTM4IDEyLjgzbC0yLjgzLTIuODMtMTEuMTcgMTEuMTctMTEuMTctMTEuMTctMi44MyAyLjgzIDExLjE3IDExLjE3LTExLjE3IDExLjE3IDIuODMgMi44MyAxMS4xNy0xMS4xNyAxMS4xNyAxMS4xNyAyLjgzLTIuODMtMTEuMTctMTEuMTd6Ii8+PHBhdGggZD0iTTAgMGg0OHY0OGgtNDh6IiBmaWxsPSJub25lIi8+PC9zdmc+")';
        button.style.backgroundSize = '60px 60px !important';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
      }
      const setButtonCamBackground = (button, activated) => {
        button.style.backgroundImage = activated 
            ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MyIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPGc+DQoJCTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjI1MC4xIiBjeT0iMjIwLjYiIHI9IjIzLjQiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMxNi4yLDE2My4ySDE4NGMtMTAuNiwwLTE5LjEsOC42LTE5LjEsMTkuMXY3Ni41YzAsMTAuNSw4LjYsMTkuMSwxOS4xLDE5LjFoMTMyLjINCgkJCWMxMC41LDAsMTkuMS04LjYsMTkuMS0xOS4xdi03Ni41QzMzNS4zLDE3MS44LDMyNi43LDE2My4yLDMxNi4yLDE2My4yeiBNMjUwLjEsMjU2LjdjLTE5LjksMC0zNi4xLTE2LjItMzYuMS0zNi4xDQoJCQlzMTYuMi0zNi4xLDM2LjEtMzYuMXMzNi4xLDE2LjIsMzYuMSwzNi4xUzI3MCwyNTYuNywyNTAuMSwyNTYuN3oiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MS45LDI2NS4yYy01LjgtNC41LTExLjMtNi42LTE1LTguMWMtMy43LTEuNi01LjgtMi4xLTUuOC0yLjFzMS44LDEuMSw1LjMsMy4yYzMuMiwyLjEsNy45LDUuNSwxMi4zLDEwLjUNCgkJYzIuMSwyLjQsMy45LDUuNSw1LDguN2MwLjgsMy4yLDAuNSw2LjYtMS4zLDkuNWMtMy40LDYtMTEuNiwxMC41LTIwLjIsMTMuOWMtMTcuNiw2LjYtMzguNiw5LjItNTYuNywxMC4yDQoJCWMtNy4xLDAuNS0xMy45LDAuNS0yMCwwLjV2MjguMWM3LjEtMC44LDE1LTIuMSwyMy40LTMuN2MxOS40LTQuMiw0MS4yLTEwLjUsNjAuMi0yMS44YzQuNy0yLjksOS4yLTYsMTMuMS05LjcNCgkJYzMuOS0zLjcsNy40LTguMSw5LjItMTMuN2MxLjgtNS4zLDEuMy0xMS4zLTEuMS0xNS41QzM3Ny45LDI3MC4yLDM3NC43LDI2Ny4zLDM3MS45LDI2NS4yeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMsMzEzLjhjMTguOSwxMS4zLDQwLjcsMTcuNiw2MC4yLDIxLjhjNi4zLDEuMywxMi42LDIuNCwxOC40LDMuMnYxNi44bDM0LjItMjkuNGwtMzQuMi0yOS40djE0LjQNCgkJYy00LjcsMC05LjctMC4zLTE1LTAuNWMtMTguMS0xLjEtMzkuMS0zLjQtNTYuNy0xMGMtOC43LTMuMi0xNi44LTcuOS0yMC41LTEzLjdjLTEuOC0yLjktMi40LTYtMS4zLTkuNWMwLjgtMy4yLDIuNi02LjMsNC43LTguNw0KCQljNC4yLTUsOC45LTguMSwxMi4zLTEwLjVjMy4yLTIuMSw1LjMtMy4yLDUuMy0zLjJzLTIuMSwwLjUtNS44LDIuMWMtMy43LDEuNi04LjksMy43LTE1LDguMWMtMi45LDIuNC02LDUuMy04LjEsOS41DQoJCWMtMi4xLDQuMi0yLjYsMTAuMi0wLjgsMTUuNWMxLjgsNS4zLDUuNSw5LjcsOS41LDEzLjdDMTMzLjgsMzA3LjgsMTM4LjMsMzEwLjksMTQzLDMxMy44eiIvPg0KPC9nPg0KPC9zdmc+DQo=")'
            : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MC4xIiBjeT0iMjUwLjIiIHI9IjE4Ni4zIi8+DQo8Zz4NCgk8Zz4NCgkJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMjUwLjIiIGN5PSIyMjAuNSIgcj0iMjMuNCIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzE2LjMsMTYzLjFIMTg0LjFjLTEwLjYsMC0xOS4xLDguNi0xOS4xLDE5LjF2NzYuNWMwLDEwLjUsOC42LDE5LjEsMTkuMSwxOS4xaDEzMi4yDQoJCQljMTAuNSwwLDE5LjEtOC42LDE5LjEtMTkuMXYtNzYuNUMzMzUuNCwxNzEuNywzMjYuOCwxNjMuMSwzMTYuMywxNjMuMXogTTI1MC4yLDI1Ni42Yy0xOS45LDAtMzYuMS0xNi4yLTM2LjEtMzYuMQ0KCQkJczE2LjItMzYuMSwzNi4xLTM2LjFzMzYuMSwxNi4yLDM2LjEsMzYuMVMyNzAuMSwyNTYuNiwyNTAuMiwyNTYuNnoiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MiwyNjUuMWMtNS44LTQuNS0xMS4zLTYuNi0xNS04LjFjLTMuNy0xLjYtNS44LTIuMS01LjgtMi4xczEuOCwxLjEsNS4zLDMuMmMzLjIsMi4xLDcuOSw1LjUsMTIuMywxMC41DQoJCWMyLjEsMi40LDMuOSw1LjUsNSw4LjdjMC44LDMuMiwwLjUsNi42LTEuMyw5LjVjLTMuNCw2LTExLjYsMTAuNS0yMC4yLDEzLjljLTE3LjYsNi42LTM4LjYsOS4yLTU2LjcsMTAuMg0KCQljLTcuMSwwLjUtMTMuOSwwLjUtMjAsMC41djI4LjFjNy4xLTAuOCwxNS0yLjEsMjMuNC0zLjdjMTkuNC00LjIsNDEuMi0xMC41LDYwLjItMjEuOGM0LjctMi45LDkuMi02LDEzLjEtOS43DQoJCWMzLjktMy43LDcuNC04LjEsOS4yLTEzLjdjMS44LTUuMywxLjMtMTEuMy0xLjEtMTUuNUMzNzgsMjcwLjEsMzc0LjksMjY3LjIsMzcyLDI2NS4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMuMiwzMTMuN2MxOC45LDExLjMsNDAuNywxNy42LDYwLjIsMjEuOGM2LjMsMS4zLDEyLjYsMi40LDE4LjQsMy4ydjE2LjhsMzQuMi0yOS40bC0zNC4yLTI5LjR2MTQuNA0KCQljLTQuNywwLTkuNy0wLjMtMTUtMC41Yy0xOC4xLTEuMS0zOS4xLTMuNC01Ni43LTEwYy04LjctMy4yLTE2LjgtNy45LTIwLjUtMTMuN2MtMS44LTIuOS0yLjQtNi0xLjMtOS41YzAuOC0zLjIsMi42LTYuMyw0LjctOC43DQoJCWM0LjItNSw4LjktOC4xLDEyLjMtMTAuNWMzLjItMi4xLDUuMy0zLjIsNS4zLTMuMnMtMi4xLDAuNS01LjgsMi4xYy0zLjcsMS42LTguOSwzLjctMTUsOC4xYy0yLjksMi40LTYsNS4zLTguMSw5LjUNCgkJYy0yLjEsNC4yLTIuNiwxMC4yLTAuOCwxNS41czUuNSw5LjcsOS41LDEzLjdDMTM0LDMwNy43LDEzOC40LDMxMC45LDE0My4yLDMxMy43eiIvPg0KPC9nPg0KPC9zdmc+DQo=")'
        button.style.backgroundSize = '60px 60px !important';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
      }
    
      const setButtonShowBackground = (button, activated) => {
        button.style.background = activated 
            ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0NSIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1NC4zLDE1NC45Yy0wLjktMC40LTItMC4zLTIuOCwwLjRsLTYxLjMsNTEuMWgtNjEuMWMtMS40LDAtMi42LDEuMi0yLjYsMi42djgyLjdjMCwxLjQsMS4yLDIuNiwyLjYsMi42DQoJCWg2MS4xbDYxLjMsNTEuMWMwLjUsMC40LDEuMSwwLjYsMS43LDAuNmMwLjQsMCwwLjctMC4xLDEuMS0wLjJjMC45LTAuNCwxLjUtMS4zLDEuNS0yLjNWMTU3LjINCgkJQzI1NS44LDE1Ni4yLDI1NS4yLDE1NS4zLDI1NC4zLDE1NC45eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMDEuMywyMTguNWMtMSwxLTEsMi42LDAsMy43YzcuMyw3LjMsMTEuNCwxNy4xLDExLjQsMjcuNGMwLDEwLjQtNCwyMC4xLTExLjQsMjcuNGMtMSwxLTEsMi42LDAsMy43DQoJCWMwLjUsMC41LDEuMiwwLjgsMS44LDAuOGMwLjcsMCwxLjMtMC4zLDEuOC0wLjhjOC4zLTguMywxMi45LTE5LjMsMTIuOS0zMS4xcy00LjYtMjIuOC0xMi45LTMxLjENCgkJQzMwMy45LDIxNy41LDMwMi4zLDIxNy41LDMwMS4zLDIxOC41eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMjYuOSwxOTYuNWMtMS0xLTIuNi0xLTMuNywwYy0xLDEtMSwyLjYsMCwzLjdjMjcuMiwyNy4yLDI3LjIsNzEuNSwwLDk4LjdjLTEsMS0xLDIuNiwwLDMuNw0KCQljMC41LDAuNSwxLjIsMC44LDEuOCwwLjhjMC43LDAsMS4zLTAuMywxLjgtMC44YzE0LjItMTQuMiwyMi0zMywyMi01M1MzNDEsMjEwLjcsMzI2LjksMTk2LjV6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM0OC44LDE3NC42Yy0xLTEtMi42LTEtMy43LDBjLTEsMS0xLDIuNiwwLDMuN2MzOS4zLDM5LjMsMzkuMywxMDMuMywwLDE0Mi42Yy0xLDEtMSwyLjYsMCwzLjcNCgkJYzAuNSwwLjUsMS4yLDAuOCwxLjgsMC44YzAuNywwLDEuMy0wLjMsMS44LTAuOEMzOTAuMSwyODMuMiwzOTAuMSwyMTUuOSwzNDguOCwxNzQuNnoiLz4NCjwvZz4NCjwvc3ZnPg0K")'
            : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MCIgY3k9IjI1MC4yIiByPSIxODYuMyIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1NC4zLDE1NC44Yy0wLjktMC40LTItMC4zLTIuOCwwLjRsLTYxLjMsNTEuMWgtNjEuMWMtMS40LDAtMi42LDEuMi0yLjYsMi42djgyLjdjMCwxLjQsMS4yLDIuNiwyLjYsMi42DQoJCWg2MS4xbDYxLjMsNTEuMWMwLjUsMC40LDEuMSwwLjYsMS43LDAuNmMwLjQsMCwwLjctMC4xLDEuMS0wLjJjMC45LTAuNCwxLjUtMS4zLDEuNS0yLjNWMTU3LjINCgkJQzI1NS44LDE1Ni4yLDI1NS4yLDE1NS4yLDI1NC4zLDE1NC44eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMDEuMywyMTguNGMtMSwxLTEsMi42LDAsMy43YzcuMyw3LjMsMTEuNCwxNy4xLDExLjQsMjcuNGMwLDEwLjQtNCwyMC4xLTExLjQsMjcuNGMtMSwxLTEsMi42LDAsMy43DQoJCWMwLjUsMC41LDEuMiwwLjgsMS44LDAuOGMwLjcsMCwxLjMtMC4zLDEuOC0wLjhjOC4zLTguMywxMi45LTE5LjMsMTIuOS0zMS4xcy00LjYtMjIuOC0xMi45LTMxLjENCgkJQzMwMy45LDIxNy40LDMwMi4zLDIxNy40LDMwMS4zLDIxOC40eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMjYuOSwxOTYuNWMtMS0xLTIuNi0xLTMuNywwYy0xLDEtMSwyLjYsMCwzLjdjMjcuMiwyNy4yLDI3LjIsNzEuNSwwLDk4LjdjLTEsMS0xLDIuNiwwLDMuNw0KCQljMC41LDAuNSwxLjIsMC44LDEuOCwwLjhjMC43LDAsMS4zLTAuMywxLjgtMC44YzE0LjItMTQuMiwyMi0zMywyMi01M0MzNDguOCwyMjkuNSwzNDEsMjEwLjcsMzI2LjksMTk2LjV6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM0OC44LDE3NC42Yy0xLTEtMi42LTEtMy43LDBjLTEsMS0xLDIuNiwwLDMuN2MzOS4zLDM5LjMsMzkuMywxMDMuMywwLDE0Mi42Yy0xLDEtMSwyLjYsMCwzLjcNCgkJYzAuNSwwLjUsMS4yLDAuOCwxLjgsMC44YzAuNywwLDEuMy0wLjMsMS44LTAuOEMzOTAuMSwyODMuMSwzOTAuMSwyMTUuOSwzNDguOCwxNzQuNnoiLz4NCjwvZz4NCjwvc3ZnPg0K")'
        button.style.backgroundSize = '60px 60px !important';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
      }
    
      const setButtonClassBackground = (button, activated) => {
        button.style.background = activated 
            ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojQzZDNkM2O30KCS5zdDF7ZmlsbDojRkZGRkZGO30KCS5zdDJ7ZmlsbDojRkZGRkZGO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDo1LjU0OTU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0M3tmaWxsOiNEQzMzMzY7fQoJLnN0NHtmaWxsOiNGNEMzMTI7fQoJLnN0NXtmaWxsOiM0RUIwNTY7fQoJLnN0NntmaWxsOiM1NDdEQkU7fQoJLnN0N3tmaWxsOiNFREVERUQ7fQoJLnN0OHtmaWxsOiNEQURBREE7fQoJLnN0OXtjbGlwLXBhdGg6dXJsKCNTVkdJRF8yXyk7ZmlsbDojREFEQURBO30KPC9zdHlsZT4KPGNpcmNsZSBjbGFzcz0ic3Q0IiBjeD0iMjUwIiBjeT0iMjUwLjMiIHI9IjE4Ni4zIi8+CjxnPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE5MC42LDMyOS42YzcuMSwwLDEyLjgtNS43LDEyLjgtMTIuOGMwLTctNS43LTEyLjgtMTIuOC0xMi44Yy03LDAtMTIuOCw1LjctMTIuOCwxMi44CgkJCUMxNzcuOCwzMjMuOSwxODMuNSwzMjkuNiwxOTAuNiwzMjkuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTkwLjYsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMyMTMuOSwzNDIuNywyMDMuNSwzMzIuMiwxOTAuNiwzMzIuMnoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTEuMiwzMjkuNmM3LjEsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNy4xLDAtMTIuOCw1LjctMTIuOCwxMi44CgkJCUMyMzguNCwzMjMuOSwyNDQuMSwzMjkuNiwyNTEuMiwzMjkuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUxLjIsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMyNzQuNSwzNDIuNywyNjQuMSwzMzIuMiwyNTEuMiwzMzIuMnoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMTEuOCwzMjkuNmM3LDAsMTIuOC01LjcsMTIuOC0xMi44YzAtNy01LjctMTIuOC0xMi44LTEyLjhjLTcuMSwwLTEyLjgsNS43LTEyLjgsMTIuOAoJCQlDMjk5LDMyMy45LDMwNC44LDMyOS42LDMxMS44LDMyOS42eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMTEuOCwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzMzNS4yLDM0Mi43LDMyNC43LDMzMi4yLDMxMS44LDMzMi4yeiIvPgoJPC9nPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM0MS43LDE2NC4xdjkzLjRjMCwxMC43LTkuNCwxOS41LTIxLDE5LjVIMTc5LjNjLTExLjYsMC0yMS04LjgtMjEtMTkuNXYtOTMuNGMwLTEwLjcsOS40LTE5LjUsMjEtMTkuNWgxNDEuNQoJCUMzMzIuMywxNDQuNiwzNDEuNywxNTMuMywzNDEuNywxNjQuMXoiLz4KPC9nPgo8L3N2Zz4K")'
            : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojQzZDNkM2O30KCS5zdDF7ZmlsbDojRkZGRkZGO30KCS5zdDJ7ZmlsbDojRkZGRkZGO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDo1LjU0OTU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0M3tmaWxsOiNEQzMzMzY7fQoJLnN0NHtmaWxsOiNGNEMzMTI7fQoJLnN0NXtmaWxsOiM0RUIwNTY7fQoJLnN0NntmaWxsOiM1NDdEQkU7fQoJLnN0N3tmaWxsOiNFREVERUQ7fQoJLnN0OHtmaWxsOiNEQURBREE7fQoJLnN0OXtjbGlwLXBhdGg6dXJsKCNTVkdJRF8yXyk7ZmlsbDojREFEQURBO30KPC9zdHlsZT4KPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMjUwLjYiIGN5PSIyNTAuMiIgcj0iMTg2LjMiLz4KPGc+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTkxLjIsMzI5LjVjNy4xLDAsMTIuOC01LjcsMTIuOC0xMi44YzAtNy01LjctMTIuOC0xMi44LTEyLjhjLTcsMC0xMi44LDUuNy0xMi44LDEyLjgKCQkJQzE3OC40LDMyMy44LDE4NC4xLDMyOS41LDE5MS4yLDMyOS41eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOTEuMiwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzIxNC41LDM0Mi42LDIwNCwzMzIuMiwxOTEuMiwzMzIuMnoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTEuOCwzMjkuNWM3LjEsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNy4xLDAtMTIuOCw1LjctMTIuOCwxMi44CgkJCUMyMzksMzIzLjgsMjQ0LjcsMzI5LjUsMjUxLjgsMzI5LjV6Ii8+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1MS44LDMzMi4yYy0xMi45LDAtMjMuMywxMC41LTIzLjMsMjMuM3YxOS40aDQ2Ljd2LTE5LjRDMjc1LjEsMzQyLjYsMjY0LjcsMzMyLjIsMjUxLjgsMzMyLjJ6Ii8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzEyLjQsMzI5LjVjNywwLDEyLjgtNS43LDEyLjgtMTIuOGMwLTctNS43LTEyLjgtMTIuOC0xMi44Yy03LjEsMC0xMi44LDUuNy0xMi44LDEyLjgKCQkJQzI5OS42LDMyMy44LDMwNS40LDMyOS41LDMxMi40LDMyOS41eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMTIuNCwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzMzNS44LDM0Mi42LDMyNS4zLDMzMi4yLDMxMi40LDMzMi4yeiIvPgoJPC9nPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM0Mi4zLDE2NHY5My40YzAsMTAuNy05LjQsMTkuNS0yMSwxOS41SDE3OS45Yy0xMS42LDAtMjEtOC44LTIxLTE5LjVWMTY0YzAtMTAuNyw5LjQtMTkuNSwyMS0xOS41aDE0MS41CgkJQzMzMi45LDE0NC41LDM0Mi4zLDE1My4zLDM0Mi4zLDE2NHoiLz4KPC9nPgo8L3N2Zz4K")'
        button.style.backgroundSize = '60px 60px !important';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
      }
    
      const setButtonDragBackground = (button) => {   
        button.style.backgroundImage = 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+IDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjQgNjQiPjxnIGlkPSJMYXllcl83MiIgZGF0YS1uYW1lPSJMYXllciA3MiI+PHBhdGggZD0iTTMyLDYwLjVhLjQ3LjQ3LDAsMCwxLS4zNS0uMTVMMjEuMTMsNDkuODRhLjUuNSwwLDAsMS0uMTQtLjM1LjUyLjUyLDAsMCwxLC4xNC0uMzZsMi0yYS41MS41MSwwLDAsMSwuNzEsMGw2LjMsNi4zVjMzLjg5SDEwLjU0bDYuMyw2LjNhLjUxLjUxLDAsMCwxLDAsLjcxbC0yLDJhLjUxLjUxLDAsMCwxLS43MSwwTDMuNjUsMzIuMzVhLjQ4LjQ4LDAsMCwxLDAtLjdMMTQuMTYsMjEuMTNhLjUxLjUxLDAsMCwxLC43MSwwbDIsMmEuNTEuNTEsMCwwLDEsMCwuNzFsLTYuMyw2LjNIMzAuMTFWMTAuNTRsLTYuMyw2LjNhLjUxLjUxLDAsMCwxLS43MSwwbC0yLTJhLjUxLjUxLDAsMCwxLDAtLjcxTDMxLjY1LDMuNjVhLjQ4LjQ4LDAsMCwxLC43LDBMNDIuODcsMTQuMTZhLjUxLjUxLDAsMCwxLDAsLjcxbC0yLDJhLjUxLjUxLDAsMCwxLS43MSwwbC02LjMtNi4zVjMwLjExSDUzLjQ2bC02LjMtNi4zYS41MS41MSwwLDAsMSwwLS43MWwyLTJhLjUxLjUxLDAsMCwxLC43MSwwTDYwLjM1LDMxLjY1YS40OC40OCwwLDAsMSwwLC43TDQ5Ljg0LDQyLjg3YS41MS41MSwwLDAsMS0uNzEsMGwtMi0yYS41MS41MSwwLDAsMSwwLS43MWw2LjMtNi4zSDMzLjg5VjUzLjQ2bDYuMy02LjNhLjUxLjUxLDAsMCwxLC43MSwwbDIsMmEuNTEuNTEsMCwwLDEsMCwuNzFMMzIuMzUsNjAuMzVBLjQ3LjQ3LDAsMCwxLDMyLDYwLjVabS05LjgxLTExTDMyLDU5LjI5bDkuODEtOS44LTEuMjctMS4yN0wzMy43NSw1NWEuNTEuNTEsMCwwLDEtLjg2LS4zNlYzMy4zOWEuNTEuNTEsMCwwLDEsLjUtLjVINTQuNjZhLjUxLjUxLDAsMCwxLC4zNi44NmwtNi44LDYuNzksMS4yNywxLjI3TDU5LjI5LDMybC05LjgtOS44MS0xLjI3LDEuMjdMNTUsMzAuMjVhLjUxLjUxLDAsMCwxLS4zNi44NkgzMy4zOWEuNTEuNTEsMCwwLDEtLjUtLjVWOS4zNEEuNTEuNTEsMCwwLDEsMzMuNzUsOWw2Ljc5LDYuOCwxLjI3LTEuMjdMMzIsNC43MWwtOS44MSw5LjgsMS4yNywxLjI3TDMwLjI1LDlhLjUxLjUxLDAsMCwxLC44Ni4zNlYzMC42MWEuNTEuNTEsMCwwLDEtLjUuNUg5LjM0QS41MS41MSwwLDAsMSw5LDMwLjI1bDYuOC02Ljc5LTEuMjctMS4yN0w0LjcxLDMybDkuOCw5LjgxLDEuMjctMS4yN0w5LDMzLjc1YS41MS41MSwwLDAsMSwuMzYtLjg2SDMwLjYxYS41MS41MSwwLDAsMSwuNS41VjU0LjY2YS41MS41MSwwLDAsMS0uODYuMzZsLTYuNzktNi44WiIvPjwvZz48L3N2Zz4=")';
        button.style.backgroundSize = '60px 60px !important';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
      }
    
      const addElementsToDiv = (div, buttonClose,buttonCam, br, buttonShow, br1, buttonClass,br2,buttonDrag) => {
        div.appendChild(buttonClose);
        div.appendChild(buttonCam);
        div.appendChild(br);
        div.appendChild(buttonShow);
        div.appendChild(br1);
        div.appendChild(buttonClass);
        div.appendChild(br2);
        div.appendChild(buttonDrag);
        document.body.appendChild(div);
        // div.style.display = 'none';
      }
   
      const setUp = () =>{
        window.buttonsContainerDiv = getContainerButton();
        const buttonCam = getButtonCam();
        const buttonShow = getButtonShow();
        const buttonClass = getButtonClass();
        const buttonDrag= getButtonDrag();
        const buttonClose= getButtonClose();

        const br = document.createElement('br');
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');

        setButtonCamBackground(buttonCam, true)
        setButtonShowBackground(buttonShow, true);
        setButtonClassBackground(buttonClass, true);
        setButtonCloseBackground(buttonClose);
        setButtonDragBackground(buttonDrag);
        addElementsToDiv(window.buttonsContainerDiv,buttonClose, buttonCam, br, buttonShow, br1, buttonClass,br2,buttonDrag);
      };
      return setUp();
}
export default  webFormContainer;