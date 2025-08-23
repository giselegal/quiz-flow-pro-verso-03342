import React from 'react';

/**
 * 🎯 BOTÃO PARA FORÇAR ABERTURA DA JANELA LOVABLE
 */
export const LovableWindowButton: React.FC = () => {
  const forceOpenLovableWindow = () => {
    // Executa o mesmo script de força
    if (typeof window !== 'undefined') {
      // Configuração global forçada
      (window as any).LOVABLE_FORCE_WINDOW = true;
      (window as any).LOVABLE_CONFIG = {
        projectId: '65efd17d-5178-405d-9721-909c97470c6d',
        apiBaseUrl: 'https://api.lovable.dev',
        previewMode: true,
        enableLivePreview: true,
        autoRefresh: true,
        windowMode: 'preview',
        forceOpen: true,
        timestamp: Date.now(),
      };

      // Meta tags forçadas
      const forceMetaTags = [
        { name: 'lovable-preview-enabled', content: 'true' },
        { name: 'lovable-window-preview', content: 'active' },
        { name: 'lovable-auto-open', content: 'true' },
        { name: 'lovable-force-window', content: 'enabled' },
        { name: 'lovable-project-id', content: '65efd17d-5178-405d-9721-909c97470c6d' },
      ];

      forceMetaTags.forEach(({ name, content }) => {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      });

      // Eventos massivos
      const forceEvents = [
        'lovable:preview:activate',
        'lovable:window:open',
        'lovable:force:open',
        'lovable:preview:show',
        'lovable:editor:active',
        'lovable:window:activate',
        'lovable:preview:window:show',
        'lovable:force:window:open',
        'lovable:auto:open',
        'lovable:immediate:show',
      ];

      forceEvents.forEach(eventName => {
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              source: 'button-force',
              timestamp: Date.now(),
              action: 'force-open-window',
              projectId: '65efd17d-5178-405d-9721-909c97470c6d',
              forced: true,
            },
            bubbles: true,
            cancelable: false,
          })
        );
      });

      // Força com PostMessage
      window.postMessage(
        {
          type: 'lovable-force-open',
          data: {
            projectId: '65efd17d-5178-405d-9721-909c97470c6d',
            action: 'open-preview-window',
            timestamp: Date.now(),
            forced: true,
          },
        },
        '*'
      );

      console.log('🎯 BOTÃO LOVABLE ACIONADO - Janela deve abrir!');
    }
  };

  return (
    <button
      onClick={forceOpenLovableWindow}
      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
      title="Clique para forçar abertura da janela Lovable"
    >
      🚀 Abrir Janela Lovable
    </button>
  );
};

export default LovableWindowButton;
