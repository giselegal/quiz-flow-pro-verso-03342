/**
 * ⚠️ COMPATIBILITY SHIM - DO NOT USE IN NEW CODE
 * 
 * Este arquivo foi movido para deprecated/UnifiedDataService.ts
 * Mantido apenas para não quebrar imports existentes
 * 
 * @deprecated Use @/services/canonical/DataService
 */

export { UnifiedDataService } from '@/services/deprecated/UnifiedDataService';
export type {
  UnifiedFunnel,
  UnifiedFunnelPage,
  UnifiedMetrics,
  UnifiedUser,
  UnifiedAnalytics,
} from '@/services/deprecated/UnifiedDataService';
