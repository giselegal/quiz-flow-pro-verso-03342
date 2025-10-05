/**
 * 🎭 EDITOR ORCHESTRATOR
 * 
 * Facade central para gerenciar todo o editor.
 * Resolve GARGALO #7: Fragmentação de responsabilidades
 * 
 * BENEFÍCIOS:
 * ✅ Ponto único de controle
 * ✅ API limpa e consistente
 * ✅ Fácil manutenção e debug
 * ✅ Extensibilidade garantida
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import { useStepsStore, type StepsStore } from '../hooks/useStepsStore';
import { stepComponentFactory, setupDefaultComponents } from '../factory/StepComponentFactory';
import { adapterRegistry } from '../adapters/ComponentAdapterRegistry';
import { stepValidator, type ValidationResult } from '../validation/StepValidator';
import { useFunctionalDragDrop } from '../drag-drop/FunctionalDragDropManager';
import type { EditorStep, SupportedStepType, EditorStepMeta } from '../types/EditorStepTypes';
import type { QuizStep } from '@/data/quizSteps';

// 📊 Métricas de performance do orchestrator
export interface OrchestratorMetrics {
    totalOperations: number;
    lastOperationTime: number;
    averageOperationTime: number;
    validationCacheHits: number;
    renderingTime: number;
}

// ⚙️ Configuração do orchestrator
export interface OrchestratorConfig {
    enableValidation: boolean;
    enableAutoSave: boolean;
    enableDragDrop: boolean;
    enableMetrics: boolean;
    autoSaveInterval: number;
    validationCacheSize: number;
}

// 📋 Estado completo do editor
export interface EditorState {
    steps: Map<string, EditorStep>;
    stepOrder: string[];
    selectedStepId: string | null;
    isLoading: boolean;
    hasUnsavedChanges: boolean;
    lastSaved: number;
    validationResults: Map<string, ValidationResult>;
}

// 🎯 Interface do orchestrator
export interface EditorOrchestrator {
    // Estado
    state: EditorState;
    store: StepsStore;
    metrics: OrchestratorMetrics;

    // Operações de step
    addStep: (type: SupportedStepType, data?: Partial<QuizStep>) => Promise<EditorStep>;
    updateStep: (id: string, updates: Partial<EditorStep>) => Promise<void>;
    updateStepData: (id: string, data: Partial<QuizStep>) => Promise<void>;
    deleteStep: (id: string) => Promise<void>;
    duplicateStep: (id: string) => Promise<EditorStep>;

    // Operações de reordenação
    moveStep: (fromId: string, toId: string) => Promise<void>;
    moveStepToPosition: (stepId: string, position: number) => Promise<void>;

    // Seleção
    selectStep: (id: string | null) => void;
    selectNextStep: () => void;
    selectPreviousStep: () => void;

    // Validação
    validateStep: (id: string) => ValidationResult;
    validateAll: () => Map<string, ValidationResult>;
    getValidationSummary: () => { valid: number; invalid: number; warnings: number };

    // Persistência
    save: () => Promise<void>;
    load: (steps: EditorStep[]) => Promise<void>;
    reset: () => Promise<void>;
    export: () => QuizStep[];

    // Renderização
    renderStep: (stepId: string, props?: any) => React.ReactElement | null;
    preloadSteps: (types: SupportedStepType[]) => Promise<void>;

    // Utilitários
    getStepsByType: (type: SupportedStepType) => EditorStep[];
    searchSteps: (query: string) => EditorStep[];
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
}

// ⚙️ Configuração padrão
const DEFAULT_CONFIG: OrchestratorConfig = {
    enableValidation: true,
    enableAutoSave: true,
    enableDragDrop: true,
    enableMetrics: true,
    autoSaveInterval: 5000,
    validationCacheSize: 100
};

// 🧠 Hook principal do orchestrator
export function useEditorOrchestrator(
    initialSteps: EditorStep[] = [],
    config: Partial<OrchestratorConfig> = {}
): EditorOrchestrator {
    const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

    // 🗂️ Store de steps
    const store = useStepsStore(initialSteps, {
        enableValidation: finalConfig.enableValidation,
        enableAutoSave: finalConfig.enableAutoSave,
        enableMetrics: finalConfig.enableMetrics
    });

    // 🖱️ Drag and drop
    const dragDrop = useFunctionalDragDrop(store, {
        animationDuration: 200
    });

    // 📊 Métricas
    const [metrics, setMetrics] = React.useState<OrchestratorMetrics>({
        totalOperations: 0,
        lastOperationTime: 0,
        averageOperationTime: 0,
        validationCacheHits: 0,
        renderingTime: 0
    });

    // 🗂️ Cache de validação
    const validationCache = React.useRef(new Map<string, ValidationResult>());
    const [selectedStepId, setSelectedStepId] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [lastSaved, setLastSaved] = React.useState(Date.now());

    // ⏱️ Utilitário para medir performance
    const measureOperation = useCallback(<T>(operation: () => T): T => {
        const start = performance.now();
        const result = operation();
        const duration = performance.now() - start;

        setMetrics(prev => ({
            ...prev,
            totalOperations: prev.totalOperations + 1,
            lastOperationTime: duration,
            averageOperationTime: (prev.averageOperationTime * prev.totalOperations + duration) / (prev.totalOperations + 1)
        }));

        return result;
    }, []);

    // ➕ Adicionar step
    const addStep = useCallback(async (
        type: SupportedStepType,
        data: Partial<QuizStep> = {}
    ): Promise<EditorStep> => {
        return measureOperation(() => {
            const defaultData: QuizStep = {
                type,
                title: `Nova ${type}`,
                subtitle: '',
                ...data
            };

            const newStep = store.addStep({
                type,
                data: defaultData,
                meta: {
                    isLocked: false,
                    isVisible: true,
                    isCollapsed: false,
                    validationState: 'pending',
                    validationErrors: [],
                    lastModified: Date.now(),
                    hasUnsavedChanges: true
                }
            });

            // Validar automaticamente
            if (finalConfig.enableValidation) {
                const validation = stepValidator.validate(newStep);
                validationCache.current.set(newStep.id, validation);

                store.updateStepMeta(newStep.id, {
                    validationState: validation.isValid ? 'valid' : 'invalid',
                    validationErrors: validation.errors.map(e => e.message)
                });
            }

            return newStep;
        });
    }, [store, finalConfig.enableValidation, measureOperation]);

    // ✏️ Atualizar step
    const updateStep = useCallback(async (
        id: string,
        updates: Partial<EditorStep>
    ): Promise<void> => {
        measureOperation(() => {
            store.updateStep(id, updates);

            // Invalidar cache de validação
            validationCache.current.delete(id);

            // Revalidar se habilitado
            if (finalConfig.enableValidation) {
                const step = store.getStep(id);
                if (step) {
                    const validation = stepValidator.validate(step);
                    validationCache.current.set(id, validation);

                    store.updateStepMeta(id, {
                        validationState: validation.isValid ? 'valid' : 'invalid',
                        validationErrors: validation.errors.map(e => e.message)
                    });
                }
            }
        });
    }, [store, finalConfig.enableValidation, measureOperation]);

    // 📝 Atualizar dados do step
    const updateStepData = useCallback(async (
        id: string,
        data: Partial<QuizStep>
    ): Promise<void> => {
        measureOperation(() => {
            store.updateStepData(id, data);
            validationCache.current.delete(id);
        });
    }, [store, measureOperation]);

    // 🗑️ Deletar step
    const deleteStep = useCallback(async (id: string): Promise<void> => {
        measureOperation(() => {
            store.deleteStep(id);
            validationCache.current.delete(id);

            if (selectedStepId === id) {
                setSelectedStepId(null);
            }
        });
    }, [store, selectedStepId, measureOperation]);

    // 📋 Duplicar step
    const duplicateStep = useCallback(async (id: string): Promise<EditorStep> => {
        return measureOperation(() => {
            return store.duplicateStep(id);
        });
    }, [store, measureOperation]);

    // 🔄 Mover step
    const moveStep = useCallback(async (fromId: string, toId: string): Promise<void> => {
        measureOperation(() => {
            store.reorderStep(fromId, toId);
        });
    }, [store, measureOperation]);

    // 📍 Mover step para posição específica
    const moveStepToPosition = useCallback(async (
        stepId: string,
        position: number
    ): Promise<void> => {
        measureOperation(() => {
            const currentOrder = [...store.stepOrder];
            const currentIndex = currentOrder.indexOf(stepId);

            if (currentIndex !== -1) {
                currentOrder.splice(currentIndex, 1);
                currentOrder.splice(position, 0, stepId);

                // Atualizar ordens
                currentOrder.forEach((id, index) => {
                    const step = store.getStep(id);
                    if (step) {
                        store.updateStep(id, { order: index });
                    }
                });
            }
        });
    }, [store, measureOperation]);

    // 🎯 Seleção de steps
    const selectStep = useCallback((id: string | null) => {
        setSelectedStepId(id);
    }, []);

    const selectNextStep = useCallback(() => {
        if (!selectedStepId) {
            setSelectedStepId(store.stepOrder[0] || null);
            return;
        }

        const currentIndex = store.stepOrder.indexOf(selectedStepId);
        const nextIndex = currentIndex + 1;

        if (nextIndex < store.stepOrder.length) {
            setSelectedStepId(store.stepOrder[nextIndex]);
        }
    }, [selectedStepId, store.stepOrder]);

    const selectPreviousStep = useCallback(() => {
        if (!selectedStepId) return;

        const currentIndex = store.stepOrder.indexOf(selectedStepId);
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
            setSelectedStepId(store.stepOrder[prevIndex]);
        }
    }, [selectedStepId, store.stepOrder]);

    // ✅ Validação
    const validateStep = useCallback((id: string): ValidationResult => {
        // Verificar cache primeiro
        const cached = validationCache.current.get(id);
        if (cached) {
            setMetrics(prev => ({ ...prev, validationCacheHits: prev.validationCacheHits + 1 }));
            return cached;
        }

        const step = store.getStep(id);
        if (!step) {
            return { isValid: false, errors: [{ field: 'id', message: 'Step não encontrado', severity: 'error', code: 'NOT_FOUND' }], warnings: [] };
        }

        const result = stepValidator.validate(step);
        validationCache.current.set(id, result);

        return result;
    }, [store]);

    const validateAll = useCallback((): Map<string, ValidationResult> => {
        const results = new Map<string, ValidationResult>();

        store.getAllSteps().forEach(step => {
            results.set(step.id, validateStep(step.id));
        });

        return results;
    }, [store, validateStep]);

    const getValidationSummary = useCallback(() => {
        const results = validateAll();
        let valid = 0, invalid = 0, warnings = 0;

        results.forEach(result => {
            if (result.isValid) {
                valid++;
            } else {
                invalid++;
            }
            if (result.warnings.length > 0) {
                warnings++;
            }
        });

        return { valid, invalid, warnings };
    }, [validateAll]);

    // 💾 Persistência
    const save = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 500));
            setLastSaved(Date.now());

            // Marcar todos os steps como salvos
            store.getAllSteps().forEach(step => {
                if (step.meta.hasUnsavedChanges) {
                    store.updateStepMeta(step.id, { hasUnsavedChanges: false });
                }
            });
        } finally {
            setIsLoading(false);
        }
    }, [store]);

    const load = useCallback(async (steps: EditorStep[]): Promise<void> => {
        setIsLoading(true);
        try {
            // Limpar estado atual
            validationCache.current.clear();
            setSelectedStepId(null);

            // Carregar novos steps
            // Implementar lógica de carregamento

        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🎨 Renderização
    const renderStep = useCallback((stepId: string, props: any = {}): React.ReactElement | null => {
        const step = store.getStep(stepId);
        if (!step) return null;

        const start = performance.now();

        try {
            const element = stepComponentFactory.create(step, {
                ...props,
                onStepUpdate: updateStep,
                onDataChange: updateStepData,
                onValidationChange: (id, isValid, errors) => {
                    store.updateStepMeta(id, {
                        validationState: isValid ? 'valid' : 'invalid',
                        validationErrors: errors
                    });
                },
                isSelected: selectedStepId === stepId
            });

            const renderTime = performance.now() - start;
            setMetrics(prev => ({ ...prev, renderingTime: prev.renderingTime + renderTime }));

            return element;
        } catch (error) {
            console.error('Error rendering step:', error);
            return React.createElement('div', {
                className: 'p-4 border-2 border-red-300 bg-red-50 rounded text-red-700'
            }, `Erro ao renderizar step ${stepId}`);
        }
    }, [store, updateStep, updateStepData, selectedStepId]);

    // 🔍 Utilitários
    const getStepsByType = useCallback((type: SupportedStepType): EditorStep[] => {
        return store.getAllSteps().filter(step => step.type === type);
    }, [store]);

    const searchSteps = useCallback((query: string): EditorStep[] => {
        const lowercaseQuery = query.toLowerCase();
        return store.getAllSteps().filter(step =>
            step.data.title?.toLowerCase().includes(lowercaseQuery) ||
            step.data.subtitle?.toLowerCase().includes(lowercaseQuery) ||
            step.type.toLowerCase().includes(lowercaseQuery)
        );
    }, [store]);

    // 🔄 Undo/Redo (implementação básica)
    const undo = useCallback(() => {
        console.log('Undo - implementar histórico');
    }, []);

    const redo = useCallback(() => {
        console.log('Redo - implementar histórico');
    }, []);

    const canUndo = useCallback(() => false, []);
    const canRedo = useCallback(() => false, []);

    // 🚀 Setup inicial
    useEffect(() => {
        setupDefaultComponents();
    }, []);

    // 💾 Auto-save
    useEffect(() => {
        if (!finalConfig.enableAutoSave) return;

        const hasUnsavedChanges = store.getAllSteps().some(step => step.meta.hasUnsavedChanges);

        if (hasUnsavedChanges) {
            const timer = setTimeout(() => {
                save();
            }, finalConfig.autoSaveInterval);

            return () => clearTimeout(timer);
        }
    }, [store.metrics.lastUpdateTime, finalConfig.enableAutoSave, finalConfig.autoSaveInterval, save]);

    // 📊 Estado consolidado
    const state: EditorState = useMemo(() => ({
        steps: store.steps,
        stepOrder: store.stepOrder,
        selectedStepId,
        isLoading,
        hasUnsavedChanges: store.getAllSteps().some(step => step.meta.hasUnsavedChanges),
        lastSaved,
        validationResults: new Map(validationCache.current)
    }), [store.steps, store.stepOrder, selectedStepId, isLoading, lastSaved, store]);

    // 🎯 API completa do orchestrator
    return useMemo(() => ({
        state,
        store,
        metrics,

        // Operações
        addStep,
        updateStep,
        updateStepData,
        deleteStep,
        duplicateStep,

        // Reordenação
        moveStep,
        moveStepToPosition,

        // Seleção
        selectStep,
        selectNextStep,
        selectPreviousStep,

        // Validação
        validateStep,
        validateAll,
        getValidationSummary,

        // Persistência
        save,
        load,
        reset: async () => { /* implementar */ },
        export: () => store.getAllSteps().map(step => step.data),

        // Renderização
        renderStep,
        preloadSteps: async (types: SupportedStepType[]) => {
            await stepComponentFactory.preloadMultiple(types);
        },

        // Utilitários
        getStepsByType,
        searchSteps,
        undo,
        redo,
        canUndo,
        canRedo
    }), [
        state, store, metrics, addStep, updateStep, updateStepData, deleteStep, duplicateStep,
        moveStep, moveStepToPosition, selectStep, selectNextStep, selectPreviousStep,
        validateStep, validateAll, getValidationSummary, save, load, renderStep,
        getStepsByType, searchSteps, undo, redo, canUndo, canRedo
    ]);
}