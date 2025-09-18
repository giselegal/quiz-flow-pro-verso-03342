import { useEffect } from 'react';

/**
 * 🎯 HOOK PARA ATIVAR PREVIEW NO LOVABLE
 *
 * Hook que força a ativação do painel de preview do Lovable
 * e configura o ambiente para visualização em tempo real
 */
export const useLovablePreview = () => {
  useEffect(() => {
    // Força configuração global do Lovable
    if (typeof window !== 'undefined') {
      // Configuração avançada do Lovable
      const lovableConfig = {
        projectId: '65efd17d-5178-405d-9721-909c97470c6d',
        apiBaseUrl: 'https://api.lovable.dev',
        previewMode: true,
        enableLivePreview: true,
        autoRefresh: true,
        debugMode: true,
      };

      (window as any).LOVABLE_CONFIG = lovableConfig;
      (window as any).LOVABLE_PREVIEW_ACTIVE = true;

      // Adiciona classes CSS específicas
      document.documentElement.setAttribute('data-lovable-preview', 'active');
      document.documentElement.setAttribute('data-editor-mode', 'live-preview');

      // Eventos customizados para comunicação com Lovable
      const events = [
        'lovable:preview:activate',
        'lovable:preview:ready',
        'lovable:editor:active',
        'lovable:live-preview:enable',
      ];

      events.forEach(eventName => {
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              source: 'quiz-quest-main-editor',
              timestamp: Date.now(),
              config: lovableConfig,
            },
          })
        );
      });

      // Adiciona meta tags para detecção
      const metaTags = [
        { name: 'lovable-preview-enabled', content: 'true' },
        { name: 'lovable-live-preview', content: 'active' },
        { name: 'lovable-editor-mode', content: 'quiz-quest' },
      ];

      metaTags.forEach(({ name, content }) => {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      });

      // Força refresh do preview se necessário
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('lovable:preview:refresh', {
            detail: {
              forced: true,
              timestamp: Date.now(),
            },
          })
        );
      }, 500);

      // Cleanup
      return () => {
        document.documentElement.removeAttribute('data-lovable-preview');
        document.documentElement.removeAttribute('data-editor-mode');

        metaTags.forEach(({ name }) => {
          const existingMeta = document.querySelector(`meta[name="${name}"]`);
          if (existingMeta) {
            existingMeta.remove();
          }
        });

        delete (window as any).LOVABLE_PREVIEW_ACTIVE;
      };
    }
  }, []);

  return {
    isPreviewActive: true,
    previewMode: 'live-preview',
  };
};

export default useLovablePreview;
