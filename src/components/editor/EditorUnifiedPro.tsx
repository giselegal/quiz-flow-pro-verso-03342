/**
 * 🎯 EDITOR UNIFIED PRO - Fase 2 Consolidada
 * 
 * Editor final consolidado com todas as otimizações:
 * ✅ Arquitetura limpa e unificada
 * ✅ Performance otimizada
 * ✅ Code splitting inteligente
 * ✅ Error boundaries robustos
 * ✅ Lazy loading estratégico
 */

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { EditorProvider } from './EditorProvider';
import { OptimizedEditorWrapper } from './core/EditorPerformanceOptimizer';
import type { EditorComponentConfig } from './core/EditorArchitecture';

export interface EditorUnifiedProProps extends EditorComponentConfig {
  performanceMode?: 'development' | 'production';
}

/**
 * 🏗️ Editor Unificado Pro - Versão Final Consolidada
 * 
 * Integra todo o sistema otimizado:
 * - Performance monitoring
 * - Error recovery
 * - Clean architecture
 * - Lazy loading inteligente
 */
export const EditorUnifiedPro: React.FC<EditorUnifiedProProps> = ({
  className = '',
  funnelId = 'quiz-style-21-steps',
  quizId,
  enableSupabase = true,
  debugMode = false,
  stepNumber = 1,
  performanceMode = 'production'
}) => {
  console.log('🎯 EditorUnifiedPro: Sistema consolidado iniciado', {
    funnelId,
    performanceMode,
    enableSupabase,
    stepNumber
  });

  const isDevelopment = performanceMode === 'development' || process.env.NODE_ENV === 'development';

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🚨 EditorUnifiedPro: Erro crítico capturado', {
          error: error.message,
          componentStack: errorInfo.componentStack
        });
      }}
    >
      <EditorProvider
        funnelId={funnelId}
        quizId={quizId}
        enableSupabase={enableSupabase}
        storageKey={`unified-editor-${funnelId}-${stepNumber}`}
      >
        <div className={`editor-unified-pro ${className}`}>
          <OptimizedEditorWrapper
            funnelId={funnelId}
            quizId={quizId}
            enableSupabase={enableSupabase}
            debugMode={debugMode || isDevelopment}
            stepNumber={stepNumber}
            performanceConfig={{
              enableLazyLoading: true,
              enableCodeSplitting: !isDevelopment, // Desabilitar em dev para debugging
              enableMemoization: true,
              enableVirtualization: false,
              chunkSize: 20,
              maxHistorySize: isDevelopment ? 10 : 50,
            }}
          />

          {/* Status Indicator - só em desenvolvimento */}
          {isDevelopment && (
            <div className="fixed bottom-4 left-4 z-50 bg-green-500/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                🎯 Editor Unified Pro v2.0
              </div>
            </div>
          )}
        </div>
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default EditorUnifiedPro;