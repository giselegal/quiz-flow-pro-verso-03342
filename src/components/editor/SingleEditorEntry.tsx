/**
 * 🎯 SINGLE EDITOR ENTRY - PONTO DE ENTRADA ÚNICO
 * 
 * Consolidação de todas as rotas /editor* em um único componente inteligente.
 * Elimina fragmentação e simplifica arquitetura.
 * 
 * FUNCIONALIDADES:
 * ✅ Roteamento interno baseado em parâmetros
 * ✅ Mode switching (visual, headless, production)
 * ✅ Lazy loading inteligente
 * ✅ Error boundaries consolidados
 * ✅ Performance optimizada
 */

import React, { Suspense, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ConsolidatedEditorProvider } from './ConsolidatedEditorProvider';
import { UnifiedEditorCore } from './UnifiedEditorCore';
import { ErrorBoundary } from './ErrorBoundary';
import { PerformanceMonitorProvider } from './optimization/PerformanceMonitor';
import { ProductionOptimizerProvider } from './optimization/ProductionOptimizer';
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
      <p className="text-foreground text-lg font-medium">Carregando Editor Consolidado...</p>
      <p className="text-sm text-muted-foreground mt-2">Sistema Unificado • Performance Otimizada</p>
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
    
    logger.info('🎯 SingleEditorEntry: Configuração detectada', {
      location,
      props,
      config,
      timestamp: new Date().toISOString()
    });

    return config;
  }, [location, props.funnelId, props.mode, props.initialStep]);

  // 🎯 PROVIDER CONFIGURAÇÃO OTIMIZADA
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
    debug: editorConfig.debug
  }), [editorConfig]);

  // 🎯 CORE EDITOR CONFIGURAÇÃO
  const coreConfig = useMemo(() => ({
    mode: editorConfig.mode,
    funnelId: editorConfig.funnelId,
    initialStep: editorConfig.initialStep,
    className: props.className || 'h-screen w-full'
  }), [editorConfig, props.className]);

  return (
    <div className="single-editor-entry h-screen w-full bg-background">
      <ProductionOptimizerProvider>
        <PerformanceMonitorProvider enableOverlay={process.env.NODE_ENV === 'development'}>
          <ErrorBoundary>
            <ConsolidatedEditorProvider {...providerConfig}>
              <Suspense fallback={<LoadingFallback />}>
                <UnifiedEditorCore {...coreConfig} />
              </Suspense>
            </ConsolidatedEditorProvider>
          </ErrorBoundary>
        </PerformanceMonitorProvider>
      </ProductionOptimizerProvider>
    </div>
  );
};

export default SingleEditorEntry;