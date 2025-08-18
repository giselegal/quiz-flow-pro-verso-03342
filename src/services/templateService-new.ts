import { getStepTemplate } from '../config/stepTemplatesMapping';
import type { Block, BlockType } from '../types/editor';

// Interfaces para corresponder à estrutura real dos templates
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface TemplateBlock {
  id: string;
  type: string;
  properties: Record<string, any>;
  children?: TemplateBlock[];
}

export interface TemplateDesign {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  button: Record<string, any>;
  card: Record<string, any>;
  progressBar: Record<string, any>;
  animations: Record<string, any>;
  imageOptionSize: Record<string, any>;
}

export interface TemplateData {
  templateVersion: string;
  metadata: TemplateMetadata;
  design: TemplateDesign;
  layout: {
    containerWidth: string;
    spacing: string;
    backgroundColor: string;
    responsive: boolean;
    animations: Record<string, any>;
  };
  blocks: TemplateBlock[];
  validation: {
    nameField?: {
      required: boolean;
      minLength: number;
      maxLength: number;
      pattern?: string;
      errorMessage?: string;
    };
    requiredFields?: string[];
    customValidation?: (data: any) => { isValid: boolean; errors: string[] };
  };
  integrations: {
    analytics?: boolean;
    marketing?: boolean;
    crm?: boolean;
    customCode?: string;
  };
}

// ✅ CONVERTER BLOCOS DE TEMPLATE (array de objetos) PARA EDITOR BLOCKS
function convertStepTemplateToEditorBlocks(templateBlocks: any[]): Block[] {
  if (!Array.isArray(templateBlocks)) {
    console.warn('⚠️ Template blocks não é um array:', templateBlocks);
    return [];
  }

  return templateBlocks.map((block, index) => ({
    id: block.id || `block-${index + 1}`,
    type: block.type || 'text',
    content: block.content || block.properties || {},
    order: block.order || index,
    stageId: block.stageId || 'step-1',
  }));
}

// ✅ CONVERTER ARRAY DE TEMPLATE BLOCKS PARA TEMPLATE DATA
function convertStepTemplateToTemplateData(
  stepNumber: number, 
  templateBlocks: any[]
): TemplateData {
  return {
    templateVersion: '1.0.0',
    metadata: {
      id: `step-${stepNumber.toString().padStart(2, '0')}`,
      name: `Step ${stepNumber}`,
      description: `Template para etapa ${stepNumber}`,
      category: 'quiz',
      type: 'step',
      tags: ['quiz', 'step', `step-${stepNumber}`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Quiz Quest System'
    },
    design: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      button: {},
      card: {},
      progressBar: {},
      animations: {},
      imageOptionSize: {}
    },
    layout: {
      containerWidth: '100%',
      spacing: '1rem',
      backgroundColor: '#ffffff',
      responsive: true,
      animations: {}
    },
    blocks: templateBlocks.map((block, index) => ({
      id: block.id || `block-${index + 1}`,
      type: block.type || 'text',
      properties: block.content || block.properties || {},
      children: block.children || []
    })),
    validation: {
      nameField: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      requiredFields: []
    },
    integrations: {
      analytics: true,
      marketing: false,
      crm: false
    }
  };
}

// ✅ TEMPLATE SERVICE - INTEGRAÇÃO COM STEP TEMPLATES MAPPING
class TemplateService {
  /**
   * ✅ NOVO: Carregar template usando stepTemplatesMapping.ts
   */
  async getTemplateByStep(step: number): Promise<TemplateData | null> {
    console.log(`🔍 TemplateService: Carregando template para etapa ${step}...`);
    
    try {
      // ✅ USAR getStepTemplate do stepTemplatesMapping.ts
      const templateBlocks = await getStepTemplate(step);
      
      if (!templateBlocks || !Array.isArray(templateBlocks)) {
        console.warn(`⚠️ Template para etapa ${step} não retornou blocos válidos:`, templateBlocks);
        return null;
      }

      console.log(`✅ Template etapa ${step} carregado: ${templateBlocks.length} blocos`);
      
      // Converter para formato TemplateData
      const templateData = convertStepTemplateToTemplateData(step, templateBlocks);
      
      return templateData;
      
    } catch (error) {
      console.error(`❌ Erro ao carregar template etapa ${step}:`, error);
      return null;
    }
  }

  /**
   * ✅ CONVERTER template blocks para editor blocks
   */
  convertTemplateBlocksToEditorBlocks(templateBlocks: TemplateBlock[]): Block[] {
    return templateBlocks.map((block, index) => ({
      id: block.id || `block-${index + 1}`,
      type: block.type as BlockType,
      content: block.properties || {},
      order: index,
      stageId: 'step-1', // Será atualizado pelo contexto
    }));
  }

  /**
   * ✅ VALIDAR se template tem conteúdo
   */
  validateTemplate(templateData: TemplateData): boolean {
    return !!(
      templateData &&
      templateData.blocks &&
      templateData.blocks.length > 0
    );
  }

  /**
   * ✅ LISTAR todos os templates disponíveis
   */
  async getAllTemplates(): Promise<TemplateData[]> {
    const templates: TemplateData[] = [];
    
    // Carregar templates das 21 etapas
    for (let step = 1; step <= 21; step++) {
      try {
        const template = await this.getTemplateByStep(step);
        if (template) {
          templates.push(template);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao carregar template etapa ${step}:`, error);
      }
    }
    
    return templates;
  }

  /**
   * ✅ BUSCAR templates por categoria
   */
  async getTemplatesByCategory(category: string): Promise<TemplateData[]> {
    const allTemplates = await this.getAllTemplates();
    return allTemplates.filter(template => 
      template.metadata.category === category
    );
  }
}

// ✅ EXPORT singleton instance
export const templateService = new TemplateService();
export default templateService;
