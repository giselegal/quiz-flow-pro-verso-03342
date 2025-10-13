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
    if (!state.isInitialized) {
      throw new Error('Builder System não inicializado');
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      logger.info('🤖 Builder System: Criando com IA', { prompt, type });

      // Usar QuizBuilderFacade para criar quiz real
      const { QuizBuilderFacade } = await import('@/core/builder/index');
      let result;

      if (type === 'quiz') {
        result = QuizBuilderFacade.createCompleteQuiz(prompt);
      } else if (type === 'landing') {
        result = QuizBuilderFacade.createLandingPage(prompt);
      } else {
        result = QuizBuilderFacade.createLeadQualification(prompt);
      }

      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        currentTemplate: type
      }));

      return result;

    } catch (error) {
      logger.error('❌ Builder System: Erro na geração', error);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Erro na geração'
      }));
      throw error;
    }
  }, [state.isInitialized]);

  // 🎨 APLICAR PRESET
  const applyPreset = useCallback(async (presetName: string) => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      logger.info('🎨 Builder System: Aplicando preset', presetName);

      const { BUILDER_PRESETS } = await import('@/core/builder/index');
      const presetFn = BUILDER_PRESETS[presetName as keyof typeof BUILDER_PRESETS];

      if (!presetFn) {
        throw new Error(`Preset "${presetName}" não encontrado`);
      }

      const result = presetFn();

      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        currentTemplate: presetName
      }));

      logger.info('✅ Builder System: Preset aplicado com sucesso');
      return result;
      
    } catch (error) {
      logger.error('❌ Builder System: Erro ao aplicar preset', error);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Erro ao aplicar preset'
      }));
      throw error;
    }
  }, []);

  // 🎯 GERAR TEMPLATE PERSONALIZADO
  const generateCustomTemplate = useCallback(async (requirements: {
    name: string;
    type: string;
    steps: number;
    theme?: string;
  }) => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      logger.info('🎯 Builder System: Gerando template personalizado', requirements);

      const { FunnelBuilder, UIBuilder } = await import('@/core/builder/index');

      // Criar funil com número de steps customizado
      const funnelBuilder = new FunnelBuilder(requirements.name);
      
      // Adicionar steps conforme solicitado
      for (let i = 0; i < requirements.steps; i++) {
        funnelBuilder.addStep(`Etapa ${i + 1}`).complete();
      }

      const funnel = funnelBuilder
        .withSettings({ theme: requirements.theme || 'modern-blue' })
        .autoConnect()
        .optimize()
        .build();

      const layout = new UIBuilder(`${requirements.name} Layout`, 'single-column')
        .withTheme((requirements.theme || 'modern-blue') as any)
        .build();

      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        currentTemplate: requirements.name
      }));

      logger.info('✅ Builder System: Template personalizado gerado');

      return { funnel, layout, css: `/* Tema: ${requirements.theme || 'modern-blue'} */` };

    } catch (error) {
      logger.error('❌ Builder System: Erro ao gerar template', error);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Erro na geração de template'
      }));
      throw error;
    }
  }, []);

  // 🔄 OTIMIZAR AUTOMATICAMENTE
  const optimizeAutomatically = useCallback(async (funnelData: any) => {
    if (!builderConfig.autoOptimization) return funnelData;

    try {
      logger.info('🔄 Builder System: Otimização automática');
      return funnelData;
    } catch (error) {
      logger.error('❌ Builder System: Erro na otimização', error);
      return funnelData;
    }
  }, [builderConfig.autoOptimization]);

  return {
    state,
    config: builderConfig,
    createWithAI,
    applyPreset,
    generateCustomTemplate,
    optimizeAutomatically,
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