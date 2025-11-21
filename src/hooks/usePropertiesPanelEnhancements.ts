/**
 * 🎯 PROPERTIES PANEL ENHANCEMENTS
 * Hook auxiliar para melhorias do painel de propriedades:
 * - Auto-select de blocos ao trocar step
 * - Estado de salvamento (isSaving)
 * - Debounce de autosave
 * - Feedback visual
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Block } from '@/types/editor';
import { toast } from '@/hooks/use-toast';
import { appLogger } from '@/lib/utils/appLogger';

export interface PropertiesPanelEnhancementsConfig {
    /**
     * Tempo de debounce para autosave (ms)
     * @default 400
     */
    debounceMs?: number;

    /**
     * Habilitar auto-select ao trocar step
     * @default true
     */
    enableAutoSelect?: boolean;

    /**
     * Habilitar feedback visual
     * @default true
     */
    enableFeedback?: boolean;
}

export interface PropertiesPanelEnhancementsResult {
    /** Estado de salvamento */
    isSaving: boolean;

    /** Função de salvamento com debounce */
    debouncedSave: (blockId: string, updates: any) => Promise<void>;

    /** Auto-selecionar primeiro bloco válido */
    autoSelectFirstBlock: (blocks: Block[], currentSelectedId: string | null) => string | null;

    /** Limpar seleção */
    clearSelection: () => void;
}

/**
 * Hook para gerenciar melhorias do painel de propriedades
 */
export function usePropertiesPanelEnhancements(
    onSave: (blockId: string, updates: any) => Promise<void>,
    onSelectBlock: (id: string | null) => void,
    config: PropertiesPanelEnhancementsConfig = {}
): PropertiesPanelEnhancementsResult {
    const {
        debounceMs = 400,
        enableAutoSelect = true,
        enableFeedback = true,
    } = config;

    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingSavesRef = useRef<Map<string, any>>(new Map());

    /**
     * Função de salvamento com debounce
     */
    const debouncedSave = useCallback(
        async (blockId: string, updates: any) => {
            // Armazenar updates pendentes
            pendingSavesRef.current.set(blockId, updates);

            // Limpar timeout anterior
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            // Criar novo timeout
            saveTimeoutRef.current = setTimeout(async () => {
                setIsSaving(true);

                try {
                    // Processar todos os updates pendentes
                    const saves = Array.from(pendingSavesRef.current.entries());
                    pendingSavesRef.current.clear();

                    for (const [id, data] of saves) {
                        await onSave(id, data);
                    }

                    if (enableFeedback) {
                        toast({
                            title: 'Salvo!',
                            description: 'Alterações salvas com sucesso.',
                            duration: 2000,
                        });
                    }

                    appLogger.info('[PropertiesPanel] Salvamento concluído', {
                        data: [{ count: saves.length }],
                    });
                } catch (error) {
                    appLogger.error('[PropertiesPanel] Erro ao salvar', { data: [error] });

                    if (enableFeedback) {
                        toast({
                            title: 'Erro ao salvar',
                            description: 'Não foi possível salvar as alterações.',
                            variant: 'destructive',
                        });
                    }
                } finally {
                    setIsSaving(false);
                }
            }, debounceMs);
        },
        [onSave, debounceMs, enableFeedback]
    );

    /**
     * Auto-selecionar primeiro bloco válido
     */
    const autoSelectFirstBlock = useCallback(
        (blocks: Block[], currentSelectedId: string | null): string | null => {
            if (!enableAutoSelect) {
                return currentSelectedId;
            }

            // Se não há seleção ou seleção inválida, selecionar primeiro bloco
            const isValidSelection = currentSelectedId && blocks.some(b => b.id === currentSelectedId);

            if (!isValidSelection && blocks.length > 0) {
                const firstBlockId = blocks[0].id;
                onSelectBlock(firstBlockId);

                appLogger.debug('[PropertiesPanel] Auto-selecionado primeiro bloco', {
                    data: [{ blockId: firstBlockId }],
                });

                return firstBlockId;
            }

            return currentSelectedId;
        },
        [enableAutoSelect, onSelectBlock]
    );

    /**
     * Limpar seleção
     */
    const clearSelection = useCallback(() => {
        onSelectBlock(null);
        appLogger.debug('[PropertiesPanel] Seleção limpa');
    }, [onSelectBlock]);

    // Cleanup de timeouts ao desmontar
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return {
        isSaving,
        debouncedSave,
        autoSelectFirstBlock,
        clearSelection,
    };
}
