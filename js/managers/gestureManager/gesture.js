import {enviroment } from '../../enviroment.js';
const basePath = "./webmodel";
// const basePath = "webmodel/";

const labelMap = {
  1: "open",
  2: "closed",
  3: "pinch",
  // 4: "point",
  // 5: "face",
  // 6: "tip",
  // 7: "pinchtip",
};
let model;
const defaultParams = {
  flipHorizontal: false,
  outputStride: 16,
  imageScaleFactor: 1,
  maxNumBoxes: 2,
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
  handTrack.load().then(m => { 
    model = m
  })
  .catch(err => {
    console.log(err)
  });
}
let predictionFrameCount = 0;
const predictionFramesToSkip = 3;
let predictionsCount = 0;
let predictions = [];

const detectGesture = async (canvas) => {
  if (model != undefined) {
    if (predictionFrameCount == predictionFramesToSkip) {
        const predic = await model.detect(canvas);
        predic.filter(x => x.score > 0.60).forEach(p => {
        // predic.filter(x => x.score > 0.60 && x.label != "face").forEach(p => {
          predictions.push(p)
        })
        predictionFrameCount = 0;
        predictionsCount += 1;
        if (predictionsCount == enviroment.predictionsCount) {
          console.log(predictions)
          const open = predictions.filter( x => x.label == "open");
          const closed = predictions.filter (x => x.label == "closed");
          const point = predictions.filter (x => x.label == "point");

          if(predictions.length > 0){
            let difference = predictions[predictions.length - 1].bbox[0] - predictions[0].bbox[0];
            console.log("difference",difference);  
            if(difference >= 50 || difference >= -50){
              document.getElementsByClassName("CITBCamButton")[0].click(); 
              predictions = [];
            }
          }          
          // if (open.length > 0 && closed.length > 1) {
          //   document.getElementsByClassName("CITBCamButton")[0].click(); 
          //   predictions = [];

          // }
          // let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
          // gamex = document.body.clientWidth * (midval / video.width)
          // else if (open.length > 0 && point.length > 0) {
          if (open.length > 0 && point.length > 0) {
            document.getElementsByClassName("CITBClassButton")[0].click(); 
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