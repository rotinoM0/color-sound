import { useCallback, useState } from 'react'
import { useEffect, useRef } from 'react'

export function useMicrophone(settings = {}) {
    const [isRecording, setIsRecording] = useState(false);
    const contextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);

    const toggleMic = useCallback(async () => {
        if (isRecording) {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setIsRecording(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: settings.echoCancellation ?? true,
                    noiseSuppression: settings.noiseSuppression ?? true,
                    autoGainControl: settings.autoGainControl ?? true,
                },
            });

            if (!contextRef.current) {
                contextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const context = contextRef.current;
            if (context.state === 'suspended') {
                await context.resume();
            }

            const source = context.createMediaStreamSource(stream);

            const filter = context.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(100, context.currentTime);

            const analyser = context.createAnalyser();
            analyser.fftSize = 256;

            source.connect(filter);
            source.connect(analyser);

            streamRef.current = stream;
            analyserRef.current = analyser;
            setIsRecording(true);
        } catch (error) {
            console.error('Erro ao acessar o microfone:', error);
        }
    }, [isRecording, settings.echoCancellation, settings.noiseSuppression, settings.autoGainControl]);

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        };
    }, []);

    return { isRecording, toggleMic, analyserRef };
}