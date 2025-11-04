/**
 * 🌉 UNIFIED QUIZ BRIDGE - Fase 4
 * 
 * Bridge consolidado que usa os novos adapters unificados
 * Substitui fragmentação entre QuizEditorBridge e outros loaders
 */

import { UnifiedQuizStep, UnifiedQuizStepAdapter } from '@/adapters/UnifiedQuizStepAdapter';
import { useUnifiedQuizLoader } from '@/hooks/useUnifiedQuizLoader';
import { templateService } from '@/services/canonical/TemplateService';
import { supabase } from '@/integrations/supabase/customClient';
import { TEMPLATE_SOURCES } from '@/config/templateSources';

export interface UnifiedFunnelData {
  id: string;
  name: string;
  slug: string;
  steps: Record<string, UnifiedQuizStep>;
  isPublished: boolean;
  version: number;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
  };
}

/**
 * Bridge unificado para gerenciar funis de quiz
 */
export class UnifiedQuizBridge {
  private static instance: UnifiedQuizBridge;
  private cache = new Map<string, UnifiedFunnelData>();

  private constructor() {}

  static getInstance(): UnifiedQuizBridge {
    if (!UnifiedQuizBridge.instance) {
      UnifiedQuizBridge.instance = new UnifiedQuizBridge();
    }
    return UnifiedQuizBridge.instance;
  }

  /**
   * Carregar funil completo de produção
   */
  async loadProductionFunnel(): Promise<UnifiedFunnelData> {
    const cacheKey = 'production-funnel';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const steps: Record<string, UnifiedQuizStep> = {};

    // Usar TemplateService como fonte canônica (com fallback síncrono compatível ao formato QUIZ_STEPS)
    const ORDER = templateService.getStepOrder();
    const QUIZ_STEPS_FALLBACK = templateService.getAllStepsSync();

    for (const stepId of ORDER) {
      // 1) Tentar carregar blocks canônicos via TemplateService (per-step JSON/registry)
      const match = stepId.match(/step-?(\d+)/i);
      const stepNumber = match ? parseInt(match[1], 10) : null;
      let unified: UnifiedQuizStep | null = null;

      if (stepNumber) {
        const blocksRes = await templateService.steps.get(stepNumber);
        if (blocksRes.success && Array.isArray(blocksRes.data) && blocksRes.data.length > 0) {
          unified = UnifiedQuizStepAdapter.fromBlocks(blocksRes.data as any, stepId);
          // Compat: manter source como 'quizstep' para não quebrar testes/consumidores
          if (unified?.metadata) {
            unified.metadata.source = 'quizstep';
          }
        }
      }

      // 2) Fallback: usar estrutura estilo QUIZ_STEPS do TemplateService
      if (!unified) {
        const quizStep = (QUIZ_STEPS_FALLBACK as any)[stepId];
        if (quizStep) {
          unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, stepId);
        }
      }

      if (unified) {
        steps[stepId] = unified;
      }
    }

    const funnel: UnifiedFunnelData = {
      id: 'production',
      name: 'Quiz Estilo Pessoal - Produção',
      slug: 'quiz-estilo',
      steps,
      isPublished: true,
      version: 1,
      metadata: {
        createdAt: new Date().toISOString(),
        author: 'System',
      },
    };

    this.cache.set(cacheKey, funnel);
    return funnel;
  }

  /**
   * Carregar step individual
   */
  async loadStep(stepId: string, source: 'database' | 'templates' | 'hardcoded' = 'hardcoded'): Promise<UnifiedQuizStep | null> {
    switch (source) {
      case 'hardcoded':
        // Fallback compatível via TemplateService (dados mínimos suficientes para adapter)
        const QUIZ_STEPS_FALLBACK = templateService.getAllStepsSync();
        const quizStep = (QUIZ_STEPS_FALLBACK as any)[stepId];
        return quizStep ? UnifiedQuizStepAdapter.fromQuizStep(quizStep, stepId) : null;

      case 'templates':
        // ⚠️ Verificar se deve tentar carregar arquivos individuais
        if (!TEMPLATE_SOURCES.preferPublicStepJSON) {
          console.warn('preferPublicStepJSON=false - Fallback para hardcoded');
          return this.loadStep(stepId, 'hardcoded');
        }
        
        try {
          const response = await fetch(`/templates/${stepId}-v3.json`);
          if (response.ok) {
            const json = await response.json();
            return UnifiedQuizStepAdapter.fromJSON(json);
          }
        } catch (error) {
          console.error('Error loading template:', error);
        }
        return null;

      case 'database':
        // TODO: Implementar quando tabela quiz_production existir
        console.warn('Database source not yet implemented');
        return this.loadStep(stepId, 'hardcoded');
    }
  }

  /**
   * Salvar step (para futuro)
   */
  async saveStep(stepId: string, unified: UnifiedQuizStep): Promise<void> {
    // TODO: Implementar salvamento no Supabase
    console.log('Save step:', stepId, unified);
  }

  /**
   * Exportar funil para JSON v3.0
   */
  async exportToJSONv3(funnelId: string): Promise<Record<string, any>> {
    const funnel = await this.loadProductionFunnel();
    const templates: Record<string, any> = {};

    for (const [stepId, unified] of Object.entries(funnel.steps)) {
      templates[stepId] = UnifiedQuizStepAdapter.toJSON(unified);
    }

    return templates;
  }

  /**
   * Importar de JSON v3.0
   */
  async importFromJSONv3(templates: Record<string, any>): Promise<UnifiedFunnelData> {
    const steps: Record<string, UnifiedQuizStep> = {};

    for (const [stepId, json] of Object.entries(templates)) {
      steps[stepId] = UnifiedQuizStepAdapter.fromJSON(json);
    }

    return {
      id: 'imported',
      name: 'Imported Funnel',
      slug: 'imported-funnel',
      steps,
      isPublished: false,
      version: 1,
    };
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Validar integridade do funil
   */
  async validateFunnel(funnelId: string): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const funnel = await this.loadProductionFunnel();
      const errors: string[] = [];

      // Validar que todos os steps estão presentes
      if (Object.keys(funnel.steps).length === 0) {
        errors.push('Funnel has no steps');
      }

      // Validar metadados
      for (const [stepId, step] of Object.entries(funnel.steps)) {
        if (!step.id) {
          errors.push(`Step ${stepId} missing id`);
        }
        if (!step.type) {
          errors.push(`Step ${stepId} missing type`);
        }
        if (!step.sections || step.sections.length === 0) {
          errors.push(`Step ${stepId} has no sections`);
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
}

// Export singleton instance
export const unifiedQuizBridge = UnifiedQuizBridge.getInstance();
