// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
// Preferir o contexto moderno do EditorProvider; manter fallback para legacy se necessário
import { useEditor } from '@/hooks/useUnifiedEditor';
import { useQuizFlow } from '@/context/QuizFlowProvider';
import {
  calculateProgress,
  getNextStepNumber,
  getPreviousStepNumber,
  getStepName,
  isValidStepNumber,
  numberToStageId,
  stageIdToNumber,
} from '@/utils/navigationHelpers';
import { makeStepKey } from '@/utils/stepKey';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { useUnifiedCRUDOptional } from '@/context/UnifiedCRUDProvider';
import { safeGetItem as safeGetItemCtx, safeSetItem as safeSetItemCtx } from '@/utils/contextualStorage';

/**
 * HOOK UNIFICADO DE NAVEGAÇÃO DO FUNIL
 * Centraliza toda lógica de navegação entre etapas
 */
export const useFunnelNavigation = () => {
  // Utils seguros para localStorage
  // Desabilita definitivamente após primeira falha (ex.: sandboxes com quota 0)
  const storageDisabledRef = useRef(false);
  // Determina o contexto ativo (fallback para EDITOR)
  let activeContext: FunnelContext = FunnelContext.EDITOR;
  try {
    const crudCtx = useUnifiedCRUDOptional();
    if (crudCtx?.funnelContext) activeContext = crudCtx.funnelContext;
  } catch { }

  const safeSetItem = (key: string, value: string) => {
    try {
      if (!storageDisabledRef.current && typeof window !== 'undefined' && window?.localStorage) {
        // Usa chave contextualizada
        safeSetItemCtx(key, value, activeContext);
      }
    } catch (e) {
      storageDisabledRef.current = true; // Evita futuras tentativas
      try {
        if ((import.meta as any)?.env?.DEV) {
          console.warn('localStorage.setItem desativado após falha:', key, (e as any)?.message || e);
        }
      } catch { }
    }
  };
  const safeGetItem = (key: string) => {
    try {
      if (!storageDisabledRef.current && typeof window !== 'undefined' && window?.localStorage) {
        return safeGetItemCtx(key, activeContext);
      }
    } catch (e) {
      storageDisabledRef.current = true;
      try {
        if ((import.meta as any)?.env?.DEV) {
          console.warn('localStorage.getItem desativado após falha:', key, (e as any)?.message || e);
        }
      } catch { }
    }
    return null;
  };
  // Tentativa de usar o contexto moderno
  let modern: any = null;
  try {
    modern = useEditorModern();
  } catch { }

  // Unificar via QuizFlowProvider
  const { currentStep, totalSteps: flowTotal, goTo } = useQuizFlow();
  const activeStageId = numberToStageId(currentStep || 1);
  const setActiveStage = (id: string) => {
    const digits = parseInt(String(id).replace(/\D/g, ''), 10) || 1;
    goTo(digits);
  };
  const currentBlocks = modern?.state
    ? modern.state.stepBlocks?.[makeStepKey(currentStep || 1)] || []
    : [];
  const loadTemplateByStep = async (step: number) => {
    await modern?.actions?.ensureStepLoaded?.(step);
  };
  const isLoadingTemplate = modern?.state?.isLoading ?? false;

  const [isSaving, setIsSaving] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Estado atual da navegação
  const currentStepNumber = currentStep || stageIdToNumber(activeStageId);
  const totalSteps = flowTotal || 21;
  const progressValue = calculateProgress(currentStepNumber, totalSteps);
  const stepName = getStepName(currentStepNumber);

  // Verificar se pode navegar
  const canNavigateNext = currentStepNumber < totalSteps;
  const canNavigatePrevious = currentStepNumber > 1;

  // Persistir etapa atual no localStorage (com dedupe para evitar writes em excesso)
  const lastSavedStageIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastSavedStageIdRef.current !== activeStageId) {
      lastSavedStageIdRef.current = activeStageId;
      safeSetItem('funnel-current-step', activeStageId);
      try { console.log(`📌 Etapa persistida: ${activeStageId} (${stepName})`); } catch { }
    }
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
      // Considera que conteúdo é válido se existirem blocos carregados para o step
      const stepId = numberToStageId(stepNumber);
      const digits = parseInt(stepId.replace(/\D/g, ''), 10) || 1;
      const blocksForStep = modern?.state?.stepBlocks?.[makeStepKey(digits)] || [];
      return Array.isArray(blocksForStep) && blocksForStep.length > 0;
    },
    [modern?.state?.stepBlocks]
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

      safeSetItem(
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
    const savedStep = safeGetItem('funnel-current-step');
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
