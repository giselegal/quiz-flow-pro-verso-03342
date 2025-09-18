/**
 * 🎯 EDITOR CONSOLIDADO PRO - CLEAN ARCHITECTURE
 * 
 * Editor consolidado migrado para Clean Architecture com:
 * ✅ HybridProviderStack (Clean + Legacy)
 * ✅ MainEditorUnified com novos hooks
 * ✅ Performance monitoring integrado
 * ✅ Fallback automático para legacy
 */

import React, { useMemo } from 'react';
import HybridProviderStack from '@/providers/HybridProviderStack';
import { MainEditorUnified } from './MainEditorUnified';
import { PerformanceMonitorProvider, PerformanceDashboard } from '@/monitoring/PerformanceMonitor';
import { cn } from '@/lib/utils';
import { EditorLoadingWrapper } from './EditorLoadingWrapper';

export interface EditorConsolidatedProProps {
  className?: string;
  stepNumber?: number;
  funnelId?: string;
  onStepChange?: (stepId: string) => void;
  onSave?: (stepId: string, data: any) => void;
  debugMode?: boolean;
  enablePerformanceMonitoring?: boolean;
}

/**
 * 🏗️ Editor Consolidado Pro - Clean Architecture v2.0
 * 
 * Versão migrada com Clean Architecture completa:
 * - HybridProviderStack para migração gradual
 * - MainEditorUnified com hooks otimizados
 * - Performance monitoring em tempo real
 * - Testes de integração incluídos
 * - Zero breaking changes
 */
export const EditorConsolidatedPro: React.FC<EditorConsolidatedProProps> = ({
  className = '',
  stepNumber = 1,
  funnelId = 'quiz-style-21-steps',
  debugMode = false,
  enablePerformanceMonitoring = true,
  onStepChange,
  onSave
}) => {
  console.log('🎯 EditorConsolidatedPro: Clean Architecture v2.0', { 
    stepNumber, 
    funnelId, 
    enablePerformanceMonitoring 
  });

  // Configuração Supabase otimizada
  const supabaseConfig = useMemo(() => ({
    enabled: true,
    funnelId,
    quizId: funnelId,
    storageKey: `${funnelId}-editor-state`
  }), [funnelId]);

  const editorContent = (
    <HybridProviderStack
      initialStep={stepNumber}
      debugMode={debugMode}
      useCleanArchitecture={true}
      supabaseConfig={supabaseConfig}
      funnelId={funnelId}
    >
      <div className="h-full flex flex-col">
        {/* Performance Dashboard (só em debug mode) */}
        {debugMode && enablePerformanceMonitoring && (
          <div className="p-2 border-b bg-muted/10">
            <PerformanceDashboard className="text-xs" />
          </div>
        )}

        {/* Editor Principal */}
        <div className="flex-1">
          <MainEditorUnified 
            className="h-full"
            stepNumber={stepNumber}
            funnelId={funnelId}
            onStepChange={onStepChange}
            onSave={onSave}
            debugMode={debugMode}
          />
        </div>
      </div>

      {/* Indicadores de Status */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {/* Status Principal */}
        <div className={cn(
          'px-3 py-2 rounded-lg text-sm font-medium transition-all',
          'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg',
          'hover:shadow-xl transform hover:scale-105'
        )}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            🎯 Clean Architecture v2.0
          </div>
        </div>

        {/* Performance Indicator */}
        {enablePerformanceMonitoring && (
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            'bg-green-500/90 text-white shadow-md'
          )}>
            📊 Performance Monitor
          </div>
        )}

        {/* Debug Mode Indicator */}
        {debugMode && (
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            'bg-orange-500/90 text-white shadow-md'
          )}>
            🐛 Debug Mode
          </div>
        )}
      </div>
    </HybridProviderStack>
  );

  return (
    <EditorLoadingWrapper 
      templateId={funnelId}
      funnelId={funnelId}
      timeout={8000}
    >
      <div className={cn('h-screen w-full overflow-hidden bg-background', className)}>
        {enablePerformanceMonitoring ? (
          <PerformanceMonitorProvider enabled={enablePerformanceMonitoring}>
            {editorContent}
          </PerformanceMonitorProvider>
        ) : (
          editorContent
        )}
      </div>
    </EditorLoadingWrapper>
  );
};

export default EditorConsolidatedPro;