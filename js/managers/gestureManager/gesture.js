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
let model;
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
  handTrack.load().then(m => { 
    model = m
    console.log("handTrackLoad 2");
     
  })
  .catch(err => {
    console.log(err)
  });
}
let predictionFrameCount = 0;
const predictionFramesToSkip = 2;
let predictionsCount = 0;
let predictions = [];
const detectGesture = async (canvas) => {
  if (model != undefined) {
    if (predictionFrameCount == predictionFramesToSkip) {
        const predic = await model.detect(canvas);
        predic.filter(x => x.score > 0.60 && x.label != "face").forEach(p => {
          predictions.push(p)
        })
        predictionFrameCount = 0;
        predictionsCount += 1;
        console.log(predictionsCount);
        if (predictionsCount == 24) {
          console.log(predictions)
          const open = predictions.filter( x => x.label == "open");
          const closed = predictions.filter (x => x.label == "closed");

          if (open.length > 0 && closed.length > 1) {
            console.log("CHANGE CAM");
            document.getElementsByClassName("CITBCamButton")[0].click(); 
            predictions = [];

          }
          predictionsCount = 0;
          predictions = [];
        }

    }
    predictionFrameCount += 1
}
}
export { gestureDetector, detectGesture };