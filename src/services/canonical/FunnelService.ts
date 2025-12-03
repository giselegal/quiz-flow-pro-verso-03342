/**
 * 🔄 BARREL EXPORT CANÔNICO - FunnelService
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
export type {
  FunnelMetadata,
  CreateFunnelInput,
  UpdateFunnelInput,
  ComponentInstance,
  FunnelWithComponents,
  UnifiedFunnelData
} from '@/types/funnel';

// Export do serviço oficial
export { FunnelService as CanonicalFunnelService } from '../funnel/FunnelService';
export type { Funnel, LoadFunnelResult, SaveFunnelResult } from '../funnel/FunnelService';

// Export da instância default (compatibilidade)
import { FunnelService } from '../funnel/FunnelService';
const canonicalInstance = new FunnelService();
export { canonicalInstance as funnelService };
