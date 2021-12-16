const API_KEY = 'AIzaSyDhLKHKTBWjlDSrRLPY_-kvgV0xcJH7qd0';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

const getAuthToken = () =>{
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log('got the token', token);
  })
};


/*
  *   Upload to Drive
  *
*/ 
  function run(obj) {
    const file = obj.target.files[0];
    if (file.name != "") {
      let fr = new FileReader();
      fr.fileName = file.name;
      fr.fileSize = file.size;
      fr.fileType = file.type;
      fr.readAsArrayBuffer(file);
      fr.onload = resumableUpload;
    }
  }

  function resumableUpload(e) {
    accessToken = gapi.auth.getToken().access_token; // Please set access token here.
    console.log("accessToken",accessToken)
    document.getElementById("progress").innerHTML = "Initializing.";
    const f = e.target;
    const resource = {
      fileName: f.fileName,
      fileSize: f.fileSize,
      fileType: f.fileType,
      fileBuffer: f.result,
      accessToken: accessToken,
    };
    const ru = new ResumableUploadToGoogleDrive();
    ru.Do(resource, function (res, err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(res);
      let msg = "";
      if (res.status == "Uploading") {
        msg =
          Math.round(
            (res.progressNumber.current / res.progressNumber.end) * 100
          ) + "%";
      } else {
        msg = res.status;
      }
      document.getElementById("progress").innerText = msg;
    });
  }

getAuthToken()