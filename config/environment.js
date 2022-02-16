const environment = {
    //**** */ CONFIGURATION FOR CITB & CHROME ORIGINAL ID *****/
     EXTENSIONID: "ijbdnbhhklnlmdpldichdlknfaibceaf"
    ,videoRecordMimeType : 'video/webm; codecs=vp9'
    ,audioRecordMimeType : 'audio/webm; codecs=vp9'
    ,upLoadToDrive : true
    // ,API_KEY : 'AIzaSyD-1Qv29qBstORU_Olt0ESCe5GLLKyM8as'//mia
    ,API_KEY : 'AIzaSyD7EL3gks0cBoCdcslEVNILkyeYcLFoukY'//NOEL
    ,DISCOVERY_DOCS : ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest","https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    ,videoCaptureModes : ['screen','audio']
    ,lowDiskSpaceAlert : 50
    ,timeIntervalSaveDB : 100
    ,backendLogURL: 'https://apicitb.tk/api/log/savelog'
    ,voiceHelpTextES: "Para controlar la grabacion use los siguientes comandos de voz:" + "<br>" +
                    "1- Class in the box grabar: Comenzar la grabacion." + "<br>" +
                    "2- Class in the box parar : Detiene la grabacion." + "<br>" +
                    "3- Class in the box pausar: Pausa la grabacion."  + "<br>" +
                    "4- Class in the box continuar: Continua la grabacion" + "<br>" +
                    "5- Class in the box cerrar: Detiene completamente los comandos de voz."
    ,voiceHelpText: "Voice commands list :" + "<br>" +
                    "1- Class in the box start: Starts the recording." + "<br>" +
                    "2- Class in the box stop : Stops te recording." + "<br>" +
                    "3- Class in the box pause: Pause the recording."  + "<br>" +
                    "4- Class in the box play: Play the recording" + "<br>" +
                    "5- Class in the box close: Closes the voice commands."
    ,timerUploadQueueDaemon: 5000
    ,backendURL: 'https://api.classinthebox.tk/'
    ,webBaseURL: 'https://classinthebox.tk/'

}

export { 
    environment
}