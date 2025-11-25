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
    data: Block | null;
    
    /** Se o rascunho tem mudanças não salvas */
    isDirty: boolean;
    
    /** Erros de validação */
    errors: string[];
    
    /** Se o rascunho é válido */
    isValid: boolean;
    
    /** Atualizar rascunho (shallow merge) */
    update: (updates: Partial<Block>) => void;
    
    /** Atualizar content específico */
    updateContent: (key: string, value: any) => void;
    
    /** Atualizar property específica */
    updateProperty: (key: string, value: any) => void;
    
    /** Atualizar properties inteiras */
    updateProperties: (properties: Record<string, any>) => void;
    
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
    
    /** Validar em cada mudança */
    validateOnChange?: boolean;
    
    /** Debounce de validação em ms */
    validationDebounce?: number;
}

/**
 * Hook principal
 */
export function useBlockDraft(
    originalBlock: Block | null,
    options: UseBlockDraftOptions = {}
): BlockDraftAPI {
    const [draftData, setDraftData] = useState<Block | null>(originalBlock);
    const [history, setHistory] = useState<Array<Block | null>>([originalBlock]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const historyIndexRef = useRef(0);
    const HISTORY_LIMIT = 100;
    
    // Sincronizar ref com estado
    useEffect(() => {
        historyIndexRef.current = historyIndex;
    }, [historyIndex]);
    
    // Sincronizar com mudanças externas do block original
    useEffect(() => {
        if (originalBlock) {
            setDraftData(originalBlock);
            setHistory([originalBlock]);
            setHistoryIndex(0);
        }
    }, [originalBlock?.id]); // Resetar apenas quando ID muda
    
    // Dirty tracking
    const isDirty = useMemo(() => {
        if (!draftData || !originalBlock) return false;
        return JSON.stringify(draftData) !== JSON.stringify(originalBlock);
    }, [draftData, originalBlock]);
    
    // Validação
    const { errors, isValid } = useMemo(() => {
        // Não validar se desabilitado ou se não há dados
        if (!draftData || options.validateOnChange === false) {
            return {
                errors: [],
                isValid: true,
            };
        }
        
        const errorList: string[] = [];
        
        // Validação com Zod
        const result = validateBlock(draftData);
        if (!result.success) {
            errorList.push(...result.error.errors.map(e => e.message));
        }
        
        // Validação customizada
        if (options.customValidation) {
            const customError = options.customValidation(draftData);
            if (customError) {
                errorList.push(customError);
            }
        }
        
        return {
            errors: errorList,
            isValid: errorList.length === 0,
        };
    }, [draftData, options.validateOnChange, options.customValidation]);
    
    // Update com history tracking
    const update = useCallback((updates: Partial<Block>) => {
        setDraftData(prev => {
            if (!prev) return prev;
            const next = { ...prev, ...updates };
            
            // Atualizar histórico usando ref para valor atual
            setHistory(h => {
                const currentIndex = historyIndexRef.current;
                const newHistory = h.slice(0, currentIndex + 1);
                newHistory.push(next);
                
                // Limitar tamanho do history
                if (newHistory.length > HISTORY_LIMIT) {
                    return newHistory.slice(-HISTORY_LIMIT);
                }
                
                return newHistory;
            });
            
            setHistoryIndex(i => {
                const newIndex = i + 1;
                return newIndex >= HISTORY_LIMIT ? HISTORY_LIMIT - 1 : newIndex;
            });
            
            return next;
        });
    }, []);
    
    // Update helpers
    const updateContent = useCallback((key: string, value: any) => {
        if (!draftData) return;
        update({
            properties: {
                ...draftData.properties,
                [key]: value,
            },
        });
    }, [draftData, update]);
    
    const updateProperty = useCallback((key: string, value: any) => {
        if (!draftData) return;
        update({
            properties: {
                ...draftData.properties,
                [key]: value,
            },
        });
    }, [draftData, update]);
    
    const updateProperties = useCallback((properties: Record<string, any>) => {
        if (!draftData) return;
        update({
            properties: {
                ...draftData.properties,
                ...properties,
            },
        });
    }, [draftData, update]);
    
    // Commit
    const commit = useCallback(() => {
        if (!draftData) return;
        
        if (!isValid && options.validateOnChange !== false) {
            appLogger.warn('[useBlockDraft] Tentativa de commit com dados inválidos');
            return;
        }
        
        appLogger.debug('[useBlockDraft] Commit:', draftData.id);
        options.onCommit?.(draftData);
        
        // Resetar history após commit mas manter isDirty como false
        setHistory([draftData]);
        setHistoryIndex(0);
    }, [draftData, isValid, options]);
    
    // Cancel
    const cancel = useCallback(() => {
        if (!originalBlock) return;
        
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
        errors,
        isValid,
        update,
        updateContent,
        updateProperty,
        updateProperties,
        commit,
        cancel,
        reset,
        undo,
        redo,
        canUndo,
        canRedo,
    };
}
