/**
 * 🪝 USE UNIVERSAL STEP EDITOR
 * 
 * Hook personalizado que integra UniversalStepEditor + FunnelCore + IndexedDB
 * Simplifica o uso do editor universal para qualquer step do funil
 */

import { useState, useEffect, useCallback } from 'react';
import { useFunnelState } from '@/core/funnel/hooks/useFunnelState';
import { indexedDBStorage } from '@/utils/storage/IndexedDBStorageService';
import { quiz21StepsToFunnelAdapter } from '@/adapters/Quiz21StepsToFunnelAdapter';
import { Block } from '@/types/editor';
import { FunnelStep, FunnelState } from '@/core/funnel/types';

// ============================================================================
// TIPOS
// ============================================================================

export interface UseUniversalStepEditorOptions {
    funnelId?: string;
    autoSave?: boolean;
    autoSaveInterval?: number;
    enableSync?: boolean;
    onStepChange?: (stepId: string) => void;
    onSave?: (stepId: string, data: any) => void;
    onError?: (error: Error) => void;
}

export interface UniversalStepEditorState {
    // Estado do step atual
    currentStepId: string;
    currentStepNumber: number;
    funnelStep: FunnelStep | null;

    // Dados do editor
    originalBlocks: Block[];
    editedBlocks: Block[];
    hasUnsavedChanges: boolean;

    // Status
    isLoading: boolean;
    isSaving: boolean;
    lastSaved: Date | null;
    error: Error | null;

    // Navegação
    canGoBack: boolean;
    canGoForward: boolean;
    totalSteps: number;
}

export interface UniversalStepEditorActions {
    // Navegação
    goToStep: (stepId: string) => Promise<void>;
    goToNext: () => Promise<void>;
    goToPrevious: () => Promise<void>;

    // Edição
    updateBlocks: (blocks: Block[]) => void;
    saveStep: () => Promise<void>;
    resetStep: () => Promise<void>;

    // Dados
    loadStep: (stepId?: string) => Promise<void>;
    exportStep: () => any;
    importStep: (data: any) => Promise<void>;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useUniversalStepEditor = (
    initialStepId: string = 'step-1',
    options: UseUniversalStepEditorOptions = {}
): [UniversalStepEditorState, UniversalStepEditorActions] => {

    const {
        funnelId = 'quiz-21-steps-complete',
        autoSave = true,
        autoSaveInterval = 30000,
        enableSync = true,
        onStepChange,
        onSave,
        onError
    } = options;

    // ========================================================================
    // ESTADO LOCAL
    // ========================================================================

    const [state, setState] = useState<UniversalStepEditorState>({
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
        canGoBack: false,
        canGoForward: true,
        totalSteps: 21
    });

    // Hook do FunnelCore
    const {
        state: funnelState,
        updateStep,
        getStep,
        navigateToStep
    } = useFunnelState({
        funnelId,
        persistence: {
            enabled: true,
            storage: 'custom', // Usamos IndexedDB
            autoSave,
            autoSaveInterval,
            compression: true,
            encryption: false
        },
        analytics: {
            enabled: true,
            events: ['step_loaded', 'step_saved', 'step_changed'],
            customEvents: {},
            realTime: enableSync
        }
    });

    // ========================================================================
    // EFEITOS
    // ========================================================================

    // Carregar step inicial
    useEffect(() => {
        loadStep(initialStepId);
    }, [initialStepId]);

    // Auto-save quando há mudanças
    useEffect(() => {
        if (!autoSave || !state.hasUnsavedChanges) return;

        const timeout = setTimeout(() => {
            saveStep();
        }, autoSaveInterval);

        return () => clearTimeout(timeout);
    }, [state.hasUnsavedChanges, autoSave, autoSaveInterval]);

    // Atualizar navegação
    useEffect(() => {
        setState(prev => ({
            ...prev,
            canGoBack: prev.currentStepNumber > 1,
            canGoForward: prev.currentStepNumber < 21
        }));
    }, [state.currentStepNumber]);

    // ========================================================================
    // FUNÇÕES DE CARREGAMENTO
    // ========================================================================

    const loadStep = useCallback(async (stepId?: string) => {
        const targetStepId = stepId || state.currentStepId;
        const stepNumber = parseInt(targetStepId.split('-')[1]) || 1;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // 1. Converter step do quiz21Steps para FunnelStep
            const conversionResult = quiz21StepsAdapter.convertStepToFunnelStep(targetStepId, stepNumber);

            if (conversionResult.warnings.length > 0) {
                console.warn('⚠️ Avisos na conversão:', conversionResult.warnings);
            }

            // 2. Tentar carregar modificações salvas
            const savedData = await indexedDBStorage.get<any>('funnels', targetStepId);
            const editedBlocks = savedData?.editedBlocks || conversionResult.originalBlocks;

            // 3. Atualizar estado
            setState(prev => ({
                ...prev,
                currentStepId: targetStepId,
                currentStepNumber: stepNumber,
                funnelStep: conversionResult.funnelStep,
                originalBlocks: conversionResult.originalBlocks,
                editedBlocks,
                hasUnsavedChanges: false,
                isLoading: false,
                lastSaved: savedData?.lastSaved ? new Date(savedData.lastSaved) : null
            }));

            // 4. Notificar mudança de step
            onStepChange?.(targetStepId);

        } catch (error) {
            console.error('❌ Erro ao carregar step:', error);
            const err = error instanceof Error ? error : new Error(String(error));
            setState(prev => ({ ...prev, error: err, isLoading: false }));
            onError?.(err);
        }
    }, [state.currentStepId, onStepChange, onError]);

    // ========================================================================
    // FUNÇÕES DE NAVEGAÇÃO
    // ========================================================================

    const goToStep = useCallback(async (stepId: string) => {
        // Salvar mudanças não salvas antes de navegar
        if (state.hasUnsavedChanges) {
            await saveStep();
        }

        await loadStep(stepId);

        // Atualizar FunnelCore
        try {
            await navigateToStep(stepId);
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar navegação no FunnelCore:', error);
        }
    }, [state.hasUnsavedChanges, loadStep, navigateToStep]);

    const goToNext = useCallback(async () => {
        if (state.currentStepNumber < 21) {
            const nextStepId = `step-${state.currentStepNumber + 1}`;
            await goToStep(nextStepId);
        }
    }, [state.currentStepNumber, goToStep]);

    const goToPrevious = useCallback(async () => {
        if (state.currentStepNumber > 1) {
            const prevStepId = `step-${state.currentStepNumber - 1}`;
            await goToStep(prevStepId);
        }
    }, [state.currentStepNumber, goToStep]);

    // ========================================================================
    // FUNÇÕES DE EDIÇÃO
    // ========================================================================

    const updateBlocks = useCallback((blocks: Block[]) => {
        const hasChanges = JSON.stringify(blocks) !== JSON.stringify(state.originalBlocks);

        setState(prev => ({
            ...prev,
            editedBlocks: blocks,
            hasUnsavedChanges: hasChanges
        }));
    }, [state.originalBlocks]);

    const saveStep = useCallback(async () => {
        if (!state.funnelStep || state.isSaving) return;

        setState(prev => ({ ...prev, isSaving: true, error: null }));

        try {
            const saveData = {
                stepId: state.currentStepId,
                stepNumber: state.currentStepNumber,
                originalBlocks: state.originalBlocks,
                editedBlocks: state.editedBlocks,
                lastSaved: Date.now(),
                metadata: {
                    namespace: 'universal-step-editor',
                    userId: 'current-user', // TODO: Pegar do auth
                    context: 'step-editing',
                    tags: ['quiz21steps', 'modular-editor']
                }
            };

            // 1. Salvar no IndexedDB
            await indexedDBStorage.set('funnels', state.currentStepId, saveData);

            // 2. Atualizar FunnelCore se necessário
            if (state.funnelStep) {
                const updatedComponents = quiz21StepsAdapter.convertBlocksToComponents(
                    state.editedBlocks,
                    { stepId: state.currentStepId, stepNumber: state.currentStepNumber }
                );

                const updatedFunnelStep = {
                    ...state.funnelStep,
                    components: updatedComponents
                };

                await updateStep(state.currentStepId, updatedFunnelStep);
            }

            // 3. Atualizar estado
            setState(prev => ({
                ...prev,
                hasUnsavedChanges: false,
                isSaving: false,
                lastSaved: new Date()
            }));

            // 4. Notificar salvamento
            onSave?.(state.currentStepId, saveData);

            console.log(`✅ Step ${state.currentStepId} salvo com sucesso`);

        } catch (error) {
            console.error('❌ Erro ao salvar step:', error);
            const err = error instanceof Error ? error : new Error(String(error));
            setState(prev => ({ ...prev, error: err, isSaving: false }));
            onError?.(err);
        }
    }, [
        state.currentStepId,
        state.currentStepNumber,
        state.funnelStep,
        state.originalBlocks,
        state.editedBlocks,
        state.isSaving,
        updateStep,
        onSave,
        onError
    ]);

    const resetStep = useCallback(async () => {
        try {
            // Remover dados salvos
            await indexedDBStorage.delete('funnels', state.currentStepId);

            // Recarregar step original
            await loadStep(state.currentStepId);

            console.log(`🔄 Step ${state.currentStepId} resetado`);

        } catch (error) {
            console.error('❌ Erro ao resetar step:', error);
            const err = error instanceof Error ? error : new Error(String(error));
            onError?.(err);
        }
    }, [state.currentStepId, loadStep, onError]);

    // ========================================================================
    // FUNÇÕES DE DADOS
    // ========================================================================

    const exportStep = useCallback(() => {
        return {
            stepId: state.currentStepId,
            stepNumber: state.currentStepNumber,
            funnelStep: state.funnelStep,
            originalBlocks: state.originalBlocks,
            editedBlocks: state.editedBlocks,
            metadata: {
                exportedAt: new Date().toISOString(),
                version: '1.0.0',
                editorType: 'universal-step-editor'
            }
        };
    }, [state]);

    const importStep = useCallback(async (data: any) => {
        try {
            if (data.stepId !== state.currentStepId) {
                throw new Error('Step ID não corresponde ao step atual');
            }

            // Atualizar blocos com dados importados
            updateBlocks(data.editedBlocks || data.originalBlocks || []);

            console.log(`📥 Step ${state.currentStepId} importado`);

        } catch (error) {
            console.error('❌ Erro ao importar step:', error);
            const err = error instanceof Error ? error : new Error(String(error));
            onError?.(err);
        }
    }, [state.currentStepId, updateBlocks, onError]);

    // ========================================================================
    // RETORNO DO HOOK
    // ========================================================================

    const editorState: UniversalStepEditorState = state;

    const editorActions: UniversalStepEditorActions = {
        goToStep,
        goToNext,
        goToPrevious,
        updateBlocks,
        saveStep,
        resetStep,
        loadStep,
        exportStep,
        importStep
    };

    return [editorState, editorActions];
};

// ============================================================================
// HOOK SIMPLIFICADO PARA CASOS BÁSICOS
// ============================================================================

export const useSimpleStepEditor = (stepId: string) => {
    const [state, actions] = useUniversalStepEditor(stepId, {
        autoSave: true,
        enableSync: false
    });

    return {
        ...state,
        ...actions,
        // Propriedades simplificadas
        isReady: !state.isLoading && !state.error,
        canSave: state.hasUnsavedChanges && !state.isSaving
    };
};

export default useUniversalStepEditor;