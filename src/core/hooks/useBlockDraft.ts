/**
 * 🎯 USE BLOCK DRAFT - Hook Universal de Rascunho de Blocos
 * 
 * Hook para gerenciar rascunhos de blocos com validação e commit.
 * Substitui múltiplas implementações de draft em painéis diferentes.
 * 
 * FEATURES:
 * - Rascunho local sem afetar estado global
 * - Validação em tempo real
 * - Commit/Cancel explícitos
 * - Dirty tracking
 * - Undo/Redo
 * 
 * @example
 * ```typescript
 * import { useBlockDraft } from '@/core/hooks';
 * 
 * function PropertiesPanel({ block }) {
 *   const draft = useBlockDraft(block);
 *   
 *   return (
 *     <div>
 *       <input 
 *         value={draft.data.content.title}
 *         onChange={e => draft.update({ content: { title: e.target.value } })}
 *       />
 *       
 *       {draft.isDirty && (
 *         <>
 *           <button onClick={draft.commit}>Salvar</button>
 *           <button onClick={draft.cancel}>Cancelar</button>
 *         </>
 *       )}
 *       
 *       {draft.validationError && (
 *         <p className="error">{draft.validationError}</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Block, validateBlock } from '@/core/schemas';
import { appLogger } from '@/lib/utils/appLogger';

export interface BlockDraftAPI {
    /** Dados do rascunho atual */
    data: Block;
    
    /** Se o rascunho tem mudanças não salvas */
    isDirty: boolean;
    
    /** Erro de validação, se houver */
    validationError: string | null;
    
    /** Se o rascunho é válido */
    isValid: boolean;
    
    /** Atualizar rascunho (shallow merge) */
    update: (updates: Partial<Block>) => void;
    
    /** Atualizar content específico */
    updateContent: (key: string, value: any) => void;
    
    /** Atualizar properties específica */
    updateProperty: (key: string, value: any) => void;
    
    /** Salvar rascunho (commit para estado global) */
    commit: () => void;
    
    /** Cancelar rascunho (reverter para original) */
    cancel: () => void;
    
    /** Resetar para valores originais */
    reset: () => void;
    
    /** Desfazer última mudança */
    undo: () => void;
    
    /** Refazer mudança desfeita */
    redo: () => void;
    
    /** Se pode desfazer */
    canUndo: boolean;
    
    /** Se pode refazer */
    canRedo: boolean;
}

export interface UseBlockDraftOptions {
    /** Callback quando commit é chamado */
    onCommit?: (block: Block) => void;
    
    /** Callback quando cancel é chamado */
    onCancel?: () => void;
    
    /** Validação customizada adicional */
    customValidation?: (block: Block) => string | null;
    
    /** Debounce de validação em ms */
    validationDebounce?: number;
}

/**
 * Hook principal
 */
export function useBlockDraft(
    originalBlock: Block,
    options: UseBlockDraftOptions = {}
): BlockDraftAPI {
    const [draftData, setDraftData] = useState<Block>(originalBlock);
    const [history, setHistory] = useState<Block[]>([originalBlock]);
    const [historyIndex, setHistoryIndex] = useState(0);
    
    // Sincronizar com mudanças externas do block original
    useEffect(() => {
        setDraftData(originalBlock);
        setHistory([originalBlock]);
        setHistoryIndex(0);
    }, [originalBlock.id]); // Resetar apenas quando ID muda
    
    // Dirty tracking
    const isDirty = useMemo(() => {
        return JSON.stringify(draftData) !== JSON.stringify(originalBlock);
    }, [draftData, originalBlock]);
    
    // Validação
    const { validationError, isValid } = useMemo(() => {
        const result = validateBlock(draftData);
        
        if (!result.success) {
            return {
                validationError: result.error.errors[0]?.message || 'Erro de validação',
                isValid: false,
            };
        }
        
        // Validação customizada
        if (options.customValidation) {
            const customError = options.customValidation(draftData);
            if (customError) {
                return {
                    validationError: customError,
                    isValid: false,
                };
            }
        }
        
        return {
            validationError: null,
            isValid: true,
        };
    }, [draftData, options.customValidation]);
    
    // Update com history tracking
    const update = useCallback((updates: Partial<Block>) => {
        setDraftData(prev => {
            const next = { ...prev, ...updates };
            
            // Adicionar ao histórico
            setHistory(h => {
                const newHistory = h.slice(0, historyIndex + 1);
                newHistory.push(next);
                return newHistory;
            });
            setHistoryIndex(i => i + 1);
            
            return next;
        });
    }, [historyIndex]);
    
    // Update helpers
    const updateContent = useCallback((key: string, value: any) => {
        update({
            content: {
                ...draftData.content,
                [key]: value,
            },
        });
    }, [draftData.content, update]);
    
    const updateProperty = useCallback((key: string, value: any) => {
        update({
            properties: {
                ...draftData.properties,
                [key]: value,
            },
        });
    }, [draftData.properties, update]);
    
    // Commit
    const commit = useCallback(() => {
        if (!isValid) {
            appLogger.warn('[useBlockDraft] Tentativa de commit com dados inválidos');
            return;
        }
        
        appLogger.debug('[useBlockDraft] Commit:', draftData.id);
        options.onCommit?.(draftData);
        
        // Resetar history após commit
        setHistory([draftData]);
        setHistoryIndex(0);
    }, [draftData, isValid, options]);
    
    // Cancel
    const cancel = useCallback(() => {
        appLogger.debug('[useBlockDraft] Cancel:', originalBlock.id);
        setDraftData(originalBlock);
        setHistory([originalBlock]);
        setHistoryIndex(0);
        options.onCancel?.();
    }, [originalBlock, options]);
    
    // Reset (alias para cancel)
    const reset = cancel;
    
    // Undo/Redo
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(i => i - 1);
            setDraftData(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);
    
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(i => i + 1);
            setDraftData(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);
    
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;
    
    return {
        data: draftData,
        isDirty,
        validationError,
        isValid,
        update,
        updateContent,
        updateProperty,
        commit,
        cancel,
        reset,
        undo,
        redo,
        canUndo,
        canRedo,
    };
}
