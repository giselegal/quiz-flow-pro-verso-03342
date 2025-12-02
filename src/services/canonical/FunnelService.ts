/**
 * 🔄 TIPOS CANONICOS PARA MIGRAÇÃO
 * 
 * Re-exporta tipos dos serviços legados para manter compatibilidade
 * durante a migração gradual
 * 
 * @deprecated Estes tipos serão removidos na v5.0
 */

// Re-export tipos legados
export type {
  FunnelMetadata,
  CreateFunnelInput,
  UpdateFunnelInput,
  ComponentInstance,
  FunnelWithComponents,
  UnifiedFunnelData
} from '../legacy/FunnelService.canonical.legacy';

// Export da classe também (para testes)
export { CanonicalFunnelService } from '../legacy/FunnelService.canonical.legacy';

// Export da instância singleton
const canonicalInstance = CanonicalFunnelService.getInstance();
export { canonicalInstance as funnelService };
