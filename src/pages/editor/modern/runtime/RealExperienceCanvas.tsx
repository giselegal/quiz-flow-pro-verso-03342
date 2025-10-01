import React, { useMemo, useRef, useState, useCallback } from 'react';
import QuizApp from '@/components/quiz/QuizApp';
import QuizAppRuntime, { QuizAppRuntimeHandle } from './QuizAppRuntime';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RealExperienceCanvasProps {
    funnelId?: string;
    stepsSource?: any[]; // futuro: shape padronizado
    onExit?: () => void;
    onReset?: () => void;
}

/**
 * Runtime isolado do quiz para o modo "Experiência Real" no editor.
 * Fase 1: usa diretamente QuizApp (estado próprio hook interno) sem sincronização reversa.
 */
const RealExperienceCanvas: React.FC<RealExperienceCanvasProps> = ({ funnelId, stepsSource, onExit, onReset }) => {
    const [isMounting] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [enableAutoAdvance, setEnableAutoAdvance] = useState(true);
    const [questionDelay, setQuestionDelay] = useState(1000);
    const [strategicDelay, setStrategicDelay] = useState(500);

    const runtimeRef = useRef<QuizAppRuntimeHandle | null>(null);
    const handleResetRuntime = () => {
        if (stepsSource && stepsSource.length > 0 && runtimeRef.current) {
            runtimeRef.current.reset();
        } else {
            setRuntimeKey(k => k + 1); // fallback legacy
        }
        onReset?.();
    };
    const [runtimeKey, setRuntimeKey] = useState(0);

    return (
        <div className="w-full h-full relative bg-white overflow-auto" ref={containerRef}>
            <div className="absolute top-2 left-2 z-20 flex flex-wrap items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded shadow border">
                <span className="px-2 py-1 text-xs rounded bg-blue-600 text-white shadow">Experiência Real</span>
                <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={enableAutoAdvance} onChange={e => setEnableAutoAdvance(e.target.checked)} />
                    Auto-avançar
                </label>
                <div className="flex items-center gap-1 text-xs">
                    <span>Delay Q:</span>
                    <input
                        type="number"
                        className="w-16 px-1 py-0.5 border rounded text-xs"
                        min={0}
                        value={questionDelay}
                        onChange={e => setQuestionDelay(Number(e.target.value) || 0)}
                        disabled={!enableAutoAdvance}
                    />
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <span>Delay Strat:</span>
                    <input
                        type="number"
                        className="w-16 px-1 py-0.5 border rounded text-xs"
                        min={0}
                        value={strategicDelay}
                        onChange={e => setStrategicDelay(Number(e.target.value) || 0)}
                        disabled={!enableAutoAdvance}
                    />
                </div>
                <button
                    onClick={handleResetRuntime}
                    className="px-2 py-1 text-xs rounded border bg-white hover:bg-gray-50 shadow"
                >Reset</button>
                {onExit && (
                    <button
                        onClick={onExit}
                        className="px-2 py-1 text-xs rounded border bg-white hover:bg-gray-50 shadow"
                    >Voltar</button>
                )}
            </div>
            {isMounting && (
                <div className="absolute inset-0 flex items-center justify-center"><LoadingSpinner /></div>
            )}
            {/* Execução isolada do quiz */}
            <div className="min-h-full">
                {/* Fase futura: adaptar QuizApp para aceitar steps injetadas. */}
                {stepsSource && stepsSource.length > 0 ? (
                    <QuizAppRuntime
                        ref={runtimeRef}
                        key={runtimeKey}
                        steps={stepsSource as any}
                        hideDebug
                        autoAdvance={enableAutoAdvance}
                        questionDelay={questionDelay}
                        strategicDelay={strategicDelay}
                    />
                ) : stepsSource && stepsSource.length === 0 ? (
                    <div className="p-6 text-sm text-amber-600">Nenhum step válido foi mapeado a partir dos blocos atuais. Adicione um bloco do tipo intro ou question.</div>
                ) : (
                    <QuizApp
                        key={runtimeKey}
                        funnelId={funnelId}
                        hideDebug
                        enableAutoAdvance={enableAutoAdvance}
                        questionAutoAdvanceDelayMs={questionDelay}
                        strategicAutoAdvanceDelayMs={strategicDelay}
                    />
                )}
            </div>
        </div>
    );
};

export default RealExperienceCanvas;
