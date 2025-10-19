/**
 * Deprecation guards for browser APIs that are being phased out.
 * - Replaces window.alert with a non-blocking notifier when inside cross-origin iframes
 * - Redirects 'unload' event listeners to 'pagehide' to avoid deprecation warnings
 */

const isPreviewHost = () => {
  try {
    return typeof location !== 'undefined' && /lovable\.app|stackblitz\.io|codesandbox\.io/.test(location.hostname);
  } catch {
    return false;
  }
};

function replaceWindowAlert() {
  try {
    const originalAlert = window.alert?.bind(window);
    const safe = (message?: any) => {
      const text = typeof message === 'string' ? message : String(message ?? '');
      // Preferir notificação no parent quando em iframe
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ __type: 'quiz:notify', level: 'info', message: text }, '*');
          return;
        }
      } catch {
        // cross-origin, continua
      }
      // Fallback: console em vez de alert bloqueante
      try { console.warn('ALERT (suprimido):', text); } catch { /* noop */ }
      // Opcional: manter compatibilidade em ambientes que precisem do alert síncrono
      if (!isPreviewHost() && !import.meta.env.DEV) {
        try { originalAlert?.(text); } catch { /* noop */ }
      }
    };
    // @ts-expect-error: override intencional para evitar depreciação em iframes
    window.alert = safe;
  } catch { /* noop */ }
}

function patchUnloadListeners() {
  try {
    const originalAdd = window.addEventListener.bind(window);
    // @ts-expect-error: sobrescrever assinatura com wrapper compatível
    window.addEventListener = (type: any, listener: any, options?: any) => {
      if (type === 'unload') {
        try { console.warn('⚠️ Redirecionando listener de "unload" para "pagehide"'); } catch {}
        return originalAdd('pagehide', listener as any, options as any);
      }
      return originalAdd(type, listener as any, options as any);
    };
  } catch { /* noop */ }
}

export function installDeprecationGuards() {
  // Aplicar sempre em dev e hosts de preview; opcional em produção
  const shouldInstall = import.meta.env.DEV || isPreviewHost();
  try {
    replaceWindowAlert();
    if (shouldInstall) {
      patchUnloadListeners();
    }
  } catch { /* noop */ }
}

export default installDeprecationGuards;
