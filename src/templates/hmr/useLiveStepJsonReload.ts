import { useEffect } from 'react';
import { templateService } from '@/services';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Hook que escuta eventos de HMR do Vite e força reload do step JSON
 * quando o arquivo correspondente mudar. Requer que a flag de live reload
 * esteja habilitada (localStorage['VITE_ENABLE_LIVE_JSON_RELOAD'] = 'true').
 */
export function useLiveStepJsonReload(stepId: string | undefined, templateId: string | undefined) {
  useEffect(() => {
    if (!stepId || !templateId) return;
    if (typeof window === 'undefined') return;
    const enabled = localStorage.getItem('VITE_ENABLE_LIVE_JSON_RELOAD') === 'true';
    if (!enabled) return;

    // @ts-ignore
    const hot = (import.meta as any).hot;
    if (!hot) return;

    const handler = (payload: any) => {
      try {
        const updates = payload?.updates || [];
        const targetFragment = `/templates/funnels/${templateId}/steps/${stepId}.json`;
        const touched = updates.some((u: any) => (u.path || '').includes(targetFragment));
        if (touched) {
          appLogger.info(`🔁 [LiveJSON] Arquivo modificado: ${targetFragment} → recarregando blocos`);
          // Invalida cache interno e recarrega via TemplateService
          templateService.invalidateStepCache(stepId);
          // Dispara fetch novamente (lazy load no próximo acesso)
          templateService.getStep(stepId, templateId).then(r => {
            appLogger.info(`[LiveJSON] Step ${stepId} recarregado (${r.success ? r.data.length : 0} blocos)`);
          });
        }
      } catch (e) {
        appLogger.warn('[LiveJSON] Falha ao processar update HMR', { data: [e] });
      }
    };

    hot.on('vite:beforeUpdate', handler);
    appLogger.info(`[LiveJSON] Watching HMR updates para ${templateId}/${stepId}`);
    return () => {
      try { hot.off('vite:beforeUpdate', handler); } catch { /* noop */ }
    };
  }, [stepId, templateId]);
}
