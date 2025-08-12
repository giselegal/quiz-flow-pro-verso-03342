/**
 * 🎯 JSON TEMPLATE ENGINE - INTEGRAÇÃO COM /EDITOR-FIXED EXISTENTE
 *
 * Sistema que funciona com TODOS os componentes existentes
 * SEM quebrar nada do que já está funcionando.
 */

import { ENHANCED_BLOCK_REGISTRY } from '@/config/enhancedBlockRegistry';
import { Block } from '@/types/editor';

// =============================================
// TYPES PARA JSON TEMPLATES
// =============================================

export interface JsonTemplate {
  // Metadata básica
  id: string;
  name: string;
  description?: string;
  version: string;
  category: 'intro' | 'question' | 'transition' | 'result' | 'custom';

  // Layout e configuração
  layout: {
    containerWidth?: 'full' | 'contained' | 'narrow';
    spacing?: 'none' | 'small' | 'medium' | 'large';
    backgroundColor?: string;
    responsive?: boolean;
  };

  // Configuração de etapas (para funil)
  stepConfig?: {
    stepNumber: number;
    isRequired?: boolean;
    nextStepCondition?: 'always' | 'on_selection' | 'on_validation';
    validationRules?: {
      minSelections?: number;
      maxSelections?: number;
      requiredFields?: string[];
    };
  };

  // Lista de blocos (compatível com sistema atual)
  blocks: JsonBlock[];

  // Estilos globais (opcional)
  globalStyles?: Record<string, any>;

  // Configurações avançadas
  analytics?: {
    trackingId?: string;
    events?: string[];
  };
}

export interface JsonBlock {
  // Identificação (compatível com Block existente)
  id: string;
  type: string; // DEVE corresponder a uma key no ENHANCED_BLOCK_REGISTRY
  order?: number;

  // Propriedades específicas do componente
  properties: Record<string, any>;

  // Estilos (compatível com sistema atual)
  style?: {
    margin?: string | number;
    padding?: string | number;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string | number;
    boxShadow?: string;
    animation?: string;
  };

  // Condições de visibilidade
  conditions?: {
    showIf?: string; // Condição JavaScript
    hideIf?: string; // Condição JavaScript
    dependsOn?: string; // ID de outro bloco
  };
}

// =============================================
// JSON TEMPLATE ENGINE PRINCIPAL
// =============================================

export class JsonTemplateEngine {
  private static instance: JsonTemplateEngine;

  public static getInstance(): JsonTemplateEngine {
    if (!JsonTemplateEngine.instance) {
      JsonTemplateEngine.instance = new JsonTemplateEngine();
    }
    return JsonTemplateEngine.instance;
  }

  /**
   * 🔄 CONVERSÃO: JSON Template → Blocos do Editor
   * Integra perfeitamente com o sistema existente
   */
  public convertTemplateToBlocks(template: JsonTemplate): Block[] {
    return template.blocks.map((jsonBlock, index) => {
      // Verificar se o tipo existe no registry
      const componentExists = jsonBlock.type in ENHANCED_BLOCK_REGISTRY;

      if (!componentExists) {
        console.warn(`⚠️ Componente "${jsonBlock.type}" não encontrado no ENHANCED_BLOCK_REGISTRY`);
        // Fallback para um componente genérico ou texto
        jsonBlock.type = 'text-inline';
      }

      // Criar bloco compatível com o sistema atual
      const block: Block = {
        id: jsonBlock.id || `block-${index}`,
        type: jsonBlock.type as any,
        order: jsonBlock.order || index,

        // Converter properties para content (compatibilidade)
        content: {
          text: jsonBlock.properties.text || '',
          title: jsonBlock.properties.title || '',
          description: jsonBlock.properties.description || '',
          ...jsonBlock.properties,
        },

        // Manter properties também (para componentes novos)
        properties: {
          ...jsonBlock.properties,
          // Injetar estilos como properties
          style: jsonBlock.style || {},
          // Injetar condições
          conditions: jsonBlock.conditions || {},
        },
      };

      return block;
    });
  }

  /**
   * 🔄 CONVERSÃO REVERSA: Blocos do Editor → JSON Template
   * Para salvar configurações como JSON
   */
  public convertBlocksToTemplate(
    blocks: Block[],
    metadata: Partial<JsonTemplate> = {}
  ): JsonTemplate {
    const jsonBlocks: JsonBlock[] = blocks.map(block => ({
      id: block.id,
      type: block.type,
      order: block.order,
      properties: {
        // Mesclar content e properties
        ...block.content,
        ...block.properties,
      },
      style: block.properties?.style || {},
      conditions: block.properties?.conditions || {},
    }));

    return {
      id: metadata.id || `template-${Date.now()}`,
      name: metadata.name || 'Template Personalizado',
      description: metadata.description || 'Template criado no editor',
      version: metadata.version || '1.0',
      category: metadata.category || 'custom',

      layout: {
        containerWidth: 'full',
        spacing: 'medium',
        backgroundColor: 'transparent',
        responsive: true,
        ...metadata.layout,
      },

      blocks: jsonBlocks,
      globalStyles: metadata.globalStyles || {},
      analytics: metadata.analytics || {},
    };
  }

  /**
   * 📝 VALIDAÇÃO: Verificar se template é válido
   */
  public validateTemplate(template: JsonTemplate): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações básicas
    if (!template.id) errors.push('Template deve ter um ID');
    if (!template.name) errors.push('Template deve ter um nome');
    if (!template.blocks || !Array.isArray(template.blocks)) {
      errors.push('Template deve ter uma lista de blocos');
    }

    // Validar blocos
    template.blocks?.forEach((block, index) => {
      if (!block.id) errors.push(`Bloco ${index} deve ter um ID`);
      if (!block.type) errors.push(`Bloco ${index} deve ter um tipo`);

      // Verificar se componente existe
      if (block.type && !(block.type in ENHANCED_BLOCK_REGISTRY)) {
        warnings.push(`Componente "${block.type}" não encontrado no registry`);
      }

      // Verificar propriedades obrigatórias baseadas no tipo
      this.validateBlockProperties(block, warnings);
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 🔍 VALIDAÇÃO ESPECÍFICA: Propriedades por tipo de bloco
   */
  private validateBlockProperties(block: JsonBlock, warnings: string[]): void {
    switch (block.type) {
      case 'text-inline':
        if (!block.properties.text) {
          warnings.push(`Bloco ${block.id}: texto não definido`);
        }
        break;

      case 'button-inline':
        if (!block.properties.text) {
          warnings.push(`Bloco ${block.id}: texto do botão não definido`);
        }
        if (!block.properties.onClick && !block.properties.href) {
          warnings.push(`Bloco ${block.id}: ação do botão não definida`);
        }
        break;

      case 'options-grid':
        if (!block.properties.options || !Array.isArray(block.properties.options)) {
          warnings.push(`Bloco ${block.id}: opções não definidas`);
        }
        break;

      case 'quiz-intro-header':
        if (!block.properties.title) {
          warnings.push(`Bloco ${block.id}: título não definido`);
        }
        break;
    }
  }

  /**
   * 📊 ANÁLISE: Componentes disponíveis no registry
   */
  public getAvailableComponents(): Array<{
    type: string;
    component: string;
    category: string;
  }> {
    return Object.keys(ENHANCED_BLOCK_REGISTRY).map(type => ({
      type,
      component: ENHANCED_BLOCK_REGISTRY[type].name || type,
      category: this.categorizeComponent(type),
    }));
  }

  /**
   * 🏷️ CATEGORIZAÇÃO: Inferir categoria baseada no nome do componente
   */
  private categorizeComponent(type: string): string {
    if (type.includes('text') || type.includes('heading')) return 'content';
    if (type.includes('button') || type.includes('cta')) return 'interactive';
    if (type.includes('image') || type.includes('media')) return 'media';
    if (type.includes('quiz')) return 'quiz';
    if (type.includes('form') || type.includes('input')) return 'forms';
    if (type.includes('layout') || type.includes('divider') || type.includes('spacer'))
      return 'layout';
    if (type.includes('pricing') || type.includes('commerce')) return 'commerce';
    if (type.includes('social') || type.includes('testimonial')) return 'social';
    return 'other';
  }
}

// =============================================
// HOOKS PARA INTEGRAÇÃO COM /EDITOR-FIXED
// =============================================

/**
 * 🪝 HOOK: useJsonTemplate
 * Para usar templates JSON no editor existente
 */
export const useJsonTemplate = () => {
  const engine = JsonTemplateEngine.getInstance();

  const loadTemplate = async (templatePath: string): Promise<JsonTemplate | null> => {
    try {
      const response = await fetch(templatePath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const template: JsonTemplate = await response.json();
      const validation = engine.validateTemplate(template);

      if (!validation.isValid) {
        console.error('❌ Template inválido:', validation.errors);
        return null;
      }

      if (validation.warnings.length > 0) {
        console.warn('⚠️ Avisos do template:', validation.warnings);
      }

      return template;
    } catch (error) {
      console.error('❌ Erro ao carregar template:', error);
      return null;
    }
  };

  const applyTemplate = (template: JsonTemplate): Block[] => {
    return engine.convertTemplateToBlocks(template);
  };

  const exportTemplate = (blocks: Block[], metadata?: Partial<JsonTemplate>): JsonTemplate => {
    return engine.convertBlocksToTemplate(blocks, metadata);
  };

  const validateTemplate = (template: JsonTemplate) => {
    return engine.validateTemplate(template);
  };

  const getAvailableComponents = () => {
    return engine.getAvailableComponents();
  };

  return {
    loadTemplate,
    applyTemplate,
    exportTemplate,
    validateTemplate,
    getAvailableComponents,
  };
};

// =============================================
// UTILITIES
// =============================================

/**
 * 🔧 HELPER: Carregar template das 21 etapas
 */
export const loadStepTemplate = async (stepNumber: number): Promise<JsonTemplate | null> => {
  const stepId = stepNumber.toString().padStart(2, '0');
  const templatePath = `/templates/step-${stepId}-template.json`;

  const { loadTemplate } = useJsonTemplate();
  return await loadTemplate(templatePath);
};

/**
 * 🔧 HELPER: Aplicar template de etapa no editor
 */
export const applyStepTemplate = async (
  stepNumber: number,
  onBlocksLoad: (blocks: Block[]) => void
): Promise<boolean> => {
  try {
    const template = await loadStepTemplate(stepNumber);
    if (!template) return false;

    const { applyTemplate } = useJsonTemplate();
    const blocks = applyTemplate(template);

    onBlocksLoad(blocks);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao aplicar template da etapa ${stepNumber}:`, error);
    return false;
  }
};

export default JsonTemplateEngine;
