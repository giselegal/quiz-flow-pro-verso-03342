/**
 * 🎯 FASE 1: PREVIEW SANDBOX PAGE
 * 
 * Página isolada que roda dentro do iframe
 * Apenas renderiza, não edita
 */

import { useEffect, useState } from 'react';
import { QuizRuntimeContainer } from '@/core/runtime/quiz/QuizRuntimeContainer';
import type { PreviewMessage } from '@/components/editor/preview/IsolatedPreviewIframe';

export default function PreviewSandbox() {
  const [quizContent, setQuizContent] = useState<any>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);

  /**
   * Enviar mensagem para o parent (editor)
   */
  const sendMessage = (message: PreviewMessage) => {
    window.parent.postMessage(
      {
        source: 'quiz-preview',
        ...message,
      },
      window.location.origin,
    );
  };

  /**
   * Listener para mensagens do editor
   */
  useEffect(() => {
    try {
      const origErr = console.error;
      const origWarn = console.warn;
      console.error = (...args: any[]) => {
        const s = args.map(a => (typeof a === 'string' ? a : '')).join(' ');
        if (s.includes('net::ERR_ABORTED')) return;
        origErr(...args);
      };
      console.warn = (...args: any[]) => {
        const s = args.map(a => (typeof a === 'string' ? a : '')).join(' ');
        if (s.includes('net::ERR_ABORTED')) return;
        origWarn(...args);
      };
      const handler = (e: ErrorEvent) => {
        const msg = String(e.message || '');
        if (msg.includes('net::ERR_ABORTED')) {
          e.preventDefault?.();
          return false;
        }
        return undefined;
      };
      window.addEventListener('error', handler);
    } catch {}
    const handleMessage = (event: MessageEvent) => {
      // Validar origem
      if (event.origin !== window.location.origin) return;

      const { source, type, payload } = event.data;

      // Validar que veio do editor
      if (source !== 'quiz-editor') return;

      try {
        switch (type) {
          case 'INIT':
            setQuizContent(payload.quizContent);
            setCurrentStepId(payload.currentStepId || null);
            break;

          case 'UPDATE':
            setQuizContent(payload.quizContent);
            if (payload.currentStepId) {
              setCurrentStepId(payload.currentStepId);
            }
            break;

          case 'NAVIGATE':
            setCurrentStepId(payload.stepId);
            break;
          case 'THEME':
            try {
              const d = !!payload?.dark;
              document.documentElement.classList.toggle('dark', d);
            } catch {}
            break;
        }
      } catch (error) {
        sendMessage({
          type: 'ERROR',
          payload: {
            message: error instanceof Error ? error.message : 'Erro desconhecido',
          },
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Notificar que está pronto
    sendMessage({ type: 'READY' });

    return () => {
      try { window.removeEventListener('message', handleMessage); } catch {}
    };
  }, []);

  /**
   * Callback quando step mudar no runtime
   */
  const handleStepChange = (stepId: string) => {
    setCurrentStepId(stepId);
    sendMessage({
      type: 'STEP_CHANGE',
      payload: { stepId },
    });
  };

  if (!quizContent) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">
            Aguardando conteúdo...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto">
      <QuizRuntimeContainer
        quizContent={quizContent}
        initialStepId={currentStepId || undefined}
        onStepChange={handleStepChange}
      />
    </div>
  );
}
