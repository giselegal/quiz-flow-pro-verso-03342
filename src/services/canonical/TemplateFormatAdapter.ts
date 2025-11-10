/**
 * 🔄 TEMPLATE FORMAT ADAPTER
 * 
 * Adapta formatos V2 → V3 → V3.1 de templates
 * 
 * FORMATOS SUPORTADOS:
 * - V2: sections[] com tipos legacy
 * - V3: sections[] com tipos padronizados
 * - V3.1: blocks[] com config/properties
 * 
 * USO:
 * ```typescript
 * const adapter = new TemplateFormatAdapter();
 * const normalized = adapter.normalize(rawTemplate);
 * ```
 */

import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

export interface TemplateV2 {
  templateVersion: '2.0' | '3.0';
  metadata: any;
  sections?: any[];
  theme?: any;
  navigation?: any;
}

export interface TemplateV3 {
  templateVersion: '3.1';
  metadata: any;
  blocks: Block[];
  theme?: any;
  navigation?: any;
  analytics?: any;
}

/**
 * Mapeamento de tipos legacy → canônicos
 */
const TYPE_ALIASES: Record<string, string> = {
  // Intro
  'hero-block': 'intro-hero',
  'welcome-form-block': 'welcome-form',
  'heading': 'heading-inline',
  'hero': 'intro-hero',
  
  // Questions
  'question-block': 'quiz-options',
  'option-grid': 'options-grid',
  'options grid': 'options-grid',
  
  // Transitions
  'transition.next': 'transition-hero',
  
  // Results
  'result.headline': 'result-main',
  'result.secondaryList': 'result-secondary-styles',
  
  // Offers
  'offer.core': 'cta-inline',
  'offer.urgency': 'urgency-timer-inline',
  'offer.testimonial': 'testimonials',
};

export class TemplateFormatAdapter {
  /**
   * Normaliza qualquer formato para V3.1 (blocks[])
   */
  normalize(template: any): TemplateV3 {
    // Já está em V3.1 com blocks[]
    if (template.blocks && Array.isArray(template.blocks)) {
      return {
        ...template,
        templateVersion: '3.1',
        blocks: template.blocks.map((b: any) => this.normalizeBlock(b)),
      };
    }

    // V2/V3 com sections[]
    if (template.sections && Array.isArray(template.sections)) {
      return {
        templateVersion: '3.1',
        metadata: template.metadata || {},
        theme: template.theme,
        navigation: template.navigation,
        blocks: template.sections.map((s: any, idx: number) => this.sectionToBlock(s, idx)),
      };
    }

    // Formato desconhecido - tentar converter
    appLogger.warn('[TemplateFormatAdapter] Formato desconhecido, tentando conversão genérica');
    return {
      templateVersion: '3.1',
      metadata: template.metadata || {},
      blocks: [],
    };
  }

  /**
   * Converte section (V2/V3) → block (V3.1)
   */
  private sectionToBlock(section: any, index: number): Block {
    const normalizedType = TYPE_ALIASES[section.type] || section.type;
    
    return {
      id: section.id || `block-${index}`,
      type: normalizedType as any,
      order: section.position ?? index,
      content: section.content || section.properties || {},
      properties: section.properties || section.content || {},
    };
  }

  /**
   * Normaliza um bloco individual (converte tipos legacy)
   */
  private normalizeBlock(block: any): Block {
    const normalizedType = TYPE_ALIASES[block.type] || block.type;
    const { getBlockConfig } = require('@/lib/utils/blockConfigMerger');
    const config = getBlockConfig(block);
    
    return {
      ...block,
      type: normalizedType as any,
      content: config,
      properties: config,
    };
  }

  /**
   * Converte V3.1 → V3 (blocks[] → sections[])
   */
  toV3Format(template: TemplateV3): TemplateV2 {
    return {
      templateVersion: '3.0',
      metadata: template.metadata,
      theme: template.theme,
      navigation: template.navigation,
      sections: template.blocks.map((b, idx) => this.blockToSection(b, idx)),
    };
  }

  /**
   * Converte block → section
   */
  private blockToSection(block: Block, index: number): any {
    return {
      id: block.id,
      type: block.type,
      content: block.content || block.properties || {},
      style: (block as any).style || {},
      position: block.order ?? index,
    };
  }

  /**
   * Valida se um template é válido
   */
  validate(template: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.metadata) {
      errors.push('Missing metadata');
    }

    if (!template.blocks && !template.sections) {
      errors.push('Template must have either blocks[] or sections[]');
    }

    if (template.blocks && !Array.isArray(template.blocks)) {
      errors.push('blocks must be an array');
    }

    if (template.sections && !Array.isArray(template.sections)) {
      errors.push('sections must be an array');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Detecta formato do template
   */
  detectFormat(template: any): '2.0' | '3.0' | '3.1' | 'unknown' {
    if (template.blocks && Array.isArray(template.blocks)) {
      return '3.1';
    }
    if (template.sections && Array.isArray(template.sections)) {
      // Aceita v3.0, v3.1, v3.2 como formatos v3
      return ['3.0', '3.1', '3.2'].includes(template.templateVersion) ? '3.0' : '2.0';
    }
    return 'unknown';
  }
}

// Instância singleton
export const templateFormatAdapter = new TemplateFormatAdapter();
