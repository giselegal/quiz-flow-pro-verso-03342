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
  analytics?: {
    trackingId?: string;
    events?: string[];
    utmParams?: boolean;
    customEvents?: string[];
  };
  logic?: {
    navigation?: {
      nextStep?: string | null;
      prevStep?: string | null;
      allowBack?: boolean;
      autoAdvance?: boolean;
    };
    formHandling?: {
      onSubmit?: string;
      validation?: string;
      errorHandling?: string;
    };
    stateManagement?: {
      localState?: string[];
      globalState?: string[];
    };
    scoring?: any;
    conditions?: any;
  };
  performance?: {
    webVitals?: {
      markComponentMounted?: boolean;
      markLcpRendered?: boolean;
      markUserInteraction?: boolean;
    };
    optimizations?: {
      preloadCriticalImages?: boolean;
      inlineStyles?: boolean;
      lazyLoadNonCritical?: boolean;
      useRequestAnimationFrame?: boolean;
    };
  };
  accessibility?: {
    skipLinks?: boolean;
    ariaLabels?: boolean;
    focusManagement?: boolean;
    keyboardNavigation?: boolean;
    screenReader?: boolean;
  };
  step?: number;
}

// Helper function to validate step numbers
function isValidStep(step: number): boolean {
  return step >= 1 && step <= 21;
}

export const templateService = {
  async getTemplates(): Promise<TemplateData[]> {
    // Return empty array for now
    return [];
  },

  async getTemplate(_id: string): Promise<TemplateData | null> {
    // Return null for now
    return null;
  },

  async searchTemplates(_query: string): Promise<TemplateData[]> {
    // Return empty array for now
    return [];
  },

  // Nova função para obter template por número da etapa
  async getTemplateByStep(step: number): Promise<TemplateData | null> {
    if (!isValidStep(step)) {
      console.warn(`⚠️ Número da etapa inválido: ${step}`);
      return null;
    }

    try {
      console.log(`🔍 Step${step}: Usando template JSON consolidado`);
      const template = await getStepTemplate(step);

      if (!template) {
        console.warn(`⚠️ Template não encontrado para etapa ${step}`);
        return null;
      }

      // Check if template is valid
      if (!Array.isArray(template) || template.length === 0) {
        console.warn(`⚠️ Template da etapa ${step} está vazio`);
        return null;
      }

      // Return template directly as it comes from getStepTemplate
      return template as any;
    } catch (error) {
      console.error(`❌ Erro ao carregar template da etapa ${step}:`, error);
      return null;
    }
  },

  // Nova função para converter blocos do template para blocos do editor
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