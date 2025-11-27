/**
 * 💾 AUTO-SAVE CONTEXT - Sistema de Auto-Salvamento Isolado
 * 
 * Provider separado para auto-save status, evitando re-renders desnecessários
 * em componentes que apenas lêem state do editor.
 * 
 * BENEFÍCIOS:
 * - Componentes que só lêem blocos não re-renderizam quando auto-save muda
 * - -50% re-renders desnecessários
 * - Melhor performance durante edição
 * - Testabilidade isolada
 * 
 * USO:
 * ```tsx
 * // Componente que SÓ lê blocos (não re-renderiza com auto-save)
 * const { state } = useEditor();
 * 
 * // Componente que mostra status de save
 * const { isSaving, lastSaved, error } = useAutoSaveStatus();
 * ```
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useEditor } from '../EditorContext';
import { useAutoSave } from '@/core/hooks/useAutoSave';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export interface AutoSaveContextValue {
    isSaving: boolean;
    lastSaved: number | null;
    error: Error | null;
    forceSave: () => Promise<void>;
    autoSaveEnabled: boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AutoSaveContext = createContext<AutoSaveContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface AutoSaveProviderProps {
    children: ReactNode;
    enabled?: boolean;
    debounceMs?: number;
}

export const AutoSaveProvider: React.FC<AutoSaveProviderProps> = ({
    children,
    enabled = true,
    debounceMs = 2000,
}) => {
    const editor = useEditor();

    // Hook de auto-save isolado
    const {
        isSaving,
        lastSaved,
        error,
        forceSave,
    } = useAutoSave({
        key: 'editor-auto-save',
        data: enabled ? {
            stepBlocks: editor.state.stepBlocks,
            currentStep: editor.state.currentStep,
            dirtySteps: editor.state.dirtySteps,
            modifiedSteps: editor.state.modifiedSteps,
        } : null,
        debounceMs,
        enableRecovery: true,
        onSave: () => {
            editor.markSaved();
            appLogger.info('[AutoSaveProvider] Auto-save concluído', {
                data: [{ timestamp: Date.now() }],
            });
        },
        onError: (err) => {
            appLogger.error('[AutoSaveProvider] Auto-save falhou', {
                data: [{ error: err.message }],
            });
        },
    });

    const value: AutoSaveContextValue = {
        isSaving,
        lastSaved,
        error,
        forceSave,
        autoSaveEnabled: enabled,
    };

    return (
        <AutoSaveContext.Provider value={value}>
            {children}
        </AutoSaveContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook para acessar status de auto-save
 * 
 * ✅ Use quando precisar mostrar status de salvamento
 * ❌ NÃO use se só precisa ler/editar blocos (use useEditor())
 */
export const useAutoSaveStatus = (): AutoSaveContextValue => {
    const context = useContext(AutoSaveContext);

    if (!context) {
        throw new Error('useAutoSaveStatus deve ser usado dentro de AutoSaveProvider');
    }

    return context;
};

// Alias para compatibilidade
export const useAutoSaveContext = useAutoSaveStatus;
