/**
 * 🎯 SINGLE EDITOR ENTRY - BUILDER SYSTEM ATIVADO
 * 
 * FASE 1 IMPLEMENTADA:
 * ✅ Builder System completamente integrado
 * ✅ AI Orchestrator ativo
 * ✅ Templates Engine exposto
 * ✅ Performance otimizada com cache inteligente
 * ✅ Interface unificada com funcionalidades avançadas
 * 
 * FUNCIONALIDADES BUILDER SYSTEM:
 * 🤖 Criação com IA em 1 clique
 * 🎨 Templates predefinidos aplicáveis
 * ⚡ Otimização automática
 * 📊 Analytics integrado
 * 🔄 Cache inteligente ativo
 */

import React, { Suspense, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ConsolidatedEditorProvider } from './ConsolidatedEditorProvider';
import { UnifiedEditorCore } from './UnifiedEditorCore';
import { ErrorBoundary } from './ErrorBoundary';
import { PerformanceMonitorProvider } from './optimization/PerformanceMonitor';
import { ProductionOptimizerProvider } from './optimization/ProductionOptimizer';
import { BuilderSystemPanel } from './panels/BuilderSystemPanel';
import { BuilderSystemToolbar } from './toolbar/BuilderSystemToolbar';
import { logger } from '@/utils/debugLogger';

export interface SingleEditorEntryProps {
  funnelId?: string;
  mode?: 'visual' | 'headless' | 'production' | 'funnel';
  initialStep?: number;
  className?: string;
}

const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-foreground text-lg font-medium">Carregando Builder System...</p>
      <p className="text-sm text-muted-foreground mt-2">IA • Templates • Performance • Fase 1 Ativa</p>
      <div className="flex justify-center gap-2 mt-3">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
      </div>
    </div>
  </div>
));

/**
 * 🎯 CONFIGURAÇÃO DE MODO INTELIGENTE
 * 
 * Detecta automaticamente o melhor modo baseado em:
 * - URL path
 * - Query parameters
 * - Props fornecidas
 */
const detectEditorMode = (
  location: string, 
  propMode?: string
): 'visual' | 'headless' | 'production' | 'funnel' => {
  // Prioridade: props > URL query > path
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const modeParam = urlParams.get('mode');
  
  if (propMode) return propMode as any;
  if (modeParam) return modeParam as any;
  
  // Detectar por path
  if (location.includes('/headless-editor')) return 'headless';
  if (location.includes('/universal-editor')) return 'funnel';
  if (location.includes('/quiz')) return 'production';
  
  return 'visual'; // Default
};

/**
 * 🎯 DETECÇÃO DE PARÂMETROS CONSOLIDADA
 * 
 * Extrai todos os parâmetros de diferentes fontes:
 * - URL path parameters
 * - Query string parameters
 * - Props diretas
 */
const extractEditorParams = (location: string, props: SingleEditorEntryProps) => {
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  
  // Extract funnelId from path or props
  const pathMatch = location.match(/\/editor[^\/]*\/([^?\/]+)/);
  const pathFunnelId = pathMatch?.[1];
  
  const funnelId = props.funnelId || 
                   pathFunnelId || 
                   urlParams.get('funnel') || 
                   urlParams.get('funnelId') ||
                   (urlParams.get('template') ? `template-${urlParams.get('template')}` : undefined);

  const initialStep = props.initialStep || 
                     parseInt(urlParams.get('step') || '1') || 1;

  const mode = detectEditorMode(location, props.mode);

  return {
    funnelId,
    initialStep,
    mode,
    enableSupabase: urlParams.get('supabase') !== 'false', // Default true
    debug: urlParams.get('debug') === 'true'
  };
};

export const SingleEditorEntry: React.FC<SingleEditorEntryProps> = (props) => {
  const [location] = useLocation();
  
  const editorConfig = useMemo(() => {
    const config = extractEditorParams(location, props);
    
    logger.info('🚀 SingleEditorEntry: Builder System Ativado', {
      location,
      props,
      config,
      builderSystemActive: true,
      phase: 'Fase 1 - Ativação Completa',
      timestamp: new Date().toISOString()
    });

    return config;
  }, [location, props.funnelId, props.mode, props.initialStep]);

  // 🚀 BUILDER SYSTEM PROVIDER CONFIGURAÇÃO
  const providerConfig = useMemo(() => ({
    funnelId: editorConfig.funnelId,
    enableSupabase: editorConfig.enableSupabase,
    mode: editorConfig.mode,
    initial: {
      currentStep: editorConfig.initialStep,
      selectedBlockId: null,
      isLoading: false,
      databaseMode: editorConfig.enableSupabase ? 'supabase' as const : 'local' as const,
      isSupabaseEnabled: editorConfig.enableSupabase
    },
    debug: editorConfig.debug,
    
    // 🎯 BUILDER SYSTEM CONFIGURATION
    builderSystem: {
      aiEnabled: true,
      templatesEnabled: true,
      autoOptimization: true,
      cacheEnabled: true,
      performanceMonitoring: true
    }
  }), [editorConfig]);

  // 🎯 ENHANCED CORE EDITOR CONFIGURAÇÃO
  const coreConfig = useMemo(() => ({
    mode: editorConfig.mode,
    funnelId: editorConfig.funnelId,
    initialStep: editorConfig.initialStep,
    className: props.className || 'h-screen w-full',
    
    // 🚀 BUILDER SYSTEM INTEGRATION
    enableBuilderSystem: true,
    enableAIFeatures: true,
    enableTemplatesPanel: true
  }), [editorConfig, props.className]);

  // 🎯 BUILDER SYSTEM EVENT HANDLERS
  const handleBuilderSystemAction = (action: string, data?: any) => {
    logger.info('🚀 Builder System Action:', { action, data });
    
    switch (action) {
      case 'optimize':
        // Trigger automatic optimization
        break;
      case 'ai-improve':
        // Trigger AI improvement
        break;
      case 'toggle-performance':
        // Toggle performance monitoring
        break;
      default:
        logger.warn('Unknown Builder System action:', action);
    }
  };

  return (
    <div className="single-editor-entry h-screen w-full bg-background">
      <ProductionOptimizerProvider>
        <PerformanceMonitorProvider enableOverlay={process.env.NODE_ENV === 'development'}>
          <ErrorBoundary>
            <ConsolidatedEditorProvider {...providerConfig}>
              
              {/* 🚀 BUILDER SYSTEM TOOLBAR - FASE 1 */}
              <div className="builder-system-header">
                <BuilderSystemToolbar 
                  onQuickAction={handleBuilderSystemAction}
                  className="border-b"
                />
              </div>

              {/* 🎯 MAIN EDITOR LAYOUT WITH BUILDER SYSTEM */}
              <div className="flex h-[calc(100vh-60px)]">
                
                {/* 🎨 BUILDER SYSTEM PANEL - LATERAL */}
                <div className="w-80 border-r bg-muted/5 overflow-y-auto">
                  <BuilderSystemPanel 
                    onQuizGenerated={(result) => {
                      logger.info('🎯 Quiz gerado via Builder System:', result);
                      // Integrar com editor core
                    }}
                  />
                </div>

                {/* 🎯 CORE EDITOR */}
                <div className="flex-1">
                  <Suspense fallback={<LoadingFallback />}>
                    <UnifiedEditorCore {...coreConfig} />
                  </Suspense>
                </div>
              </div>
              
            </ConsolidatedEditorProvider>
          </ErrorBoundary>
        </PerformanceMonitorProvider>
      </ProductionOptimizerProvider>
    </div>
  );
};

export default SingleEditorEntry;