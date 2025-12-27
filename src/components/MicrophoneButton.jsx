import { useEffect, useState } from "react";
import { toggleMic } from "../hooks/useMicrophone";

export default function Microphone() {
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        const handleStartRecording = () => setRecording(true);
        const handleStopRecording = () => setRecording(false);

        window.addEventListener("StartRecording", handleStartRecording);
        window.addEventListener("StopRecording", handleStopRecording);

        return () => {
            window.removeEventListener("StartRecording", handleStartRecording);
            window.removeEventListener("StopRecording", handleStopRecording);
        };
    }, []);

    return (<button id='micBtn' onClick={toggleMic}>{recording ? (
        <div className="flex gap-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
            </svg>
            Gravando
        </div>
        
    )
        : (
            <div className="flex gap-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-mic" viewBox="0 0 16 16">
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
                </svg>
                Iniciar Gravação
            </div>
        )}</button>)
}