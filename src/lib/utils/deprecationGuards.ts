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
    (window as any).alert = safe;
  } catch { /* noop */ }
}

function patchUnloadListeners() {
  try {
    const originalAdd = window.addEventListener.bind(window);
    const originalRemove = window.removeEventListener.bind(window);
    let warnedOnce = false;

    (window as any).addEventListener = (type: any, listener: any, options?: any) => {
      if (type === 'unload') {
        if (!warnedOnce) {
          try { console.warn('⚠️ Redirecionando listener de "unload" para "pagehide"'); } catch {}
          warnedOnce = true;
        }
        return originalAdd('pagehide', listener as any, options as any);
      }
      return originalAdd(type, listener as any, options as any);
    };

    // Redireciona remoção para manter consistência
    (window as any).removeEventListener = (type: any, listener: any, options?: any) => {
      if (type === 'unload') {
        return originalRemove('pagehide', listener as any, options as any);
      }
      return originalRemove(type, listener as any, options as any);
    };
  } catch { /* noop */ }
}

export function installDeprecationGuards() {
  // Aplicar sempre em dev e hosts de preview; opcional em produção
  const shouldInstall = import.meta.env.DEV || isPreviewHost();
  try {
    // Evita múltiplas instalações (HMR)
    if (typeof window !== 'undefined' && (window as any).__DEPRECATION_GUARDS_INSTALLED__) return;
    replaceWindowAlert();
    if (shouldInstall) {
      patchUnloadListeners();
    }
    if (typeof window !== 'undefined') {
      (window as any).__DEPRECATION_GUARDS_INSTALLED__ = true;
    }
  } catch { /* noop */ }
}

export default installDeprecationGuards;
