import { appLogger } from '@/lib/utils/appLogger';
// Simple runtime helper to inspect how many step layers are on screen
// Usage in console: debugStepLayers()

declare global {
  interface Window {
    debugStepLayers?: () => void;
  }
}

export function installLayerDiagnostics() {
  if (typeof window === 'undefined') return;
  window.debugStepLayers = () => {
    try {
      const steps = Array.from(document.querySelectorAll<HTMLElement>('.step-container'));
      const byId: Record<string, HTMLElement[]> = {};
      steps.forEach(el => {
        const id = el.getAttribute('data-step-id') || 'unknown';
        byId[id] = byId[id] || [];
        byId[id].push(el);
      });

      const overlays = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter(n => {
        const s = getComputedStyle(n);
        if (!s) return false;
        const pos = s.position;
        const zi = parseInt(s.zIndex || '0', 10);
        return (pos === 'fixed' || pos === 'absolute') && zi >= 1000;
      });

      console.groupCollapsed('[LayerDiag] Snapshot de camadas de step');
      appLogger.info('Total step-containers:', { data: [steps.length] });
      appLogger.info('Por stepId:', { data: [Object.fromEntries(Object.entries(byId).map(([k,v]) => [k, v.length]))] });
      appLogger.info('Overlays (z>=1000):', { data: [overlays.length] });
      console.table(steps.map((el, i) => {
        const rect = el.getBoundingClientRect();
        return {
          idx: i,
          stepId: el.getAttribute('data-step-id'),
          name: el.getAttribute('data-step-name'),
          category: el.getAttribute('data-step-category'),
          x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height)
        };
      }));
      console.groupEnd();
    } catch (e) {
      appLogger.warn('[LayerDiag] Falha no snapshot de camadas', { data: [e] });
    }
  };

  if (import.meta?.env?.DEV) {
    appLogger.info('🧪 [LayerDiag] Comando disponível: debugStepLayers()');
  }
}

export default installLayerDiagnostics;
