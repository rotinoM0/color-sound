import './App.css'

import React, { useState } from 'react'

import Microphone from './components/MicrophoneButton.jsx'
import Content from './components/Content.jsx'
import Params from './components/Params.jsx'
import Footer from './components/Footer.jsx'

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className='flex bg-zinc-900 w-screen text-white h-screen overflow-x-hidden'>


                <header className='flex flex-1 bg-gray-800 p-4 gap-5 fixed justify-between w-full z-10'>
                    <div className='flex pl-20 items-center gap-5'>
                        <span className='text-xl font-bold font-mono'>Sound Shape by rotinoM</span>
                    </div>
                    <button
                        className='lg: text-white'
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </button>
                </header>
                <div className='flex-1 flex flex-col w-1/2 h-full overflow-y-auto'>
                    <Content />

                    <div className='flex flex-col px-10 gap-20 py-10 border-t border-gray-700'>
                        <section>
                            <h2>Sobre o projeto</h2>
                            <p >Este projeto é uma aplicação web que captura o áudio do microfone do usuário e exibe uma visualização em tempo real do espectro de áudio utilizando a API Web Audio e o elemento canvas do HTML5. A visualização é estilizada com um gradiente de cores baseado em uma função gaussiana para criar um efeito visual atraente.</p>
                        </section>

                        <section>
                            <h2>Instruções de uso</h2>
                            <ol>
                                <li>Clique no botão de microfone para iniciar a captura de áudio.</li>
                                <li>Permita o acesso ao microfone quando solicitado pelo navegador.</li>
                                <li>Observe a visualização em tempo real do espectro de áudio no canvas.</li>
                                <li>Use o menu lateral para ajustar os parâmetros da visualização, como o modo de exibição (barras ou onda), o alcance do buffer e outras opções.</li>
                            </ol>
                        </section>

                        <section>
                            <h2>Tecnologias utilizadas</h2>
                            <ul>
                                <li>React: Biblioteca JavaScript para construção de interfaces de usuário.</li>
                                <li>Web Audio API: API para processamento e síntese de áudio no navegador.</li>
                                <li>HTML5 Canvas: Elemento para renderização gráfica dinâmica.</li>
                                <li>CSS: Estilização da aplicação.</li>
                            </ul>
                        </section>
                    </div>
                    <Footer />
                </div>

                {/* Sidebar for parameters configuration */}
                <div className={`transition-all duration-500 overflow-hidden ${sidebarOpen ? 'max-w-[500px]' : 'max-w-0'} 
                        flex flex-1 bg-black z-20 shadow-xl`}>
                    <div className='flex flex-col px-10 w-full text-white border-b border-gray-700 flex items-center py-10'>
                        {sidebarOpen && (
                            <button className="absolute top-0 right-0 p-5" onClick={() => setSidebarOpen(false)}>
                                <span aria-hidden="true" className='text-4xl p-5'>&times;</span>
                            </button>
                        )}
                        <div className='flex items-center justify-between w-full py-10'>
                            <h3 className='font-mono font-bold text-3xl px-5'>Configurar Parâmetros</h3>
                        </div>
                        <div className='flex flex-col w-full gap-10'>
                            <div className='w-full flex flex-col justify-between font-bold'>
                                <label htmlFor="bufferRange">Alcance de captura</label>
                                <input type="range" id='bufferRange' className='slider' min={1} max={200} step={1} />
                            </div>
                            {/* <div className='w-full flex flex-col justify-between font-bold'>
                                <label htmlFor=""></label>
                                <input type="range" className='slider' min={1} max={200} step={1} />
                            </div> */}
                            <div className='w-full flex flex-col justify-between font-bold'>
                                <label htmlFor=""></label>
                                <select className='bg-gray-800 p-2 rounded-md w-full' id='viewMode'>
                                    <option value="wave">Wave Mode</option>
                                    <option value="bars">Bars Mode</option>
                                </select>
                            </div>
                            <div className='w-full flex gap-2 font-bold items-center'>
                                <input type="checkbox" name="" id="echo" checked />
                                <label htmlFor="echo" className='ml-2'>Cancelamento de eco</label>
                            </div>
                            <div className='w-full flex gap-2 font-bold items-center'>
                                <input type="checkbox" name="" id="noise" checked />
                                <label htmlFor="noise" className='ml-2'>Redução de ruído</label>
                            </div>
                            <div className='w-full flex gap-2 font-bold items-center'>
                                <input type="checkbox" name="" id="autoGain" checked />
                                <label htmlFor="autoGain" className='ml-2'>Ganho automático</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
