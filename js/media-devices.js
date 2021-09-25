function monkeyPatchMediaDevices() {
  if (window.location.host === 'meet.google.com') {

    document.onreadystatechange = (event) => {
      const MYVIDEODDEVICELABEL = 'EasyCamera';
      const MYAUDIODEVICELABEL = 'Predeterminado - Micrófono';
  
      window.assignModes = () => {
        chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultMode: true }, async function (response) {
          if (response && response.farewell){
            console.log('todo ha ido bien', response.farewell);
            window.activatedMode = response.farewell;
            window.showActivated = window.activatedMode === 'show';
            window.classActivated = window.activatedMode === 'class';
            buttonShow.style.background = window.showActivated
             ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0NSIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1NC4zLDE1NC45Yy0wLjktMC40LTItMC4zLTIuOCwwLjRsLTYxLjMsNTEuMWgtNjEuMWMtMS40LDAtMi42LDEuMi0yLjYsMi42djgyLjdjMCwxLjQsMS4yLDIuNiwyLjYsMi42DQoJCWg2MS4xbDYxLjMsNTEuMWMwLjUsMC40LDEuMSwwLjYsMS43LDAuNmMwLjQsMCwwLjctMC4xLDEuMS0wLjJjMC45LTAuNCwxLjUtMS4zLDEuNS0yLjNWMTU3LjINCgkJQzI1NS44LDE1Ni4yLDI1NS4yLDE1NS4zLDI1NC4zLDE1NC45eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMDEuMywyMTguNWMtMSwxLTEsMi42LDAsMy43YzcuMyw3LjMsMTEuNCwxNy4xLDExLjQsMjcuNGMwLDEwLjQtNCwyMC4xLTExLjQsMjcuNGMtMSwxLTEsMi42LDAsMy43DQoJCWMwLjUsMC41LDEuMiwwLjgsMS44LDAuOGMwLjcsMCwxLjMtMC4zLDEuOC0wLjhjOC4zLTguMywxMi45LTE5LjMsMTIuOS0zMS4xcy00LjYtMjIuOC0xMi45LTMxLjENCgkJQzMwMy45LDIxNy41LDMwMi4zLDIxNy41LDMwMS4zLDIxOC41eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMjYuOSwxOTYuNWMtMS0xLTIuNi0xLTMuNywwYy0xLDEtMSwyLjYsMCwzLjdjMjcuMiwyNy4yLDI3LjIsNzEuNSwwLDk4LjdjLTEsMS0xLDIuNiwwLDMuNw0KCQljMC41LDAuNSwxLjIsMC44LDEuOCwwLjhjMC43LDAsMS4zLTAuMywxLjgtMC44YzE0LjItMTQuMiwyMi0zMywyMi01M1MzNDEsMjEwLjcsMzI2LjksMTk2LjV6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM0OC44LDE3NC42Yy0xLTEtMi42LTEtMy43LDBjLTEsMS0xLDIuNiwwLDMuN2MzOS4zLDM5LjMsMzkuMywxMDMuMywwLDE0Mi42Yy0xLDEtMSwyLjYsMCwzLjcNCgkJYzAuNSwwLjUsMS4yLDAuOCwxLjgsMC44YzAuNywwLDEuMy0wLjMsMS44LTAuOEMzOTAuMSwyODMuMiwzOTAuMSwyMTUuOSwzNDguOCwxNzQuNnoiLz4NCjwvZz4NCjwvc3ZnPg0K")'
             : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MCIgY3k9IjI1MC4yIiByPSIxODYuMyIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1NC4zLDE1NC44Yy0wLjktMC40LTItMC4zLTIuOCwwLjRsLTYxLjMsNTEuMWgtNjEuMWMtMS40LDAtMi42LDEuMi0yLjYsMi42djgyLjdjMCwxLjQsMS4yLDIuNiwyLjYsMi42DQoJCWg2MS4xbDYxLjMsNTEuMWMwLjUsMC40LDEuMSwwLjYsMS43LDAuNmMwLjQsMCwwLjctMC4xLDEuMS0wLjJjMC45LTAuNCwxLjUtMS4zLDEuNS0yLjNWMTU3LjINCgkJQzI1NS44LDE1Ni4yLDI1NS4yLDE1NS4yLDI1NC4zLDE1NC44eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMDEuMywyMTguNGMtMSwxLTEsMi42LDAsMy43YzcuMyw3LjMsMTEuNCwxNy4xLDExLjQsMjcuNGMwLDEwLjQtNCwyMC4xLTExLjQsMjcuNGMtMSwxLTEsMi42LDAsMy43DQoJCWMwLjUsMC41LDEuMiwwLjgsMS44LDAuOGMwLjcsMCwxLjMtMC4zLDEuOC0wLjhjOC4zLTguMywxMi45LTE5LjMsMTIuOS0zMS4xcy00LjYtMjIuOC0xMi45LTMxLjENCgkJQzMwMy45LDIxNy40LDMwMi4zLDIxNy40LDMwMS4zLDIxOC40eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMjYuOSwxOTYuNWMtMS0xLTIuNi0xLTMuNywwYy0xLDEtMSwyLjYsMCwzLjdjMjcuMiwyNy4yLDI3LjIsNzEuNSwwLDk4LjdjLTEsMS0xLDIuNiwwLDMuNw0KCQljMC41LDAuNSwxLjIsMC44LDEuOCwwLjhjMC43LDAsMS4zLTAuMywxLjgtMC44YzE0LjItMTQuMiwyMi0zMywyMi01M0MzNDguOCwyMjkuNSwzNDEsMjEwLjcsMzI2LjksMTk2LjV6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM0OC44LDE3NC42Yy0xLTEtMi42LTEtMy43LDBjLTEsMS0xLDIuNiwwLDMuN2MzOS4zLDM5LjMsMzkuMywxMDMuMywwLDE0Mi42Yy0xLDEtMSwyLjYsMCwzLjcNCgkJYzAuNSwwLjUsMS4yLDAuOCwxLjgsMC44YzAuNywwLDEuMy0wLjMsMS44LTAuOEMzOTAuMSwyODMuMSwzOTAuMSwyMTUuOSwzNDguOCwxNzQuNnoiLz4NCjwvZz4NCjwvc3ZnPg0K")'
            buttonClass.style.background = window.classActivated
             ? 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0NCIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOTAuNiwzMjkuNmM3LjEsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNywwLTEyLjgsNS43LTEyLjgsMTIuOA0KCQkJQzE3Ny44LDMyMy45LDE4My41LDMyOS42LDE5MC42LDMyOS42eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTkwLjYsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMyMTMuOSwzNDIuNywyMDMuNSwzMzIuMiwxOTAuNiwzMzIuMnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTEuMiwzMjkuNmM3LjEsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNy4xLDAtMTIuOCw1LjctMTIuOCwxMi44DQoJCQlDMjM4LjQsMzIzLjksMjQ0LjEsMzI5LjYsMjUxLjIsMzI5LjZ6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTEuMiwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzI3NC41LDM0Mi43LDI2NC4xLDMzMi4yLDI1MS4yLDMzMi4yeiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMxMS44LDMyOS42YzcsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNy4xLDAtMTIuOCw1LjctMTIuOCwxMi44DQoJCQlDMjk5LDMyMy45LDMwNC44LDMyOS42LDMxMS44LDMyOS42eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzExLjgsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMzMzUuMiwzNDIuNywzMjQuNywzMzIuMiwzMTEuOCwzMzIuMnoiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM0MS43LDE2NC4xdjkzLjRjMCwxMC43LTkuNCwxOS41LTIxLDE5LjVIMTc5LjNjLTExLjYsMC0yMS04LjgtMjEtMTkuNXYtOTMuNGMwLTEwLjcsOS40LTE5LjUsMjEtMTkuNWgxNDEuNQ0KCQlDMzMyLjMsMTQ0LjYsMzQxLjcsMTUzLjMsMzQxLjcsMTY0LjF6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==")'
             : 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MC42IiBjeT0iMjUwLjIiIHI9IjE4Ni4zIi8+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE5MS4yLDMyOS41YzcuMSwwLDEyLjgtNS43LDEyLjgtMTIuOGMwLTctNS43LTEyLjgtMTIuOC0xMi44Yy03LDAtMTIuOCw1LjctMTIuOCwxMi44DQoJCQlDMTc4LjQsMzIzLjgsMTg0LjEsMzI5LjUsMTkxLjIsMzI5LjV6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOTEuMiwzMzIuMmMtMTIuOSwwLTIzLjMsMTAuNS0yMy4zLDIzLjN2MTkuNGg0Ni43di0xOS40QzIxNC41LDM0Mi42LDIwNCwzMzIuMiwxOTEuMiwzMzIuMnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNTEuOCwzMjkuNWM3LjEsMCwxMi44LTUuNywxMi44LTEyLjhjMC03LTUuNy0xMi44LTEyLjgtMTIuOGMtNy4xLDAtMTIuOCw1LjctMTIuOCwxMi44DQoJCQlDMjM5LDMyMy44LDI0NC43LDMyOS41LDI1MS44LDMyOS41eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUxLjgsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMyNzUuMSwzNDIuNiwyNjQuNywzMzIuMiwyNTEuOCwzMzIuMnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMTIuNCwzMjkuNWM3LDAsMTIuOC01LjcsMTIuOC0xMi44YzAtNy01LjctMTIuOC0xMi44LTEyLjhjLTcuMSwwLTEyLjgsNS43LTEyLjgsMTIuOA0KCQkJQzI5OS42LDMyMy44LDMwNS40LDMyOS41LDMxMi40LDMyOS41eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzEyLjQsMzMyLjJjLTEyLjksMC0yMy4zLDEwLjUtMjMuMywyMy4zdjE5LjRoNDYuN3YtMTkuNEMzMzUuOCwzNDIuNiwzMjUuMywzMzIuMiwzMTIuNCwzMzIuMnoiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM0Mi4zLDE2NHY5My40YzAsMTAuNy05LjQsMTkuNS0yMSwxOS41SDE3OS45Yy0xMS42LDAtMjEtOC44LTIxLTE5LjVWMTY0YzAtMTAuNyw5LjQtMTkuNSwyMS0xOS41aDE0MS41DQoJCUMzMzIuOSwxNDQuNSwzNDIuMywxNTMuMywzNDIuMywxNjR6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==")'
          }
        });
        if (defaultID && defaultLabel){
          if (defaultLabel.includes(MYVIDEODDEVICELABEL)){
            window.citbActivated = true;
            buttonCam.style.background = 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MyIgY3g9IjI1MCIgY3k9IjI1MC4zIiByPSIxODYuMyIvPg0KPGc+DQoJPGc+DQoJCTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjI1MC4xIiBjeT0iMjIwLjYiIHI9IjIzLjQiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMxNi4yLDE2My4ySDE4NGMtMTAuNiwwLTE5LjEsOC42LTE5LjEsMTkuMXY3Ni41YzAsMTAuNSw4LjYsMTkuMSwxOS4xLDE5LjFoMTMyLjINCgkJCWMxMC41LDAsMTkuMS04LjYsMTkuMS0xOS4xdi03Ni41QzMzNS4zLDE3MS44LDMyNi43LDE2My4yLDMxNi4yLDE2My4yeiBNMjUwLjEsMjU2LjdjLTE5LjksMC0zNi4xLTE2LjItMzYuMS0zNi4xDQoJCQlzMTYuMi0zNi4xLDM2LjEtMzYuMXMzNi4xLDE2LjIsMzYuMSwzNi4xUzI3MCwyNTYuNywyNTAuMSwyNTYuN3oiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MS45LDI2NS4yYy01LjgtNC41LTExLjMtNi42LTE1LTguMWMtMy43LTEuNi01LjgtMi4xLTUuOC0yLjFzMS44LDEuMSw1LjMsMy4yYzMuMiwyLjEsNy45LDUuNSwxMi4zLDEwLjUNCgkJYzIuMSwyLjQsMy45LDUuNSw1LDguN2MwLjgsMy4yLDAuNSw2LjYtMS4zLDkuNWMtMy40LDYtMTEuNiwxMC41LTIwLjIsMTMuOWMtMTcuNiw2LjYtMzguNiw5LjItNTYuNywxMC4yDQoJCWMtNy4xLDAuNS0xMy45LDAuNS0yMCwwLjV2MjguMWM3LjEtMC44LDE1LTIuMSwyMy40LTMuN2MxOS40LTQuMiw0MS4yLTEwLjUsNjAuMi0yMS44YzQuNy0yLjksOS4yLTYsMTMuMS05LjcNCgkJYzMuOS0zLjcsNy40LTguMSw5LjItMTMuN2MxLjgtNS4zLDEuMy0xMS4zLTEuMS0xNS41QzM3Ny45LDI3MC4yLDM3NC43LDI2Ny4zLDM3MS45LDI2NS4yeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMsMzEzLjhjMTguOSwxMS4zLDQwLjcsMTcuNiw2MC4yLDIxLjhjNi4zLDEuMywxMi42LDIuNCwxOC40LDMuMnYxNi44bDM0LjItMjkuNGwtMzQuMi0yOS40djE0LjQNCgkJYy00LjcsMC05LjctMC4zLTE1LTAuNWMtMTguMS0xLjEtMzkuMS0zLjQtNTYuNy0xMGMtOC43LTMuMi0xNi44LTcuOS0yMC41LTEzLjdjLTEuOC0yLjktMi40LTYtMS4zLTkuNWMwLjgtMy4yLDIuNi02LjMsNC43LTguNw0KCQljNC4yLTUsOC45LTguMSwxMi4zLTEwLjVjMy4yLTIuMSw1LjMtMy4yLDUuMy0zLjJzLTIuMSwwLjUtNS44LDIuMWMtMy43LDEuNi04LjksMy43LTE1LDguMWMtMi45LDIuNC02LDUuMy04LjEsOS41DQoJCWMtMi4xLDQuMi0yLjYsMTAuMi0wLjgsMTUuNWMxLjgsNS4zLDUuNSw5LjcsOS41LDEzLjdDMTMzLjgsMzA3LjgsMTM4LjMsMzEwLjksMTQzLDMxMy44eiIvPg0KPC9nPg0KPC9zdmc+DQo=")';
          }else{
            window.citbActivated = false;
            buttonCam.style.background = 'url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMCA1MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwMCA1MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDNkM2QzY7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCgkuc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6NS41NDk1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0RDMzMzNjt9DQoJLnN0NHtmaWxsOiNGNEMzMTI7fQ0KCS5zdDV7ZmlsbDojNEVCMDU2O30NCgkuc3Q2e2ZpbGw6IzU0N0RCRTt9DQoJLnN0N3tmaWxsOiNFREVERUQ7fQ0KCS5zdDh7ZmlsbDojREFEQURBO30NCgkuc3Q5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiNEQURBREE7fQ0KPC9zdHlsZT4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1MC4xIiBjeT0iMjUwLjIiIHI9IjE4Ni4zIi8+DQo8Zz4NCgk8Zz4NCgkJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMjUwLjIiIGN5PSIyMjAuNSIgcj0iMjMuNCIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzE2LjMsMTYzLjFIMTg0LjFjLTEwLjYsMC0xOS4xLDguNi0xOS4xLDE5LjF2NzYuNWMwLDEwLjUsOC42LDE5LjEsMTkuMSwxOS4xaDEzMi4yDQoJCQljMTAuNSwwLDE5LjEtOC42LDE5LjEtMTkuMXYtNzYuNUMzMzUuNCwxNzEuNywzMjYuOCwxNjMuMSwzMTYuMywxNjMuMXogTTI1MC4yLDI1Ni42Yy0xOS45LDAtMzYuMS0xNi4yLTM2LjEtMzYuMQ0KCQkJczE2LjItMzYuMSwzNi4xLTM2LjFzMzYuMSwxNi4yLDM2LjEsMzYuMVMyNzAuMSwyNTYuNiwyNTAuMiwyNTYuNnoiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM3MiwyNjUuMWMtNS44LTQuNS0xMS4zLTYuNi0xNS04LjFjLTMuNy0xLjYtNS44LTIuMS01LjgtMi4xczEuOCwxLjEsNS4zLDMuMmMzLjIsMi4xLDcuOSw1LjUsMTIuMywxMC41DQoJCWMyLjEsMi40LDMuOSw1LjUsNSw4LjdjMC44LDMuMiwwLjUsNi42LTEuMyw5LjVjLTMuNCw2LTExLjYsMTAuNS0yMC4yLDEzLjljLTE3LjYsNi42LTM4LjYsOS4yLTU2LjcsMTAuMg0KCQljLTcuMSwwLjUtMTMuOSwwLjUtMjAsMC41djI4LjFjNy4xLTAuOCwxNS0yLjEsMjMuNC0zLjdjMTkuNC00LjIsNDEuMi0xMC41LDYwLjItMjEuOGM0LjctMi45LDkuMi02LDEzLjEtOS43DQoJCWMzLjktMy43LDcuNC04LjEsOS4yLTEzLjdjMS44LTUuMywxLjMtMTEuMy0xLjEtMTUuNUMzNzgsMjcwLjEsMzc0LjksMjY3LjIsMzcyLDI2NS4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDMuMiwzMTMuN2MxOC45LDExLjMsNDAuNywxNy42LDYwLjIsMjEuOGM2LjMsMS4zLDEyLjYsMi40LDE4LjQsMy4ydjE2LjhsMzQuMi0yOS40bC0zNC4yLTI5LjR2MTQuNA0KCQljLTQuNywwLTkuNy0wLjMtMTUtMC41Yy0xOC4xLTEuMS0zOS4xLTMuNC01Ni43LTEwYy04LjctMy4yLTE2LjgtNy45LTIwLjUtMTMuN2MtMS44LTIuOS0yLjQtNi0xLjMtOS41YzAuOC0zLjIsMi42LTYuMyw0LjctOC43DQoJCWM0LjItNSw4LjktOC4xLDEyLjMtMTAuNWMzLjItMi4xLDUuMy0zLjIsNS4zLTMuMnMtMi4xLDAuNS01LjgsMi4xYy0zLjcsMS42LTguOSwzLjctMTUsOC4xYy0yLjksMi40LTYsNS4zLTguMSw5LjUNCgkJYy0yLjEsNC4yLTIuNiwxMC4yLTAuOCwxNS41czUuNSw5LjcsOS41LDEzLjdDMTM0LDMwNy43LDEzOC40LDMxMC45LDE0My4yLDMxMy43eiIvPg0KPC9nPg0KPC9zdmc+DQo=")';
          }
        } else {
          console.log('el defaultid o el defaultlabel no existen');
        }
      }
  
      const setMicrophone = (microphone) => {
        console.log('***microphoneIDsent', microphone);
        chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { setDefaultMicrophoneId: microphone }, async function (response) {
          if (response && response.farewell){ 
          }
        });
      }

      const setMode = (mode) => {
        console.log('***voy a mandar hacia el back ', mode)
        chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { setDefaultMode: mode }, async function (response1) {
          if (response1 && response1.farewell){
            // window.assignModes();
          }
        });
      }
  
      const setVideo = (videoId) => {
        chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { setDefaultVideoId: videoId }, async function (response) {
          if (response && response.farewell){
            console.log('todo ha ido bien');
          }
        });
      }

      const buttonShow = document.createElement('button');
      buttonShow.style.width = '40px';
      buttonShow.style.height = '40px';
      buttonShow.style.borderRadius = '40px'
      buttonShow.style.margin = '5px'
      buttonShow.addEventListener('click', () => {
        if (window.showActivated) {
          setMode('none');
        }else {
          setMode('show');
        }
      })
      const buttonClass = document.createElement('button');
      buttonClass.style.width = '40px';
      buttonClass.style.height = '40px';
      buttonClass.style.borderRadius = '40px'
      buttonClass.style.margin = '5px'
      buttonClass.addEventListener('click', () => {
        if (window.classActivated) {
          const remainingMics = devices.filter(x => (x.kind === 'audioinput' && x.deviceId != defaultMicrophoneId));
          if (remainingMics.length > 0){
            console.log('encontro otro mic')
            console.log(remainingMics[0]);
            setMicrophone(remainingMics[0].deviceId);
            setMode('none');
          }else{
            alert('no se ha podido cambiar el mic');
          }
        }else {
          const goodmic = devices.filter(x => (x.kind === 'audioinput' && x.label.includes(MYAUDIODEVICELABEL)));
          if(goodmic.length > 0){
            console.log('encontro el mic bueno');
            console.log(goodmic[0]);
            setMicrophone(goodmic[0].deviceId);
            setMode('class');
          }else{
            alert('no se ha podido cambiar el video');
          }
        }
      })
      const buttonCam = document.createElement('button');
      buttonCam.style.width = '40px';
      buttonCam.style.height = '40px';
      buttonCam.style.borderRadius = '40px'
      buttonCam.style.margin = '5px'
      buttonCam.addEventListener('click', () => {
        if (window.citbActivated){
          const remainingVideos = devices.filter(x => (x.kind === 'videoinput' && x.deviceId != defaultID));
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
      const div = document.createElement('div');
      const br = document.createElement('br');
      const br1 = document.createElement('br');
      div.appendChild(buttonCam);
      div.appendChild(br);
      div.appendChild(buttonShow);
      div.appendChild(br1);
      div.appendChild(buttonClass);
      div.style.position = 'fixed';
      div.style.zIndex = 999;
      div.style.top = '50px';
      div.style.right = '10px';
      document.body.appendChild(div);
  
      setInterval(assignModes(), 2000);
    }

    const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
    const getUserMediaFn = MediaDevices.prototype.getUserMedia;
    var origAddTrack = RTCPeerConnection.prototype.addTrack;
    var origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
    var currentMediaStream = new MediaStream();
    var currentAudioMediaStream = new MediaStream();
    let defaultID, defaultMode, defaultLabel, defaultMicrophoneId, defaultMicrophoneLabel;
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

    RTCPeerConnection.onTrack = function (argument) {
      console.log("ontrack", arguments)
    }

    const checkingVideo = async function () {
      chrome.runtime.sendMessage('mkodjolllifkapdaggjabifdafbciclf', { defaultVideoId: true }, async function (response) {
        if (response && response.farewell && window.peerConection) {
          const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual")
          const defaultDevice = videoDevices.filter(d => d.deviceId == defaultID || d.deviceId.exact == defaultID)
          const otherDevices = videoDevices.filter(d => d.deviceId != defaultID && d.deviceId.exact != defaultID)
          const currentTrackLabel = window.peerConection.getSenders().filter((s) => s.track.kind == 'video')[0].track.label
          let run = false
          if (defaultDevice.length > 0) {
            run = defaultDevice[0].label != currentTrackLabel
          }
          console.log("OUTSIDE OUTSIDE", defaultDevice[0].label, currentTrackLabel)

          if (response.farewell != defaultID || run) {
            console.log("INSIDE INSIDE", defaultDevice[0].label, currentTrackLabel)
            defaultID = response.farewell;
            defaultLabel = devices.filter(x => x.deviceId === defaultID)[0].label;
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
    let devices = []
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
          defaultID = response.farewell;
          defaultLabel = res.filter(x => x.deviceId === defaultID)[0].label;
          console.log("WILL CHANGE USERMEDIA", defaultID)
        }
      });
      if (defaultID != undefined) {
        setMediaStreamTracks()
      }
      return res;
    };

    async function setMediaStreamTracks() {
      const constraints = {
        video: {
          deviceId: { exact: defaultID },
        },
        audio: false,
      };

      const videoDevices = devices.filter(d => d.kind == "videoinput" && d.deviceId != "virtual")
      const defaultDevice = videoDevices.filter(d => d.deviceId == defaultID || d.deviceId.exact == defaultID)
      const otherDevices = videoDevices.filter(d => d.deviceId != defaultID && d.deviceId.exact != defaultID)

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
          console.log(defaultID);
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