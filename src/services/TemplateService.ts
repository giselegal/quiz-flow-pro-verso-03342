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
   * TODO Wave 2: Integrar com Supabase/API
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

    // TODO Wave 2: Implementar carregamento de diferentes fontes
    let template: FunnelTemplate | null = null;

    switch (this.config.dataSource) {
      case 'supabase':
        // TODO Wave 2: Implementar integração com Supabase
        appLogger.warn('[TemplateService] Supabase source não implementado, usando fallback');
        template = await this.getFallbackTemplate(templateId);
        break;
      case 'api':
        // TODO Wave 2: Implementar integração com API
        appLogger.warn('[TemplateService] API source não implementado, usando fallback');
        template = await this.getFallbackTemplate(templateId);
        break;
      case 'local':
      default:
        template = await this.getFallbackTemplate(templateId);
        break;
    }

    // Adicionar ao cache
    if (template && this.config.enableCache) {
      this.setCache(templateId, template);
    }

    return template;
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
   * TODO Wave 2: Implementar validação com Zod
   */
  validateTemplate(template: FunnelTemplate): TemplateValidationResult {
    const errors: TemplateValidationResult['errors'] = [];
    const warnings: TemplateValidationResult['warnings'] = [];

    // Validações básicas
    if (!template.metadata?.id) {
      errors.push({
        path: 'metadata.id',
        message: 'ID do template é obrigatório',
        code: 'REQUIRED_FIELD',
      });
    }

    if (!template.steps || template.steps.length === 0) {
      errors.push({
        path: 'steps',
        message: 'Template deve ter pelo menos um step',
        code: 'MIN_STEPS',
      });
    }

    // Validar blocos referenciados
    const blocksUsed = new Set(template.blocksUsed || []);
    template.steps.forEach((step, idx) => {
      step.blocks.forEach((blockId) => {
        if (!blocksUsed.has(blockId)) {
          warnings!.push({
            path: `steps[${idx}].blocks`,
            message: `Bloco '${blockId}' não está na lista blocksUsed`,
          });
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
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
