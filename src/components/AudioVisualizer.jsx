import { useState, useEffect, useRef, useCallback } from 'react'

export default function AudioVisualizer() {

    const [isRecording, setIsRecording] = useState(false);
    const canvas = useRef(null);
    const contextRef = useRef(null);
    const analyserRef = useRef(null);
    const animRef = useRef(null);

    const bufferRange = useRef({ min: 256, max: 2048 });
    const drawModeRef = useRef(null)

    window.addEventListener("DOMContentLoaded", () => {
        bufferRange.current = window.document.getElementById("bufferRange")?.value
        drawModeRef.current = window.document.getElementById("viewMode")?.value || 'wave';
    })

    useEffect(() => {
        contextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        bufferRange.current = window.document.getElementById("bufferRange")?.value 
        drawModeRef.current = window.document.getElementById("viewMode")?.value || 'bars';

        const handleBufferChange = (event) => {
            bufferRange.current = event.target.value;
        }

        const handleViewModeChange = (event) => {
            drawModeRef.current = event.target.value;
        };
        
        window.document.getElementById("bufferRange")?.addEventListener("change", handleBufferChange);
        window.document.getElementById("viewMode")?.addEventListener("change", handleViewModeChange);
    }, []);

    useEffect(() => {
        const handleStartRecording = () => setIsRecording(true);
        const handleStopRecording = () => setIsRecording(false);

        window.addEventListener("StartRecording", handleStartRecording);
        window.addEventListener("StopRecording", handleStopRecording);

        return () => {
            window.removeEventListener("StartRecording", handleStartRecording);
            window.removeEventListener("StopRecording", handleStopRecording);
        };
    }, []);

    
    const draw = useCallback((analyser) => {
        animRef.current = requestAnimationFrame(() => draw(analyser));
        let ctx = canvas.current.getContext("2d");
        
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height); // Clear canvas
        
        if (drawModeRef.current === 'bars') {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            
            let pitch = 0;
            let maxVal = 0;
            let maxIndex = 0;
            
            for (let i = 0; i < dataArray.length; i++) {
                if (dataArray[i] > maxVal) {
                    maxVal = dataArray[i];
                    maxIndex = i;
                }
            }
            if (maxVal > 0)
                pitch = maxIndex * contextRef.current.sampleRate / analyser.fftSize;
            
            const barWidth = (canvas.current.width / 100) * 1.5;
            let x = 0;
            
            const bars = Math.min(dataArray.length, bufferRange.current);
            for (let i = 0; i < bars; i++) {
                const barHeight = (dataArray[i] || 0) / 2;
                const peak = 2000;
                const bright = pitch / peak * 255;
                
                const sigma = 75; // largura da gaussiana
                const centerR = 0;
                const centerG = bars / 2 + sigma * 2;
                const centerB = bars + sigma * 2;
                
                const gaussian = (x, center, sigmaVal) => {
                    if (sigmaVal <= 0) return x === center ? 1 : 0;
                    const d = x - center;
                    return Math.exp(-(d * d) / (2 * sigmaVal * sigmaVal));
                };
                
                const r = Math.min(1, Math.max(0, gaussian(bright, centerR, sigma)));
                const g = Math.min(1, Math.max(0, gaussian(bright, centerG, sigma)));
                const b = bright >= centerB ? 1 : Math.min(1, Math.max(0, gaussian(bright, centerB, sigma)));
                
                ctx.fillStyle = `rgb(${(r * 255)}, ${(g * 255)}, ${(b * 255)})`;
                ctx.fillRect(x, canvas.current.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 0.5;
            }
        } else {
            // wave mode: desenha uma única forma de onda usando os dados de tempo
            const dataArray = new Uint8Array(analyser.fftSize);
            analyser.getByteTimeDomainData(dataArray);
            
            ctx.lineWidth = 1;
            ctx.beginPath();
            const sliceWidth = canvas.current.width / dataArray.length;

            const len = Math.min(dataArray.length, bufferRange.current);
            const sigma = 75; // largura da gaussiana
            const centerR = 0;
            const centerG = len / 2 + sigma * 2;
            const centerB = len + sigma * 2;

            let x = 0;
            
            for (let i = 0; i < dataArray.length; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.current.height / 2;
                
                const bright = v * 255;
                
                const gaussian = (x, center, sigmaVal) => {
                    if (sigmaVal <= 0) return x === center ? 1 : 0;
                    const d = x - center;
                    return Math.exp(-(d * d) / (2 * sigmaVal * sigmaVal));
                };
                
                const r = Math.min(1, Math.max(0, gaussian(bright, centerR, sigma)));
                const g = Math.min(1, Math.max(0, gaussian(bright, centerG, sigma)));
                const b = bright >= centerB ? 1 : Math.min(1, Math.max(0, gaussian(bright, centerB, sigma)));
                
                ctx.strokeStyle = `rgb(${(r * 255)}, ${(g * 255)}, ${(b * 255)})`;

                ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.stroke();
        }
    }, []);

    useEffect(() => {
        if (isRecording) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                const source = contextRef.current.createMediaStreamSource(stream);
                const analyser = contextRef.current.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                analyserRef.current = analyser;
                draw(analyser);
            }).catch((err) => console.error("Error accessing microphone:", err));
        } else {
            if (animRef.current) {
                cancelAnimationFrame(animRef.current);
                animRef.current = null;
            }
            if (canvas.current) {
                const ctx = canvas.current.getContext("2d");
                ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
            }
        }
    }, [isRecording, draw]);

    return (
        <canvas id="view" className="flex justify-center w-1/2" ref={canvas} height={400}></canvas>
    )
}