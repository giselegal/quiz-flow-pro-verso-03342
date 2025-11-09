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

        // 🔧 FIX: Validação rigorosa do projectId para evitar erro 405
        const hasValidProjectId = projectId && projectId.trim().length > 0 && projectId !== 'undefined' && projectId !== 'null';
        
        // Habilitar Lovable somente quando:
        // - Estiver rodando dentro do preview (iframe) OU
        // - Flag explícita VITE_ENABLE_LOVABLE=true
        // - E tem um projectId VÁLIDO (não vazio, não undefined, não null)
        const shouldEnableLovable = isEditor && (inIframe || enableFlag) && hasValidProjectId;

        if (shouldEnableLovable) {
          (window as any).LOVABLE_CONFIG = {
            projectId: projectId!, // Garantido como string válida pela validação acima
            apiBaseUrl: 'https://api.lovable.dev',
          };

          // Log informativo para diagnóstico
          // eslint-disable-next-line no-console
          console.info('[Lovable] ✅ Configuração ativada com projectId válido', {
            inIframe,
            enableFlag,
            projectId: projectId!.substring(0, 8) + '...', // Mostrar apenas início do ID
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
              console.info('[Lovable] ⚠️ Desativado', {
                reason: !hasValidProjectId 
                  ? 'projectId inválido/ausente' 
                  : !isEditor 
                  ? 'não está em rota de editor' 
                  : 'sem iframe e sem flag de ativação',
                hasValidProjectId,
                isEditor,
                inIframe,
                enableFlag
              });
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
