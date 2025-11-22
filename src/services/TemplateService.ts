/**
 * 🎯 TEMPLATE SERVICE OFICIAL
 * 
 * Service canônico para gerenciamento de templates/funis.
 * Consome os contratos oficiais definidos em src/core/quiz/templates/types.ts
 * 
 * Responsabilidades:
 * - Carregar e validar templates
 * - Cache inteligente
 * - Transformação de dados legados
 * - Integração com backend (Supabase/API)
 * 
 * @version 1.0.0
 * @status OFICIAL - Este é o service canônico
 */

import type {
  FunnelTemplate,
  FunnelMetadata,
  FunnelStep,
  TemplateValidationResult,
} from '@/core/quiz/templates/types';
import { BlockRegistry } from '@/core/quiz/blocks/registry';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Configuração do TemplateService
 */
interface TemplateServiceConfig {
  /** Habilitar cache */
  enableCache?: boolean;
  /** TTL do cache em ms */
  cacheTTL?: number;
  /** Fonte de dados primária */
  dataSource?: 'supabase' | 'local' | 'api';
  /** Fallback para templates locais */
  enableFallback?: boolean;
}

/**
 * Service oficial para templates
 */
class TemplateServiceClass {
  private cache = new Map<string, { template: FunnelTemplate; timestamp: number }>();
  private config: Required<TemplateServiceConfig>;

  constructor(config: TemplateServiceConfig = {}) {
    this.config = {
      enableCache: config.enableCache ?? true,
      cacheTTL: config.cacheTTL ?? 5 * 60 * 1000, // 5 minutos
      dataSource: config.dataSource ?? 'local',
      enableFallback: config.enableFallback ?? true,
    };
  }

  /**
   * Obter template por ID
   * ✅ Wave 2: Integrado com TemplateLoader
   */
  async getTemplate(templateId: string): Promise<FunnelTemplate | null> {
    appLogger.info(`[TemplateService] Buscando template: ${templateId}`);

    // Verificar cache
    if (this.config.enableCache) {
      const cached = this.getCached(templateId);
      if (cached) {
        appLogger.info(`[TemplateService] Template encontrado no cache: ${templateId}`);
        return cached;
      }
    }

    // ✅ Wave 2: Usar TemplateLoader
    const { TemplateLoader } = await import('@/core/quiz/templates/loader');
    const result = await TemplateLoader.loadTemplate(templateId, {
      source: this.config.dataSource,
      validate: true,
      strict: false,
    });

    if (!result.success || !result.template) {
      appLogger.error('[TemplateService] Failed to load template:', { 
        data: [result.errors] 
      });
      return this.config.enableFallback ? await this.getFallbackTemplate(templateId) : null;
    }

    // Log warnings se houver
    if (result.warnings && result.warnings.length > 0) {
      appLogger.warn('[TemplateService] Template loaded with warnings:', { 
        data: [result.warnings] 
      });
    }

    // Adicionar ao cache
    if (this.config.enableCache) {
      this.setCache(templateId, result.template);
    }

    return result.template;
  }

  /**
   * Listar todos os templates disponíveis
   * TODO Wave 2: Implementar busca paginada
   */
  async listTemplates(filters?: {
    category?: string;
    tags?: string[];
    officialOnly?: boolean;
  }): Promise<FunnelMetadata[]> {
    appLogger.info('[TemplateService] Listando templates', { data: [filters] });

    // TODO Wave 2: Implementar busca real
    // Por enquanto retorna array vazio
    return [];
  }

  /**
   * Validar template
   * ✅ Wave 2: Implementado com Zod
   */
  async validateTemplate(template: FunnelTemplate): Promise<TemplateValidationResult> {
    const { validateFunnelTemplate, validateTemplateIntegrity } = await import(
      '@/core/quiz/templates/schemas'
    );

    // Validação de schema
    const schemaValidation = validateFunnelTemplate(template);
    if (!schemaValidation.success) {
      const errors = schemaValidation.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return {
        valid: false,
        errors,
      };
    }

    // Validação de integridade
    const integrityResult = validateTemplateIntegrity(template);

    return integrityResult;
  }

  /**
   * Transformar dados legados em formato oficial
   * TODO Wave 2: Implementar transformadores específicos
   */
  transformLegacyTemplate(legacyData: any): FunnelTemplate {
    appLogger.info('[TemplateService] Transformando template legado');

    // Transformação básica - adaptar conforme necessário
    return {
      metadata: {
        id: legacyData.id || 'legacy-template',
        name: legacyData.name || 'Template Legado',
        description: legacyData.description || '',
        category: 'custom',
        tags: legacyData.tags || [],
        version: '1.0.0',
        createdAt: legacyData.created_at || new Date().toISOString(),
        updatedAt: legacyData.updated_at || new Date().toISOString(),
        isOfficial: false,
      },
      settings: {
        theme: legacyData.theme || 'default',
        navigation: {},
        scoring: {},
        integrations: {},
      },
      steps: [],
      blocksUsed: [],
    };
  }

  /**
   * Obter template de fallback local
   * TODO Wave 2: Carregar de arquivos JSON locais
   */
  private async getFallbackTemplate(templateId: string): Promise<FunnelTemplate | null> {
    appLogger.warn(`[TemplateService] Usando fallback para template: ${templateId}`);

    // Por enquanto retorna null - Wave 2 carregará JSONs locais
    return null;
  }

  /**
   * Obter do cache
   */
  private getCached(templateId: string): FunnelTemplate | null {
    const entry = this.cache.get(templateId);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.config.cacheTTL) {
      this.cache.delete(templateId);
      return null;
    }

    return entry.template;
  }

  /**
   * Adicionar ao cache
   */
  private setCache(templateId: string, template: FunnelTemplate): void {
    this.cache.set(templateId, {
      template,
      timestamp: Date.now(),
    });
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.cache.clear();
    appLogger.info('[TemplateService] Cache limpo');
  }

  /**
   * Obter estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Instância singleton do serviço
 */
export const TemplateService = new TemplateServiceClass();

/**
 * Export para compatibilidade
 */
export default TemplateService;
