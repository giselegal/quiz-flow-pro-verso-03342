import { STEP_TEMPLATES, getStepTemplate } from '../config/templates/templates';
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
      errorMessage: string;
      realTimeValidation: boolean;
    };
    [key: string]: any;
  };
  analytics: {
    trackingId: string;
    events: string[];
    utmParams: boolean;
    customEvents: string[];
  };
  logic: {
    navigation: {
      nextStep: string | null;
      prevStep: string | null;
      allowBack: boolean;
      autoAdvance: boolean;
    };
    formHandling: {
      onSubmit: string;
      validation: string;
      errorHandling: string;
    };
    stateManagement: {
      localState: string[];
      globalState: string[];
    };
    scoring: any;
    conditions: any;
  };
  performance: {
    webVitals: {
      markComponentMounted: boolean;
      markLcpRendered: boolean;
      markUserInteraction: boolean;
    };
    optimizations: {
      preloadCriticalImages: boolean;
      inlineStyles: boolean;
      lazyLoadNonCritical: boolean;
      useRequestAnimationFrame: boolean;
    };
  };
  accessibility: {
    skipLinks: boolean;
    ariaLabels: boolean;
    focusManagement: boolean;
    keyboardNavigation: boolean;
    screenReader: boolean;
  };
  step?: number;
}

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
