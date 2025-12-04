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
   * Usa fetch para carregar JSON de public/templates
   */
  async loadJSON(stepId: string, templateId: string = 'quiz21Steps'): Promise<Block[]> {
    try {
      // Normalizar stepId para formato step-XX
      const normalizedStepId = this.normalizeStepId(stepId);
      
      // Tentar carregar JSON via fetch (de public/)
      try {
        const jsonPath = `/templates/${templateId}/steps/${normalizedStepId}.json`;
        const response = await fetch(jsonPath);
        
        if (!response.ok) {
          appLogger.debug(`[TemplateSourceLoader] JSON não encontrado: ${jsonPath}`);
          return this.loadFallbackJSON(normalizedStepId);
        }
        
        const data = await response.json();
        const blocks = data?.blocks || data || [];
        
        if (Array.isArray(blocks) && blocks.length > 0) {
          appLogger.info(`✅ [TemplateSourceLoader] JSON carregado: ${normalizedStepId} (${blocks.length} blocos)`);
          return blocks;
        }
      } catch (fetchError) {
        appLogger.debug('[TemplateSourceLoader] loadJSON: falha ao carregar via fetch', {
          stepId: normalizedStepId,
          data: [fetchError]
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
   * Carregar JSON de fallback (tenta caminhos alternativos)
   */
  private async loadFallbackJSON(stepId: string): Promise<Block[]> {
    // Tentar caminhos alternativos conhecidos
    const fallbackPaths = [
      `/templates/quiz21Steps/steps/${stepId}.json`,
      `/templates/quiz21StepsComplete/steps/${stepId}.json`,
      `/templates/default/steps/${stepId}.json`,
    ];

    for (const path of fallbackPaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          const blocks = data?.blocks || data || [];
          if (Array.isArray(blocks) && blocks.length > 0) {
            appLogger.debug(`[TemplateSourceLoader] Fallback encontrado: ${path}`);
            return blocks;
          }
        }
      } catch {
        // Continuar tentando próximo path
      }
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
