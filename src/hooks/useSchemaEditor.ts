
import { useState, useCallback, useMemo } from 'react';
import { EditorBlock } from '@/types/editor';
import { FunnelStep } from '@/types/funnel';

export interface SchemaEditorActions {
  addStep: () => void;
  deleteStep: (stepIndex: number) => void;
  setCurrentStep: (stepIndex: number) => void;
  populateStep: (stepIndex: number) => void;
  addBlock: (type: string, position?: number) => string;
  updateBlock: (blockId: string, updates: Partial<EditorBlock>) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  selectBlock: (blockId: string | null) => void;
  saveFunnel: () => Promise<void>;
}

export function useSchemaEditor(funnelId?: string) {
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with a default step if empty
  const initializedSteps = useMemo(() => {
    if (steps.length === 0) {
      return [{
        id: 'step-1',
        type: 'quiz-question',
        title: 'Nova Etapa',
        blocks: []
      }];
    }
    return steps;
  }, [steps]);

  const addStep = useCallback(() => {
    const newStep: FunnelStep = {
      id: `step-${Date.now()}`,
      type: 'quiz-question',
      title: `Etapa ${steps.length + 1}`,
      blocks: []
    };
    setSteps(prev => [...prev, newStep]);
  }, [steps.length]);

  const deleteStep = useCallback((stepIndex: number) => {
    if (steps.length <= 1) return; // Don't delete the last step
    
    setSteps(prev => prev.filter((_, index) => index !== stepIndex));
    
    // Adjust current step if needed
    if (currentStepIndex >= stepIndex && currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [steps.length, currentStepIndex]);

  const populateStep = useCallback((stepIndex: number) => {
    // Add default blocks to a step
    const defaultBlocks: EditorBlock[] = [
      {
        id: `block-${Date.now()}-1`,
        type: 'header',
        content: { text: 'Título da Questão' },
        order: 0
      },
      {
        id: `block-${Date.now()}-2`,
        type: 'text',
        content: { text: 'Descrição da questão...' },
        order: 1
      }
    ];

    setSteps(prev => prev.map((step, index) => 
      index === stepIndex 
        ? { ...step, blocks: [...step.blocks, ...defaultBlocks] }
        : step
    ));
  }, []);

  const addBlock = useCallback((type: string, position?: number): string => {
    const currentStep = initializedSteps[currentStepIndex];
    if (!currentStep) return '';

    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type: type as EditorBlock['type'],
      content: { text: `Novo ${type}` },
      order: position ?? currentStep.blocks.length
    };

    setSteps(prev => prev.map((step, index) => 
      index === currentStepIndex 
        ? { ...step, blocks: [...step.blocks, newBlock] }
        : step
    ));

    return newBlock.id;
  }, [currentStepIndex, initializedSteps]);

  const updateBlock = useCallback((blockId: string, updates: Partial<EditorBlock>) => {
    setSteps(prev => prev.map(step => ({
      ...step,
      blocks: step.blocks.map(block => 
        block.id === blockId 
          ? { ...block, ...updates }
          : block
      )
    })));
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setSteps(prev => prev.map(step => ({
      ...step,
      blocks: step.blocks.filter(block => block.id !== blockId)
    })));
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    const currentStep = initializedSteps[currentStepIndex];
    if (!currentStep) return;

    const newBlocks = Array.from(currentStep.blocks);
    const [removed] = newBlocks.splice(startIndex, 1);
    newBlocks.splice(endIndex, 0, removed);

    setSteps(prev => prev.map((step, index) => 
      index === currentStepIndex 
        ? { ...step, blocks: newBlocks.map((block, idx) => ({ ...block, order: idx })) }
        : step
    ));
  }, [currentStepIndex, initializedSteps]);

  const selectBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  const saveFunnel = useCallback(async () => {
    try {
      setIsLoading(true);
      // Here you would save to your backend
      console.log('Saving funnel:', { funnelId, steps: initializedSteps });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setError(null);
    } catch (err) {
      setError('Erro ao salvar o funil');
      console.error('Save error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [funnelId, initializedSteps]);

  const actions: SchemaEditorActions = {
    addStep,
    deleteStep,
    setCurrentStep: setCurrentStepIndex,
    populateStep,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    saveFunnel
  };

  return {
    steps: initializedSteps,
    currentStepIndex,
    selectedBlockId,
    isLoading,
    error,
    actions
  };
}
