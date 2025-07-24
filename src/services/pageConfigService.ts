import type { BlockData } from './funnelService';

export interface PageStyles {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  customCSS?: string;
}

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface ConfigBlock extends BlockData {
  componentType?: string;
  props?: Record<string, any>;
  children?: ConfigBlock[];
  conditionalRender?: {
    condition: string;
    value: any;
  };
}

export interface PageConfig {
  pageId: string;
  pageName: string;
  blocks: ConfigBlock[];
  styles: PageStyles;
  metadata: PageMetadata;
  settings: {
    showProgress?: boolean;
    progressValue?: number;
    abTestVariant?: string;
    customScripts?: string[];
  };
  lastModified: string;
  version: number;
}

class PageConfigService {
  private baseUrl: string;
  private cache: Map<string, PageConfig> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  /**
   * Buscar configuração de uma página específica
   */
  async getPageConfig(pageId: string): Promise<PageConfig | null> {
    try {
      // Verificar cache primeiro
      if (this.cache.has(pageId)) {
        const cached = this.cache.get(pageId);
        if (cached && this.isCacheValid(cached)) {
          return cached;
        }
      }

      // Tentar buscar do localStorage primeiro (modo offline)
      try {
        const localConfig = localStorage.getItem(`page-config-${pageId}`);
        if (localConfig) {
          const config = JSON.parse(localConfig);
          this.cache.set(pageId, config);
          return config;
        }
      } catch (localError) {
        console.warn('Failed to load from localStorage:', localError);
      }

      // Tentar buscar do backend apenas se disponível
      try {
        const response = await fetch(`${this.baseUrl}/page-configs/${pageId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Timeout rápido para não travar a aplicação
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          const config = await response.json();
          // Salvar no cache e localStorage
          this.cache.set(pageId, config);
          localStorage.setItem(`page-config-${pageId}`, JSON.stringify(config));
          return config;
        }
      } catch (apiError) {
        console.warn('API not available, using offline mode:', apiError);
      }

      // Fallback para configuração padrão
      const defaultConfig = this.getDefaultPageConfig(pageId);
      this.cache.set(pageId, defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Error fetching page config:', error);
      // Fallback final para configuração padrão
      return this.getDefaultPageConfig(pageId);
    }
  }

  /**
   * Salvar configuração de uma página
   */
  async savePageConfig(config: PageConfig): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/page-configs/${config.pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          lastModified: new Date().toISOString(),
          version: config.version + 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save page config');
      }

      // Atualizar cache
      this.cache.set(config.pageId, config);
      
      return true;
    } catch (error) {
      console.error('Error saving page config:', error);
      
      // Fallback para localStorage
      try {
        localStorage.setItem(`page-config-${config.pageId}`, JSON.stringify(config));
        this.cache.set(config.pageId, config);
        return true;
      } catch (localError) {
        console.error('Failed to save to localStorage:', localError);
        return false;
      }
    }
  }

  /**
   * Converter dados do editor para configuração de página
   */
  convertFunnelToPageConfig(funnelData: any, pageId: string): PageConfig {
    const page = funnelData.pages?.find((p: any) => p.id === pageId);
    
    if (!page) {
      return this.getDefaultPageConfig(pageId);
    }

    return {
      pageId: page.id,
      pageName: page.name || page.title || 'Página sem nome',
      blocks: this.convertBlocks(page.blocks || []),
      styles: {
        backgroundColor: page.settings?.backgroundColor || '#fffaf7',
        textColor: page.settings?.textColor || '#432818',
        fontFamily: page.settings?.fontFamily || 'Inter, sans-serif',
        customCSS: page.settings?.customCSS || ''
      },
      metadata: {
        title: page.title || '',
        description: page.description || '',
        keywords: page.keywords || [],
        ogImage: page.ogImage || ''
      },
      settings: {
        showProgress: page.settings?.showProgress || false,
        progressValue: page.settings?.progressValue || 0,
        abTestVariant: page.settings?.abTestVariant || 'A',
        customScripts: page.settings?.customScripts || []
      },
      lastModified: new Date().toISOString(),
      version: 1
    };
  }

  /**
   * Converter blocos do editor para blocos de configuração
   */
  private convertBlocks(blocks: any[]): ConfigBlock[] {
    return blocks.map(block => ({
      id: block.id,
      type: block.type,
      order: block.order,
      content: block.content,
      settings: block.settings || {},
      styles: block.styles || {},
      componentType: this.getComponentType(block.type),
      props: this.extractProps(block),
      children: block.children ? this.convertBlocks(block.children) : undefined
    }));
  }

  /**
   * Mapear tipo de bloco para componente React
   */
  private getComponentType(blockType: string): string {
    const typeMap: Record<string, string> = {
      'header-component-real': 'Header',
      'card-component-real': 'Card',
      'testimonials-component-real': 'Testimonials',
      'button-component-real': 'Button',
      'fixed-intro-image-component-real': 'FixedIntroImage',
      'countdown-timer-component-real': 'CountdownTimer',
      'pricing-section-component-real': 'PricingSection',
      'guarantee-component-real': 'GuaranteeSection',
      'faq-section-component-real': 'FaqSectionNew',
      'header': 'HeaderBlock',
      'text': 'TextBlock',
      'image': 'ImageBlock',
      'button': 'ButtonBlock',
      'question-multiple': 'QuestionBlock',
      'question-strategic': 'StrategicQuestionBlock'
    };

    return typeMap[blockType] || 'GenericBlock';
  }

  /**
   * Extrair props do bloco para componente
   */
  private extractProps(block: any): Record<string, any> {
    const props: Record<string, any> = {};

    // Props específicas por tipo de componente
    switch (block.type) {
      case 'header-component-real':
        props.primaryStyle = block.settings?.props?.primaryStyle || 'dynamic';
        props.logo = block.settings?.props?.logo || '';
        props.logoAlt = block.settings?.props?.logoAlt || '';
        props.userName = block.settings?.props?.userName || '';
        break;

      case 'button-component-real':
        props.className = block.settings?.className || '';
        props.style = block.settings?.style || {};
        props.onClick = block.settings?.onClick || 'handleClick';
        props.children = block.settings?.children || 'Clique aqui';
        break;

      case 'fixed-intro-image-component-real':
        props.src = block.settings?.props?.src || '';
        props.alt = block.settings?.props?.alt || '';
        props.width = block.settings?.props?.width || 200;
        props.height = block.settings?.props?.height || 100;
        break;

      case 'pricing-section-component-real':
        props.title = block.settings?.title || '';
        props.installments = block.settings?.installments || '';
        props.fullPrice = block.settings?.fullPrice || '';
        props.savings = block.settings?.savings || '';
        props.className = block.settings?.className || '';
        break;

      default:
        // Props genéricas
        props.title = block.settings?.title || '';
        props.content = block.settings?.content || block.content || '';
        props.text = block.settings?.text || '';
        props.src = block.settings?.src || '';
        props.alt = block.settings?.alt || '';
        props.className = block.settings?.className || '';
        props.style = block.settings?.style || {};
    }

    return props;
  }

  /**
   * Obter configuração padrão para uma página
   */
  private getDefaultPageConfig(pageId: string): PageConfig {
    const defaultConfigs: Record<string, Partial<PageConfig>> = {
      'etapa-20-resultado-a': {
        pageName: 'Página de Resultado',
        styles: {
          backgroundColor: '#fffaf7',
          textColor: '#432818',
          fontFamily: 'Inter, sans-serif'
        },
        blocks: []
      },
      'etapa-21-oferta-b': {
        pageName: 'Página de Oferta',
        styles: {
          backgroundColor: '#FFFBF7',
          textColor: '#432818',
          fontFamily: 'Inter, sans-serif'
        },
        blocks: []
      }
    };

    const defaultConfig = defaultConfigs[pageId] || {};

    return {
      pageId,
      pageName: defaultConfig.pageName || 'Página',
      blocks: defaultConfig.blocks || [],
      styles: defaultConfig.styles || {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Arial, sans-serif'
      },
      metadata: {
        title: '',
        description: '',
        keywords: [],
        ogImage: ''
      },
      settings: {
        showProgress: false,
        progressValue: 0,
        abTestVariant: 'A',
        customScripts: []
      },
      lastModified: new Date().toISOString(),
      version: 1
    };
  }

  /**
   * Verificar se o cache ainda é válido (1 hora)
   */
  private isCacheValid(config: PageConfig): boolean {
    const cacheTime = new Date(config.lastModified).getTime();
    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000;
    
    return (now - cacheTime) < oneHour;
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obter todas as configurações em cache
   */
  getCachedConfigs(): PageConfig[] {
    return Array.from(this.cache.values());
  }
}

export const pageConfigService = new PageConfigService();
export default pageConfigService;
