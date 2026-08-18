import React, { useState } from 'react'
import logo from './assets/sound-shape.png'
import { useMicrophone } from './hooks/useMicrophone'
import Content from './components/Content.jsx'
import Params from './components/Params.jsx'
import Footer from './components/Footer.jsx'

const DEFAULT_SETTINGS = {
    mode: 'bars',
    bufferSize: 100,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
}

function InfoSection() {
    return (
        <div className="grid gap-6 px-6 pb-20 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h2 className="mb-3 text-lg font-bold text-zinc-100">Sobre o projeto</h2>
                <p className="text-sm leading-relaxed text-zinc-400">
                    Aplicação web que captura o áudio do microfone e exibe em tempo real o espectro de
                    áudio, usando a Web Audio API e o canvas do HTML5. As cores são geradas a partir da
                    frequência dominante para criar um efeito visual dinâmico e atraente.
                </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h2 className="mb-3 text-lg font-bold text-zinc-100">Instruções de uso</h2>
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
                    <li>Clique no botão de microfone para iniciar a captura.</li>
                    <li>Permita o acesso ao microfone quando solicitado pelo navegador.</li>
                    <li>Observe a visualização em tempo real do espectro de áudio.</li>
                    <li>Use o menu lateral para ajustar modo de exibição, buffer e opções de áudio.</li>
                </ol>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:col-span-2 lg:col-span-1">
                <h2 className="mb-3 text-lg font-bold text-zinc-100">Tecnologias utilizadas</h2>
                <ul className="space-y-2 text-sm text-zinc-400">
                    <li><span className="text-zinc-200">React</span> · construção da interface</li>
                    <li><span className="text-zinc-200">Web Audio API</span> · processamento de áudio</li>
                    <li><span className="text-zinc-200">HTML5 Canvas</span> · renderização gráfica</li>
                    <li><span className="text-zinc-200">Tailwind CSS</span> · estilização</li>
                </ul>
            </article>
        </div>
    )
}

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const { isRecording, toggleMic, analyserRef } = useMicrophone(settings);

    return (
        <div className="relative flex min-h-screen flex-col bg-zinc-950 text-white">
            <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex h-16 items-center justify-between px-4 pr-6 sm:px-6">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Sound Shape" className="w-10 rounded-lg" />
                        <span className="font-mono text-lg font-bold tracking-tight">
                            Sound Shape <span className="font-normal text-zinc-500">by rotinoM</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium sm:flex
                            ${isRecording ? 'border-red-400/30 bg-red-400/10 text-red-300' : 'bg-white/5 text-zinc-400'}`}>
                            <span className={`h-2 w-2 rounded-full ${isRecording ? 'animate-pulse bg-red-400' : 'bg-zinc-500'}`} />
                            {isRecording ? 'Capturando' : 'Pronto'}
                        </span>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir configurações"
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-sliders" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-1 pt-16">
                <Content
                    analyserRef={analyserRef}
                    isRecording={isRecording}
                    onToggleMic={toggleMic}
                    settings={settings}
                />
                <InfoSection />
                <Footer />
            </main>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
            )}

            <aside
                className={`fixed right-0 top-0 z-50 h-full w-[min(88vw,400px)] overflow-y-auto border-l border-white/10 bg-zinc-950/60 backdrop-blur-2xl shadow-2xl transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <h3 className="font-mono text-xl font-bold">Parâmetros</h3>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Fechar configurações"
                        className="rounded-lg p-1.5 text-3xl leading-none text-zinc-400 transition-colors hover:text-white"
                    >
                        &times;
                    </button>
                </div>
                <div className="px-6 py-8">
                    <Params settings={settings} onChange={setSettings} />
                </div>
            </aside>
        </div>
    )
}

export default App