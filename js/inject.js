'use strict';

if (
  window.location.host === "meet.google.com" ||
  window.location.host.includes("zoom.us") ||
  window.location.host == "teams.microsoft.com" ||
  window.location.host == "teams.live.com" ||
  window.location.host == "meet.jit.si"
) {
  console.log("SE INYECTO EL SCRIPT!!!!");
  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;

  console.log("SE INICIA EL MEDIA DEVICES");

  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute(
    "src",
    chrome.runtime.getURL("app/CITB/media-devices.js")
  );

  head.insertBefore(script, head.firstChild);
  console.log("SE INICIA EL MEDIA DEVICES");

  const annyangScript = document.createElement("script");
  annyangScript.setAttribute("type", "module");
  annyangScript.setAttribute(
    "src",
    chrome.runtime.getURL("app/CITB/managers/voiceManager/annyang.min.js")
  );
  const annyangScriptHead =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  head.insertBefore(annyangScript, annyangScriptHead.firstChild);

  const floatingButtonScript = document.createElement("script");
  floatingButtonScript.setAttribute("type", "module");
  floatingButtonScript.setAttribute(
    "src",
    chrome.runtime.getURL("app/CITB/citb-floating-buttons.js")
  );
  const floatingButtonScriptHead =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  head.insertBefore(floatingButtonScript, floatingButtonScriptHead.firstChild);

}
