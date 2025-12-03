/**
 * 🔄 BARREL EXPORT PARA FUNNEL SERVICE
 * 
 * Re-exporta FunnelServiceCompatAdapter como FunnelService canônico
 * Mantém compatibilidade com API antiga enquanto usa nova implementação
 */

export { FunnelServiceCompatAdapter as CanonicalFunnelService } from '../adapters/FunnelServiceCompatAdapter';
export { funnelServiceCompat as funnelService } from '../adapters/FunnelServiceCompatAdapter';

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
