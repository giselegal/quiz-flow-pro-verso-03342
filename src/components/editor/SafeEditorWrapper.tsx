/**
 * 🛡️ SAFE EDITOR WRAPPER - Wrapper Seguro para o Editor
 * 
 * Componente que evita problemas de contexto usando renderização condicional
 * e fallbacks seguros para todos os hooks.
 */

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { EditorProvider } from './EditorProvider';
import { PureBuilderProvider } from './PureBuilderProvider';
import { CRUDIntegrationProvider } from './unified/UnifiedCRUDIntegration';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { UnifiedCRUDProvider } from '@/context/UnifiedCRUDProvider';
import EditorFallback from '@/components/error/EditorFallback';

interface SafeEditorWrapperProps {
  children: React.ReactNode;
  funnelId?: string;
  templateId?: string;
  enableDebug?: boolean;
}

// Componente que renderiza apenas se os contextos estiverem prontos
const SafeEditorContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [contextError, setContextError] = useState<Error | null>(null);

  useEffect(() => {
    const checkContexts = () => {
      try {
        // Verificar se estamos no cliente
        if (typeof window === 'undefined') {
          return false;
        }

        // Verificar se React está disponível
        if (!React || !React.createContext) {
          throw new Error('React context não disponível');
        }

        // Verificar se não há erros de contexto globais
        const globalErrors = (window as any).__EDITOR_CONTEXT_ERROR__;
        if (globalErrors && globalErrors.length > 0) {
          console.warn('⚠️ Erros de contexto detectados:', globalErrors);
          // Não falhar, apenas avisar
        }

        return true;
      } catch (error) {
        console.error('❌ Erro ao verificar contextos:', error);
        setContextError(error as Error);
        return false;
      }
    };

    const initialize = async () => {
      try {
        // Aguardar um pouco para garantir que o DOM está pronto
        await new Promise(resolve => setTimeout(resolve, 100));

        if (checkContexts()) {
          setIsReady(true);
          setContextError(null);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar:', error);
        setContextError(error as Error);
      }
    };

    initialize();
  }, []);

  // Se há erro de contexto, mostrar fallback
  if (contextError) {
    return (
      <EditorFallback 
        error={contextError}
        onRetry={() => {
          setContextError(null);
          setIsReady(false);
          window.location.reload();
        }}
        onGoHome={() => window.location.href = '/'}
      />
    );
  }

  // Se contextos não estão prontos, mostrar loading
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando editor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function SafeEditorWrapper({
  children,
  funnelId,
  templateId,
  enableDebug = false
}: SafeEditorWrapperProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Error boundary interno
  const handleError = (error: Error) => {
    console.error('❌ Erro no SafeEditorWrapper:', error);
    setError(error);
    setHasError(true);
  };

  // Se há erro, mostrar fallback
  if (hasError && error) {
    return (
      <EditorFallback 
        error={error}
        onRetry={() => {
          setHasError(false);
          setError(null);
          window.location.reload();
        }}
        onGoHome={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div onError={handleError}>
      <SafeEditorContent>
        <FunnelMasterProvider
          funnelId={funnelId}
          debugMode={enableDebug}
          enableCache={true}
        >
          <UnifiedCRUDProvider
            funnelId={funnelId}
            autoLoad={true}
            debug={enableDebug}
          >
            <CRUDIntegrationProvider
              initialFunnelId={funnelId}
              enableAutoSave={true}
            >
              <PureBuilderProvider
                funnelId={funnelId || 'quiz21StepsComplete'}
                enableSupabase={false}
              >
                <EditorProvider
                  funnelId={funnelId}
                  initial={{
                    currentStep: 1,
                    totalSteps: 21,
                    isLoading: false,
                    isDirty: false
                  }}
                >
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando editor...</p>
                      </div>
                    </div>
                  }>
                    {children}
                  </Suspense>
                </EditorProvider>
              </PureBuilderProvider>
            </CRUDIntegrationProvider>
          </UnifiedCRUDProvider>
        </FunnelMasterProvider>
      </SafeEditorContent>
    </div>
  );
}
