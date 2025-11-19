/**
 * 🎯 FASE 1: PREVIEW SANDBOX PAGE
 * 
 * Página isolada que roda dentro do iframe
 * Apenas renderiza, não edita
 */

import { useEffect, useState, useCallback } from 'react';
import { QuizRuntimeContainer } from '@/core/runtime/quiz/QuizRuntimeContainer';
import type { PreviewMessage } from '@/components/editor/preview/IsolatedPreviewIframe';
import { useSafeEventListener } from '@/hooks/useSafeEventListener';

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
    } catch {}
  }, []);

  const errorHandler = useCallback((e: ErrorEvent) => {
    const msg = String(e.message || '');
    if (msg.includes('net::ERR_ABORTED')) {
      e.preventDefault?.();
      return false;
    }
    return undefined;
  }, []);

  useSafeEventListener('error', errorHandler);

  const handleMessage = useCallback((event: MessageEvent) => {
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
  }, []);

  useSafeEventListener('message', handleMessage);

  useEffect(() => {
    sendMessage({ type: 'READY' });
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.cssText;
    const prevBody = body.style.cssText;
    html.style.cssText = `${prevHtml};overflow:hidden;`;
    body.style.cssText = `${prevBody};overflow:hidden;`;
    return () => {
      html.style.cssText = prevHtml;
      body.style.cssText = prevBody;
    };
  }, []);

  const sendHeight = useCallback(() => {
    try {
      const root = document.getElementById('preview-root') || document.body;
      const h = Math.max(root.scrollHeight, root.clientHeight, document.documentElement.scrollHeight);
      sendMessage({ type: 'HEIGHT', payload: { height: h } });
    } catch {}
  }, []);

  useEffect(() => {
    sendHeight();
  }, [quizContent, currentStepId, sendHeight]);

  useSafeEventListener('resize', () => sendHeight());

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

  const handleBlockClick = (blockId: string) => {
    try {
      sendMessage({
        type: 'BLOCK_SELECT',
        payload: { blockId },
      });
    } catch {}
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
    <div id="preview-root" className="min-h-full overflow-hidden">
      <QuizRuntimeContainer
        quizContent={quizContent}
        initialStepId={currentStepId || undefined}
        onStepChange={handleStepChange}
        onBlockClick={handleBlockClick}
      />
    </div>
  );
}
