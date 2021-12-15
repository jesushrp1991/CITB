(function() {
    let urlRedirect;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        urlRedirect = tabs[0].url;
        window.oauth2 = {
            access_token_url: "https://example.com",
            authorization_url: "https://accounts.google.com/o/oauth2/v2/auth",
            client_id: "19686602327-9r18u3m3mvpt9195nafk1fjde8cc6vjh.apps.googleusercontent.com",
            client_secret: "niet nada de client secret",
            redirect_url: urlRedirect.substring(0, urlRedirect.length - 1),
            // scope: 'email%20profile%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&openid.realm',
            scope: 'email%20profile%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive',
            response_type:'permission%20id_token',
            key: "AIzaSyDhLKHKTBWjlDSrRLPY_-kvgV0xcJH7qd0",
            nonce : '3Dauth632202',

            /**
             * Starts the authorization process.
             */
            start: function() {
                window.close();
                var url = this.authorization_url + "?client_id=" + this.client_id + "&response_type=" + this.response_type +"&nonce=" + this.nonce + "&redirect_uri=" + this.redirect_url + "&scope=" + this.scope;
                chrome.tabs.create({url: url, active: true});
            },
            /**
             * Finishes the oauth2 process by exchanging the given authorization code for an
             * authorization token. The authroiztion token is saved to the browsers local storage.
             * If the redirect page does not return an authorization code or an error occures when 
             * exchanging the authorization code for an authorization token then the oauth2 process dies
             * and the authorization tab is closed.
             * 
             * @param url The url of the redirect page specified in the authorization request.
             */
            finish: function(url) {

                function removeTab() {
                    chrome.tabs.getCurrent(function(tab) {
                        chrome.tabs.remove(tab.id);
                    });
                };

                if(url.match(/\?error=(.+)/)) {
                    removeTab();
                } else {
                    var code = url.match(/\?code=([\w\/\-]+)/)[1];

                    var that = this;
                    var data = new FormData();
                    data.append('client_id', this.client_id);
                    data.append('client_secret', this.client_secret);
                    data.append('code', code);

                    // Send request for authorization token.
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener('readystatechange', function(event) {
                        if(xhr.readyState == 4) {
                            if(xhr.status == 200) {
                                if(xhr.responseText.match(/error=/)) {
                                    removeTab();
                                } else {
                                    // Parsing JSON Response.
                                    var response = xhr.responseText;
                                    var jsonResponse = JSON.parse(response);
                                    // Replace "access_token" with the parameter
                                    // relevant to the API you're using.
                                    var tokenOauth = jsonResponse.access_token
                                    var obj = { 'token': tokenOauth };
                                    // Storing in Chrome Local Storage.
                                    chrome.storage.local.set(obj, function() {
                                        // Notify that we saved.
                                        console.log('oAuth Token saved');
                                    });
                                    removeTab();
                                }
                            } else {
                                removeTab();
                            }
                        }
                    });
                    xhr.open('POST', this.access_token_url, true);
                    xhr.send(data);
                }
            },
            
            /**
             * Retreives the authorization token from Chrome Storage.
             */
            getToken: function() {
                chrome.storage.local.get("token", function(result) {
                    return result.token
                });
            },

            /**
             * Clears the authorization token from the Chrome storage.
             */
            clearToken: function() {
                chrome.storage.local.remove("token", function() {
                    console.log("Token Cleared")
                });
            }
        }
    });
})();
