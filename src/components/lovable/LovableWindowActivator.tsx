import React, { useEffect } from 'react';

/**
 * 🎯 COMPONENTE PARA FORÇAR ATIVAÇÃO DA JANELA LOVABLE
 *
 * Este componente força especificamente a abertura e ativação
 * da janela de preview do Lovable
 */
// Flags de ambiente (Vite)
const DEV = import.meta.env?.DEV;
const PROD = import.meta.env?.PROD;
const DEBUG = import.meta.env?.VITE_DEBUG_LOVABLE === 'true';
const ENABLED_FLAG = import.meta.env?.VITE_ENABLE_LOVABLE_WINDOW === 'true';
const DISABLED_FLAG = import.meta.env?.VITE_DISABLE_LOVABLE_WINDOW === 'true';

// Só ativa fora do /editor, fora de DEV e quando explicitamente habilitado
const shouldActivateLovable = (): boolean => {
  if (DISABLED_FLAG) return false;
  if (DEV && !ENABLED_FLAG) return false; // Em dev, precisa habilitar manualmente
  try {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (/^\/?editor(\b|\/)/.test(path)) return false; // Não ativar no editor
  } catch {}
  return ENABLED_FLAG || (!!PROD && !DEV);
};

export const LovableWindowActivator: React.FC = () => {
  useEffect(() => {
    // Função para ativar a janela do Lovable
    const activateLovableWindow = () => {
      if (typeof window !== 'undefined' && shouldActivateLovable()) {
        // 1. Configuração específica para janela do Lovable
        (window as any).LOVABLE_WINDOW_CONFIG = {
          projectId: '65efd17d-5178-405d-9721-909c97470c6d',
          apiBaseUrl: 'https://api.lovable.dev',
          windowMode: 'preview',
          autoOpen: true,
          forceActivation: true,
          timestamp: Date.now(),
        };

        // 2. Meta tags específicas para janela
        const windowMetaTags = [
          { name: 'lovable-window-preview', content: 'active' },
          { name: 'lovable-auto-open', content: 'true' },
          { name: 'lovable-force-window', content: 'enabled' },
          { name: 'lovable-preview-mode', content: 'window' },
        ];

        windowMetaTags.forEach(({ name, content }) => {
          let metaTag = document.querySelector(`meta[name="${name}"]`);
          if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', name);
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute('content', content);
        });

        // 3. Atributos específicos no HTML
        document.documentElement.setAttribute('data-lovable-window', 'active');
        document.documentElement.setAttribute('data-lovable-preview-window', 'open');
        document.documentElement.setAttribute('data-lovable-force-open', 'true');

        // 4. Classes CSS para detecção
        document.body.classList.add('lovable-window-active');
        document.body.classList.add('lovable-preview-window-open');
        document.body.classList.add('lovable-force-activation');

        // 5. Eventos específicos para janela
        const windowEvents = [
          'lovable:window:open',
          'lovable:window:activate',
          'lovable:preview:window:show',
          'lovable:force:window:open',
          'lovable:window:preview:start',
        ];

        windowEvents.forEach(eventName => {
          window.dispatchEvent(
            new CustomEvent(eventName, {
              detail: {
                source: 'quiz-quest-window-activator',
                timestamp: Date.now(),
                action: 'force-open-window',
                projectId: '65efd17d-5178-405d-9721-909c97470c6d',
              },
            })
          );
        });

        // 6. Variáveis globais específicas
        (window as any).LOVABLE_WINDOW_ACTIVE = true;
        (window as any).LOVABLE_PREVIEW_WINDOW_OPEN = true;
        (window as any).LOVABLE_FORCE_WINDOW = true;

        // 7. Local Storage para persistência
        localStorage.setItem('lovable-window-preview', 'active');
        localStorage.setItem('lovable-auto-open', 'true');
        localStorage.setItem('lovable-last-activation', Date.now().toString());

        // 8. Força abertura com menor impacto no main thread
        const dispatchImmediateOpen = () => {
          window.dispatchEvent(
            new CustomEvent('lovable:force:window:now', {
              detail: {
                forced: true,
                timestamp: Date.now(),
                action: 'immediate-open',
              },
            })
          );
        };
        if (typeof (window as any).requestIdleCallback === 'function') {
          (window as any).requestIdleCallback(dispatchImmediateOpen, { timeout: 250 });
        } else {
          setTimeout(dispatchImmediateOpen, 150);
        }

        // 9. Adiciona listener para mensagens do Lovable
        // Throttling para evitar spam de 'message' handler
        let lastHandled = 0;
        const MIN_INTERVAL_MS = 1000; // 1s
        const handleLovableMessage = (event: MessageEvent) => {
          if (event?.data?.type !== 'lovable-preview-request') return;
          const now = Date.now();
          if (now - lastHandled < MIN_INTERVAL_MS) return;
          lastHandled = now;
          window.postMessage(
            {
              type: 'lovable-preview-response',
              data: {
                projectId: '65efd17d-5178-405d-9721-909c97470c6d',
                status: 'active',
                windowMode: 'preview',
                timestamp: now,
              },
            },
            '*'
          );
        };

        window.addEventListener('message', handleLovableMessage);

        // 10. Console log para debug
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.log('🎯 Lovable Window Activator - ATIVO');
          // eslint-disable-next-line no-console
          console.log('📊 Config:', (window as any).LOVABLE_WINDOW_CONFIG);
          // eslint-disable-next-line no-console
          console.log('🚀 Eventos disparados:', windowEvents.length);
        }

        // Cleanup
        return () => {
          windowMetaTags.forEach(({ name }) => {
            const existingMeta = document.querySelector(`meta[name="${name}"]`);
            if (existingMeta) {
              existingMeta.remove();
            }
          });

          document.documentElement.removeAttribute('data-lovable-window');
          document.documentElement.removeAttribute('data-lovable-preview-window');
          document.documentElement.removeAttribute('data-lovable-force-open');

          document.body.classList.remove('lovable-window-active');
          document.body.classList.remove('lovable-preview-window-open');
          document.body.classList.remove('lovable-force-activation');

          window.removeEventListener('message', handleLovableMessage);

          delete (window as any).LOVABLE_WINDOW_ACTIVE;
          delete (window as any).LOVABLE_PREVIEW_WINDOW_OPEN;
          delete (window as any).LOVABLE_FORCE_WINDOW;
        };
      }
    };

    // Ativa imediatamente (apenas quando permitido)
    const cleanup = activateLovableWindow();

    // Força reativação com menor frequência e respeitando visibilidade
    const REACTIVATE_MS = Number(import.meta.env?.VITE_LOVABLE_REACTIVATE_MS) || 30000;
    const interval = setInterval(() => {
      if (typeof window === 'undefined') return;
      if (document.visibilityState !== 'visible') return;
      if (!shouldActivateLovable()) return;
      window.dispatchEvent(
        new CustomEvent('lovable:window:reactivate', {
          detail: {
            timestamp: Date.now(),
            action: 'periodic-reactivation',
          },
        })
      );
    }, REACTIVATE_MS);

    return () => {
      cleanup?.();
      clearInterval(interval);
    };
  }, []);

  // Só mostrar indicador visual em modo debug
  return DEBUG ? (
    <div
      className="lovable-window-activator"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '2px',
        height: '100vh',
        background: 'linear-gradient(180deg, #10b981, #3b82f6, #8b5cf6)',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.9,
      }}
    />
  ) : null;
};

export default LovableWindowActivator;
