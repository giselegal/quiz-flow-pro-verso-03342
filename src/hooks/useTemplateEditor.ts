/**
 * 🎯 HOOK: useTemplateEditor
 * 
 * Hook React para gerenciar edição de templates no editor
 * Fornece interface simples para save/export/import de templates
 */

import { useState, useCallback } from 'react';
import TemplateEditorService, { SaveResult } from '@/services/TemplateEditorService';

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

        try {
            const result = await TemplateEditorService.saveStepChanges(stepId, stepData);
            setLastSaveResult(result);
            return result;
        } catch (error) {
            const errorResult: SaveResult = {
                success: false,
                message: error instanceof Error ? error.message : 'Erro desconhecido',
                stepId,
                error
            };
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

        try {
            const json = await TemplateEditorService.exportMasterTemplate();

            // Criar download
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quiz21-complete-export-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('✅ Template exportado com sucesso');
            return {
                success: true,
                message: 'Template exportado com sucesso'
            };
        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao exportar',
                error
            };
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

        try {
            const text = await file.text();
            const result = await TemplateEditorService.importMasterTemplate(text);
            setLastSaveResult(result);
            return result;
        } catch (error) {
            const errorResult: SaveResult = {
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao importar',
                error
            };
            setLastSaveResult(errorResult);
            return errorResult;
        } finally {
            setImporting(false);
        }
    }, []);

    /**
     * Valida todos os steps do master template
     */
    const validateAll = useCallback(async () => {
        try {
            const result = await TemplateEditorService.validateAllSteps();
            return result;
        } catch (error) {
            console.error('❌ Erro ao validar:', error);
            throw error;
        }
    }, []);

    /**
     * Limpa dados do localStorage
     */
    const clearStorage = useCallback(() => {
        TemplateEditorService.clearLocalStorage();
    }, []);

    /**
     * Verifica se há dados salvos no localStorage
     */
    const hasStorageData = useCallback(() => {
        return TemplateEditorService.hasLocalStorageData();
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
        clearLastResult
    };
}

export default useTemplateEditor;
