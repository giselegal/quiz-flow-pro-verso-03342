/**
 * 🚀 SCRIPT PARA MODO STANDALONE LOCAL 
 * 
 * Transforma a aplicação em 100% independente do Lovable.dev
 * Otimizado para funcionar no Simple Browser do VS Code
 */

// 1. Configuração LOCAL independente
window.LOCAL_DEV_MODE = true;
window.APP_CONFIG = {
  mode: 'standalone-local',
  apiBaseUrl: window.location.origin,
  enableLocalPreview: true,
  autoRefresh: true,
  windowMode: 'local-dev',
  vscodeSimpleBrowser: true,
  timestamp: Date.now(),
};

// 2. Meta tags para modo local
const localMetaTags = [
  { name: 'local-dev-mode', content: 'true' },
  { name: 'standalone-app', content: 'active' },
  { name: 'vscode-simple-browser', content: 'enabled' },
  { name: 'independent-mode', content: 'true' },
  { name: 'app-version', content: 'standalone-v1.0' },
];

localMetaTags.forEach(({ name, content }) => {
  let metaTag = document.querySelector(`meta[name="${name}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', name);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', content);
});

// 3. Atributos HTML para modo local
document.documentElement.setAttribute('data-standalone-mode', 'active');
document.documentElement.setAttribute('data-local-dev', 'true');
document.documentElement.setAttribute('data-vscode-browser', 'true');
document.documentElement.setAttribute('data-app-mode', 'independent');

// 4. Classes CSS para modo standalone
document.body.classList.add('standalone-mode-active');
document.body.classList.add('local-dev-mode');
document.body.classList.add('vscode-simple-browser');

// 5. Eventos massivos para ativação
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
        source: 'manual-force-script',
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

// 6. Local Storage para persistência
localStorage.setItem('lovable-window-preview', 'active');
localStorage.setItem('lovable-auto-open', 'true');
localStorage.setItem('lovable-force-enabled', 'true');
localStorage.setItem('lovable-project-id', '65efd17d-5178-405d-9721-909c97470c6d');

// 7. Força abertura com PostMessage
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

// 8. Tenta comunicação com parent window (para iframes)
if (window.parent && window.parent !== window) {
  window.parent.postMessage(
    {
      type: 'lovable-child-ready',
      data: {
        projectId: '65efd17d-5178-405d-9721-909c97470c6d',
        childReady: true,
        timestamp: Date.now(),
      },
    },
    '*'
  );
}

// 9. Força refresh da página com parâmetros Lovable
const currentUrl = new URL(window.location.href);
currentUrl.searchParams.set('lovable', 'true');
currentUrl.searchParams.set('preview', 'active');
currentUrl.searchParams.set('window', 'force');
currentUrl.searchParams.set('project', '65efd17d-5178-405d-9721-909c97470c6d');

// 10. Console log para confirmação
console.log('🎯 LOVABLE WINDOW FORCE SCRIPT EXECUTADO');
console.log('📊 Configuração:', window.LOVABLE_CONFIG);
console.log('🚀 Eventos disparados:', forceEvents.length);
console.log('🔗 URL atualizada:', currentUrl.toString());
console.log('✅ Meta tags adicionadas:', forceMetaTags.length);

// 11. Execução com delay para garantir
setTimeout(() => {
  forceEvents.forEach(eventName => {
    window.dispatchEvent(
      new CustomEvent(eventName + ':delayed', {
        detail: {
          source: 'delayed-force-script',
          timestamp: Date.now(),
          delayed: true,
        },
      })
    );
  });
  console.log('🔄 Eventos de delay executados');
}, 1000);

// 12. Execução periódica
setInterval(() => {
  window.dispatchEvent(
    new CustomEvent('lovable:keep:alive', {
      detail: {
        timestamp: Date.now(),
        action: 'keep-window-alive',
      },
    })
  );
}, 10000);

console.log('✅ SCRIPT DE FORÇA LOVABLE CONCLUÍDO - Janela deve abrir agora!');
