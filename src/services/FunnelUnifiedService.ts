/**
 * 🔄 REDIRECT: FunnelUnifiedService → FunnelService (canonical)
 * 
 * @deprecated Use @/services/canonical/FunnelService
 * Este arquivo redireciona imports antigos para o serviço canonical
 */

export type { UnifiedFunnel as UnifiedFunnelData, UnifiedStage } from '@/services/UnifiedCRUDService';
export { funnelService as funnelUnifiedService, funnelService as FunnelUnifiedService } from '@/services/canonical/FunnelService';
export { adaptMetadataToUnified, adaptUnifiedToMetadata } from '@/services/canonical/FunnelAdapter';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] FunnelUnifiedService → use @/services/canonical/FunnelService');
}
