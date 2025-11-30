/**
 * 🎯 FASE 3.1 - Hook de Navegação de Steps
 * 
 * Extrai lógica de navegação entre steps do QuizModularEditor
 * Reduz complexidade do componente principal
 * 
 * RESPONSABILIDADES:
 * - Navegação entre steps
 * - Validação de steps
 * - Limpar seleção ao trocar step
 * - Background loading de steps
 * 
 * @phase FASE 3.1 - Refatoração QuizModularEditor
 */

import { useCallback, useState } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import { templateService } from '@/services/canonical/TemplateService';

export interface UseStepNavigationOptions {
  currentStepKey: string;
  loadedTemplate: any;
  setCurrentStep: (step: number) => void;
  setSelectedBlock: (block: any) => void;
  templateId?: string;
  resourceId?: string;
}

export interface UseStepNavigationReturn {
  handleSelectStep: (key: string) => void;
  navigateToStep: (step: number) => void;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
  totalSteps: number;
}

/**
 * Hook para gerenciar navegação entre steps
 */
export function useStepNavigation({
  currentStepKey,
  loadedTemplate,
  setCurrentStep,
  setSelectedBlock,
  templateId,
  resourceId,
}: UseStepNavigationOptions): UseStepNavigationReturn {
  
  const [isNavigating, setIsNavigating] = useState(false);

  /**
   * Handler para selecionar um step específico
   * ✅ FASE 1: Navegação não-bloqueante já implementada
   */
  const handleSelectStep = useCallback((key: string) => {
    if (isNavigating) {
      appLogger.warn('[useStepNavigation] Navegação já em progresso, ignorando');
      return;
    }

    if (key === currentStepKey) {
      appLogger.debug('[useStepNavigation] Step já está selecionado, ignorando');
      return;
    }

    setIsNavigating(true);

    try {
      // 🎯 FASE 1 CRÍTICO: Limpar selectedBlockId ao mudar de step
      appLogger.info(`🧹 [useStepNavigation] Limpando selectedBlockId ao navegar: ${currentStepKey} → ${key}`);
      setSelectedBlock(null);

      // 🎯 WAVE 1 FIX: Atualizar UI IMEDIATAMENTE (não bloqueia)
      if (loadedTemplate?.steps?.length) {
        const index = loadedTemplate.steps.findIndex((s: any) => s.id === key);
        const newStep = index >= 0 ? index + 1 : 1;

        if (newStep > 0) {
          setCurrentStep(newStep);
          appLogger.info(`⚡ [useStepNavigation] Navegação instantânea: ${currentStepKey} → ${key} (step ${newStep})`);
        }
      } else {
        // Fallback: extrair número do step-XX
        const match = key.match(/step-(\d{1,2})/i);
        const num = match ? parseInt(match[1], 10) : 1;
        setCurrentStep(num);
        appLogger.info(`⚡ [useStepNavigation] Navegação instantânea (fallback): step ${num}`);
      }

      // 🔄 Lazy load em BACKGROUND (não bloqueia UI)
      const tid = templateId ?? resourceId;
      if (tid) {
        templateService.getStep(key, tid)
          .then(stepResult => {
            if (stepResult.success) {
              appLogger.info(`✅ [useStepNavigation] Step ${key} carregado em background`);
            }
          })
          .catch(error => {
            appLogger.warn(`⚠️ [useStepNavigation] Erro ao carregar step ${key}:`, { data: [error] });
          })
          .finally(() => {
            setIsNavigating(false);
          });
      } else {
        setIsNavigating(false);
      }
    } catch (error) {
      appLogger.error('[useStepNavigation] Erro na navegação:', error);
      setIsNavigating(false);
    }
  }, [currentStepKey, loadedTemplate, setCurrentStep, setSelectedBlock, templateId, resourceId, isNavigating]);

  /**
   * Navegar para um step específico por número
   */
  const navigateToStep = useCallback((step: number) => {
    if (loadedTemplate?.steps?.length) {
      const stepKey = loadedTemplate.steps[step - 1]?.id;
      if (stepKey) {
        handleSelectStep(stepKey);
      } else {
        appLogger.warn(`[useStepNavigation] Step ${step} não encontrado no template`);
      }
    } else {
      // Fallback: usar formato padrão step-XX
      const stepKey = `step-${step.toString().padStart(2, '0')}`;
      handleSelectStep(stepKey);
    }
  }, [loadedTemplate, handleSelectStep]);

  /**
   * Calcular se pode navegar para próximo/anterior
   */
  const totalSteps = loadedTemplate?.steps?.length || 21;
  const currentStepIndex = loadedTemplate?.steps?.findIndex((s: any) => s.id === currentStepKey) ?? -1;
  const canNavigateNext = currentStepIndex < totalSteps - 1;
  const canNavigatePrevious = currentStepIndex > 0;

  return {
    handleSelectStep,
    navigateToStep,
    canNavigateNext,
    canNavigatePrevious,
    totalSteps,
  };
}

export default useStepNavigation;
