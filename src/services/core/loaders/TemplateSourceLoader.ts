/**
 * 🔄 TEMPLATE SOURCE LOADER
 * 
 * Responsável por carregar dados de templates de diferentes fontes.
 * Extrai lógica de carregamento do HierarchicalTemplateSource.
 * 
 * FONTES SUPORTADAS:
 * - USER_EDIT: Supabase funnels.config
 * - ADMIN_OVERRIDE: Supabase template_overrides
 * - JSON: Arquivos JSON locais (v3)
 * 
 * @version 1.0.0
 */

import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

export interface TemplateSourceLoaderConfig {
  supabaseClient: any;
  jsonBasePath?: string;
}

export class TemplateSourceLoader {
  private supabase: any;
  private jsonBasePath: string;

  constructor(config: TemplateSourceLoaderConfig) {
    this.supabase = config.supabaseClient;
    this.jsonBasePath = config.jsonBasePath ?? '@/templates/json/v3';
  }

  /**
   * Carregar edição de usuário (Supabase funnels.config)
   * Retorna blocos customizados pelo usuário para um step específico
   */
  async loadUserEdit(stepId: string, funnelId: string): Promise<Block[] | null> {
    if (!funnelId) {
      appLogger.debug('[TemplateSourceLoader] loadUserEdit: funnelId não fornecido');
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('funnels')
        .select('config')
        .eq('id', funnelId)
        .single();

      if (error) {
        appLogger.debug('[TemplateSourceLoader] loadUserEdit: erro Supabase', { data: [error] });
        return null;
      }

      const config = (data?.config as any) || {};
      if (!config?.steps) {
        appLogger.debug('[TemplateSourceLoader] loadUserEdit: sem steps no config');
        return null;
      }

      const blocks = config.steps[stepId];
      
      if (!blocks || !Array.isArray(blocks)) {
        appLogger.debug('[TemplateSourceLoader] loadUserEdit: sem blocos para', { stepId });
        return null;
      }

      appLogger.info(`✅ [TemplateSourceLoader] USER_EDIT carregado: ${stepId} (${blocks.length} blocos)`);
      return blocks;
    } catch (error) {
      appLogger.debug('[TemplateSourceLoader] loadUserEdit: exception', { 
        stepId, 
        funnelId, 
        data: [error] 
      });
      return null;
    }
  }

  /**
   * Carregar override de admin (Supabase template_overrides)
   * Retorna blocos configurados pelo admin para um template
   */
  async loadAdminOverride(stepId: string, templateId?: string): Promise<Block[] | null> {
    try {
      // Usar maybeSingle() para evitar erro se não existir
      let query = this.supabase
        .from('template_overrides')
        .select('blocks')
        .eq('step_id', stepId);

      if (templateId) {
        query = query.eq('template_id', templateId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        appLogger.debug('[TemplateSourceLoader] loadAdminOverride: erro Supabase', { data: [error] });
        return null;
      }

      if (!data || !data.blocks) {
        appLogger.debug('[TemplateSourceLoader] loadAdminOverride: sem override', { stepId });
        return null;
      }

      const blocks = Array.isArray(data.blocks) ? data.blocks : [];
      
      if (blocks.length === 0) {
        return null;
      }

      appLogger.info(`✅ [TemplateSourceLoader] ADMIN_OVERRIDE carregado: ${stepId} (${blocks.length} blocos)`);
      return blocks;
    } catch (error) {
      appLogger.debug('[TemplateSourceLoader] loadAdminOverride: exception', { 
        stepId, 
        data: [error] 
      });
      return null;
    }
  }

  /**
   * Carregar template JSON local
   * Usa importação dinâmica para carregar JSON apenas quando necessário
   */
  async loadJSON(stepId: string, templateId: string = 'quiz21'): Promise<Block[]> {
    try {
      // Normalizar stepId para formato step-XX
      const normalizedStepId = this.normalizeStepId(stepId);
      
      // Tentar carregar JSON dinâmico
      try {
        const module = await import(`../../../templates/json/v3/${normalizedStepId}.json`);
        const blocks = module.default?.blocks || module.blocks || [];
        
        if (Array.isArray(blocks) && blocks.length > 0) {
          appLogger.info(`✅ [TemplateSourceLoader] JSON carregado: ${normalizedStepId} (${blocks.length} blocos)`);
          return blocks;
        }
      } catch (importError) {
        appLogger.debug('[TemplateSourceLoader] loadJSON: falha na importação dinâmica', {
          stepId: normalizedStepId,
          data: [importError]
        });
      }

      // Fallback: tentar carregar de arquivo estático conhecido
      const fallbackBlocks = await this.loadFallbackJSON(normalizedStepId);
      if (fallbackBlocks.length > 0) {
        return fallbackBlocks;
      }

      // Último recurso: retornar array vazio (será tratado pelo caller)
      appLogger.warn(`⚠️ [TemplateSourceLoader] JSON não encontrado: ${normalizedStepId}`);
      return [];
    } catch (error) {
      appLogger.error('❌ [TemplateSourceLoader] loadJSON: erro crítico', {
        stepId,
        data: [error]
      });
      return [];
    }
  }

  /**
   * Normalizar stepId para formato esperado (step-XX)
   */
  private normalizeStepId(stepId: string): string {
    // Se já está no formato step-XX, retornar
    if (/^step-\d{2}$/.test(stepId)) {
      return stepId;
    }

    // Se é apenas número, converter para step-XX
    const numMatch = stepId.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0], 10);
      return `step-${num.toString().padStart(2, '0')}`;
    }

    // Retornar como está se não conseguir normalizar
    return stepId;
  }

  /**
   * Carregar JSON de fallback (para steps conhecidos)
   */
  private async loadFallbackJSON(stepId: string): Promise<Block[]> {
    try {
      // Mapa de steps conhecidos com fallbacks
      const knownSteps: Record<string, () => Promise<any>> = {
        'step-01': () => import('../../../templates/json/v3/step-01.json'),
        'step-02': () => import('../../../templates/json/v3/step-02.json'),
        'step-03': () => import('../../../templates/json/v3/step-03.json'),
        'step-04': () => import('../../../templates/json/v3/step-04.json'),
        'step-05': () => import('../../../templates/json/v3/step-05.json'),
        'step-06': () => import('../../../templates/json/v3/step-06.json'),
        'step-07': () => import('../../../templates/json/v3/step-07.json'),
        'step-08': () => import('../../../templates/json/v3/step-08.json'),
        'step-09': () => import('../../../templates/json/v3/step-09.json'),
        'step-10': () => import('../../../templates/json/v3/step-10.json'),
      };

      const loader = knownSteps[stepId];
      if (loader) {
        const module = await loader();
        const blocks = module.default?.blocks || module.blocks || [];
        return Array.isArray(blocks) ? blocks : [];
      }
    } catch (error) {
      appLogger.debug('[TemplateSourceLoader] loadFallbackJSON: falha', {
        stepId,
        data: [error]
      });
    }

    return [];
  }

  /**
   * Verificar se step é válido (entre 1 e 21)
   */
  isValidStepId(stepId: string): boolean {
    const numericMatch = stepId.match(/^step-(\d{2})$/);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      return num >= 1 && num <= 21;
    }
    return false;
  }

  /**
   * Criar blocos de fallback emergencial (placeholder)
   */
  createEmergencyFallback(stepId: string): Block[] {
    appLogger.warn(`🆘 [TemplateSourceLoader] Criando fallback emergencial para ${stepId}`);
    
    return [
      {
        id: `fallback-${stepId}-title`,
        type: 'heading',
        order: 0,
        content: {
          title: 'Conteúdo Temporariamente Indisponível',
          level: 2,
        },
        properties: {
          textAlign: 'center',
          color: '#666',
        },
      },
      {
        id: `fallback-${stepId}-message`,
        type: 'text',
        order: 1,
        content: {
          text: 'Este step está sendo carregado. Por favor, tente novamente em alguns instantes.',
        },
        properties: {
          textAlign: 'center',
          fontSize: '14px',
          color: '#999',
        },
      },
    ] as Block[];
  }
}
