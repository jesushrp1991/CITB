import {
  virtualWebCamMediaStream
  , videoCITB
  , videoOther
} from '../videoManager/webcam.js'
const basePath = "./webmodel";
// const basePath = "webmodel/";

const labelMap = {
  1: "open",
  2: "closed",
  3: "pinch",
  4: "point",
  5: "face",
  6: "tip",
  7: "pinchtip",
};

const defaultParams = {
  flipHorizontal: false,
  outputStride: 16,
  imageScaleFactor: 1,
  maxNumBoxes: 20,
  iouThreshold: 0.2,
  scoreThreshold: 0.6,
  modelType: "ssd320fpnlite",
  modelSize: "large",
  bboxLineWidth: "2",
  fontSize: 17,
  basePath: basePath,
  labelMap: labelMap,
};
const gestureDetector = () => {
  console.log("handTrackLoad 1");
  handTrack.load().then(model => { 
      console.log("handTrackLoad 2");
      model.detect(virtualWebCamMediaStream).then(predictions => {
        console.log('Predictions: ', predictions) // bbox predictions
      });
  })
  .catch(err => {
    console.log(err)
  });
}
export { gestureDetector };