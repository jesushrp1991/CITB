console.log("Inyectado");

var origAddTrack = RTCPeerConnection.prototype.addTrack;

RTCPeerConnection.prototype.addTrack = async function (track, stream) {
console.log("prototype.addTrack");
if (window.peerConection == undefined) {
    window.peerConection = this;
    // showDiv()
}        
window.currentMediaStream = stream;
window.currentTrack = track;
await origAddTrack.apply(this, arguments);
}

