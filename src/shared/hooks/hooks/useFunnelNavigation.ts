import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
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
 * HOOK UNIFICADO DE NAVEGAÇÃO DO FUNIL
 * Centraliza toda lógica de navegação entre etapas
 */
export const useFunnelNavigation = () => {
  const {
    activeStageId,
    stages,
    stageActions: { setActiveStage },
    computed: { currentBlocks },
    templateActions: { loadTemplateByStep, isLoadingTemplate },
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
    localStorage.setItem('funnel-current-step', activeStageId);
    console.log(`📌 Etapa persistida: ${activeStageId} (${stepName})`);
  }, [activeStageId, stepName]);

  // Adicionar ao histórico de navegação
  useEffect(() => {
    setNavigationHistory(prev => {
      const newHistory = [...prev, activeStageId];
      return newHistory.slice(-10); // Manter apenas últimas 10
    });
  }, [activeStageId]);

  // Validar conteúdo da etapa
  const validateStepContent = useCallback(
    (stepNumber: number): boolean => {
      const stageId = numberToStageId(stepNumber);
      const stage = stages.find(s => s.id === stageId);
      return !!(stage && (stage.metadata?.blocksCount || 0) > 0);
    },
    [stages]
  );

  // Navegação para etapa específica
  const navigateToStep = useCallback(
    async (stepNumber: number) => {
      if (!isValidStepNumber(stepNumber) || isLoadingTemplate) {
        console.warn(`❌ Navegação inválida ou em carregamento: ${stepNumber}`);
        return;
      }

      const targetStageId = numberToStageId(stepNumber);
      console.log(`🚀 Navegando para etapa ${stepNumber} (${getStepName(stepNumber)})`);

      try {
        // Carregar template se necessário
        if (!validateStepContent(stepNumber)) {
          console.log(`📝 Carregando template para etapa ${stepNumber}...`);
          await loadTemplateByStep(stepNumber);
        }

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
    [setActiveStage, loadTemplateByStep, isLoadingTemplate, validateStepContent]
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

      // Simular salvamento (implementar Supabase depois)
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

  // Navegação por teclado
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return; // Ignorar atalhos do sistema

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSave();
          }
          break;
        case 'p':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handlePreview();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [handleNext, handlePrevious, handleSave, handlePreview]);

  // Recuperar etapa salva na inicialização
  useEffect(() => {
    const savedStep = localStorage.getItem('funnel-current-step');
    if (savedStep && savedStep !== activeStageId) {
      const savedStepNumber = stageIdToNumber(savedStep);
      if (isValidStepNumber(savedStepNumber)) {
        console.log(`🔄 Recuperando etapa salva: ${savedStep}`);
        navigateToStep(savedStepNumber);
      }
    }
  }, []); // Executar apenas na inicialização

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
    isLoadingTemplate,
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
