function SectionTitle({ children }) {
    return <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">{children}</h4>
}

function Switch({ checked, onChange, id, label }) {
    return (
        <label htmlFor={id} className="flex w-full cursor-pointer items-center justify-between gap-4 py-3">
            <span className="font-medium text-zinc-200">{label}</span>
            <span className="relative inline-flex">
                <input
                    id={id}
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={onChange}
                />
                <span className="h-6 w-11 rounded-full bg-white/10 transition-colors duration-300 peer-checked:bg-cyan-400/40" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-zinc-300 shadow transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-white" />
            </span>
        </label>
    )
}

export default function Params({ settings, onChange }) {
    const update = (key) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        onChange({ ...settings, [key]: value });
    };

    return (
        <div className="flex w-full flex-col gap-10">
            <div>
                <SectionTitle>Visualização</SectionTitle>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="viewMode" className="font-medium text-zinc-200">Modo de exibição</label>
                        <select
                            id="viewMode"
                            value={settings.mode}
                            onChange={update('mode')}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-zinc-100 outline-none transition-colors focus:border-cyan-400/50"
                        >
                            <option value="bars">Barras</option>
                            <option value="wave">Onda</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="bufferRange" className="font-medium text-zinc-200">Alcance de buffer</label>
                            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-sm text-cyan-300">
                                {settings.bufferSize}
                            </span>
                        </div>
                        <input
                            id="bufferRange"
                            type="range"
                            min={1}
                            max={200}
                            step={1}
                            value={settings.bufferSize}
                            onChange={update('bufferSize')}
                            className="cs-range w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <SectionTitle>Áudio</SectionTitle>
                <div className="mt-2 flex flex-col divide-y divide-white/10 border-y border-white/10">
                    <Switch
                        id="echo"
                        label="Cancelamento de eco"
                        checked={settings.echoCancellation}
                        onChange={update('echoCancellation')}
                    />
                    <Switch
                        id="noise"
                        label="Redução de ruído"
                        checked={settings.noiseSuppression}
                        onChange={update('noiseSuppression')}
                    />
                    <Switch
                        id="autoGain"
                        label="Ganho automático"
                        checked={settings.autoGainControl}
                        onChange={update('autoGainControl')}
                    />
                </div>
            </div>
        </div>
    )
}