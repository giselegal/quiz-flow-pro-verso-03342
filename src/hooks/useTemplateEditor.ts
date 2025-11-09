// @ts-nocheck
/**
 * 🎯 HOOK: useTemplateEditor (LEGACY)
 *
 * AVISO: A API antiga de edição (TemplateEditorService) foi descontinuada.
 * Este hook agora expõe stubs compatíveis que registram avisos e evitam que o app quebre.
 * Integração canônica deve usar templateService.saveStep/blocks em painéis específicos.
 */

import { useState, useCallback } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
import { generateBlockId } from '@/utils/idGenerator';

type SaveResult = { success: boolean; message: string; stepId?: string; error?: any };

export function useTemplateEditor() {
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [lastSaveResult, setLastSaveResult] = useState<SaveResult | null>(null);

    /**
     * Salva alterações de um step específico
     */
    const saveStep = useCallback(async (stepId: string, stepData: any): Promise<SaveResult> => {
        setSaving(true);
        setLastSaveResult(null);
        console.warn('[useTemplateEditor] API legacy saveStepChanges removida. Usando templateService.saveStep com heurística.');
        try {
            const blocks = Array.isArray(stepData?.blocks)
                ? stepData.blocks
                : (function normalizeBlocksForSave() {
                    // Se não vier blocks, encapsular dados em um ConfigBlock/ResultConfigBlock
                    const isResult = stepId === 'step-20' || /result/i.test(stepId);
                    const blockType = isResult ? 'ResultConfigBlock' : 'ConfigBlock';
                    const properties = stepData?.config || stepData?.metadata || stepData || {};
                    return [{
                        id: generateBlockId(),
                        type: blockType,
                        order: 0,
                        properties,
                        content: {},
                    }];
                })();
            const res = await templateService.saveStep(stepId, blocks);
            const result: SaveResult = {
                success: res.success,
                message: res.success ? 'Salvo via templateService.saveStep' : res.error?.message || 'Falha ao salvar',
                stepId,
                error: res.success ? undefined : res.error,
            };
            setLastSaveResult(result);
            return result;
        } catch (error) {
            const errorResult: SaveResult = { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido', stepId, error };
            setLastSaveResult(errorResult);
            return errorResult;
        } finally {
            setSaving(false);
        }
    }, []);

    /**
     * Exporta master template para arquivo JSON
     */
    const exportTemplate = useCallback(async (): Promise<SaveResult> => {
        setExporting(true);
        console.warn('[useTemplateEditor] exportMasterTemplate legacy removida. Exportação direta não suportada.');
        try {
            return { success: false, message: 'Exportação legacy indisponível. Use ferramentas canônicas.' };
        } finally {
            setExporting(false);
        }
    }, []);

    /**
     * Importa master template de arquivo JSON
     */
    const importTemplate = useCallback(async (file: File): Promise<SaveResult> => {
        setImporting(true);
        setLastSaveResult(null);
        console.warn('[useTemplateEditor] importMasterTemplate legacy removida. Importação direta não suportada.');
        try {
            return { success: false, message: 'Importação legacy indisponível. Use ferramentas canônicas.' };
        } finally {
            setImporting(false);
        }
    }, []);

    /**
     * Valida todos os steps do master template
     */
    const validateAll = useCallback(async () => {
        console.warn('[useTemplateEditor] validateAllSteps legacy removida.');
        return { valid: 0, invalid: 0, errors: [] } as any;
    }, []);

    /**
     * Limpa dados do localStorage
     */
    const clearStorage = useCallback(() => {
        console.warn('[useTemplateEditor] clearLocalStorage legacy removida.');
    }, []);

    /**
     * Verifica se há dados salvos no localStorage
     */
    const hasStorageData = useCallback(() => {
        console.warn('[useTemplateEditor] hasLocalStorageData legacy removida.');
        return false;
    }, []);

    /**
     * Limpa resultado da última operação
     */
    const clearLastResult = useCallback(() => {
        setLastSaveResult(null);
    }, []);

    return {
        // Estados
        saving,
        exporting,
        importing,
        lastSaveResult,
        isLoading: saving || exporting || importing,

        // Ações
        saveStep,
        exportTemplate,
        importTemplate,
        validateAll,
        clearStorage,
        hasStorageData,
        clearLastResult,
    };
}

export default useTemplateEditor;
