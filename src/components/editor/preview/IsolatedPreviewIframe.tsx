/**
 * 🎯 FASE 1: ISOLATED PREVIEW IFRAME
 * 
 * Preview 100% isolado usando iframe + postMessage
 * Previne state leakage entre Editor e Runtime
 */

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useSafeEventListener } from '@/hooks/useSafeEventListener';
import { Loader2 } from 'lucide-react';

export interface PreviewMessage {
  type:
    | 'INIT'
    | 'UPDATE'
    | 'NAVIGATE'
    | 'ERROR'
    | 'READY'
    | 'THEME'
    | 'STEP_CHANGE'
    | 'BLOCK_SELECT'
    | 'HEIGHT';
  payload?: any;
}

export interface IsolatedPreviewIframeProps {
  quizContent: {
    steps: any[];
    metadata: Record<string, any>;
  };
  currentStepId?: string;
  onStepChange?: (stepId: string) => void;
  onBlockSelect?: (blockId: string) => void;
  className?: string;
  darkMode?: boolean;
}

/**
 * Preview isolado em iframe
 * 
 * Comunicação bidirecional via postMessage:
 * - Editor → Preview: Envia conteúdo atualizado
 * - Preview → Editor: Notifica mudanças de step
 */
export const IsolatedPreviewIframe = memo<IsolatedPreviewIframeProps>(({ 
  quizContent,
  currentStepId,
  onStepChange,
  onBlockSelect,
  className = '',
  darkMode,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frameHeight, setFrameHeight] = useState<number | undefined>(undefined);

  /**
   * Enviar mensagem para o iframe
   */
  const sendMessage = (message: PreviewMessage) => {
    if (!iframeRef.current?.contentWindow) return;

    iframeRef.current.contentWindow.postMessage(
      {
        source: 'quiz-editor',
        ...message,
      },
      window.location.origin,
    );
  };

  /**
   * Listener para mensagens do iframe
   */
  const handleMessage = useCallback((event: MessageEvent) => {
      // Validar origem
      if (event.origin !== window.location.origin) return;

      const { source, type, payload } = event.data;

      // Validar que veio do preview
      if (source !== 'quiz-preview') return;

      switch (type) {
        case 'READY':
        case 'INIT':
          setIsLoading(false);
          sendMessage({
            type: 'INIT',
            payload: { quizContent, currentStepId },
          });
          break;

        case 'STEP_CHANGE':
          onStepChange?.(payload.stepId);
          break;

        case 'BLOCK_SELECT':
          if (payload?.blockId) {
            onBlockSelect?.(payload.blockId);
          }
          break;

        case 'ERROR':
          setError(payload.message);
          break;
        case 'HEIGHT':
          try {
            const h = Number(payload?.height) || 0;
            if (h > 0) {
              setFrameHeight(h);
            }
          } catch {}
          break;
      }
  }, [quizContent, currentStepId, onStepChange, onBlockSelect]);

  useSafeEventListener('message', handleMessage);

  /**
   * Atualizar conteúdo quando mudar
   */
  useEffect(() => {
    if (isLoading) return;

    sendMessage({
      type: 'UPDATE',
      payload: { quizContent, currentStepId },
    });
  }, [quizContent, currentStepId, isLoading]);

  /**
   * Navegar para step específico
   */
  useEffect(() => {
    if (isLoading || !currentStepId) return;

    sendMessage({
      type: 'NAVIGATE',
      payload: { stepId: currentStepId },
    });
  }, [currentStepId, isLoading]);

  /**
   * Handler para load do iframe
   */
  const handleIframeLoad = () => {
    sendMessage({
      type: 'INIT',
      payload: { quizContent, currentStepId },
    });
  };

  /**
   * Handler para erro do iframe
   */
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Falha ao carregar preview');
  };

  useEffect(() => {
    if (typeof darkMode === 'boolean') {
      sendMessage({ type: 'THEME', payload: { dark: darkMode } });
    }
  }, [darkMode]);

  useEffect(() => {
    if (!isLoading) return;
    const t = setTimeout(() => {
      sendMessage({ type: 'INIT', payload: { quizContent, currentStepId } });
    }, 800);
    return () => clearTimeout(t);
  }, [isLoading, quizContent, currentStepId]);

  return (
    <div className={`relative w-full ${className}`} style={frameHeight ? { height: `${frameHeight}px` } : undefined}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando preview...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-destructive/10 z-10 flex items-center justify-center">
          <div className="bg-background border border-destructive rounded-lg p-6 max-w-md">
            <h3 className="font-semibold text-destructive mb-2">Erro no Preview</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                iframeRef.current?.contentWindow?.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Iframe isolado */}
      <iframe
        ref={iframeRef}
        src="/preview-sandbox" // Rota dedicada para o preview isolado
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="Quiz Preview"
      />
    </div>
  );
});

IsolatedPreviewIframe.displayName = 'IsolatedPreviewIframe';
