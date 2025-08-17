import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext.simple';
import {
  stageIdToNumber,
  numberToStageId,
  getNextStepNumber,
  getPreviousStepNumber,
  isValidStepNumber,
  calculateProgress,
  getStepName,
} from '@/utils/navigationHelpers';

/**
 * HOOK SIMPLIFICADO DE NAVEGAÇÃO DO FUNIL
 * Compatible with EditorContext.simple.tsx
 */
export const useFunnelNavigation = () => {
  const {
    activeStageId,
    stages,
    stageActions: { setActiveStage },
    computed: { currentBlocks },
  } = useEditor();

  const [isSaving, setIsSaving] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Estado atual da navegação
  const currentStepNumber = stageIdToNumber(activeStageId);
  const totalSteps = 21;
  const progressValue = calculateProgress(currentStepNumber, totalSteps);
  const stepName = getStepName(currentStepNumber);

  // Verificar se pode navegar
  const canNavigateNext = currentStepNumber < totalSteps;
  const canNavigatePrevious = currentStepNumber > 1;

  // Persistir etapa atual no localStorage
  useEffect(() => {
    if (activeStageId) {
      localStorage.setItem('funnel-current-step', activeStageId);
      console.log(`📌 Etapa persistida: ${activeStageId} (${stepName})`);
    }
  }, [activeStageId, stepName]);

  // Adicionar ao histórico de navegação
  useEffect(() => {
    if (activeStageId) {
      setNavigationHistory(prev => {
        const newHistory = [...prev, activeStageId];
        return newHistory.slice(-10); // Manter apenas últimas 10
      });
    }
  }, [activeStageId]);

  // Validar conteúdo da etapa
  const validateStepContent = useCallback(
    (stepNumber: number): boolean => {
      const stageId = numberToStageId(stepNumber);
      const stage = stages.find(s => s.id === stageId);
      return !!(stage && stage.name);
    },
    [stages]
  );

  // Navegação para etapa específica
  const navigateToStep = useCallback(
    async (stepNumber: number) => {
      if (!isValidStepNumber(stepNumber)) {
        console.warn(`❌ Navegação inválida: ${stepNumber}`);
        return;
      }

      const targetStageId = numberToStageId(stepNumber);
      console.log(`🚀 Navegando para etapa ${stepNumber} (${getStepName(stepNumber)})`);

      try {
        // Navegar
        setActiveStage(targetStageId);

        // Disparar evento customizado para sincronização
        window.dispatchEvent(
          new CustomEvent('funnel-navigation-change', {
            detail: { stepNumber, stageId: targetStageId, stepName: getStepName(stepNumber) },
          })
        );
      } catch (error) {
        console.error(`❌ Erro na navegação para etapa ${stepNumber}:`, error);
      }
    },
    [setActiveStage]
  );

  // Próxima etapa
  const handleNext = useCallback(async () => {
    const nextStep = getNextStepNumber(currentStepNumber);
    if (nextStep && canNavigateNext) {
      await navigateToStep(nextStep);
    }
  }, [currentStepNumber, canNavigateNext, navigateToStep]);

  // Etapa anterior
  const handlePrevious = useCallback(async () => {
    const previousStep = getPreviousStepNumber(currentStepNumber);
    if (previousStep && canNavigatePrevious) {
      await navigateToStep(previousStep);
    }
  }, [currentStepNumber, canNavigatePrevious, navigateToStep]);

  // Salvar progresso
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      console.log(`💾 Salvando progresso da etapa ${currentStepNumber}...`);

      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem(
        `funnel-step-${currentStepNumber}-saved`,
        JSON.stringify({
          stageId: activeStageId,
          blocks: currentBlocks,
          timestamp: Date.now(),
        })
      );

      console.log(`✅ Etapa ${currentStepNumber} salva com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentStepNumber, activeStageId, currentBlocks]);

  // Preview da etapa
  const handlePreview = useCallback(() => {
    const previewUrl = `/step/${currentStepNumber}`;
    console.log(`👁️ Abrindo preview: ${previewUrl}`);
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  }, [currentStepNumber]);

  return {
    // Estado atual
    currentStepNumber,
    currentStageId: activeStageId,
    totalSteps,
    progressValue,
    stepName,

    // Capacidades de navegação
    canNavigateNext,
    canNavigatePrevious,
    isLoadingTemplate: false, // Simplificado
    isSaving,

    // Ações de navegação
    navigateToStep,
    handleNext,
    handlePrevious,
    handleSave,
    handlePreview,

    // Validação e histórico
    validateStepContent,
    navigationHistory,

    // Utilities
    getStepName: (step: number) => getStepName(step),
    calculateProgress: (current: number) => calculateProgress(current, totalSteps),
  };
};