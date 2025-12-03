/**
 * 🎯 BARREL EXPORT PARA FUNNEL SERVICE (CANÔNICO)
 * 
 * Exporta a implementação canônica consolidada e sua instância única.
 */

export { CanonicalFunnelService, canonicalFunnelService as funnelService } from '../funnel/CanonicalFunnelService';

// Re-export tipos da implementação original
export type { Funnel, LoadFunnelResult, SaveFunnelResult } from '../funnel/FunnelService';

// Re-export tipos de funnel
export type {
  FunnelMetadata,
  CreateFunnelInput,
  UpdateFunnelInput,
  ComponentInstance,
  FunnelWithComponents,
  UnifiedFunnelData,
} from '@/types/funnel';
