const speachCommands = () => {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var modes = ['cambiar cámara', 'modo show', 'modo clase'];
    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + modes.join(' | ') + ' ;'

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'es-MX';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

 
    recognition.start();
    recognition.onresult = function(event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object
        var color = event.results[0][0].transcript;
        console.log('Result received: ' + color + '.');
        console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function() {
        recognition.stop();
    }

    recognition.onnomatch = function(event) {
      console.log("NO MATCH", event)
    }

    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
    }

        // called when we detect silence
    function stopSpeech(){
        console.log("STOP SPEACH")
        recognition.stop();
    }
    // called when we detect sound
    function startSpeech(){
        console.log("START SPEACH")
        try{ // calling it twice will throw...
            recognition.start();
        }
        catch(e){ console.log("ERROR", e)}
    }
    console.log("SPEACH SPEACH")
        // request a LocalMediaStream
    navigator.mediaDevices.getUserMedia({audio:true})
    // add our listeners
    .then(stream => detectSilence(stream, stopSpeech, startSpeech))
    .catch(e => log(e.message));


    function detectSilence(
    stream,
    onSoundEnd = _=>{},
    onSoundStart = _=>{},
    silence_delay = 500,
    min_decibels = -80
    ) {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        const streamNode = ctx.createMediaStreamSource(stream);
        streamNode.connect(analyser);
        analyser.minDecibels = min_decibels;

        const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
        let silence_start = performance.now();
        let triggered = false; // trigger only once per silence event

        function loop(time) {
            requestAnimationFrame(loop); // we'll loop every 60th of a second to check
            analyser.getByteFrequencyData(data); // get current data
            if (data.some(v => v)) { // if there is data above the given db limit
            if(triggered){
                triggered = false;
                onSoundStart();
                }
            silence_start = time; // set it to now
            }
            if (!triggered && time - silence_start > silence_delay) {
            onSoundEnd();
            triggered = true;
            }
        }
        loop();
    }
}

export {speachCommands}