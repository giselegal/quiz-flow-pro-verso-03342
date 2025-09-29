import React from 'react';
import { useQuizEditorContext } from '@/context/QuizEditorProvider';

export const QuizStatusBar: React.FC = () => {
    const { state, dirty, lastPersistedAt, storageMedium, loading, lastReloadAt, lastHash, persistedFlash } = useQuizEditorContext();

    return (
        <div className="w-full border-t bg-gray-900/70 text-xs text-gray-400 px-3 py-1 flex items-center gap-4">
            {loading && <span>Carregando quiz...</span>}
            {!loading && state && (
                <>
                    <span>
                        Hash: <strong className="text-gray-200">{state.hash}</strong>
                        {lastHash && lastHash !== state.hash && (
                            <span className="ml-1 text-[10px] text-purple-300">(prev {lastHash.slice(0, 8)})</span>
                        )}
                    </span>
                    <span>Status: {dirty ? <span className="text-amber-400">Modificado</span> : <span className="text-green-400">Sincronizado</span>}</span>
                    {persistedFlash && !dirty && (
                        <span className="text-emerald-400 animate-pulse">Persistido ✓</span>
                    )}
                    {storageMedium && <span>Storage: {storageMedium}</span>}
                    {lastPersistedAt && <span>Save: {new Date(lastPersistedAt).toLocaleTimeString()}</span>}
                    {lastReloadAt && <span>Reload: {new Date(lastReloadAt).toLocaleTimeString()}</span>}
                    <span>Steps: {state.steps.length}</span>
                </>
            )}
        </div>
    );
};

export default QuizStatusBar;
