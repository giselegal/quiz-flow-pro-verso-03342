import React, { useEffect, useState } from 'react';

interface LovableProviderProps {
  children: React.ReactNode;
}

export function LovableClientProvider({ children }: LovableProviderProps) {
  const [isEditorMode, setIsEditorMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const inIframe = window.self !== window.top;
        const enableFlag = (import.meta as any).env?.VITE_ENABLE_LOVABLE === 'true';
        const projectId = (import.meta as any).env?.VITE_LOVABLE_PROJECT_ID as string | undefined;
        const isEditor =
          window.location.pathname.includes('/admin') ||
          window.location.pathname === '/' ||
          window.location.pathname.startsWith('/dashboard') ||
          window.location.pathname.startsWith('/editor') ||
          window.location.pathname.startsWith('/resultado/') ||
          window.location.search.includes('lovable=true');

        setIsEditorMode(isEditor);

        // Habilitar Lovable somente quando:
        // - Estiver rodando dentro do preview (iframe) OU
        // - Flag explícita VITE_ENABLE_LOVABLE=true
        const shouldEnableLovable = isEditor && (inIframe || enableFlag) && !!projectId;

        if (shouldEnableLovable) {
          (window as any).LOVABLE_CONFIG = {
            projectId,
            apiBaseUrl: 'https://api.lovable.dev',
          };

          // Log informativo para diagnóstico
          // eslint-disable-next-line no-console
          console.info('[Lovable] Configuração ativada', {
            inIframe,
            enableFlag,
            hasProjectId: !!projectId,
            path: window.location.pathname,
          });

          return () => {
            try {
              delete (window as any).LOVABLE_CONFIG;
            } catch (error) {
              console.warn('Error cleaning up Lovable config:', error);
            }
          };
        } else {
          // Garantir que não haja configuração residual em DEV local
          try {
            if ((window as any).LOVABLE_CONFIG) {
              delete (window as any).LOVABLE_CONFIG;
              // eslint-disable-next-line no-console
              console.info('[Lovable] Desativado (sem iframe/flag ou sem projectId)');
            }
          } catch { }
        }
      } catch (error) {
        console.warn('Error setting up Lovable config:', error);
        setIsEditorMode(false);
      }
    }
  }, []);

  return (
    <div
      className={isEditorMode ? 'lovable-editable-page' : ''}
      data-lovable-root={isEditorMode ? 'true' : undefined}
    >
      {children}
    </div>
  );
}
