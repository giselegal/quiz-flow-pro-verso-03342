import { useCallback } from 'react';
import { generateSemanticId } from '@/utils/semanticIdGenerator';

interface QuizStep {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive: boolean;
  type: string;
  description: string;
  multiSelect?: number;
}

export const useStepHandlers = (
  steps: QuizStep[],
  setSteps: (updater: (prev: QuizStep[]) => QuizStep[]) => void,
  selectedStepId: string,
  setSelectedStepId: (stepId: string) => void,
  setSelectedBlockId: (blockId: string | null) => void,
  handlePopulateStep: (stepId: string) => void
) => {
  const handleStepSelect = useCallback(
    (stepId: string) => {
      console.log(`🎯 Selecionando etapa: ${stepId}`);
      setSelectedStepId(stepId);
      setSelectedBlockId(null); // Clear block selection when changing steps

      // 🔧 CORREÇÃO: Carregar automaticamente o conteúdo da etapa selecionada
      // Verificar se a etapa já tem blocos, se não tiver, popular automaticamente
      const selectedStep = steps.find(step => step.id === stepId);
      if (selectedStep && selectedStep.blocksCount === 0) {
        console.log(`📝 Etapa ${stepId} está vazia, populando automaticamente...`);
        // Carregar conteúdo da etapa automaticamente
        setTimeout(() => {
          handlePopulateStep(stepId);
        }, 100);
      } else {
        console.log(`✅ Etapa ${stepId} já tem ${selectedStep?.blocksCount || 0} blocos`);
      }
    },
    [steps, setSelectedStepId, setSelectedBlockId, handlePopulateStep]
  );

  const handleStepAdd = useCallback(() => {
    const newStep: QuizStep = {
      id: generateSemanticId({
        context: 'editor',
        type: 'step',
        identifier: 'etapa',
        index: Math.floor(Math.random() * 1000),
      }),
      name: `Etapa ${steps.length + 1}`,
      order: steps.length + 1,
      blocksCount: 0,
      isActive: false,
      type: 'custom',
      description: `Etapa personalizada ${steps.length + 1}`,
    };
    setSteps(prev => [...prev, newStep]);
  }, [steps.length, setSteps]);

  const handleStepUpdate = useCallback(
    (stepId: string, updates: Partial<QuizStep>) => {
      setSteps(prev => prev.map(step => (step.id === stepId ? { ...step, ...updates } : step)));
    },
    [setSteps]
  );

  const handleStepDelete = useCallback(
    (stepId: string) => {
      if (steps.length <= 1) {
        alert('Não é possível excluir a última etapa');
        return;
      }

      if (confirm('Tem certeza que deseja excluir esta etapa?')) {
        setSteps(prev => prev.filter(step => step.id !== stepId));
        if (selectedStepId === stepId) {
          setSelectedStepId(steps[0]?.id || '');
        }
      }
    },
    [steps, selectedStepId, setSteps, setSelectedStepId]
  );

  const handleStepDuplicate = useCallback(
    (stepId: string) => {
      const stepToDuplicate = steps.find(step => step.id === stepId);
      if (stepToDuplicate) {
        const newStep: QuizStep = {
          ...stepToDuplicate,
          id: generateSemanticId({
            context: 'editor',
            type: 'step',
            identifier: 'etapa',
            index: Math.floor(Math.random() * 1000),
          }),
          name: `${stepToDuplicate.name} (Cópia)`,
          order: steps.length + 1,
        };
        setSteps(prev => [...prev, newStep]);
      }
    },
    [steps, setSteps]
  );

  const handleStepReorder = useCallback((draggedId: string, targetId: string) => {
    // TODO: Implement drag and drop reordering
    console.log('Reorder step', draggedId, 'to', targetId);
  }, []);

  return {
    handleStepSelect,
    handleStepAdd,
    handleStepUpdate,
    handleStepDelete,
    handleStepDuplicate,
    handleStepReorder,
  };
};
