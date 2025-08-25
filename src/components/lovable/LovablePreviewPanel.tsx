import React, { useEffect } from 'react';

interface LovablePreviewPanelProps {
  children: React.ReactNode;
}

/**
 * 🎯 COMPONENTE PARA ATIVAR PAINEL DE PREVIEW NO LOVABLE
 *
 * Este componente força a ativação do painel de preview do Lovable
 * permitindo visualização em tempo real das mudanças no editor
 */
export const LovablePreviewPanel: React.FC<LovablePreviewPanelProps> = ({ children }) => {
  useEffect(() => {
  // Carrega CSS apenas quando o painel é realmente utilizado
  import('@/styles/lovable-preview.css').catch(() => {});

    // Configura o ambiente para o Lovable detectar como editor
    if (typeof window !== 'undefined') {
      // Força configuração do Lovable
      (window as any).LOVABLE_CONFIG = {
        projectId: '65efd17d-5178-405d-9721-909c97470c6d',
        apiBaseUrl: 'https://api.lovable.dev',
        previewMode: true,
        enableLivePreview: true,
      };

      // Adiciona classe CSS para identificação do Lovable
      document.body.classList.add('lovable-editor-active');
      document.body.classList.add('lovable-preview-panel-active');

      // Força evento de detecção do Lovable
      window.dispatchEvent(
        new CustomEvent('lovable:preview:activate', {
          detail: {
            source: 'quiz-quest-editor',
            timestamp: Date.now(),
            mode: 'live-preview',
          },
        })
      );

      // Adiciona meta tag para detecção
      const metaTag = document.createElement('meta');
      metaTag.name = 'lovable-preview-enabled';
      metaTag.content = 'true';
      document.head.appendChild(metaTag);

      // Cleanup
      return () => {
        document.body.classList.remove('lovable-editor-active');
        document.body.classList.remove('lovable-preview-panel-active');

        const existingMeta = document.querySelector('meta[name="lovable-preview-enabled"]');
        if (existingMeta) {
          existingMeta.remove();
        }
      };
    }
  }, []);

  return <div className="lovable-preview-container">{children}</div>;
};

export default LovablePreviewPanel;
