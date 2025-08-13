// @ts-nocheck
import { getStepTemplate, preloadAllTemplates } from '../config/templates/templates';
import type { Block } from '../types/editor';

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

// removed unused STEP_TEMPLATES type dependencies

function isValidStep(step: number): boolean {
  return step >= 1 && step <= 21;
}

export const templateService = {
  async getTemplates(): Promise<TemplateData[]> {
    const results: TemplateData[] = [];
    for (let i = 1; i <= 21; i++) {
      const tpl = await getStepTemplate(i);
      if (tpl) results.push({ ...tpl, step: i });
    }
    return results;
  },

  async getTemplate(id: string): Promise<TemplateData | null> {
    const step = parseInt(id.replace('step-', ''));
    if (!isValidStep(step)) return null;
    const template = await getStepTemplate(step);
    return template ? { ...template, step } : null;
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

  // Nova função para obter template por número da etapa
  async getTemplateByStep(step: number): Promise<TemplateData | null> {
    if (!isValidStep(step)) return null;
    const template = await getStepTemplate(step);
    return template ? { ...template, step } : null;
  },

  // Nova função para converter blocos do template para blocos do editor
  convertTemplateBlocksToEditorBlocks(templateBlocks: TemplateBlock[]): Block[] {
    return templateBlocks.map((block, index) => {
      const mergedProps = {
        ...(block.properties || {}),
        ...(block.children ? { children: block.children } : {}),
      };
      return {
        id: block.id,
        type: block.type as any,
        content: { ...mergedProps }, // compatibilidade com renderizadores legados
        order: typeof (block as any).position === 'number' ? (block as any).position : index,
        properties: mergedProps,
      };
    });
  },
};

export default templateService;
