/**
 * 🔍 SERVIÇO DE EXTRAÇÃO UNIVERSAL DE PROPRIEDADES
 *
 * Extrai e organiza TODAS as propriedades configuráveis de qualquer bloco,
 * incluindo properties, content, metadata e configurações de validação.
 */

import { Block } from '@/types/editor';

export interface PropertyField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'range' | 'array' | 'object' | 'interpolated-text';
  category: PropertyCategory;
  value: any;
  defaultValue?: any;
  description?: string;
  supportsInterpolation: boolean;
  availableVariables?: DynamicVariable[];
  validation?: ValidationRule[];
  isRequired?: boolean;
  isAdvanced?: boolean;
  options?: string[] | { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export type PropertyCategory =
  | 'content'      // Textos, imagens, dados
  | 'style'        // Cores, tipografia, efeitos
  | 'layout'       // Posicionamento, dimensões
  | 'behavior'     // Interações, navegação
  | 'validation'   // Regras de validação
  | 'accessibility'// Acessibilidade
  | 'advanced'     // Configurações técnicas
  | 'metadata';    // Informações do sistema

export interface DynamicVariable {
  key: string;
  label: string;
  description: string;
  currentValue: string;
  context: string[];
  example?: string;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface CategorizedProperties {
  [category: string]: PropertyField[];
}

/**
 * Variáveis dinâmicas disponíveis para interpolação
 */
export const AVAILABLE_VARIABLES: DynamicVariable[] = [
  {
    key: 'userName',
    label: 'Nome do Usuário',
    description: 'Nome coletado no formulário inicial',
    currentValue: 'Ana Silva',
    context: ['all'],
    example: 'Olá, {userName}!'
  },
  {
    key: 'resultStyle',
    label: 'Estilo Predominante',
    description: 'Estilo calculado baseado nas respostas',
    currentValue: 'Clássico Elegante',
    context: ['result', 'final', 'offer'],
    example: 'Seu estilo é {resultStyle}'
  },
  {
    key: 'quizStep',
    label: 'Etapa Atual',
    description: 'Número da etapa atual do quiz',
    currentValue: '1',
    context: ['all'],
    example: 'Etapa {quizStep} de 21'
  },
  {
    key: 'offerPrice',
    label: 'Preço da Oferta',
    description: 'Valor da oferta especial',
    currentValue: 'R$ 197',
    context: ['offer', 'checkout'],
    example: 'Apenas {offerPrice} hoje!'
  },
  {
    key: 'resultPercentage',
    label: 'Percentual do Resultado',
    description: 'Percentual de afinidade com o estilo',
    currentValue: '87%',
    context: ['result', 'final'],
    example: '{resultPercentage} de afinidade'
  }
];

export class PropertyExtractionService {
  /**
   * Extrai TODAS as propriedades de um bloco
   */
  extractAllProperties(block: Block, _templateData?: any): PropertyField[] {
    const properties: PropertyField[] = [];

    // 1. Extrair propriedades do bloco
    if (block.properties) {
      Object.entries(block.properties).forEach(([key, value]) => {
        properties.push(this.createPropertyField(key, value, 'content', block.type));
      });
    }

    // 2. Extrair content do bloco
    if (block.content) {
      if (typeof block.content === 'object') {
        Object.entries(block.content).forEach(([key, value]) => {
          properties.push(this.createPropertyField(`content.${key}`, value, 'content', block.type));
        });
      } else {
        properties.push(this.createPropertyField('content', block.content, 'content', block.type));
      }
    }

    // 3. Propriedades básicas do bloco
    properties.push(
      {
        key: 'id',
        label: 'ID do Bloco',
        type: 'text',
        category: 'metadata',
        value: block.id,
        supportsInterpolation: false,
        description: 'Identificador único do bloco',
        isAdvanced: true
      },
      {
        key: 'type',
        label: 'Tipo do Bloco',
        type: 'text',
        category: 'metadata',
        value: block.type,
        supportsInterpolation: false,
        description: 'Tipo do componente',
        isAdvanced: true
      }
    );

    // 4. Propriedades específicas por tipo
    properties.push(...this.getTypeSpecificProperties(block));

    return properties;
  }

  /**
   * Categoriza propriedades automaticamente
   */
  categorizeProperties(properties: PropertyField[]): CategorizedProperties {
    const categorized: CategorizedProperties = {};

    properties.forEach(prop => {
      if (!categorized[prop.category]) {
        categorized[prop.category] = [];
      }
      categorized[prop.category].push(prop);
    });

    // Ordenar categorias por prioridade
    const categoryOrder = ['content', 'style', 'layout', 'behavior', 'validation', 'accessibility', 'advanced', 'metadata'];
    const sorted: CategorizedProperties = {};

    categoryOrder.forEach(category => {
      if (categorized[category]) {
        sorted[category] = categorized[category];
      }
    });

    return sorted;
  }

  /**
   * Identifica campos que suportam interpolação
   */
  identifyInterpolationFields(properties: PropertyField[]): PropertyField[] {
    return properties.map(prop => {
      if (prop.type === 'text' || prop.type === 'textarea') {
        const supportsInterpolation = this.isInterpolatableField(prop.key);
        return {
          ...prop,
          supportsInterpolation,
          type: supportsInterpolation ? 'interpolated-text' : prop.type,
          availableVariables: supportsInterpolation ? this.getAvailableVariables(prop.key) : undefined
        };
      }
      return prop;
    });
  }

  /**
   * Valida se um campo pode usar interpolação
   */
  private isInterpolatableField(key: string): boolean {
    const interpolatableFields = [
      'title', 'subtitle', 'text', 'content', 'label', 'placeholder',
      'description', 'buttonText', 'heading', 'subheading', 'message',
      'content.title', 'content.subtitle', 'content.text', 'content.description'
    ];

    return interpolatableFields.some(field =>
      key.includes(field) || key.toLowerCase().includes('text') || key.toLowerCase().includes('title')
    );
  }

  /**
   * Obtém variáveis disponíveis baseado no contexto
   */
  private getAvailableVariables(fieldKey: string): DynamicVariable[] {
    // Para campos de resultado, mostrar variáveis de resultado
    if (fieldKey.includes('result') || fieldKey.includes('final')) {
      return AVAILABLE_VARIABLES.filter(v =>
        v.context.includes('result') || v.context.includes('all')
      );
    }

    // Para campos de oferta, mostrar variáveis de oferta
    if (fieldKey.includes('offer') || fieldKey.includes('price')) {
      return AVAILABLE_VARIABLES.filter(v =>
        v.context.includes('offer') || v.context.includes('all')
      );
    }

    // Por padrão, mostrar variáveis globais
    return AVAILABLE_VARIABLES.filter(v => v.context.includes('all'));
  }

  /**
   * Cria um campo de propriedade
   */
  private createPropertyField(key: string, value: any, _defaultCategory: PropertyCategory, blockType: string): PropertyField {
    const category = this.inferCategory(key, blockType);
    const type = this.inferType(key, value);

    return {
      key,
      label: this.generateLabel(key),
      type,
      category,
      value,
      defaultValue: this.getDefaultValue(key, type),
      description: this.generateDescription(key, blockType),
      supportsInterpolation: false, // Será definido posteriormente
      isRequired: this.isRequiredField(key),
      isAdvanced: this.isAdvancedField(key),
      placeholder: this.generatePlaceholder(key, type),
      ...this.getTypeSpecificConfig(type, key)
    };
  }

  /**
   * Infere a categoria baseada na chave
   */
  private inferCategory(key: string, _blockType: string): PropertyCategory {
    const categoryMap: Record<string, PropertyCategory> = {
      // Conteúdo
      'title': 'content',
      'subtitle': 'content',
      'text': 'content',
      'content': 'content',
      'label': 'content',
      'placeholder': 'content',
      'description': 'content',
      'src': 'content',
      'alt': 'content',
      'href': 'content',

      // Estilo
      'color': 'style',
      'backgroundColor': 'style',
      'fontSize': 'style',
      'fontFamily': 'style',
      'fontWeight': 'style',
      'textAlign': 'style',
      'borderRadius': 'style',
      'borderColor': 'style',
      'borderWidth': 'style',

      // Layout
      'width': 'layout',
      'height': 'layout',
      'margin': 'layout',
      'padding': 'layout',
      'position': 'layout',
      'display': 'layout',

      // Comportamento
      'onClick': 'behavior',
      'onSubmit': 'behavior',
      'disabled': 'behavior',
      'required': 'behavior',
      'validation': 'behavior',

      // Acessibilidade
      'aria': 'accessibility',
      'role': 'accessibility',
      'tabIndex': 'accessibility',

      // Avançado
      'id': 'advanced',
      'className': 'advanced',
      'style': 'advanced',
      'data': 'advanced'
    };

    // Buscar por padrões na chave
    for (const [pattern, category] of Object.entries(categoryMap)) {
      if (key.toLowerCase().includes(pattern)) {
        return category;
      }
    }

    return 'content'; // Padrão
  }

  /**
   * Infere o tipo do campo baseado na chave e valor
   */
  private inferType(key: string, value: any): PropertyField['type'] {
    // Baseado no tipo do valor
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';

    // Baseado na chave
    if (key.includes('color') || key.includes('Color')) return 'color';
    if (key.includes('description') || key.includes('content') || key.includes('text')) return 'textarea';
    if (key.includes('size') || key.includes('width') || key.includes('height') || key.includes('radius')) return 'range';

    return 'text';
  }

  /**
   * Gera um label legível
   */
  private generateLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/content\./i, '')
      .trim();
  }

  /**
   * Gera descrição contextual
   */
  private generateDescription(key: string, blockType: string): string {
    const descriptions: Record<string, string> = {
      'title': 'Título principal do elemento',
      'subtitle': 'Subtítulo ou texto secundário',
      'content': 'Conteúdo principal do bloco',
      'text': 'Texto a ser exibido',
      'color': 'Cor do texto ou elemento',
      'backgroundColor': 'Cor de fundo',
      'fontSize': 'Tamanho da fonte',
      'width': 'Largura do elemento',
      'height': 'Altura do elemento'
    };

    return descriptions[key] || `Configura ${this.generateLabel(key).toLowerCase()} do ${blockType}`;
  }

  /**
   * Verifica se é campo obrigatório
   */
  private isRequiredField(key: string): boolean {
    const requiredFields = ['title', 'content', 'text', 'src', 'alt'];
    return requiredFields.some(field => key.includes(field));
  }

  /**
   * Verifica se é campo avançado
   */
  private isAdvancedField(key: string): boolean {
    const advancedFields = ['id', 'className', 'style', 'data-', 'aria-', 'role'];
    return advancedFields.some(field => key.toLowerCase().includes(field));
  }

  /**
   * Gera placeholder apropriado
   */
  private generatePlaceholder(key: string, type: string): string {
    if (type === 'color') return '#000000';
    if (key.includes('url') || key.includes('src')) return 'https://exemplo.com/imagem.jpg';
    if (key.includes('email')) return 'usuario@exemplo.com';
    if (key.includes('title')) return 'Digite o título...';
    if (key.includes('text') || key.includes('content')) return 'Digite o texto...';
    return `Digite ${this.generateLabel(key).toLowerCase()}...`;
  }

  /**
   * Obtém configurações específicas por tipo
   */
  private getTypeSpecificConfig(type: string, key: string): Partial<PropertyField> {
    switch (type) {
      case 'number':
      case 'range':
        return {
          min: key.includes('percentage') ? 0 : undefined,
          max: key.includes('percentage') ? 100 : undefined,
          step: key.includes('percentage') ? 1 : undefined
        };

      case 'select':
        return {
          options: this.getSelectOptions(key)
        };

      default:
        return {};
    }
  }

  /**
   * Obtém opções para campos select
   */
  private getSelectOptions(key: string): string[] {
    const optionsMap: Record<string, string[]> = {
      'fontSize': ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'],
      'fontWeight': ['font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold'],
      'textAlign': ['text-left', 'text-center', 'text-right', 'text-justify'],
      'variant': ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      'size': ['sm', 'default', 'lg', 'xl']
    };

    return optionsMap[key] || [];
  }

  /**
   * Obtém valor padrão baseado no tipo
   */
  private getDefaultValue(_key: string, type: string): any {
    if (type === 'boolean') return false;
    if (type === 'number' || type === 'range') return 0;
    if (type === 'array') return [];
    if (type === 'object') return {};
    if (type === 'color') return '#000000';
    return '';
  }

  /**
   * Propriedades específicas por tipo de bloco
   */
  private getTypeSpecificProperties(block: Block): PropertyField[] {
    const properties: PropertyField[] = [];

    switch (block.type) {
      case 'text-inline':
        properties.push(
          {
            key: 'htmlContent',
            label: 'Conteúdo HTML',
            type: 'interpolated-text',
            category: 'content',
            value: block.properties?.htmlContent || '',
            supportsInterpolation: true,
            availableVariables: AVAILABLE_VARIABLES,
            description: 'Conteúdo HTML com suporte a variáveis dinâmicas',
            isRequired: true
          }
        );
        break;

      case 'button-inline':
        properties.push(
          {
            key: 'buttonText',
            label: 'Texto do Botão',
            type: 'interpolated-text',
            category: 'content',
            value: block.properties?.text || 'Clique aqui',
            supportsInterpolation: true,
            availableVariables: AVAILABLE_VARIABLES,
            description: 'Texto exibido no botão',
            isRequired: true
          }
        );
        break;

      case 'image-display-inline':
        properties.push(
          {
            key: 'imageUrl',
            label: 'URL da Imagem',
            type: 'text',
            category: 'content',
            value: block.properties?.src || '',
            supportsInterpolation: false,
            description: 'URL da imagem a ser exibida',
            placeholder: 'https://exemplo.com/imagem.jpg',
            isRequired: true
          }
        );
        break;

      case 'options-grid':
        // === CONTEÚDO ===
        properties.push(
          {
            key: 'title',
            label: 'Título da Questão',
            type: 'interpolated-text',
            category: 'content',
            value: block.properties?.title || 'Escolha uma opção:',
            supportsInterpolation: true,
            availableVariables: AVAILABLE_VARIABLES,
            description: 'Pergunta principal exibida acima das opções',
            isRequired: true
          },
          {
            key: 'description',
            label: 'Descrição/Subtítulo',
            type: 'textarea',
            category: 'content',
            value: block.properties?.description || '',
            supportsInterpolation: false,
            description: 'Texto adicional explicativo (opcional)'
          },
          {
            key: 'options',
            label: 'Opções da Questão',
            type: 'array',
            category: 'content',
            value: block.properties?.options || [],
            supportsInterpolation: false,
            description: 'Configure todas as opções disponíveis para seleção'
          }
        );

        // === LAYOUT ===
        properties.push(
          {
            key: 'columns',
            label: 'Número de Colunas',
            type: 'range',
            category: 'layout',
            value: block.properties?.columns || 2,
            min: 1,
            max: 4,
            step: 1,
            supportsInterpolation: false,
            description: 'Quantas colunas terá o grid de opções'
          },
          {
            key: 'gridGap',
            label: 'Espaçamento entre Opções',
            type: 'range',
            category: 'layout',
            value: block.properties?.gridGap || 16,
            min: 0,
            max: 48,
            step: 2,
            supportsInterpolation: false,
            description: 'Distância entre cada opção no grid'
          },
          {
            key: 'layoutOrientation',
            label: 'Orientação do Layout',
            type: 'select',
            category: 'layout',
            value: block.properties?.layoutOrientation || 'vertical',
            options: [
              { label: 'Vertical', value: 'vertical' },
              { label: 'Horizontal', value: 'horizontal' }
            ],
            supportsInterpolation: false
          }
        );

        // === COMPORTAMENTO ===
        properties.push(
          {
            key: 'multipleSelection',
            label: 'Permitir Seleção Múltipla',
            type: 'boolean',
            category: 'behavior',
            value: block.properties?.multipleSelection || false,
            supportsInterpolation: false,
            description: 'Permitir selecionar várias opções simultaneamente'
          },
          {
            key: 'minSelections',
            label: 'Mínimo de Seleções',
            type: 'range',
            category: 'behavior',
            value: block.properties?.minSelections || 1,
            min: 0,
            max: 10,
            step: 1,
            supportsInterpolation: false,
            description: 'Número mínimo de opções que devem ser selecionadas'
          },
          {
            key: 'maxSelections',
            label: 'Máximo de Seleções',
            type: 'range',
            category: 'behavior',
            value: block.properties?.maxSelections || 1,
            min: 1,
            max: 10,
            step: 1,
            supportsInterpolation: false,
            description: 'Número máximo de opções que podem ser selecionadas'
          },
          {
            key: 'autoAdvanceOnComplete',
            label: 'Auto Avançar ao Completar',
            type: 'boolean',
            category: 'behavior',
            value: block.properties?.autoAdvanceOnComplete || false,
            supportsInterpolation: false,
            description: 'Avançar automaticamente quando atingir seleções obrigatórias'
          },
          {
            key: 'autoAdvanceDelay',
            label: 'Delay do Auto Avanço (ms)',
            type: 'range',
            category: 'behavior',
            value: block.properties?.autoAdvanceDelay || 1000,
            min: 0,
            max: 5000,
            step: 100,
            supportsInterpolation: false,
            description: 'Tempo de espera antes do auto avanço'
          }
        );

        // === ESTILO ===
        properties.push(
          {
            key: 'showImages',
            label: 'Exibir Imagens',
            type: 'boolean',
            category: 'style',
            value: block.properties?.showImages !== false,
            supportsInterpolation: false,
            description: 'Ativar/desativar imagens nas opções'
          },
          {
            key: 'contentMode',
            label: 'Modo de Conteúdo',
            type: 'select',
            category: 'style',
            value: block.properties?.contentMode || 'text-and-image',
            options: [
              { label: '🖼️ Imagem + Texto', value: 'text-and-image' },
              { label: '📷 Apenas Imagem', value: 'image-only' },
              { label: '📝 Apenas Texto', value: 'text-only' }
            ],
            supportsInterpolation: false,
            description: 'Que tipo de conteúdo exibir nas opções'
          },
          {
            key: 'imageSize',
            label: 'Tamanho das Imagens',
            type: 'range',
            category: 'style',
            value: block.properties?.imageSize || 256,
            min: 100,
            max: 400,
            step: 10,
            supportsInterpolation: false,
            description: 'Tamanho padrão das imagens'
          },
          {
            key: 'backgroundColor',
            label: 'Cor de Fundo',
            type: 'color',
            category: 'style',
            value: block.properties?.backgroundColor || '#FFFFFF',
            supportsInterpolation: false,
            description: 'Cor de fundo das opções não selecionadas'
          },
          {
            key: 'selectedColor',
            label: 'Cor de Fundo Selecionado',
            type: 'color',
            category: 'style',
            value: block.properties?.selectedColor || '#B89B7A',
            supportsInterpolation: false,
            description: 'Cor de fundo quando a opção está selecionada'
          }
        );

        // === VALIDAÇÃO ===
        properties.push(
          {
            key: 'enableValidation',
            label: 'Ativar Validação',
            type: 'boolean',
            category: 'validation',
            value: block.properties?.enableValidation !== false,
            supportsInterpolation: false,
            description: 'Verificar se seleções são válidas antes de prosseguir'
          },
          {
            key: 'validationMessage',
            label: 'Mensagem de Validação',
            type: 'text',
            category: 'validation',
            value: block.properties?.validationMessage || 'Selecione pelo menos uma opção para continuar',
            supportsInterpolation: false,
            description: 'Mensagem exibida quando seleção é inválida'
          }
        );
        break;
    }

    return properties;
  }
}

// Instância singleton do serviço
export const propertyExtractionService = new PropertyExtractionService();