import { useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';

export const useFunnelNavigation = () => {
  const { stages, activeStageId, stageActions } = useEditor();

  const currentStepNumber =
    stages?.find(stage => stage.id === activeStageId)?.order || 1;
  const totalSteps = stages?.length || 0;

  const canNavigatePrevious = currentStepNumber > 1;
  const canNavigateNext = currentStepNumber < totalSteps;

  const navigateToStep = useCallback(
    async (stepNumber: number) => {
      if (stepNumber >= 1 && stepNumber <= stages.length) {
        const targetStage = stages.find((stage: any) => stage.order === stepNumber);
        if (targetStage) {
          stageActions.setActiveStage(targetStage.id);
          
          // Try to load template if available
          if (stageActions.loadTemplateByStep) {
            try {
              await stageActions.loadTemplateByStep(stepNumber);
            } catch (error) {
              console.warn('Template loading not available:', error);
            }
          }
        }
      }
    },
    [stages, stageActions]
  );

  const getCurrentStageInfo = useCallback(() => {
    const currentStage = stages.find((stage: any) => stage.id === activeStageId);
    return {
      stage: currentStage,
      stepNumber: currentStage?.order || 1,
      blocksCount: currentStage?.blocks?.length || 0,
      description: (currentStage as any)?.description || '',
    };
  }, [stages, activeStageId]);

  return {
    currentStepNumber,
    totalSteps,
    canNavigatePrevious,
    canNavigateNext,
    navigateToStep,
    getCurrentStageInfo,
  };
};
