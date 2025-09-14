/**
 * 🪝 USE UNIVERSAL STEP EDITOR (SIMPLIFIED)
 * 
 * Hook personalizado simplificado que integra UniversalStepEditor
 * Versão funcional básica para demonstração
 */

import { useState, useEffect, useCallback } from 'react';
import { indexedDBStorage } from '@/utils/storage/IndexedDBStorageService';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { FunnelStep } from '@/core/funnel/types';

// ============================================================================
// TIPOS
// ============================================================================

export interface UseUniversalStepEditorOptions {
    autoSave?: boolean;
    autoSaveInterval?: number;
    enableSync?: boolean;
    onStepChange?: (stepId: string) => void;
    onSave?: (stepId: string, data: any) => void;
    onError?: (error: Error) => void;
}

export interface UniversalStepEditorState {
    currentStepId: string;
    currentStepNumber: number;
    funnelStep: FunnelStep | null;
    originalBlocks: Block[];
    editedBlocks: Block[];
    hasUnsavedChanges: boolean;
    isLoading: boolean;
    isSaving: boolean;
    lastSaved: Date | null;
    error: Error | null;
    canGoBack: boolean;
    canGoForward: boolean;
    totalSteps: number;
}

export interface UniversalStepEditorActions {
    goToStep: (stepId: string) => Promise<void>;
    saveStep: (data?: any) => Promise<void>;
    resetStep: () => Promise<void>;
    exportStep: () => any;
    importStep: (data: any) => Promise<void>;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useUniversalStepEditor(
    initialStepId: string,
    options: UseUniversalStepEditorOptions = {}
): [UniversalStepEditorState, UniversalStepEditorActions] {

    // ========================================================================
    // STATE
    // ========================================================================

    const [state, setState] = useState<UniversalStepEditorState>(() => ({
        currentStepId: initialStepId,
        currentStepNumber: parseInt(initialStepId.split('-')[1]) || 1,
        funnelStep: null,
        originalBlocks: [],
        editedBlocks: [],
        hasUnsavedChanges: false,
        isLoading: true,
        isSaving: false,
        lastSaved: null,
        error: null,
        canGoBack: true,
        canGoForward: true,
        totalSteps: 21
    }));

    // ========================================================================
    // LOAD STEP DATA
    // ========================================================================

    const loadStepData = useCallback(async (stepId: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Buscar dados originais do template
            const originalBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId] || [];

            // Tentar carregar dados salvos do IndexedDB
            const savedData: any = await indexedDBStorage.get('funnel-steps', stepId);
            const editedBlocks = savedData?.editedBlocks || [...originalBlocks];

            // Criar FunnelStep básico
            const funnelStep: FunnelStep = {
                id: stepId,
                name: `Step ${parseInt(stepId.split('-')[1])}`,
                description: 'Step do quiz',
                order: parseInt(stepId.split('-')[1]) || 1,
                type: 'question',
                isRequired: false,
                isVisible: true,
                components: [],
                settings: {
                    autoAdvance: false,
                    autoAdvanceDelay: 0,
                    showProgress: true,
                    allowSkip: false,
                    validation: {
                        required: false
                    }
                }
            };

            setState(prev => ({
                ...prev,
                currentStepId: stepId,
                currentStepNumber: parseInt(stepId.split('-')[1]) || 1,
                funnelStep,
                originalBlocks,
                editedBlocks,
                hasUnsavedChanges: false,
                isLoading: false,
                lastSaved: savedData?.lastSaved ? new Date(savedData.lastSaved) : null,
                canGoBack: parseInt(stepId.split('-')[1]) > 1,
                canGoForward: parseInt(stepId.split('-')[1]) < 21
            }));

        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error as Error
            }));
            options.onError?.(error as Error);
        }
    }, [options]);

    // ========================================================================
    // AUTO-SAVE SETUP
    // ========================================================================

    useEffect(() => {
        if (!options.autoSave || !state.hasUnsavedChanges || state.isSaving) return;

        const timeout = setTimeout(() => {
            saveStep();
        }, options.autoSaveInterval || 3000);

        return () => clearTimeout(timeout);
    }, [state.hasUnsavedChanges, state.isSaving, options.autoSave, options.autoSaveInterval]);

    // ========================================================================
    // INITIAL LOAD
    // ========================================================================

    useEffect(() => {
        loadStepData(initialStepId);
    }, [initialStepId, loadStepData]);

    // ========================================================================
    // ACTIONS
    // ========================================================================

    const goToStep = useCallback(async (stepId: string) => {
        try {
            // Salvar step atual se houver mudanças
            if (state.hasUnsavedChanges) {
                await saveStep();
            }

            // Carregar novo step
            await loadStepData(stepId);
            options.onStepChange?.(stepId);
        } catch (error) {
            console.error('Erro ao navegar para step:', error);
            options.onError?.(error as Error);
        }
    }, [state.hasUnsavedChanges, loadStepData, options]);

    const saveStep = useCallback(async (customData?: any) => {
        if (state.isSaving) return;

        setState(prev => ({ ...prev, isSaving: true }));

        try {
            const saveData = {
                stepId: state.currentStepId,
                stepNumber: state.currentStepNumber,
                originalBlocks: state.originalBlocks,
                editedBlocks: state.editedBlocks,
                funnelStep: state.funnelStep,
                lastSaved: new Date().toISOString(),
                customData
            };

            await indexedDBStorage.set('funnel-steps', state.currentStepId, saveData);

            setState(prev => ({
                ...prev,
                hasUnsavedChanges: false,
                isSaving: false,
                lastSaved: new Date()
            }));

            options.onSave?.(state.currentStepId, saveData);
            console.log(`✅ Step ${state.currentStepId} salvo com sucesso`);

        } catch (error) {
            setState(prev => ({
                ...prev,
                isSaving: false,
                error: error as Error
            }));
            console.error('❌ Erro ao salvar step:', error);
            options.onError?.(error as Error);
        }
    }, [state, options]);

    const resetStep = useCallback(async () => {
        try {
            // Remover dados salvos
            await indexedDBStorage.delete('funnel-steps', state.currentStepId);

            // Recarregar step original
            await loadStepData(state.currentStepId);

            console.log(`🔄 Step ${state.currentStepId} resetado`);
        } catch (error) {
            console.error('Erro ao resetar step:', error);
            options.onError?.(error as Error);
        }
    }, [state.currentStepId, loadStepData, options]);

    const exportStep = useCallback(() => {
        return {
            stepId: state.currentStepId,
            stepNumber: state.currentStepNumber,
            funnelStep: state.funnelStep,
            originalBlocks: state.originalBlocks,
            editedBlocks: state.editedBlocks,
            exportedAt: new Date().toISOString()
        };
    }, [state]);

    const importStep = useCallback(async (data: any) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));

            const importedData = {
                stepId: state.currentStepId,
                stepNumber: state.currentStepNumber,
                originalBlocks: data.originalBlocks || state.originalBlocks,
                editedBlocks: data.editedBlocks || data.blocks || [],
                funnelStep: data.funnelStep || state.funnelStep,
                lastSaved: new Date().toISOString()
            };

            await indexedDBStorage.set('funnel-steps', state.currentStepId, importedData);
            await loadStepData(state.currentStepId);

            console.log(`📥 Step ${state.currentStepId} importado com sucesso`);
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            console.error('Erro ao importar step:', error);
            options.onError?.(error as Error);
        }
    }, [state, loadStepData, options]);

    // ========================================================================
    // RETURN
    // ========================================================================

    const actions: UniversalStepEditorActions = {
        goToStep,
        saveStep,
        resetStep,
        exportStep,
        importStep
    };

    return [state, actions];
}

export default useUniversalStepEditor;