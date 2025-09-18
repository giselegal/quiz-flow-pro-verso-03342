import { Block } from '@/types/editor';
import { blocksRegistry } from '@/core/blocks/registry';

export interface ExtractedProperty {
  key: string;
  type: 'text' | 'textarea' | 'number' | 'range' | 'color' | 'select' | 'switch' | 'array' | 'object' | 'url';
  category: 'content' | 'style' | 'layout' | 'behavior' | 'animation' | 'accessibility' | 'seo' | 'advanced';
  label: string;
  description?: string;
  value: any;
  options?: Array<{ value: any; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  placeholder?: string;
  when?: { key: string; value: any };
}

class PropertyExtractionService {
  /**
   * Extrai propriedades editáveis de um bloco baseado no registry
   */
  extractProperties(block: Block): ExtractedProperty[] {
    if (!block?.type) return [];

    const definition = blocksRegistry[block.type];
    if (!definition?.propsSchema) return [];

    return definition.propsSchema.map(prop => ({
      key: prop.key,
      type: prop.kind,
      category: prop.category as any,
      label: prop.label,
      description: prop.description,
      value: block.properties?.[prop.key] ?? prop.default,
      options: prop.options,
      min: prop.min,
      max: prop.max,
      step: prop.step,
      unit: prop.unit,
      required: prop.required,
      placeholder: prop.placeholder,
      when: prop.when
    }));
  }

  /**
   * Extrai propriedades por categoria
   */
  extractPropertiesByCategory(block: Block): Record<string, ExtractedProperty[]> {
    const properties = this.extractProperties(block);
    
    return properties.reduce((acc, prop) => {
      const category = prop.category || 'advanced';
      if (!acc[category]) acc[category] = [];
      acc[category].push(prop);
      return acc;
    }, {} as Record<string, ExtractedProperty[]>);
  }

  /**
   * Extrai propriedades específicas para componentes Step 20
   */
  extractStep20Properties(block: Block): ExtractedProperty[] {
    const baseProperties = this.extractProperties(block);
    
    // Adicionar propriedades específicas baseadas no tipo do bloco Step 20
    switch (block.type) {
      case 'step20-result-header':
        return this.enhanceResultHeaderProperties(baseProperties, block);
      case 'step20-style-reveal':
        return this.enhanceStyleRevealProperties(baseProperties, block);
      case 'step20-user-greeting':
        return this.enhanceUserGreetingProperties(baseProperties, block);
      case 'step20-compatibility':
        return this.enhanceCompatibilityProperties(baseProperties, block);
      case 'step20-secondary-styles':
        return this.enhanceSecondaryStylesProperties(baseProperties, block);
      case 'step20-personalized-offer':
        return this.enhanceOfferProperties(baseProperties, block);
      default:
        return baseProperties;
    }
  }

  /**
   * Propriedades específicas do ResultHeader
   */
  private enhanceResultHeaderProperties(properties: ExtractedProperty[], block: Block): ExtractedProperty[] {
    const enhanced = [...properties];
    
    // Adicionar propriedades dinâmicas baseadas em dados do quiz
    enhanced.push({
      key: 'dynamicUserName',
      type: 'text',
      category: 'content',
      label: 'Nome do Usuário (Dinâmico)',
      description: 'Nome obtido automaticamente do quiz',
      value: block.properties?.dynamicUserName || 'Carregando...',
      required: false
    });

    return enhanced;
  }

  /**
   * Propriedades específicas do StyleReveal
   */
  private enhanceStyleRevealProperties(properties: ExtractedProperty[], block: Block): ExtractedProperty[] {
    const enhanced = [...properties];
    
    // Adicionar seletor de imagens por estilo
    enhanced.push({
      key: 'styleImageLibrary',
      type: 'select',
      category: 'content',
      label: 'Biblioteca de Imagens por Estilo',
      description: 'Imagens pré-definidas para cada tipo de estilo',
      value: block.properties?.styleImageLibrary || 'auto',
      options: [
        { value: 'auto', label: 'Automático (baseado no resultado)' },
        { value: 'classic', label: 'Imagens - Estilo Clássico' },
        { value: 'romantic', label: 'Imagens - Estilo Romântico' },
        { value: 'dramatic', label: 'Imagens - Estilo Dramático' },
        { value: 'natural', label: 'Imagens - Estilo Natural' },
        { value: 'custom', label: 'Personalizada' }
      ]
    });

    return enhanced;
  }

  /**
   * Propriedades específicas do UserGreeting
   */
  private enhanceUserGreetingProperties(properties: ExtractedProperty[], block: Block): ExtractedProperty[] {
    const enhanced = [...properties];
    
    // Adicionar variáveis dinâmicas
    enhanced.push({
      key: 'dynamicVariables',
      type: 'switch',
      category: 'behavior',
      label: 'Usar Variáveis Dinâmicas',
      description: 'Substitui {userName} e {style} automaticamente',
      value: block.properties?.dynamicVariables ?? true
    });

    return enhanced;
  }

  /**
   * Propriedades específicas do Compatibility
   */
  private enhanceCompatibilityProperties(properties: ExtractedProperty[], block: Block): ExtractedProperty[] {
    const enhanced = [...properties];
    
    // Configurações de animação avançadas
    enhanced.push({
      key: 'animationDuration',
      type: 'range',
      category: 'animation',
      label: 'Duração da Animação',
      description: 'Tempo de animação em milissegundos',
      value: block.properties?.animationDuration || 1500,
      min: 500,
      max: 5000,
      step: 100,
      unit: 'ms'
    });

    enhanced.push({
      key: 'animationDelay',
      type: 'range',
      category: 'animation',
      label: 'Atraso da Animação',
      description: 'Atraso antes de iniciar a animação',
      value: block.properties?.animationDelay || 500,
      min: 0,
      max: 3000,
      step: 100,
      unit: 'ms'
    });

    return enhanced;
  }

  /**
   * Propriedades específicas do SecondaryStyles
   */
  private enhanceSecondaryStylesProperties(properties: ExtractedProperty[], block: Block): ExtractedProperty[] {
    const enhanced = [...properties];
    
    // Layout responsivo avançado
    enhanced.push({
      key: 'responsiveColumns',
      type: 'switch',
      category: 'layout',
      label: 'Colunas Responsivas',
      description: 'Ajusta automaticamente em dispositivos móveis',
      value: block.properties?.responsiveColumns ?? true
    });

    enhanced.push({
      key: 'cardLayout',
      type: 'select',
      category: 'layout',
      label: 'Layout dos Cards',
      value: block.properties?.cardLayout || 'horizontal',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
        { value: 'compact', label: 'Compacto' }
      ]
    });

    return enhanced;
  }

  /**
   * Propriedades específicas da Offer
   */
  private enhanceOfferProperties(properties: ExtractedProperty[], block: Block): ExtractedProperty[] {
    const enhanced = [...properties];
    
    // Configurações de ação do CTA
    enhanced.push({
      key: 'ctaAction',
      type: 'select',
      category: 'behavior',
      label: 'Ação do Botão Principal',
      value: block.properties?.ctaAction || 'url',
      options: [
        { value: 'url', label: 'Abrir URL' },
        { value: 'next-step', label: 'Próximo Passo' },
        { value: 'custom', label: 'Ação Personalizada' }
      ]
    });

    // Configurações de compartilhamento
    enhanced.push({
      key: 'shareIncludesResult',
      type: 'switch',
      category: 'behavior',
      label: 'Incluir Resultado no Compartilhamento',
      description: 'Inclui o estilo descoberto no texto de compartilhamento',
      value: block.properties?.shareIncludesResult ?? true
    });

    return enhanced;
  }

  /**
   * Obter opções de seleção baseadas em dados reais
   */
  getStyleBasedOptions(category: string): Array<{ value: string; label: string }> {
    const styleOptions = {
      icons: [
        { value: 'trophy', label: '🏆 Troféu' },
        { value: 'star', label: '⭐ Estrela' },
        { value: 'heart', label: '💖 Coração' },
        { value: 'award', label: '🥇 Medalha' },
        { value: 'crown', label: '👑 Coroa' }
      ],
      colors: [
        { value: '#B89B7A', label: 'Bronze Elegante' },
        { value: '#aa6b5d', label: 'Terracota' },
        { value: '#432818', label: 'Marrom Escuro' },
        { value: '#F3E8E6', label: 'Rosa Suave' },
        { value: '#8F7A6A', label: 'Bege Neutro' }
      ],
      images: [
        { value: 'classic', label: 'Clássico - Elegância atemporal' },
        { value: 'romantic', label: 'Romântico - Suavidade e feminilidade' },
        { value: 'dramatic', label: 'Dramático - Intensidade e contraste' },
        { value: 'natural', label: 'Natural - Simplicidade e autenticidade' }
      ]
    };

    return styleOptions[category as keyof typeof styleOptions] || [];
  }

  /**
   * Validar propriedades de um bloco
   */
  validateProperties(block: Block): { isValid: boolean; errors: string[] } {
    const properties = this.extractProperties(block);
    const errors: string[] = [];

    properties.forEach(prop => {
      if (prop.required && (prop.value === undefined || prop.value === null || prop.value === '')) {
        errors.push(`Campo obrigatório: ${prop.label}`);
      }

      if (prop.type === 'range' && prop.min !== undefined && prop.max !== undefined) {
        const value = Number(prop.value);
        if (value < prop.min || value > prop.max) {
          errors.push(`${prop.label} deve estar entre ${prop.min} e ${prop.max}`);
        }
      }

      if (prop.type === 'url' && prop.value && prop.value !== '#') {
        try {
          new URL(prop.value);
        } catch {
          errors.push(`${prop.label} deve ser uma URL válida`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const propertyExtractionService = new PropertyExtractionService();
export default PropertyExtractionService;