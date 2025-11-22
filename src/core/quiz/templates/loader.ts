/**
 * 📦 TEMPLATE LOADER - Wave 2
 * 
 * Carregador de templates de múltiplas fontes.
 * Suporta JSON local, Supabase e APIs externas.
 * 
 * @version 1.0.0
 * @wave 2
 */

import type { FunnelTemplate } from './types';
import { validateFunnelTemplate, validateTemplateIntegrity } from './schemas';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Fonte de dados para templates
 */
export type TemplateSource = 'local' | 'supabase' | 'api';

/**
 * Opções de carregamento
 */
export interface LoadOptions {
  /** Fonte de dados */
  source?: TemplateSource;
  /** Validar após carregar */
  validate?: boolean;
  /** Lançar erro se inválido */
  strict?: boolean;
}

/**
 * Resultado de carregamento
 */
export interface LoadResult {
  success: boolean;
  template: FunnelTemplate | null;
  errors?: Array<{ path: string; message: string; code: string }>;
  warnings?: Array<{ path: string; message: string }>;
  source?: TemplateSource;
}

/**
 * Template Loader Class
 */
class TemplateLoaderClass {
  private localTemplatesCache = new Map<string, FunnelTemplate>();

  /**
   * Carregar template por ID
   */
  async loadTemplate(
    templateId: string,
    options: LoadOptions = {}
  ): Promise<LoadResult> {
    const {
      source = 'local',
      validate = true,
      strict = false,
    } = options;

    appLogger.info(`[TemplateLoader] Loading template: ${templateId} from ${source}`);

    try {
      let template: FunnelTemplate | null = null;

      switch (source) {
        case 'local':
          template = await this.loadFromLocal(templateId);
          break;
        case 'supabase':
          template = await this.loadFromSupabase(templateId);
          break;
        case 'api':
          template = await this.loadFromAPI(templateId);
          break;
      }

      if (!template) {
        return {
          success: false,
          template: null,
          errors: [
            {
              path: 'template',
              message: `Template '${templateId}' não encontrado em ${source}`,
              code: 'NOT_FOUND',
            },
          ],
          source,
        };
      }

      // Validar se solicitado
      if (validate) {
        const schemaValidation = validateFunnelTemplate(template);
        if (!schemaValidation.success) {
          const errors = schemaValidation.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code,
          }));

          if (strict) {
            return {
              success: false,
              template: null,
              errors,
              source,
            };
          } else {
            appLogger.warn('[TemplateLoader] Template validation failed (non-strict)', { data: [errors] });
          }
        }

        // Validar integridade
        const integrityResult = validateTemplateIntegrity(template);
        if (!integrityResult.valid) {
          if (strict) {
            return {
              success: false,
              template: null,
              errors: integrityResult.errors,
              warnings: integrityResult.warnings,
              source,
            };
          } else {
            appLogger.warn('[TemplateLoader] Template integrity issues (non-strict)', { 
              data: [integrityResult] 
            });
          }
        }

        return {
          success: true,
          template,
          warnings: integrityResult.warnings,
          source,
        };
      }

      return {
        success: true,
        template,
        source,
      };
    } catch (error) {
      appLogger.error(`[TemplateLoader] Error loading template ${templateId}:`, { data: [error] });
      return {
        success: false,
        template: null,
        errors: [
          {
            path: 'template',
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'LOAD_ERROR',
          },
        ],
        source,
      };
    }
  }

  /**
   * Carregar de JSON local
   * TODO: Implementar carregamento dinâmico de arquivos JSON
   */
  private async loadFromLocal(templateId: string): Promise<FunnelTemplate | null> {
    // Verificar cache primeiro
    if (this.localTemplatesCache.has(templateId)) {
      appLogger.info(`[TemplateLoader] Template found in cache: ${templateId}`);
      return this.localTemplatesCache.get(templateId)!;
    }

    // TODO: Carregar de arquivos JSON locais
    // Por enquanto, carregar template de exemplo se for o ID esperado
    if (templateId === 'example-quiz-fashion') {
      try {
        const exampleTemplate = await import('./example-funnel.json');
        const template = exampleTemplate.default as FunnelTemplate;
        this.localTemplatesCache.set(templateId, template);
        return template;
      } catch (error) {
        appLogger.error('[TemplateLoader] Failed to load example template:', { data: [error] });
        return null;
      }
    }

    appLogger.warn(`[TemplateLoader] Local template not found: ${templateId}`);
    return null;
  }

  /**
   * Carregar do Supabase
   * TODO: Implementar integração com Supabase
   */
  private async loadFromSupabase(templateId: string): Promise<FunnelTemplate | null> {
    appLogger.warn('[TemplateLoader] Supabase loading not implemented yet');
    // TODO Wave 3: Implementar
    return null;
  }

  /**
   * Carregar de API externa
   * TODO: Implementar integração com API
   */
  private async loadFromAPI(templateId: string): Promise<FunnelTemplate | null> {
    appLogger.warn('[TemplateLoader] API loading not implemented yet');
    // TODO Wave 3: Implementar
    return null;
  }

  /**
   * Listar templates disponíveis
   * TODO: Implementar listagem de múltiplas fontes
   */
  async listTemplates(source: TemplateSource = 'local'): Promise<string[]> {
    switch (source) {
      case 'local':
        // Retornar IDs conhecidos
        return ['example-quiz-fashion'];
      case 'supabase':
      case 'api':
        return [];
    }
  }

  /**
   * Limpar cache local
   */
  clearCache(): void {
    this.localTemplatesCache.clear();
    appLogger.info('[TemplateLoader] Cache cleared');
  }

  /**
   * Pre-carregar templates (warm cache)
   */
  async preloadTemplates(templateIds: string[], source: TemplateSource = 'local'): Promise<void> {
    appLogger.info(`[TemplateLoader] Preloading ${templateIds.length} templates`);
    await Promise.all(
      templateIds.map((id) =>
        this.loadTemplate(id, { source, validate: false })
      )
    );
  }
}

/**
 * Instância singleton
 */
export const TemplateLoader = new TemplateLoaderClass();

/**
 * Export para compatibilidade
 */
export default TemplateLoader;
