/**
 * 🪝 USE UNIVERSAL STEP EDITOR - VERSÃO SIMPLIFICADA
 * 
 * Hook personalizado que integra UniversalStepEditor com dados básicos
 * Versão simplificada para evitar problemas de integração
 */

import { useState, useCallback } from 'react';
import { Quiz21StepsToFunnelAdapter } from '@/adapters/Quiz21StepsToFunnelAdapter';
import { Block } from '@/types/editor';
import { FunnelStep } from '@/types/funnel';

export interface UseUniversalStepEditorOptions {
    funnelId?: string;
    autoSave?: boolean;
    autoSaveInterval?: number;
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
    goToNext: () => Promise<void>;
    goToPrevious: () => Promise<void>;
    updateBlocks: (blocks: Block[]) => void;
    saveStep: () => Promise<void>;
    resetStep: () => Promise<void>;
    loadStep: (stepId?: string) => Promise<void>;
    exportStep: () => any;
}

export interface UniversalStepEditorReturn extends UniversalStepEditorState, UniversalStepEditorActions {}

export function useUniversalStepEditor(options: UseUniversalStepEditorOptions = {}): UniversalStepEditorReturn {
    const {
        funnelId: _funnelId = 'quiz-21-steps-complete',
        autoSave: _autoSave = true,
        autoSaveInterval: _autoSaveInterval = 5000,
        onStepChange,
        onSave,
        onError
    } = options;

    // Estado simplificado
    const [state, setState] = useState<UniversalStepEditorState>({
        currentStepId: 'step-1',
        currentStepNumber: 1,
        funnelStep: null,
        originalBlocks: [],
        editedBlocks: [],
        hasUnsavedChanges: false,
        isLoading: false,
        isSaving: false,
        lastSaved: null,
        error: null,
        canGoBack: false,
        canGoForward: true,
        totalSteps: 21
    });

    // Carregar step
    const loadStep = useCallback(async (targetStepId?: string) => {
        const stepId = targetStepId || state.currentStepId;
        const stepNumber = parseInt(stepId.replace('step-', '')) || 1;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const adapter = new Quiz21StepsToFunnelAdapter();
            const funnelStep = adapter.convertStep(stepId, stepNumber);

            const originalBlocks = funnelStep.components || [];
            const compatibleFunnelStep = {
                id: funnelStep.id,
                type: funnelStep.type as any,
                title: funnelStep.name,
                blocks: originalBlocks as any[],
                settings: funnelStep.settings
            };

            setState(prev => ({
                ...prev,
                currentStepId: stepId,
                currentStepNumber: stepNumber,
                funnelStep: compatibleFunnelStep,
                originalBlocks: originalBlocks as any[],
                editedBlocks: originalBlocks as any[],
                hasUnsavedChanges: false,
                isLoading: false,
                canGoBack: stepNumber > 1,
                canGoForward: stepNumber < 21
            }));

            onStepChange?.(stepId);
            console.log('✅ Step carregado:', stepId);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Erro ao carregar step');
            setState(prev => ({ ...prev, error: err, isLoading: false }));
            onError?.(err);
        }
    }, [state.currentStepId, onStepChange, onError]);

    // Navegar para step
    const goToStep = useCallback(async (stepId: string) => {
        await loadStep(stepId);
    }, [loadStep]);

    // Próximo step
    const goToNext = useCallback(async () => {
        const nextStepNumber = state.currentStepNumber + 1;
        if (nextStepNumber <= 21) {
            await goToStep(`step-${nextStepNumber}`);
        }
    }, [state.currentStepNumber, goToStep]);

    // Step anterior
    const goToPrevious = useCallback(async () => {
        const prevStepNumber = state.currentStepNumber - 1;
        if (prevStepNumber >= 1) {
            await goToStep(`step-${prevStepNumber}`);
        }
    }, [state.currentStepNumber, goToStep]);

    // Atualizar blocks
    const updateBlocks = useCallback((blocks: Block[]) => {
        setState(prev => ({
            ...prev,
            editedBlocks: blocks,
            hasUnsavedChanges: JSON.stringify(blocks) !== JSON.stringify(prev.originalBlocks)
        }));
    }, []);

    // Salvar step
    const saveStep = useCallback(async () => {
        setState(prev => ({ ...prev, isSaving: true }));

        try {
            // Simular salvamento (substituir por IndexedDB quando necessário)
            await new Promise(resolve => setTimeout(resolve, 500));

            setState(prev => ({
                ...prev,
                originalBlocks: prev.editedBlocks,
                hasUnsavedChanges: false,
                isSaving: false,
                lastSaved: new Date()
            }));

            onSave?.(state.currentStepId, state.editedBlocks);
            console.log('✅ Step salvo:', state.currentStepId);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Erro ao salvar');
            setState(prev => ({ ...prev, error: err, isSaving: false }));
            onError?.(err);
        }
    }, [state.currentStepId, state.editedBlocks, onSave, onError]);

    // Reset step
    const resetStep = useCallback(async () => {
        setState(prev => ({
            ...prev,
            editedBlocks: prev.originalBlocks,
            hasUnsavedChanges: false
        }));
    }, []);

    // Export step
    const exportStep = useCallback(() => {
        return {
            stepId: state.currentStepId,
            stepNumber: state.currentStepNumber,
            funnelStep: state.funnelStep,
            blocks: state.editedBlocks,
            lastSaved: state.lastSaved
        };
    }, [state]);

    return {
        ...state,
        goToStep,
        goToNext,
        goToPrevious,
        updateBlocks,
        saveStep,
        resetStep,
        loadStep,
        exportStep
    };
}