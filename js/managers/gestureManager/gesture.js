// import { handTrack } from './handtrack.min.js';

const gestureDetector = () => {
  console.log("handTrackLoad 1");
  const canvas = document.getElementById("virtualWebCamCanvasVideoContainer");
  console.log("canvas",canvas);
  // handTrack.load().then(model => { 
  //     console.log("handTrackLoad 2");
  //     model.detect(canvas).then(predictions => {
  //       console.log('Predictions: ', predictions) // bbox predictions
  //     });
  // });
}
export { gestureDetector };