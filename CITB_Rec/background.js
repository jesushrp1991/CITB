chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log('got the token', token);
  })