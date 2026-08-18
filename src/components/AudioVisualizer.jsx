import { useCallback, useEffect, useRef } from 'react'

const clamp = (value) => Math.min(1, Math.max(0, value));

const GRADIENT_STOPS = [
    { t: 0.0, r: 34, g: 211, b: 238 },   // cyan-400
    { t: 0.4, r: 129, g: 140, b: 248 },  // indigo-400
    { t: 0.75, r: 232, g: 121, b: 249 }, // fuchsia-400
    { t: 1.0, r: 251, g: 113, b: 133 },  // rose-400
];

function paletteColor(mix) {
    const m = clamp(mix);
    let i = 0;
    while (i < GRADIENT_STOPS.length - 2 && m > GRADIENT_STOPS[i + 1].t) i++;

    const a = GRADIENT_STOPS[i];
    const b = GRADIENT_STOPS[i + 1];
    const t = (m - a.t) / (b.t - a.t);

    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r},${g},${bl})`;
}

function dominantFrequency(analyser, context) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let maxVal = 0;
    let maxIndex = 0;
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxVal) {
            maxVal = dataArray[i];
            maxIndex = i;
        }
    }
    if (maxVal <= 0) return 0;
    return maxIndex * context.sampleRate / analyser.fftSize;
}

export default function AudioVisualizer({ analyserRef, isRecording, settings, onPitchChange }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const drawModeRef = useRef(settings.mode);
    const bufferRef = useRef(settings.bufferSize);
    const lastPitchRef = useRef(null);

    useEffect(() => { drawModeRef.current = settings.mode; }, [settings.mode]);
    useEffect(() => { bufferRef.current = settings.bufferSize; }, [settings.bufferSize]);

    const emitPitch = useCallback((pitch) => {
        if (!onPitchChange) return;
        if (lastPitchRef.current === null || Math.abs(pitch - lastPitchRef.current) > 2) {
            lastPitchRef.current = pitch;
            onPitchChange(pitch);
        }
    }, [onPitchChange]);

    const draw = useCallback((analyser, context) => {
        animRef.current = requestAnimationFrame(() => draw(analyser, context));
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;
        const mode = drawModeRef.current;
        const buffer = bufferRef.current;

        const pitch = dominantFrequency(analyser, context);
        emitPitch(pitch);

        const maxFreq = buffer * context.sampleRate / analyser.fftSize;
        const color = paletteColor(pitch > 0 ? pitch / maxFreq : 0);

        if (mode === 'bars') {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);

            const bars = Math.min(dataArray.length, buffer);
            const barWidth = width / bars;

            for (let i = 0; i < bars; i++) {
                const barHeight = Math.max(2, (dataArray[i] / 255) * height);
                const alpha = 0.4 + 0.6 * (dataArray[i] / 255);
                ctx.fillStyle = color;
                ctx.globalAlpha = clamp(alpha);
                ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
            }
            ctx.globalAlpha = 1;
        } else {
            const dataArray = new Uint8Array(analyser.fftSize);
            analyser.getByteTimeDomainData(dataArray);

            const sliceWidth = width / dataArray.length;
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.beginPath();

            const steps = dataArray.length;
            for (let i = 0; i < steps; i++) {
                const v = dataArray[i] / 128.0;
                const y = height / 2 + v * (height / 2) * 0.9;
                const x = i * sliceWidth;

                const amplitude = clamp(Math.abs(v - 1) * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.25 + 0.75 * amplitude;
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }, [emitPitch]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (isRecording && analyserRef.current) {
            draw(analyserRef.current, analyserRef.current.context);
        } else {
            if (animRef.current) {
                cancelAnimationFrame(animRef.current);
                animRef.current = null;
            }
            lastPitchRef.current = null;
            if (canvas) {
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [isRecording, analyserRef, draw]);

    return (
        <canvas
            ref={canvasRef}
            id="view"
            width={800}
            height={450}
            className="w-full aspect-[16/9] rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl"
        />
    )
}