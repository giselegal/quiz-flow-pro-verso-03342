/**
 * 🚀 SCRIPT PARA MODO STANDALONE LOCAL 
 * 
 * Aplicação 100% independente.
 * Otimizado para funcionar localmente.
 * 
 * Lovable integration has been REMOVED from this project.
 */

// Configuração LOCAL independente
window.LOCAL_DEV_MODE = true;
window.APP_CONFIG = {
  mode: 'standalone-local',
  apiBaseUrl: window.location.origin,
  enableLocalPreview: true,
  autoRefresh: true,
  windowMode: 'local-dev',
  timestamp: Date.now(),
};

// Meta tags para modo local
const localMetaTags = [
  { name: 'local-dev-mode', content: 'true' },
  { name: 'standalone-app', content: 'active' },
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

// Atributos HTML para modo local
document.documentElement.setAttribute('data-standalone-mode', 'active');
document.documentElement.setAttribute('data-local-dev', 'true');
document.documentElement.setAttribute('data-app-mode', 'independent');

// Classes CSS para modo standalone
document.body.classList.add('standalone-mode-active');
document.body.classList.add('local-dev-mode');

console.log('✅ Standalone mode activated (Lovable removed)');
