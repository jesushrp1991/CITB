
alertify.prompt( "ClassInTheBox", "What's yours meet name?", 'My first CITB meet'
    , function(evt, value) { 
        alertify.success('Your rec name will: ' + value) 
        chrome.storage.sync.set({fileName: value}, function() {
        });
    }
    , function() { alertify.error('Your rec name will be: CITB REC') 
});
