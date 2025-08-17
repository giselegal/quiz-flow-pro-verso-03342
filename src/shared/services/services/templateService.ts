import { STEP_TEMPLATES, getStepTemplate } from '../config/templates/templates';
import type { Block, BlockType } from '../types/editor';

// ===== IMPORT DO STEP01 TYPESCRIPT FUNCIONAL =====

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
      // ===== CASO ESPECIAL: STEP01 USA TEMPLATE TYPESCRIPT FUNCIONAL =====
      if (step === 1) {
        console.log('🎯 Step01: Usando Step01Template.tsx');

        // Obter blocos do template TypeScript
        // TODO: Migrado para TemplateRenderer - remover se não necessário
        console.log(`✅ Step01Template carregado: ${step01Blocks.length} blocos`);

        const step01Template: TemplateData = {
          templateVersion: '1.0.0',
          metadata: {
            id: 'step-01-intro',
            name: 'Introdução do Quiz - Step 01',
            description: 'Template de introdução do questionário de estilo',
            category: 'quiz',
            type: 'intro',
            tags: ['quiz', 'introdução', 'step01'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: 'Step01Template.tsx',
          },
          design: {
            primaryColor: '#B89B7A',
            secondaryColor: '#D4C2A8',
            accentColor: '#432818',
            backgroundColor: '#ffffff',
            fontFamily: 'Playfair Display, serif',
            button: { backgroundColor: '#B89B7A', color: '#ffffff' },
            card: { borderRadius: '12px', shadow: 'lg' },
            progressBar: { color: '#B89B7A' },
            animations: { enabled: true },
            imageOptionSize: { width: 300, height: 204 },
          },
          layout: {
            containerWidth: 'max-w-2xl',
            spacing: 'space-y-6',
            backgroundColor: '#ffffff',
            responsive: true,
            animations: { fade: true, slide: true },
          },
          blocks: step01Blocks as TemplateBlock[],
          validation: {
            nameField: {
              required: true,
              minLength: 2,
              maxLength: 50,
              errorMessage: 'Nome é obrigatório',
              realTimeValidation: true,
            },
          },
          analytics: {
            trackingId: 'step01-intro',
            events: ['form_start', 'name_input', 'cta_click'],
            utmParams: true,
            customEvents: ['intro_view', 'user_name_entered'],
          },
          logic: {
            navigation: {
              nextStep: '2',
              prevStep: null,
              allowBack: false,
              autoAdvance: false,
            },
            formHandling: {
              onSubmit: 'validateAndNext',
              validation: 'realTime',
              errorHandling: 'inline',
            },
            stateManagement: {
              localState: ['userName'],
              globalState: ['userProgress', 'currentStep'],
            },
            scoring: {},
            conditions: {},
          },
          performance: {
            webVitals: {
              markComponentMounted: true,
              markLcpRendered: true,
              markUserInteraction: true,
            },
            optimizations: {
              preloadCriticalImages: true,
              inlineStyles: true,
              lazyLoadNonCritical: false,
              useRequestAnimationFrame: true,
            },
          },
          accessibility: {
            skipLinks: true,
            ariaLabels: true,
            focusManagement: true,
            keyboardNavigation: true,
            screenReader: true,
          },
        };

        console.log(`✅ Step01 JSON carregado: ${step01Template.blocks.length} blocos`);
        return step01Template;
      }

      // ===== STEPS 2-21: USAR SISTEMA TYPESCRIPT EXISTENTE =====
      console.log(`🔍 Step${step}: Usando sistema TypeScript`);
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
