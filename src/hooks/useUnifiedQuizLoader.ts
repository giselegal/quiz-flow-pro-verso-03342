/**
 * 🎯 UNIFIED QUIZ LOADER - Hook consolidado
 * 
 * Substitui:
 * - useTemplateLoader (fragmentado)
 * - useQuizState (duplicação)
 * - QuizEditorBridge.loadForRuntime (incompleto)
 * 
 * FASE 3: Single source of truth para carregamento de quiz
 */

import { useState, useCallback, useEffect } from 'react';
import { UnifiedQuizStep, UnifiedQuizStepAdapter } from '@/lib/adapters/UnifiedQuizStepAdapter';
import { TemplateService } from '@/services/canonical/TemplateService';
import { supabase } from '@/services/integrations/supabase/customClient';
import { TEMPLATE_SOURCES } from '@/config/templateSources';

interface UseUnifiedQuizLoaderOptions {
  funnelId?: string;
  source: 'database' | 'templates' | 'hardcoded';
  enableCache?: boolean;
}

interface UseUnifiedQuizLoaderReturn {
  steps: Record<string, UnifiedQuizStep>;
  loadStep: (stepId: string) => Promise<UnifiedQuizStep | null>;
  loadAllSteps: () => Promise<Record<string, UnifiedQuizStep>>;
  reloadSteps: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const cache: Record<string, UnifiedQuizStep> = {};

export function useUnifiedQuizLoader(
  options: UseUnifiedQuizLoaderOptions,
): UseUnifiedQuizLoaderReturn {
  const { funnelId, source, enableCache = true } = options;
  
  const [steps, setSteps] = useState<Record<string, UnifiedQuizStep>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Carregar step individual
   */
  const loadStep = useCallback(async (stepId: string): Promise<UnifiedQuizStep | null> => {
    // Cache hit
    if (enableCache && cache[stepId]) {
      return cache[stepId];
    }
    
    try {
      let unifiedStep: UnifiedQuizStep | null = null;
      
      switch (source) {
        case 'database':
          // Carregar do Supabase (quando tabela quiz_production for criada)
          // TODO: Implementar após criar tabela quiz_production
          console.warn('Database source not yet implemented - falling back to TemplateService');
          const templateService = TemplateService.getInstance();
          const dbFallbackResult = await templateService.getStep(stepId);
          if (dbFallbackResult.success) {
            unifiedStep = UnifiedQuizStepAdapter.fromBlocks(dbFallbackResult.data as any, stepId);
          }
          break;
        
        case 'templates':
          // Carregar via TemplateService canonical
          const templateServiceTemplates = TemplateService.getInstance();
          const templateResult = await templateServiceTemplates.getStep(stepId);
          
          if (templateResult.success) {
            unifiedStep = UnifiedQuizStepAdapter.fromBlocks(templateResult.data as any, stepId);
          }
          break;
        
        case 'hardcoded':
        default:
          // Usar TemplateService como fonte única
          const templateServiceDefault = TemplateService.getInstance();
          const defaultResult = await templateServiceDefault.getStep(stepId);
          if (defaultResult.success) {
            unifiedStep = UnifiedQuizStepAdapter.fromBlocks(defaultResult.data as any, stepId);
          }
          break;
      }
      
      // Salvar no cache
      if (unifiedStep && enableCache) {
        cache[stepId] = unifiedStep;
      }
      
      return unifiedStep;
    } catch (err) {
      console.error(`Failed to load step ${stepId}:`, err);
      setError(err as Error);
      return null;
    }
  }, [source, funnelId, enableCache]);
  
  /**
   * Carregar todos os steps
   */
  const loadAllSteps = useCallback(async (): Promise<Record<string, UnifiedQuizStep>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedSteps: Record<string, UnifiedQuizStep> = {};
      
      // Carregar steps 1-21
      for (let i = 1; i <= 21; i++) {
        const stepId = `step-${i}`;
        const step = await loadStep(stepId);
        if (step) {
          loadedSteps[stepId] = step;
        }
      }
      
      setSteps(loadedSteps);
      return loadedSteps;
    } catch (err) {
      setError(err as Error);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [loadStep]);
  
  /**
   * Recarregar steps (limpar cache)
   */
  const reloadSteps = useCallback(async () => {
    // Limpar cache
    Object.keys(cache).forEach(key => delete cache[key]);
    
    // Recarregar
    await loadAllSteps();
  }, [loadAllSteps]);
  
  // Auto-load on mount
  useEffect(() => {
    loadAllSteps();
  }, [loadAllSteps]);
  
  return {
    steps,
    loadStep,
    loadAllSteps,
    reloadSteps,
    isLoading,
    error,
  };
}
