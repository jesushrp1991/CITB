/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';
const CITBCAMERALABEL = "2K HD Camera"
const getDevices = async () => {
  await navigator.mediaDevices.getUserMedia({audio: true, video: true});   
  return await navigator.mediaDevices.enumerateDevices();
}

getDevices().then(d => {
  console.log(d)
})

const getFinalVideoSources = async () => {
  const sources = await getDevices()
  const videoSources = sources.filter(s => s.kind == "videoinput");
  const CITBVideo = videoSources.filter(s => s.label.includes(CITBCAMERALABEL));
  const OTHERVIDEO = videoSources.filter(s => !s.label.includes(CITBCAMERALABEL));
  let returnValue = {citbVideo: null, otherVideo: null}
  if (CITBVideo.length > 0){
    returnValue.citbVideo = CITBVideo[0];
  }
  if (OTHERVIDEO.length > 0){
    returnValue.otherVideo = OTHERVIDEO[0];
  }

}
// Put variables in global scope to make them available to the browser console.

const videoCITB = document.querySelector('#citb');
const videoOther = document.querySelector('#mainvideo');
var currentVideoSource = videoCITB;

const buildVideos = async () => {
  let sources = await getFinalVideoSources();
  let constraints = {
    video: {
      deviceId: { exact: "" },
    },
    audio: false,
  };
  if (sources.citbVideo != null) {

  }
}

const setStreamToVideoTag = async (stream ,video) => {

}

const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;

const button = document.querySelector('button');
button.onclick = function() {
  canvas.width = videoCITB.videoWidth;
  canvas.height = videoCITB.videoHeight;
  canvas.getContext('2d').drawImage(videoCITB, 0, 0, canvas.width, canvas.height);
};

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  videoCITB.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);