import { useState } from 'react'
import AudioVisualizer from './AudioVisualizer'
import MicrophoneButton from './MicrophoneButton'

export default function Content({ analyserRef, isRecording, onToggleMic, settings }) {
    const [pitch, setPitch] = useState(0);

    return (
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-6 py-16">
            <header className="text-center">
                <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
                    Sound <span className="text-cyan-400">Shape</span>
                </h1>
                <span className="mb-4 inline-block px-4 py-1 text-sm font-medium text-cyan-300 backdrop-blur-xl">
                    Visualizador de espectro em tempo real
                </span>
                <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                    Capture o áudio do seu microfone e veja as frequências se transformarem em formas e cores.
                </p>
            </header>

            <AudioVisualizer
                analyserRef={analyserRef}
                isRecording={isRecording}
                settings={settings}
                onPitchChange={setPitch}
            />

            <div className="flex flex-col w-full flex-wrap items-center justify-center gap-6">
                {isRecording && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
                        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                        <span className="text-sm text-zinc-300">Frequência dominante</span>
                        <span className="font-mono text-lg font-semibold text-cyan-300">
                            {pitch > 0 ? `${Math.round(pitch)} Hz` : '—'}
                        </span>
                    </div>
                )}
                <MicrophoneButton isRecording={isRecording} onToggle={onToggleMic} />
            </div>
        </section>
    )
}