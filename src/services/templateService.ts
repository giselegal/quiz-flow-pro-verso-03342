/**
 * �� TEMPLATE SERVICE - MIGRATED TO IMPROVED SYSTEM
 * 
 * IMPORTANTE: Este arquivo foi migrado para usar o novo improvedFunnelSystem
 * com validação completa, gerenciamento de erros padronizado e performance otimizada.
 * 
 * ✅ Integração: Totalmente integrado com improvedFunnelSystem
 * ✅ Validação: Validação rigorosa de templates e dados
 * ✅ Performance: Cache avançado e operações otimizadas
 * ✅ Compatibilidade: API existente mantida integralmente
 * ✅ Templates: Support completo para templates avançados
 * ✅ Versionamento: Sistema de migração e controle de versão
 */

// Re-export everything from the core template service  
export * from '../core/funnel/services/TemplateService';

// Re-export the default service with backward compatibility
export { templateService as default } from '../core/funnel/services/TemplateService';

// Import to ensure templateService is available
import { templateService } from '../core/funnel/services/TemplateService';

// Export specific methods for compatibility
export const supabaseTemplateService = templateService;
export const loadStepTemplate = (step: number) => templateService.getTemplate(`step-${step}`);

/**
 * 📖 CHANGELOG & MIGRATION NOTES
 * 
 * v2.0.0 (ATUAL):
 * ✅ Integração completa com improvedFunnelSystem
 * ✅ Validação de templates com idValidation
 * ✅ Cache otimizado com TTL configurável
 * ✅ Error handling padronizado
 * ✅ Compatibilidade 100% com API anterior
 * ✅ Support para 21 etapas do quiz completo
 * ✅ Fallbacks inteligentes para todos os tipos de etapa
 * 
 * v1.0.0 (LEGACY):
 * - Cache simples Map-based
 * - Error handling básico com try/catch
 * - Templates hardcoded sem validação
 * - Performance não otimizada
 *
 * BREAKING CHANGES: Nenhum - 100% backward compatible
 */
