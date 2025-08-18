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

// Mock STEP_TEMPLATES for type safety
const STEP_TEMPLATES = {} as Record<number, TemplateData>;

type StepNumber = keyof typeof STEP_TEMPLATES;
type StepTemplate = (typeof STEP_TEMPLATES)[StepNumber];

function isValidStep(step: number): step is StepNumber {
  return step >= 1 && step <= 21;
}

export const templateService = {
  async getTemplates(): Promise<TemplateData[]> {
    const templates = (Object.entries(STEP_TEMPLATES) as [string, StepTemplate][]).map(
      ([stepStr, template]) => ({
        ...template,
        step: parseInt(stepStr),
      })
    );

    return templates;
  },

  async getTemplate(id: string): Promise<TemplateData | null> {
    const step = parseInt(id.replace('step-', ''));

    if (!isValidStep(step)) {
      return null;
    }

    const template = STEP_TEMPLATES[step];
    return {
      ...template,
      step,
    };
  },

  async searchTemplates(query: string): Promise<TemplateData[]> {
    const templates = await this.getTemplates();
    const searchQuery = query.toLowerCase();

    return templates.filter(
      template =>
        template.metadata.name.toLowerCase().includes(searchQuery) ||
        template.metadata.description.toLowerCase().includes(searchQuery) ||
        template.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  },

  // Nova função para obter template por número da etapa - COM INTEGRAÇÃO JSON STEP01
  async getTemplateByStep(step: number): Promise<TemplateData | null> {
    if (!isValidStep(step)) {
      console.warn(`⚠️ Número da etapa inválido: ${step}`);
      return null;
    }

    try {
      // ===== TODAS AS STEPS (1-21): USAR SISTEMA JSON CONSOLIDADO =====
      console.log(`🔍 Step${step}: Usando template JSON consolidado`);
      const template = await getStepTemplate(step);

      if (!template) {
        console.warn(`⚠️ Template não encontrado para etapa ${step}`);
        return null;
      }

      // Verificar se ainda está carregando ou se veio vazio
      if (template.__loading || !template.blocks || template.blocks.length === 0) {
        console.warn(`⚠️ Template da etapa ${step} ainda carregando ou vazio`);
        return null; // Retornar null para triggerar fallback
      }

      return {
        ...template,
        step,
      };
    } catch (error) {
      console.error(`❌ Erro ao carregar template da etapa ${step}:`, error);
      return null;
    }
  },

  // Nova função para converter blocos do template para blocos do editor - CORRIGIDA
  convertTemplateBlocksToEditorBlocks(templateBlocks: TemplateBlock[]): Block[] {
    return templateBlocks.map((block, index) => ({
      id: block.id,
      type: block.type as BlockType,
      content: block.properties || {},
      order: index,
      properties: block.properties || {}, // Manter properties também para compatibilidade
    }));
  },
};

export default templateService;
