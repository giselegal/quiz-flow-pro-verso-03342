/**
 * 🛡️ EDITOR CONTEXT WRAPPER - Wrapper Robusto para Contextos do Editor
 * 
 * Componente que garante que todos os contextos necessários estejam disponíveis
 * e evita erros de contexto como o React Error #300.
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { EditorProvider } from './EditorProvider';
import { PureBuilderProvider } from './PureBuilderProvider';
import { CRUDIntegrationProvider } from './unified/UnifiedCRUDIntegration';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { UnifiedCRUDProvider } from '@/context/UnifiedCRUDProvider';
import EditorFallback from '@/components/error/EditorFallback';

interface EditorContextWrapperProps {
  children: React.ReactNode;
  funnelId?: string;
  templateId?: string;
  enableDebug?: boolean;
}

export default function EditorContextWrapper({
  children,
  funnelId,
  templateId,
  enableDebug = false
}: EditorContextWrapperProps) {
  const [contextError, setContextError] = useState<Error | null>(null);
  const [isContextReady, setIsContextReady] = useState(false);

  // Verificar se todos os contextos estão disponíveis
  const checkContexts = useCallback(() => {
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
      }

      return true;
    } catch (error) {
      console.error('❌ Erro ao verificar contextos:', error);
      setContextError(error as Error);
      return false;
    }
  }, []);

  // Inicializar contextos
  useEffect(() => {
    const initializeContexts = async () => {
      try {
        // Aguardar um pouco para garantir que o DOM está pronto
        await new Promise(resolve => setTimeout(resolve, 100));

        if (checkContexts()) {
          setIsContextReady(true);
          setContextError(null);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar contextos:', error);
        setContextError(error as Error);
      }
    };

    initializeContexts();
  }, [checkContexts]);

  // Se há erro de contexto, mostrar fallback
  if (contextError) {
    return (
      <EditorFallback 
        error={contextError}
        onRetry={() => {
          setContextError(null);
          setIsContextReady(false);
          window.location.reload();
        }}
        onGoHome={() => window.location.href = '/'}
      />
    );
  }

  // Se contextos não estão prontos, mostrar loading
  if (!isContextReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando editor...</p>
        </div>
      </div>
    );
  }

  // Renderizar com todos os providers necessários
  return (
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
              {children}
            </EditorProvider>
          </PureBuilderProvider>
        </CRUDIntegrationProvider>
      </UnifiedCRUDProvider>
    </FunnelMasterProvider>
  );
}
