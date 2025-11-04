/**
 * 🔄 REDIRECT: FunnelConfigPersistenceService → FunnelService (canonical)
 * 
 * @deprecated Use @/services/canonical/FunnelService
 */

export * from '@/services/deprecated/FunnelConfigPersistenceService';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] FunnelConfigPersistenceService → use @/services/canonical/FunnelService');
}
