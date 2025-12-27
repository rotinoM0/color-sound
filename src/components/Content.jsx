import AudioVisualizer from './AudioVisualizer';
import Microphone from './MicrophoneButton'

function Frequency() {
    return <h3 id='Frequency'>Frequencia</h3>
}

function Canvas() {
    return <canvas id="view" className="" width={200} height={200}></canvas>
}

export default function Content() {
    return (
        <div className='px-10 py-20 h-full flex flex-col gap-10 items-center border-b border-gray-700'>
            <AudioVisualizer />
            <Frequency />
            <Microphone />
        </div>
    )
}

export { Canvas, Frequency };