/**
 * 🎯 HOOK: Estado Central do Editor
 * Extrai lógica de gerenciamento de estado do QuizModularProductionEditor
 */

import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { EditableQuizStep, BlockComponent, StepType } from '../types';

export interface EditorState {
  steps: EditableQuizStep[];
  selectedStepId: string | null;
  selectedBlockId: string | null;
  isDirty: boolean;
  funnelId: string | null;
  funnelName: string;
}

export function useEditorState(initialFunnelId?: string) {
  const [state, setState] = useState<EditorState>({
    steps: [],
    selectedStepId: null,
    selectedBlockId: null,
    isDirty: false,
    funnelId: initialFunnelId || null,
    funnelName: 'Novo Quiz',
  });

  const setSteps = useCallback((steps: EditableQuizStep[]) => {
    setState(prev => ({ ...prev, steps, isDirty: true }));
  }, []);

  const setSelectedStepId = useCallback((stepId: string | null) => {
    setState(prev => ({ ...prev, selectedStepId: stepId, selectedBlockId: null }));
  }, []);

  const setSelectedBlockId = useCallback((blockId: string | null) => {
    setState(prev => ({ ...prev, selectedBlockId: blockId }));
  }, []);

  const setFunnelName = useCallback((name: string) => {
    setState(prev => ({ ...prev, funnelName: name, isDirty: true }));
  }, []);

  const markClean = useCallback(() => {
    setState(prev => ({ ...prev, isDirty: false }));
  }, []);

  const addStep = useCallback((type: StepType = 'question') => {
    setState(prev => {
      const newStep: EditableQuizStep = {
        id: nanoid(),
        type,
        order: prev.steps.length,
        blocks: [],
        title: `Etapa ${prev.steps.length + 1}`,
      };
      return {
        ...prev,
        steps: [...prev.steps, newStep],
        selectedStepId: newStep.id,
        isDirty: true,
      };
    });
  }, []);

  const deleteStep = useCallback((stepId: string) => {
    setState(prev => {
      const filtered = prev.steps.filter(s => s.id !== stepId);
      const reordered = filtered.map((s, idx) => ({ ...s, order: idx }));
      return {
        ...prev,
        steps: reordered,
        selectedStepId: reordered[0]?.id || null,
        selectedBlockId: null,
        isDirty: true,
      };
    });
  }, []);

  const duplicateStep = useCallback((stepId: string) => {
    setState(prev => {
      const original = prev.steps.find(s => s.id === stepId);
      if (!original) return prev;

      const duplicate: EditableQuizStep = {
        ...original,
        id: nanoid(),
        order: prev.steps.length,
        title: `${original.title} (cópia)`,
        blocks: original.blocks.map(b => ({ ...b, id: nanoid() })),
      };

      return {
        ...prev,
        steps: [...prev.steps, duplicate],
        selectedStepId: duplicate.id,
        isDirty: true,
      };
    });
  }, []);

  const reorderSteps = useCallback((oldIndex: number, newIndex: number) => {
    setState(prev => {
      const reordered = [...prev.steps];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      return {
        ...prev,
        steps: reordered.map((s, idx) => ({ ...s, order: idx })),
        isDirty: true,
      };
    });
  }, []);

  return {
    ...state,
    setSteps,
    setSelectedStepId,
    setSelectedBlockId,
    setFunnelName,
    markClean,
    addStep,
    deleteStep,
    duplicateStep,
    reorderSteps,
  };
}
