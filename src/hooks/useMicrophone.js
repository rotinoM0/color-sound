let context = new AudioContext();
let stream = null;
let recording = false

let noiseSuppression = null;
let echoCancellation = null;
let autoGainControl = null;

document.addEventListener('DOMContentLoaded', () => {
    noiseSuppression = document.getElementById("noise");
    echoCancellation = document.getElementById("echo");
    autoGainControl = document.getElementById("autoGain");
});

async function startRecording() {


    const micStream = await navigator.mediaDevices.getUserMedia(
        {
            audio: {
                echoCancellation: echoCancellation.checked,
                noiseSuppression: noiseSuppression.checked,
                autoGainControl: autoGainControl.checked
            },
        });


    stream = micStream;

    const filter = context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(100, context.currentTime);



    const source = context.createMediaStreamSource(micStream);
    const analyser = context.createAnalyser();
    source.connect(filter);
    source.connect(analyser);
    window.dispatchEvent(new Event("StartRecording"));
    // Updatecanvas(analyzer);
}

async function stopRecording() {
    stream.getTracks().forEach(s => s.stop());
    stream = null;
    window.dispatchEvent(new Event("StopRecording"));
}

async function toggleMic() {
    recording = !recording;

    if (context.state !== 'running')
        startContext()
    recording ? startRecording() : stopRecording();
}

async function startContext() {
    await context.resume();
}

function useRecording() {
    return recording;
}

export {toggleMic, useRecording};