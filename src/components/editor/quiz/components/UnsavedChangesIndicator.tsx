import React from 'react';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';

interface UnsavedChangesIndicatorProps {
    dirtyCount: number;
    onSave?: () => void;
    isSaving?: boolean;
}

/**
 * Indicador global de alterações não salvas
 * Exibe no topo do editor com contagem de steps modificados
 */
export function UnsavedChangesIndicator({
    dirtyCount,
    onSave,
    isSaving = false,
}: UnsavedChangesIndicatorProps) {
    if (dirtyCount === 0) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                    Todas as alterações salvas
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                    {dirtyCount} {dirtyCount === 1 ? 'step modificado' : 'steps modificados'}
                </span>
            </div>

            {onSave && (
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium rounded-md transition-colors"
                >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                </button>
            )}
        </div>
    );
}
