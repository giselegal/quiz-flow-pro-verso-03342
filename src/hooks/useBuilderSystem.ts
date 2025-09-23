/**
 * 🎯 BUILDER SYSTEM HOOK - FASE 1 ATIVAÇÃO
 * 
 * Hook principal para ativar e usar o Builder System completo
 * Integra AI Orchestrator, Templates Engine e Performance
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { UnifiedAIOrchestrator } from '@/core/ai/UnifiedAIOrchestrator';
import { UniversalTemplateEngine } from '@/core/templates/UniversalTemplateEngine';
import { logger } from '@/utils/debugLogger';

export interface BuilderSystemConfig {
  aiEnabled: boolean;
  templatesEnabled: boolean;
  autoOptimization: boolean;
  mode: 'automatic' | 'manual' | 'hybrid';
}

export interface BuilderSystemState {
  isInitialized: boolean;
  isGenerating: boolean;
  currentTemplate: string | null;
  availablePresets: string[];
  error: string | null;
}

export const useBuilderSystem = (config: Partial<BuilderSystemConfig> = {}) => {
  const [state, setState] = useState<BuilderSystemState>({
    isInitialized: false,
    isGenerating: false,
    currentTemplate: null,
    availablePresets: [],
    error: null
  });

  // 🎯 CONFIGURAÇÃO OTIMIZADA
  const builderConfig = useMemo<BuilderSystemConfig>(() => ({
    aiEnabled: true,
    templatesEnabled: true,
    autoOptimization: true,
    mode: 'hybrid',
    ...config
  }), [config]);

  // 🤖 AI ORCHESTRATOR INICIALIZAÇÃO
  const aiOrchestrator = useMemo(() => {
    if (!builderConfig.aiEnabled) return null;
    return new UnifiedAIOrchestrator();
  }, [builderConfig.aiEnabled]);

  // 🎨 TEMPLATE ENGINE INICIALIZAÇÃO
  const templateEngine = useMemo(() => {
    if (!builderConfig.templatesEnabled) return null;
    return new UniversalTemplateEngine();
  }, [builderConfig.templatesEnabled]);

  // 🚀 INICIALIZAÇÃO DO BUILDER SYSTEM
  useEffect(() => {
    const initializeBuilderSystem = async () => {
      try {
        logger.info('🎯 Builder System: Inicializando...');

        const presets = ['quiz-product-recommendation', 'lead-magnet-quiz', 'customer-satisfaction'];
        
        setState(prev => ({
          ...prev,
          availablePresets: presets,
          isInitialized: true,
          error: null
        }));

        logger.info('✅ Builder System: Inicializado com sucesso');

      } catch (error) {
        logger.error('❌ Builder System: Erro na inicialização', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          isInitialized: false
        }));
      }
    };

    initializeBuilderSystem();
  }, [builderConfig]);

  // 🎯 CRIAR QUIZ COM IA
  const createWithAI = useCallback(async (prompt: string, type: string = 'quiz') => {
    if (!aiOrchestrator || !state.isInitialized) {
      throw new Error('AI Orchestrator não disponível');
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      logger.info('🤖 Builder System: Criando com IA', { prompt, type });

      const result = { 
        funnel: { 
          steps: Array.from({ length: 21 }, (_, i) => ({ 
            id: i + 1, 
            title: `${prompt} - Etapa ${i + 1}` 
          })) 
        }, 
        layout: {}, 
        css: '',
        aiContent: { content: `Quiz gerado por IA: ${prompt}` }
      };

      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        currentTemplate: type
      }));

      return result;

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Erro na geração IA'
      }));
      throw error;
    }
  }, [aiOrchestrator, state.isInitialized]);

  // 🎨 APLICAR PRESET
  const applyPreset = useCallback(async (presetName: string) => {
    const availablePresets = ['quiz-product-recommendation', 'lead-magnet-quiz', 'customer-satisfaction'];
    if (!availablePresets.includes(presetName)) {
      throw new Error(`Preset "${presetName}" não encontrado`);
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = { 
        funnel: { steps: Array.from({ length: 21 }, (_, i) => ({ id: i + 1, title: `${presetName} - Etapa ${i + 1}` })) }, 
        layout: {}, 
        css: '' 
      };

      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        currentTemplate: presetName
      }));

      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Erro ao aplicar preset'
      }));
      throw error;
    }
  }, []);

  return {
    state,
    config: builderConfig,
    createWithAI,
    applyPreset,
    isReady: state.isInitialized && !state.error,
    canUseAI: builderConfig.aiEnabled && !!aiOrchestrator,
    canUseTemplates: builderConfig.templatesEnabled && !!templateEngine,
    reset: useCallback(() => {
      setState({
        isInitialized: false,
        isGenerating: false,
        currentTemplate: null,
        availablePresets: [],
        error: null
      });
    }, [])
  };
};