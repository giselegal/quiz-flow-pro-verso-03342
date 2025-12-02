/**
 * 🔄 TIPOS CANONICOS PARA MIGRAÇÃO
 * 
 * Re-exporta tipos dos serviços legados para manter compatibilidade
 * durante a migração gradual
 * 
 * @deprecated Estes tipos serão removidos na v5.0
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

// Export da classe também (para testes)
import { CanonicalFunnelService } from '../legacy/FunnelService.canonical.legacy';
export { CanonicalFunnelService };

// Export da instância singleton
const canonicalInstance = CanonicalFunnelService.getInstance();
export { canonicalInstance as funnelService };
