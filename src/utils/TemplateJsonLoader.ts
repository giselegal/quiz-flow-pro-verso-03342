// @ts-nocheck
import type { Block } from '@/types/editor';

/**
 * Interfaces para Templates JSON
 */
export interface JsonTemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JsonTemplateLayout {
  containerWidth?: 'small' | 'medium' | 'large' | 'full';
  spacing?: 'none' | 'small' | 'normal' | 'large';
  backgroundColor?: string;
  responsive?: boolean;
}

export interface JsonTemplateBlock {
  id: string;
  type: string;
  position: number;
  properties: Record<string, any>;
  conditions?: {
    showIf?: string;
    hideIf?: string;
  };
}

export interface JsonTemplateValidation {
  required?: boolean;
  minAnswers?: number;
  maxAnswers?: number;
  validationMessage?: string;
}

export interface JsonTemplateAnalytics {
  trackingId: string;
  events: string[];
}

export interface JsonTemplate {
  templateVersion: string;
  metadata: JsonTemplateMetadata;
  layout: JsonTemplateLayout;
  blocks: JsonTemplateBlock[];
  validation?: JsonTemplateValidation;
  analytics?: JsonTemplateAnalytics;
}

/**
 * Template Loader - Carrega e processa templates JSON
 */
export class TemplateJsonLoader {
  private static templates = new Map<string, JsonTemplate>();

  /**
   * Carrega um template JSON
   */
  static async loadTemplate(templatePath: string): Promise<JsonTemplate> {
    try {
      // Se já está em cache, retorna
      if (this.templates.has(templatePath)) {
        return this.templates.get(templatePath)!;
      }

      // Carrega o template
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Erro ao carregar template: ${response.statusText}`);
      }

      const template: JsonTemplate = await response.json();

      // Valida o template
      this.validateTemplate(template);

      // Armazena no cache
      this.templates.set(templatePath, template);

      console.log(`✅ Template carregado: ${template.metadata.id}`, template);
      return template;
    } catch (error) {
      console.error(`❌ Erro ao carregar template ${templatePath}:`, error);
      throw error;
    }
  }

  /**
   * Converte template JSON para blocos do editor
   */
  static jsonToBlocks(template: JsonTemplate, stepId: string): Block[] {
    return template.blocks
      .sort((a, b) => a.position - b.position) // Ordena por posição
      .map(
        (jsonBlock, index) =>
          ({
            id: `${stepId}-${jsonBlock.id}`,
            type: jsonBlock.type,
            order: jsonBlock.position,
            properties: {
              ...jsonBlock.properties,
              // Adiciona propriedades do layout global se não existirem
              containerWidth: jsonBlock.properties.containerWidth || template.layout.containerWidth,
              spacing: jsonBlock.properties.spacing || template.layout.spacing,
              backgroundColor:
                jsonBlock.properties.backgroundColor || template.layout.backgroundColor,
            },
            content: jsonBlock.properties, // Para compatibilidade
            // Adiciona metadados do template
            _templateMetadata: {
              originalId: jsonBlock.id,
              templateId: template.metadata.id,
              position: jsonBlock.position,
              conditions: jsonBlock.conditions,
            },
          }) as Block
      );
  }

  /**
   * Carrega template e converte para blocos
   */
  static async loadTemplateAsBlocks(templatePath: string, stepId: string): Promise<Block[]> {
    const template = await this.loadTemplate(templatePath);
    return this.jsonToBlocks(template, stepId);
  }

  /**
   * Valida estrutura do template
   */
  private static validateTemplate(template: JsonTemplate): void {
    if (!template.metadata?.id) {
      throw new Error('Template deve ter metadata.id');
    }

    if (!template.blocks || template.blocks.length === 0) {
      throw new Error('Template deve ter pelo menos um bloco');
    }

    // Valida IDs únicos
    const ids = template.blocks.map(b => b.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      throw new Error('IDs dos blocos devem ser únicos');
    }

    // Valida tipos de bloco conhecidos
    const knownTypes = [
      'text-inline',
      'button-inline',
      'image-display-inline',
      'options-grid',
      'quiz-intro-header',
      'form-input',
      'decorative-bar-inline',
      'legal-notice-inline',
    ];

    for (const block of template.blocks) {
      if (!knownTypes.includes(block.type)) {
        console.warn(`⚠️ Tipo de bloco desconhecido: ${block.type}`);
      }
    }
  }

  /**
   * Lista templates disponíveis
   */
  static getLoadedTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Obtém metadados de um template carregado
   */
  static getTemplateMetadata(templatePath: string): JsonTemplateMetadata | null {
    const template = this.templates.get(templatePath);
    return template?.metadata || null;
  }

  /**
   * Limpa cache de templates
   */
  static clearCache(): void {
    this.templates.clear();
  }
}

export default TemplateJsonLoader;
