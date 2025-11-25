/**
 * 💾 USE AUTO SAVE - Auto-save automático com debounce
 * 
 * Hook que monitora mudanças no estado do editor e persiste automaticamente
 * usando o persistenceService. Inclui:
 * - Debounce configurável
 * - Recovery de dados perdidos
 * - Controle via feature flag
 * - Indicador de status (salvando, salvo, erro)
 * 
 * @example
 * ```typescript
 * const { isSaving, lastSaved, error } = useAutoSave({
 *   data: editorState,
 *   key: 'editor-state',
 *   debounceMs: 2000,
 * });
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { getFeatureFlag } from '@/core/utils/featureFlags';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Helper para salvar dados no localStorage com compressão opcional
 */
function saveToStorage(key: string, data: any, options?: { compress?: boolean }): void {
    try {
        const serialized = JSON.stringify(data);
        const timestamp = Date.now();
        const item = {
            data: serialized,
            timestamp,
            version: '1.0',
        };
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        appLogger.error('[useAutoSave] Failed to save to localStorage', { data: [{ key, error }] });
        throw error;
    }
}

/**
 * Helper para carregar dados do localStorage
 */
function loadFromStorage(key: string): any | null {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;
        
        const item = JSON.parse(stored);
        if (!item || !item.data) return null;
        
        return JSON.parse(item.data);
    } catch (error) {
        appLogger.warn('[useAutoSave] Failed to load from localStorage', { data: [{ key, error }] });
        return null;
    }
}

export interface UseAutoSaveOptions {
    /** Chave única para persistência */
    key: string;
    
    /** Dados a serem salvos */
    data: any;
    
    /** Tempo de debounce em ms (padrão: 2000) */
    debounceMs?: number;
    
    /** Se deve salvar imediatamente ao montar (padrão: false) */
    saveOnMount?: boolean;
    
    /** Callback ao salvar com sucesso */
    onSave?: (key: string) => void;
    
    /** Callback ao falhar */
    onError?: (error: Error) => void;
    
    /** Se deve fazer recovery ao montar (padrão: true) */
    enableRecovery?: boolean;
}

export interface UseAutoSaveResult {
    /** Se está salvando no momento */
    isSaving: boolean;
    
    /** Timestamp do último save bem-sucedido */
    lastSaved: number | null;
    
    /** Erro do último save, se houver */
    error: Error | null;
    
    /** Forçar save imediato */
    forceSave: () => Promise<void>;
    
    /** Dados recuperados, se houver */
    recoveredData: any | null;
    
    /** Limpar dados recuperados */
    clearRecovery: () => void;
}

/**
 * Hook de auto-save com debounce e recovery
 */
export function useAutoSave(options: UseAutoSaveOptions): UseAutoSaveResult {
    const {
        key,
        data,
        debounceMs = 2000,
        saveOnMount = false,
        onSave,
        onError,
        enableRecovery = true,
    } = options;

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<number | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [recoveredData, setRecoveredData] = useState<any | null>(null);
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dataRef = useRef(data);
    const isEnabledRef = useRef(getFeatureFlag('usePersistenceService'));

    // Atualizar ref quando dados mudam
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    // Atualizar feature flag
    useEffect(() => {
        isEnabledRef.current = getFeatureFlag('usePersistenceService');
    }, []);

    /**
     * Salvar dados
     */
    const save = useCallback(async () => {
        if (!isEnabledRef.current) {
            appLogger.debug('[useAutoSave] Persistence disabled via feature flag');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            saveToStorage(key, dataRef.current, { compress: true });

            const now = Date.now();
            setLastSaved(now);
            setIsSaving(false);

            appLogger.debug('[useAutoSave] Data saved successfully', {
                data: [{ key, timestamp: now }],
            });

            onSave?.(key);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            setIsSaving(false);

            appLogger.error('[useAutoSave] Failed to save data', {
                data: [{ key, error: error.message }],
            });

            onError?.(error);
        }
    }, [key, onSave, onError]);

    /**
     * Force save imediato
     */
    const forceSave = useCallback(async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        await save();
    }, [save]);

    /**
     * Recovery de dados ao montar
     */
    useEffect(() => {
        if (!enableRecovery || !isEnabledRef.current) return;

        const recover = () => {
            try {
                const recovered = loadFromStorage(key);
                if (recovered && recovered !== null) {
                    setRecoveredData(recovered);
                    appLogger.info('[useAutoSave] Data recovered', {
                        data: [{ key }],
                    });
                }
            } catch (err) {
                appLogger.warn('[useAutoSave] Recovery failed', {
                    data: [{ key, error: err }],
                });
            }
        };

        recover();
    }, [key, enableRecovery]);

    /**
     * Save on mount se configurado
     */
    useEffect(() => {
        if (saveOnMount && isEnabledRef.current) {
            save();
        }
    }, [saveOnMount, save]);

    /**
     * Auto-save com debounce quando dados mudam
     */
    useEffect(() => {
        if (!isEnabledRef.current) return;

        // Limpar timeout anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Agendar novo save
        timeoutRef.current = setTimeout(() => {
            save();
        }, debounceMs);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, debounceMs, save]);

    /**
     * Limpar recovery
     */
    const clearRecovery = useCallback(() => {
        setRecoveredData(null);
    }, []);

    /**
     * Save final ao desmontar
     */
    useEffect(() => {
        return () => {
            if (isEnabledRef.current && dataRef.current) {
                // Save síncrono no unmount
                try {
                    saveToStorage(key, dataRef.current, { compress: true });
                } catch (err) {
                    appLogger.error('[useAutoSave] Failed to save on unmount', {
                        data: [{ key, error: err }],
                    });
                }
            }
        };
    }, [key]);

    return {
        isSaving,
        lastSaved,
        error,
        forceSave,
        recoveredData,
        clearRecovery,
    };
}

export default useAutoSave;
