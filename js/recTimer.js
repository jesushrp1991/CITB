window.currentRecordingTime;
window.totalPauseTime = 0;
window.initialRecordTimeInMS = 0;
//Start timer
const startTimerCount = () => {
  window.meetStartTime = dayjs().format();
  window.initialRecordTimeInMS = new Date().getTime();
  window.currentRecordingTime = new Date().getTime();
};

const calculatePauseTime = () => {
  if (window.endPauseTime == undefined) {
    window.endPauseTime = new Date().getTime();
  }
  window.totalPauseTime +=  window.endPauseTime - window.currentRecordingTime;
  window.endPauseTime = undefined;
};

//stop timer
const stopTimerCount = () => {
  window.currentRecordingTime = new Date().getTime();
};

//reset timer
const reset = () => {
  window.currentRecordingTime = 0;
  window.totalPauseTime = 0;
};

export { startTimerCount, stopTimerCount, reset, calculatePauseTime};
