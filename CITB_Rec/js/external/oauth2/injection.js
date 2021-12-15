window.location =
  chrome.extension.getURL("js/external/oauth2/oauth2.html") +
  window.location.href.substring(window.location.href.indexOf("?"));
