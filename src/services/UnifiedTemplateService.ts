/**
 * 📋 UNIFIED TEMPLATE SERVICE - FASE 2
 * 
 * Serviço unificado que consolida TODAS as fontes de templates:
 * - public/templates/*.json
 * - src/templates/quiz21StepsComplete.ts
 * - Templates dinâmicos do Supabase
 * 
 * OBJETIVO: Fonte única de verdade para templates
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE, getPersonalizedStepTemplate } from '@/templates/quiz21StepsComplete';
import { convertSectionsToBlocks } from '@/utils/sectionToBlockConverter';

export class UnifiedTemplateService {
  private static instance: UnifiedTemplateService;
  private templateCache = new Map<string, any>();

  private constructor() {}

  static getInstance(): UnifiedTemplateService {
    if (!this.instance) {
      this.instance = new UnifiedTemplateService();
    }
    return this.instance;
  }

  /**
   * Obtém template de step unificado
   */
  getStepTemplate(stepId: string, funnelId?: string): any {
    const cacheKey = funnelId ? `${funnelId}:${stepId}` : stepId;
    
    // Check cache
    if (this.templateCache.has(cacheKey)) {
      return this.templateCache.get(cacheKey);
    }

    // Get from hardcoded template
    const template = getPersonalizedStepTemplate(stepId, funnelId);
    
    if (template) {
      this.templateCache.set(cacheKey, template);
      return template;
    }

    console.warn(`⚠️ Template ${stepId} not found`);
    return null;
  }

  /**
   * Obtém todos os templates do quiz (21 steps)
   */
  getAllSteps(): Record<string, any> {
    return QUIZ_STYLE_21_STEPS_TEMPLATE;
  }

  /**
   * Alias: getTemplate
   */
  getTemplate(templateName: string): Record<string, any> | null {
    if (templateName === 'quiz21StepsComplete') {
      return this.getAllSteps();
    }
    return null;
  }

  /**
   * Carrega blocos de um step específico
   */
  loadStepBlocks(stepId: string, funnelId?: string): any[] {
    const template = this.getStepTemplate(stepId, funnelId);
    
    if (!template) {
      return [];
    }

    // Se template já é um array de blocos (formato legacy)
    if (Array.isArray(template)) {
      return template;
    }

    // Se template tem propriedade blocks
    if (template.blocks && Array.isArray(template.blocks)) {
      return template.blocks;
    }

    // Se template tem propriedade sections (v3.0)
    if (template.sections && Array.isArray(template.sections)) {
      console.log(`🔄 Converting sections to blocks for ${stepId}`);
      const blocks = convertSectionsToBlocks(template.sections);
      console.log(`✅ Converted ${blocks.length} blocks from sections`);
      return blocks;
    }

    return [];
  }

  /**
   * Publica um step (placeholder para compatibilidade)
   */
  publishStep(stepId: string, funnelId?: string): boolean {
    console.log(`Publishing step: ${stepId}${funnelId ? ` for funnel ${funnelId}` : ''}`);
    return true;
  }

  /**
   * Despublica um step (placeholder para compatibilidade)
   */
  unpublishStep(stepId: string): boolean {
    console.log(`Unpublishing step: ${stepId}`);
    return true;
  }

  /**
   * Preload common steps
   */
  preloadCommonSteps(): void {
    // Preload first 3 steps
    for (let i = 1; i <= 3; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
      this.getStepTemplate(stepId);
    }
  }

  /**
   * Invalida cache
   */
  invalidateCache(stepId?: string): void {
    if (stepId) {
      this.templateCache.delete(stepId);
    } else {
      this.clearCache();
    }
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.templateCache.clear();
  }
}

export const unifiedTemplateService = UnifiedTemplateService.getInstance();
