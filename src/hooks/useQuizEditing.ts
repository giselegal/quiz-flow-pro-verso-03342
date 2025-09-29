/**
 * 🎯 USE QUIZ EDITING - Hook para Edição de Quiz
 * 
 * Hook personalizado para gerenciar o estado de edição do quiz.
 * Funcionalidades:
 * - ✅ Gerenciamento de estado de edição
 * - ✅ Controle de mudanças não salvas
 * - ✅ Validação de etapas
 * - ✅ Sistema de versionamento
 * - ✅ Auto-save
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface QuizStep {
  id: string;
  name: string;
  type: string;
  content: any;
  settings: any;
  styles: any;
  order: number;
  isActive: boolean;
}

interface QuizEditingState {
  steps: QuizStep[];
  selectedStep: string | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: string[];
  isAutoSaving: boolean;
  lastSaved: Date | null;
  version: string;
}

interface QuizEditingActions {
  // Gerenciamento de etapas
  addStep: (step: Omit<QuizStep, 'id' | 'order'>) => void;
  updateStep: (stepId: string, updates: Partial<QuizStep>) => void;
  deleteStep: (stepId: string) => void;
  duplicateStep: (stepId: string) => void;
  reorderSteps: (stepIds: string[]) => void;
  
  // Navegação
  selectStep: (stepId: string) => void;
  setEditing: (isEditing: boolean) => void;
  
  // Persistência
  save: () => Promise<void>;
  load: (steps: QuizStep[]) => void;
  reset: () => void;
  
  // Validação
  validate: () => string[];
  validateStep: (stepId: string) => string[];
  
  // Versionamento
  createVersion: (name: string) => void;
  loadVersion: (versionId: string) => void;
  getVersions: () => Array<{ id: string; name: string; createdAt: Date }>;
}

interface UseQuizEditingOptions {
  autoSave?: boolean;
  autoSaveInterval?: number;
  onSave?: (steps: QuizStep[]) => Promise<void>;
  onLoad?: () => Promise<QuizStep[]>;
  onValidate?: (steps: QuizStep[]) => string[];
  initialSteps?: QuizStep[];
}

export function useQuizEditing(options: UseQuizEditingOptions = {}): QuizEditingState & QuizEditingActions {
  const {
    autoSave = true,
    autoSaveInterval = 30000, // 30 segundos
    onSave,
    onLoad,
    onValidate,
    initialSteps = []
  } = options;

  const [state, setState] = useState<QuizEditingState>({
    steps: initialSteps,
    selectedStep: initialSteps[0]?.id || null,
    isEditing: false,
    hasUnsavedChanges: false,
    validationErrors: [],
    isAutoSaving: false,
    lastSaved: null,
    version: '1.0.0'
  });

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const versionsRef = useRef<Array<{ id: string; name: string; createdAt: Date; steps: QuizStep[] }>>([]);

  // Auto-save
  useEffect(() => {
    if (autoSave && state.hasUnsavedChanges && !state.isAutoSaving) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(async () => {
        await save();
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [state.hasUnsavedChanges, autoSave, autoSaveInterval]);

  // Validação automática
  useEffect(() => {
    const errors = validate();
    setState(prev => ({ ...prev, validationErrors: errors }));
  }, [state.steps]);

  const addStep = useCallback((step: Omit<QuizStep, 'id' | 'order'>) => {
    const newStep: QuizStep = {
      ...step,
      id: `step-${Date.now()}`,
      order: state.steps.length + 1
    };

    setState(prev => ({
      ...prev,
      steps: [...prev.steps, newStep],
      hasUnsavedChanges: true,
      selectedStep: newStep.id
    }));
  }, [state.steps.length]);

  const updateStep = useCallback((stepId: string, updates: Partial<QuizStep>) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
      hasUnsavedChanges: true
    }));
  }, []);

  const deleteStep = useCallback((stepId: string) => {
    setState(prev => {
      const newSteps = prev.steps.filter(step => step.id !== stepId);
      const newSelectedStep = prev.selectedStep === stepId 
        ? (newSteps[0]?.id || null)
        : prev.selectedStep;

      return {
        ...prev,
        steps: newSteps,
        selectedStep: newSelectedStep,
        hasUnsavedChanges: true
      };
    });
  }, []);

  const duplicateStep = useCallback((stepId: string) => {
    const stepToDuplicate = state.steps.find(step => step.id === stepId);
    if (!stepToDuplicate) return;

    const duplicatedStep: QuizStep = {
      ...stepToDuplicate,
      id: `step-${Date.now()}`,
      name: `${stepToDuplicate.name} (Cópia)`,
      order: state.steps.length + 1
    };

    setState(prev => ({
      ...prev,
      steps: [...prev.steps, duplicatedStep],
      hasUnsavedChanges: true,
      selectedStep: duplicatedStep.id
    }));
  }, [state.steps]);

  const reorderSteps = useCallback((stepIds: string[]) => {
    const reorderedSteps = stepIds.map((id, index) => {
      const step = state.steps.find(s => s.id === id);
      return step ? { ...step, order: index + 1 } : null;
    }).filter(Boolean) as QuizStep[];

    setState(prev => ({
      ...prev,
      steps: reorderedSteps,
      hasUnsavedChanges: true
    }));
  }, [state.steps]);

  const selectStep = useCallback((stepId: string) => {
    setState(prev => ({ ...prev, selectedStep: stepId }));
  }, []);

  const setEditing = useCallback((isEditing: boolean) => {
    setState(prev => ({ ...prev, isEditing }));
  }, []);

  const save = useCallback(async () => {
    if (!state.hasUnsavedChanges) return;

    setState(prev => ({ ...prev, isAutoSaving: true }));

    try {
      if (onSave) {
        await onSave(state.steps);
      }

      setState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
        isAutoSaving: false,
        lastSaved: new Date()
      }));
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setState(prev => ({ ...prev, isAutoSaving: false }));
    }
  }, [state.steps, state.hasUnsavedChanges, onSave]);

  const load = useCallback((steps: QuizStep[]) => {
    setState(prev => ({
      ...prev,
      steps,
      selectedStep: steps[0]?.id || null,
      hasUnsavedChanges: false,
      validationErrors: []
    }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      steps: initialSteps,
      selectedStep: initialSteps[0]?.id || null,
      hasUnsavedChanges: false,
      validationErrors: []
    }));
  }, [initialSteps]);

  const validate = useCallback((): string[] => {
    if (onValidate) {
      return onValidate(state.steps);
    }

    const errors: string[] = [];

    if (state.steps.length === 0) {
      errors.push('O quiz deve ter pelo menos uma etapa');
    }

    state.steps.forEach((step, index) => {
      if (!step.name.trim()) {
        errors.push(`Etapa ${index + 1}: Nome é obrigatório`);
      }

      if (!step.content?.title?.trim()) {
        errors.push(`Etapa ${index + 1}: Título é obrigatório`);
      }

      if (step.type === 'question' && (!step.content?.options || step.content.options.length < 2)) {
        errors.push(`Etapa ${index + 1}: Deve ter pelo menos 2 opções`);
      }
    });

    return errors;
  }, [state.steps, onValidate]);

  const validateStep = useCallback((stepId: string): string[] => {
    const step = state.steps.find(s => s.id === stepId);
    if (!step) return ['Etapa não encontrada'];

    const errors: string[] = [];

    if (!step.name.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!step.content?.title?.trim()) {
      errors.push('Título é obrigatório');
    }

    if (step.type === 'question' && (!step.content?.options || step.content.options.length < 2)) {
      errors.push('Deve ter pelo menos 2 opções');
    }

    return errors;
  }, [state.steps]);

  const createVersion = useCallback((name: string) => {
    const version = {
      id: `version-${Date.now()}`,
      name,
      createdAt: new Date(),
      steps: [...state.steps]
    };

    versionsRef.current.push(version);
  }, [state.steps]);

  const loadVersion = useCallback((versionId: string) => {
    const version = versionsRef.current.find(v => v.id === versionId);
    if (version) {
      load(version.steps);
    }
  }, [load]);

  const getVersions = useCallback(() => {
    return versionsRef.current.map(v => ({
      id: v.id,
      name: v.name,
      createdAt: v.createdAt
    }));
  }, []);

  return {
    ...state,
    addStep,
    updateStep,
    deleteStep,
    duplicateStep,
    reorderSteps,
    selectStep,
    setEditing,
    save,
    load,
    reset,
    validate,
    validateStep,
    createVersion,
    loadVersion,
    getVersions
  };
}
