/**
 * 🎯 EDITOR STATE MANAGER (Sprint 2 - TK-ED-04)
 * 
 * Gerencia todo o state do editor de forma centralizada:
 * - Steps e blocos
 * - Seleção (step e block)
 * - Histórico (undo/redo)
 * - Dirty state (mudanças não salvas)
 * - Validação de steps
 */

import { useState, useCallback, useEffect } from 'react';
import { HistoryManager } from '@/utils/historyManager';
import type { EditableQuizStep } from '../types';

interface EditorStateManagerProps {
  initialSteps: EditableQuizStep[];
  onStepsChange?: (steps: EditableQuizStep[]) => void;
  autoSaveInterval?: number;
}

export function useEditorStateManager({
  initialSteps,
  onStepsChange,
  autoSaveInterval = 30000,
}: EditorStateManagerProps) {
  // Core state
  const [steps, setSteps] = useState<EditableQuizStep[]>(initialSteps);
  const [currentStepId, setCurrentStepId] = useState<string | null>(
    initialSteps[0]?.id || null
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // History manager
  const [historyManager] = useState(() => new HistoryManager<EditableQuizStep[]>(initialSteps));

  // Validation state
  const [stepValidation, setStepValidation] = useState<Record<string, boolean>>({});

  // Sincronizar steps iniciais
  useEffect(() => {
    if (initialSteps.length > 0 && steps.length === 0) {
      setSteps(initialSteps);
      setCurrentStepId(initialSteps[0]?.id || null);
      historyManager.push(initialSteps);
    }
  }, [initialSteps, steps.length, historyManager]);

  // Notificar mudanças
  useEffect(() => {
    onStepsChange?.(steps);
  }, [steps, onStepsChange]);

  // Auto-save (se configurado)
  useEffect(() => {
    if (!isDirty || !autoSaveInterval) return;

    const timer = setTimeout(() => {
      console.log('🔄 Auto-save triggered');
      // onAutoSave?.();
      setIsDirty(false);
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [isDirty, autoSaveInterval]);

  /**
   * Atualizar steps com histórico
   */
  const updateSteps = useCallback((
    updater: EditableQuizStep[] | ((prev: EditableQuizStep[]) => EditableQuizStep[])
  ) => {
    setSteps(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      historyManager.push(next);
      setIsDirty(true);
      return next;
    });
  }, [historyManager]);

  /**
   * Undo
   */
  const undo = useCallback(() => {
    const previous = historyManager.undo();
    if (previous) {
      setSteps(previous);
      setIsDirty(true);
    }
  }, [historyManager]);

  /**
   * Redo
   */
  const redo = useCallback(() => {
    const next = historyManager.redo();
    if (next) {
      setSteps(next);
      setIsDirty(true);
    }
  }, [historyManager]);

  /**
   * Navegar para step
   */
  const goToStep = useCallback((stepId: string) => {
    setCurrentStepId(stepId);
    setSelectedBlockId(null); // Limpar seleção de bloco ao mudar step
  }, []);

  /**
   * Navegar para próximo step
   */
  const goToNextStep = useCallback(() => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1].id);
    }
  }, [steps, currentStepId, goToStep]);

  /**
   * Navegar para step anterior
   */
  const goToPreviousStep = useCallback(() => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1].id);
    }
  }, [steps, currentStepId, goToStep]);

  /**
   * Validar step específico
   */
  const validateStep = useCallback((stepId: string): boolean => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;

    // Validação básica: step tem pelo menos 1 bloco
    const isValid = step.blocks.length > 0;

    setStepValidation(prev => ({
      ...prev,
      [stepId]: isValid,
    }));

    return isValid;
  }, [steps]);

  /**
   * Validar todos os steps
   */
  const validateAllSteps = useCallback(() => {
    const validation: Record<string, boolean> = {};

    steps.forEach(step => {
      validation[step.id] = step.blocks.length > 0;
    });

    setStepValidation(validation);

    return Object.values(validation).every(v => v);
  }, [steps]);

  /**
   * Marcar como salvo
   */
  const markAsSaved = useCallback(() => {
    setIsDirty(false);
  }, []);

  /**
   * Resetar para steps iniciais
   */
  const reset = useCallback(() => {
    setSteps(initialSteps);
    setCurrentStepId(initialSteps[0]?.id || null);
    setSelectedBlockId(null);
    setIsDirty(false);
    // Clear history and start fresh
    historyManager.push(initialSteps);
  }, [initialSteps, historyManager]);

  // Current step helper
  const currentStep = steps.find(s => s.id === currentStepId) || null;
  const currentStepIndex = steps.findIndex(s => s.id === currentStepId);

  return {
    // State
    steps,
    currentStepId,
    currentStep,
    currentStepIndex,
    selectedBlockId,
    isDirty,
    stepValidation,

    // Setters
    setSteps: updateSteps,
    setCurrentStepId: goToStep,
    setSelectedBlockId,
    setIsDirty,

    // Navigation
    goToStep,
    goToNextStep,
    goToPreviousStep,

    // History
    undo,
    redo,
    canUndo: historyManager.canUndo(),
    canRedo: historyManager.canRedo(),

    // Validation
    validateStep,
    validateAllSteps,

    // Actions
    markAsSaved,
    reset,
  };
}
