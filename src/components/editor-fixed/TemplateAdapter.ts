/**
 * 🔄 ADAPTADOR: Converte templates existentes para formato do sistema
 *
 * Conecta os 92 templates existentes com o novo sistema JSON
 * SEM quebrar compatibilidade
 */

import { JsonBlock, JsonTemplate } from './JsonTemplateEngine';

// =============================================
// TIPOS DOS TEMPLATES EXISTENTES
// =============================================

interface ExistingTemplateBlock {
  id: string;
  type: string;
  position: number;
  properties: Record<string, any>;
}

interface ExistingTemplate {
  templateVersion: string;
  layout: {
    containerWidth: 'full' | 'contained' | 'narrow';
    spacing: 'none' | 'small' | 'medium' | 'large';
    backgroundColor: string;
    responsive: boolean;
  };
  validation?: {
    required?: boolean;
    minAnswers?: number;
    maxAnswers?: number;
    validationMessage?: string;
  };
  analytics?: {
    events?: string[];
    trackingId?: string;
  };
  metadata: {
    id: string;
    name: string;
    description: string;
    category: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  };
  blocks: ExistingTemplateBlock[];
}

// =============================================
// ADAPTADOR PRINCIPAL
// =============================================

export class TemplateAdapter {
  /**
   * 🎯 MAPEAMENTO DE COMPONENTES: Fallbacks para tipos não encontrados
   */
  private static readonly COMPONENT_FALLBACKS: Record<string, string> = {
    // Componentes específicos → Genéricos
    'quiz-intro-header': 'header-inline',
    'options-grid': 'grid-inline', 
    'result-card': 'card-inline',
    'loading-animation': 'text-inline',
    'progress-bar': 'spacer-inline',
    'lead-form': 'form-inline',
    'offer-header': 'header-inline',
    'offer-hero-section': 'hero-inline',
    'offer-product-showcase': 'grid-inline',
    'offer-problem-section': 'text-block',
    'offer-solution-section': 'text-block',
    'offer-guarantee-section': 'card-inline',
    'offer-faq-section': 'accordion-inline',
    
    // Fallback final
    'unknown': 'text-inline'
  };

  /**
   * 🔄 Converte template existente para formato do sistema
   */
  static convertExistingTemplate(existingTemplate: ExistingTemplate): JsonTemplate {
    // Converter blocos
    const convertedBlocks: JsonBlock[] = existingTemplate.blocks.map(block => {
      // Verificar se o tipo existe, caso contrário usar fallback
      const originalType = block.type;
      const mappedType = TemplateAdapter.mapComponentType(originalType);
      
      // Log se houve mapeamento
      if (mappedType !== originalType) {
        console.log(`🔄 Mapeando '${originalType}' → '${mappedType}'`);
      }

      return {
        id: block.id,
        type: mappedType,
        order: block.position,
        properties: {
          // Aplicar mapeamento de propriedades avançado
          ...TemplateAdapter.mapProperties(block.properties, originalType, mappedType),
          
          // Preservar tipo original para referência
          _originalType: originalType,
        },

        // Extrair estilos das propriedades se existirem
        style: TemplateAdapter.extractStylesFromProperties(block.properties),
      };
    });

    // Inferir categoria baseada no metadata
    const category = TemplateAdapter.inferCategory(existingTemplate.metadata);

    // Criar template no formato do sistema
    const convertedTemplate: JsonTemplate = {
      id: existingTemplate.metadata.id,
      name: existingTemplate.metadata.name,
      description: existingTemplate.metadata.description,
      version: existingTemplate.templateVersion || '1.0',
      category: category,

      layout: {
        containerWidth: existingTemplate.layout.containerWidth,
        spacing: existingTemplate.layout.spacing,
        backgroundColor: existingTemplate.layout.backgroundColor,
        responsive: existingTemplate.layout.responsive,
      },

      blocks: convertedBlocks,

      // Configurações opcionais
      stepConfig: TemplateAdapter.convertValidationToStepConfig(existingTemplate.validation),
      analytics: existingTemplate.analytics,

      // Estilos globais (extrair se houver)
      globalStyles: TemplateAdapter.extractGlobalStyles(existingTemplate),
    };

    return convertedTemplate;
  }

  /**
   * 🎯 MAPEAR TIPO DE COMPONENTE: Aplicar fallbacks
   */
  private static mapComponentType(originalType: string): string {
    // Primeiro verificar se existe no registry
    const { ENHANCED_BLOCK_REGISTRY } = require('@/config/enhancedBlockRegistry');
    
    if (ENHANCED_BLOCK_REGISTRY && originalType in ENHANCED_BLOCK_REGISTRY) {
      return originalType; // Tipo existe, manter original
    }

    // Aplicar fallback
    if (originalType in TemplateAdapter.COMPONENT_FALLBACKS) {
      return TemplateAdapter.COMPONENT_FALLBACKS[originalType];
    }

    // Fallback final baseado no nome
    if (originalType.includes('header')) return 'header-inline';
    if (originalType.includes('button')) return 'button-inline';  
    if (originalType.includes('text')) return 'text-inline';
    if (originalType.includes('image')) return 'image-inline';
    if (originalType.includes('grid') || originalType.includes('options')) return 'grid-inline';
    if (originalType.includes('card')) return 'card-inline';
    if (originalType.includes('form')) return 'form-inline';

    // Último recurso
    return 'text-inline';
  }

  /**
   * 🔄 MAPEAR PROPRIEDADES: Converter propriedades específicas para formato genérico
   */
  private static mapProperties(
    originalProps: Record<string, any>, 
    originalType: string, 
    mappedType: string
  ): Record<string, any> {
    const mappedProps = { ...originalProps };

    // Mapeamento baseado no tipo original
    switch (originalType) {
      case 'quiz-intro-header':
        mappedProps.title = originalProps.logoAlt || 'Header';
        mappedProps.showProgress = originalProps.showProgress || false;
        mappedProps.progressValue = originalProps.progressValue || 0;
        break;

      case 'options-grid':
        mappedProps.columns = originalProps.columns || 2;
        mappedProps.gap = originalProps.spacing || 'medium';
        mappedProps.items = originalProps.options || [];
        break;

      case 'result-card':
        mappedProps.title = originalProps.resultTitle || originalProps.title;
        mappedProps.description = originalProps.resultDescription || originalProps.description;
        mappedProps.image = originalProps.resultImage || originalProps.imageUrl;
        break;

      case 'loading-animation':
        mappedProps.text = originalProps.loadingText || 'Carregando...';
        mappedProps.duration = originalProps.duration || 3000;
        break;

      case 'progress-bar':
        mappedProps.value = originalProps.progressValue || 0;
        mappedProps.max = originalProps.progressTotal || 100;
        mappedProps.showLabel = originalProps.showProgress || true;
        break;

      case 'lead-form':
        mappedProps.fields = originalProps.formFields || [
          { type: 'email', label: 'Email', required: true }
        ];
        mappedProps.submitText = originalProps.buttonText || 'Enviar';
        break;

      case 'offer-header':
      case 'offer-hero-section':
        mappedProps.title = originalProps.offerTitle || originalProps.title;
        mappedProps.subtitle = originalProps.offerSubtitle || originalProps.subtitle;
        mappedProps.image = originalProps.heroImage || originalProps.imageUrl;
        break;
    }

    // Mapeamentos genéricos sempre aplicados
    mappedProps.text = mappedProps.text || mappedProps.content || '';
    mappedProps.title = mappedProps.title || '';
    mappedProps.description = mappedProps.description || '';

    // Mapear estilos CSS
    if (originalProps.fontSize) {
      mappedProps.fontSize = TemplateAdapter.convertTailwindFontSize(originalProps.fontSize);
    }
    if (originalProps.textAlign) {
      mappedProps.textAlign = TemplateAdapter.convertTailwindTextAlign(originalProps.textAlign);
    }
    if (originalProps.fontWeight) {
      mappedProps.fontWeight = TemplateAdapter.convertTailwindFontWeight(originalProps.fontWeight);
    }

    return mappedProps;
  }

  /**
   * 🎨 Extrai estilos das propriedades do bloco
   */
  private static extractStylesFromProperties(properties: Record<string, any>): Record<string, any> {
    const styles: Record<string, any> = {};

    // Mapeamento de propriedades comuns para CSS
    const styleMapping = {
      backgroundColor: 'backgroundColor',
      textColor: 'color',
      fontSize: 'fontSize',
      fontWeight: 'fontWeight',
      textAlign: 'textAlign',
      marginTop: 'marginTop',
      marginBottom: 'marginBottom',
      padding: 'padding',
      borderRadius: 'borderRadius',
      width: 'width',
      height: 'height',
    };

    Object.entries(styleMapping).forEach(([propKey, cssKey]) => {
      if (properties[propKey] !== undefined) {
        styles[cssKey] = properties[propKey];
      }
    });

    // Tratar propriedades especiais do Tailwind
    if (properties.fontSize && typeof properties.fontSize === 'string') {
      styles.fontSize = TemplateAdapter.convertTailwindFontSize(properties.fontSize);
    }

    if (properties.textAlign && typeof properties.textAlign === 'string') {
      styles.textAlign = TemplateAdapter.convertTailwindTextAlign(properties.textAlign);
    }

    if (properties.fontWeight && typeof properties.fontWeight === 'string') {
      styles.fontWeight = TemplateAdapter.convertTailwindFontWeight(properties.fontWeight);
    }

    return styles;
  }

  /**
   * 🏷️ Infere categoria baseada no metadata
   */
  private static inferCategory(metadata: {
    category?: string;
    tags?: string[];
    name?: string;
  }): JsonTemplate['category'] {
    // Usar categoria explícita se disponível
    if (metadata.category) {
      switch (metadata.category.toLowerCase()) {
        case 'intro':
        case 'introduction':
          return 'intro';
        case 'question':
        case 'quiz':
          return 'question';
        case 'result':
        case 'results':
          return 'result';
        case 'transition':
          return 'transition';
        default:
          return 'custom';
      }
    }

    // Inferir das tags
    if (metadata.tags) {
      if (metadata.tags.includes('intro')) return 'intro';
      if (metadata.tags.includes('question') || metadata.tags.includes('quiz')) return 'question';
      if (metadata.tags.includes('result')) return 'result';
      if (metadata.tags.includes('transition')) return 'transition';
    }

    // Inferir do nome
    if (metadata.name) {
      const name = metadata.name.toLowerCase();
      if (name.includes('intro') || name.includes('começar')) return 'intro';
      if (name.includes('pergunta') || name.includes('questão')) return 'question';
      if (name.includes('resultado') || name.includes('final')) return 'result';
      if (name.includes('transição')) return 'transition';
    }

    return 'custom';
  }

  /**
   * ⚙️ Converte validação para configuração de etapa
   */
  private static convertValidationToStepConfig(validation?: ExistingTemplate['validation']) {
    if (!validation) return undefined;

    return {
      stepNumber: 1, // Será ajustado quando usado
      isRequired: validation.required || false,
      nextStepCondition: (validation.minAnswers && validation.minAnswers > 0
        ? 'on_validation'
        : 'always') as 'on_validation' | 'always' | 'on_selection',
      validationRules: {
        minSelections: validation.minAnswers,
        maxSelections: validation.maxAnswers,
        requiredFields: validation.required ? ['answer'] : undefined,
      },
    };
  }

  /**
   * 🌍 Extrai estilos globais do template
   */
  private static extractGlobalStyles(template: ExistingTemplate): Record<string, any> {
    const globalStyles: Record<string, any> = {};

    // Extrair cores do tema baseado nos blocos
    const colors = new Set<string>();
    template.blocks.forEach(block => {
      if (block.properties.backgroundColor) colors.add(block.properties.backgroundColor);
      if (block.properties.textColor) colors.add(block.properties.textColor);
    });

    if (colors.size > 0) {
      globalStyles.themeColors = Array.from(colors);
    }

    return globalStyles;
  }

  // =============================================
  // CONVERSORES TAILWIND → CSS
  // =============================================

  private static convertTailwindFontSize(tailwindClass: string): string {
    const mapping: Record<string, string> = {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
      'text-4xl': '2.25rem',
      'text-5xl': '3rem',
      'text-6xl': '3.75rem',
    };
    return mapping[tailwindClass] || tailwindClass;
  }

  private static convertTailwindTextAlign(tailwindClass: string): string {
    const mapping: Record<string, string> = {
      'text-left': 'left',
      'text-center': 'center',
      'text-right': 'right',
      'text-justify': 'justify',
    };
    return mapping[tailwindClass] || tailwindClass;
  }

  private static convertTailwindFontWeight(tailwindClass: string): string {
    const mapping: Record<string, string> = {
      'font-thin': '100',
      'font-extralight': '200',
      'font-light': '300',
      'font-normal': '400',
      'font-medium': '500',
      'font-semibold': '600',
      'font-bold': '700',
      'font-extrabold': '800',
      'font-black': '900',
    };
    return mapping[tailwindClass] || tailwindClass;
  }

  // =============================================
  // UTILIDADES PARA CARREGAMENTO
  // =============================================

  /**
   * 📄 Carrega e converte template existente
   */
  static async loadAndConvertTemplate(templatePath: string): Promise<JsonTemplate | null> {
    try {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const existingTemplate: ExistingTemplate = await response.json();
      const convertedTemplate = TemplateAdapter.convertExistingTemplate(existingTemplate);

      return convertedTemplate;
    } catch (error) {
      console.error(`❌ Erro ao carregar template: ${templatePath}`, error);
      return null;
    }
  }

  /**
   * 🔢 Carrega template de etapa específica
   */
  static async loadStepTemplate(stepNumber: number): Promise<JsonTemplate | null> {
    if (stepNumber < 1 || stepNumber > 21) {
      console.error('❌ Número da etapa deve estar entre 1 e 21');
      return null;
    }

    const stepId = stepNumber.toString().padStart(2, '0');
    const templatePath = `/templates/step-${stepId}-template.json`;

    const template = await TemplateAdapter.loadAndConvertTemplate(templatePath);

    // Ajustar stepNumber se houver stepConfig
    if (template && template.stepConfig) {
      template.stepConfig.stepNumber = stepNumber;
    }

    return template;
  }

  /**
   * 🔍 Lista todos os templates disponíveis
   */
  static async discoverAvailableTemplates(): Promise<
    Array<{ step: number; path: string; exists: boolean }>
  > {
    const templates = [];

    for (let step = 1; step <= 21; step++) {
      const stepId = step.toString().padStart(2, '0');
      const path = `/templates/step-${stepId}-template.json`;

      try {
        const response = await fetch(path, { method: 'HEAD' });
        templates.push({
          step,
          path,
          exists: response.ok,
        });
      } catch {
        templates.push({
          step,
          path,
          exists: false,
        });
      }
    }

    return templates;
  }

  /**
   * 🧪 Testa conversão de um template
   */
  static async testTemplateConversion(stepNumber: number): Promise<{
    success: boolean;
    originalSize: number;
    convertedSize: number;
    blocksCount: number;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      const stepId = stepNumber.toString().padStart(2, '0');
      const templatePath = `/templates/step-${stepId}-template.json`;

      // Carregar template original
      const response = await fetch(templatePath);
      const originalTemplate = await response.json();
      const originalSize = JSON.stringify(originalTemplate).length;

      // Converter
      const convertedTemplate = TemplateAdapter.convertExistingTemplate(originalTemplate);
      const convertedSize = JSON.stringify(convertedTemplate).length;

      return {
        success: true,
        originalSize,
        convertedSize,
        blocksCount: convertedTemplate.blocks.length,
        errors,
      };
    } catch (error) {
      errors.push(String(error));
      return {
        success: false,
        originalSize: 0,
        convertedSize: 0,
        blocksCount: 0,
        errors,
      };
    }
  }
}

export default TemplateAdapter;
