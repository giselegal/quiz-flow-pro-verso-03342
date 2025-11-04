/**
 * 🔄 REDIRECT: FunnelUnifiedService → FunnelService (canonical)
 * 
 * @deprecated Use @/services/canonical/FunnelService
 * Este arquivo redireciona imports antigos para o serviço canonical
 */

export type { UnifiedFunnelData, UnifiedStage } from '@/services/UnifiedCRUDService';
export { funnelService as funnelUnifiedService } from '@/services/canonical/FunnelService';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] FunnelUnifiedService → use @/services/canonical/FunnelService');
}
