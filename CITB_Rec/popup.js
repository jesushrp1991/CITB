const auth = () =>{
  window.oauth2.start();
}

document.getElementById('authButton').addEventListener('click',auth);