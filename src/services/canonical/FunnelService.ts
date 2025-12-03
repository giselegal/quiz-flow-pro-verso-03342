/**
 * 🔄 BARREL EXPORT CANÔNICO - FunnelService
 * 
 * Re-exporta o FunnelService oficial de src/services/funnel/FunnelService.ts
 * para manter compatibilidade durante a migração
 * 
 * @deprecated Use @/services/funnel/FunnelService diretamente
 */

// Re-export tipos centralizados
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
