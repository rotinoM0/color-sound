import './App.css'

import React, { useState } from 'react'

import Microphone from './components/MicrophoneButton.jsx'
import Content from './components/Content.jsx'
import Params from './components/Params.jsx'

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <>
            <div className='flex bg-gray-900 w-screen text-white h-screen overflow-x-hidden'>


                <div className='flex-1 flex flex-col w-full'>
                    <header className='flex flex-1 bg-gray-800 p-4 gap-5 fixed w-full z-10'>
                        <button
                            className='lg:hidden text-white'
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? 'Close Params' : 'Open Params'}
                        </button>
                        <h1>Sound Shape</h1>
                    </header>
                    <Content />
                </div>

            </div>
            {/* Sidebar for parameters configuration */}
            <div className={`transition-transform duration-500 ${sidebarOpen ? 'translate-x-[-100%]' : 'translate-x-0'} 
                    flex flex-1 w-full h-screen bg-black z-20 shadow-xl`}>
                <div className='flex flex-col px-10 w-full text-white border-b border-gray-700 flex items-center'>
                    <div className='w-full py-10'>
                        <h2 className='font-mono font-bold text-3xl px-5 py-10 mb-10 border-b'>Configurar Parâmetros</h2>
                    </div>
                    <div className='flex flex-col gap-10'>
                        <div>
                            <label htmlFor="bufferRange"></label>
                            <input type="range" id='bufferRange' className='slider' min={1} max={200} step={1} />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="range" className='slider' min={1} max={200} step={1} />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <select className='bg-gray-800 p-2 rounded-md w-full' id='viewMode'>
                                <option value="wave">Wave Mode</option>
                                <option value="bars">Bars Mode</option>
                            </select>
                        </div>
                        <div>
                            <input type="checkbox" name="" id="echo" />
                            <label htmlFor="echo" className='ml-2'>Cancelamento de eco</label>
                        </div>
                        <div>
                            <input type="checkbox" name="" id="noise" />
                            <label htmlFor="noise" className='ml-2'>Redução de ruído</label>
                        </div>
                        <div>
                            <input type="checkbox" name="" id="autoGain" />
                            <label htmlFor="autoGain" className='ml-2'>Ganho automático</label>
                        </div>
                    </div>
                </div>
                {sidebarOpen && (
                    <div className=" inset-0 bg-black p-5 opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <span aria-hidden="true" className='bg-white p-5'>&times;</span>
                    </div>
                )}
            </div>
        </>
    )
}

export default App
