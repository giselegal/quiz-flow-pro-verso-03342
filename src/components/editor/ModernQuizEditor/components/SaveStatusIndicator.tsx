/**
 * 💾 SaveStatusIndicator - Indicador de status de salvamento
 * 
 * Exibe:
 * - Spinner enquanto salva
 * - Checkmark quando salvo
 * - Erro com botão de retry
 * - Timestamp do último save
 */

import { SaveStatus } from '../hooks/usePersistence';

export interface SaveStatusIndicatorProps {
    status: SaveStatus;
    error: Error | null;
    lastSaved: Date | null;
    onRetry?: () => void;
    onClearError?: () => void;
}

export function SaveStatusIndicator({
    status,
    error,
    lastSaved,
    onRetry,
    onClearError,
}: SaveStatusIndicatorProps) {
    // Formatar timestamp
    const formatTimestamp = (date: Date | null): string => {
        if (!date) return 'Nunca';

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);

        if (diffSec < 10) return 'Agora mesmo';
        if (diffSec < 60) return `${diffSec}s atrás`;
        if (diffMin < 60) return `${diffMin}m atrás`;
        if (diffHour < 24) return `${diffHour}h atrás`;
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
            {/* Status Icon */}
            <div className="flex items-center gap-2">
                {status === 'saving' && (
                    <>
                        <div className="animate-spin text-blue-500 text-xl">⏳</div>
                        <span className="text-sm text-gray-600">Salvando...</span>
                    </>
                )}

                {status === 'saved' && (
                    <>
                        <div className="text-green-500 text-xl">✓</div>
                        <span className="text-sm text-green-600">Salvo</span>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-xl">⚠️</div>
                        <span className="text-sm text-red-600">Erro ao salvar</span>
                    </>
                )}

                {status === 'idle' && lastSaved && (
                    <>
                        <div className="text-gray-400 text-xl">💾</div>
                        <span className="text-sm text-gray-500">Todas as alterações salvas</span>
                    </>
                )}

                {status === 'idle' && !lastSaved && (
                    <>
                        <div className="text-gray-400 text-xl">💾</div>
                        <span className="text-sm text-gray-400">Pronto para salvar</span>
                    </>
                )}
            </div>

            {/* Timestamp */}
            {lastSaved && (
                <span className="text-xs text-gray-400">
                    Último save: {formatTimestamp(lastSaved)}
                </span>
            )}

            {/* Error Message + Retry */}
            {status === 'error' && error && (
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-red-600 max-w-xs truncate" title={error.message}>
                        {error.message}
                    </span>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-3 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded transition"
                        >
                            Tentar novamente
                        </button>
                    )}

                    {onClearError && (
                        <button
                            onClick={onClearError}
                            className="text-gray-400 hover:text-gray-600"
                            title="Fechar erro"
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
