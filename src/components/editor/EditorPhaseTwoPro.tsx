/**
 * 🎯 EDITOR FASE 2 PRO - Clean Architecture Implementation
 * 
 * Editor consolidado com arquitetura limpa implementando:
 * ✅ Correção crítica de runtime errors
 * ✅ Contextos unificados 
 * ✅ Validação robusta com type guards
 * ✅ Error boundaries integrados
 * ✅ Step 20 components corrigidos
 */

import React, { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { EditorProvider } from './EditorProvider';
import { useUnifiedEditor } from '@/hooks/useEditorContext';

// Lazy load do editor principal para melhor performance
const EditorLegacyPro = React.lazy(() => import('@/legacy/editor/EditorPro'));

export interface EditorPhaseTwoProProps {
  className?: string;
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
  debugMode?: boolean;
  stepNumber?: number;
}

const EditorLoadingFallback = () => (
  <div className="min-h-[500px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <div className="text-sm text-muted-foreground">
        Inicializando editor consolidado...
      </div>
    </div>
  </div>
);

const EditorErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="min-h-[500px] flex items-center justify-center p-8">
    <div className="max-w-md text-center space-y-4">
      <h3 className="text-lg font-semibold text-destructive">
        ❌ Erro crítico no editor
      </h3>
      <p className="text-sm text-muted-foreground">
        {error.message}
      </p>
      <button 
        onClick={retry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        🔄 Tentar novamente
      </button>
    </div>
  </div>
);

/**
 * 🏗️ Editor Principal Fase 2
 * 
 * Implementa todas as correções da Fase 1:
 * - Runtime error fixes
 * - Context unification
 * - Type guards
 * - Error recovery
 */
export const EditorPhaseTwoPro: React.FC<EditorPhaseTwoProProps> = ({
  className = '',
  funnelId = 'quiz-style-21-steps',
  quizId,
  enableSupabase = true,
  debugMode = false,
  stepNumber = 1
}) => {
  console.log('🎯 EditorPhaseTwoPro: Iniciando com correções críticas', {
    funnelId,
    enableSupabase,
    stepNumber,
    debugMode
  });

  return (
    <ErrorBoundary
      fallbackComponent={EditorErrorFallback}
      onError={(error, errorInfo) => {
        console.error('🚨 EditorPhaseTwoPro: Erro capturado', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        });
      }}
    >
      <EditorProvider
        funnelId={funnelId}
        quizId={quizId}
        enableSupabase={enableSupabase}
        storageKey={`editor-${funnelId}-${stepNumber}`}
      >
        <div className={`editor-phase-two-pro ${className}`}>
          <Suspense fallback={<EditorLoadingFallback />}>
            <EditorLegacyPro />
          </Suspense>

          {/* Debug Panel - só visível em desenvolvimento */}
          {debugMode && process.env.NODE_ENV === 'development' && (
            <EditorDebugPanel
              funnelId={funnelId}
              enableSupabase={enableSupabase}
              stepNumber={stepNumber}
            />
          )}
        </div>
      </EditorProvider>
    </ErrorBoundary>
  );
};

// Debug Panel para desenvolvimento
const EditorDebugPanel: React.FC<{
  funnelId?: string;
  enableSupabase?: boolean;
  stepNumber?: number;
}> = ({ funnelId, enableSupabase, stepNumber }) => {
  const { state } = useUnifiedEditor();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 border border-border rounded-lg p-3 text-xs space-y-2 max-w-xs shadow-lg">
      <div className="font-semibold text-primary">🔧 Debug Panel</div>
      <div className="space-y-1 text-muted-foreground">
        <div>Funnel: {funnelId || 'N/A'}</div>
        <div>Step: {stepNumber}/{state.currentStep}</div>
        <div>Supabase: {enableSupabase ? '✅' : '❌'}</div>
        <div>Mode: {state.databaseMode}</div>
        <div>Loading: {state.isLoading ? '🔄' : '✅'}</div>
        <div>Selected: {state.selectedBlockId ? '📝' : '➕'}</div>
        <div>Steps: {Object.keys(state.stepBlocks).length}</div>
      </div>
      
      {/* Indicador de status */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs">Fase 2 Ativa</span>
      </div>
    </div>
  );
};

export default EditorPhaseTwoPro;