/**
 * ⚠️ COMPATIBILITY SHIM - DO NOT USE IN NEW CODE
 * 
 * Este arquivo foi movido para deprecated/EnhancedUnifiedDataService.ts
 * Mantido apenas para não quebrar imports existentes
 * 
 * @deprecated Use @/services/canonical/DataService
 */

export { EnhancedUnifiedDataService } from '@/services/deprecated/EnhancedUnifiedDataService';
export type {
  RealTimeMetrics,
  EnhancedFunnelAnalytics,
  SystemHealthMetrics,
} from '@/services/deprecated/EnhancedUnifiedDataService';
