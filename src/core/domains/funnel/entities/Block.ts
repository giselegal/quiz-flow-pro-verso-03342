/**
 * 🎯 BLOCK ENTITY - Core Business Object
 * 
 * Representa um bloco individual no domínio Funnel.
 * Contém todas as regras de negócio relacionadas a blocos de conteúdo.
 */

export type BlockType = 
  | 'text'
  | 'heading'
  | 'image'
  | 'video'
  | 'button'
  | 'form'
  | 'quiz-question'
  | 'quiz-option'
  | 'quiz-result'
  | 'countdown'
  | 'testimonial'
  | 'pricing'
  | 'divider'
  | 'spacer'
  | 'embed'
  | 'social-proof';

export interface BlockContent {
  text?: string;
  html?: string;
  imageUrl?: string;
  videoUrl?: string;
  embedCode?: string;
  alt?: string;
  caption?: string;
  link?: {
    url: string;
    target: '_self' | '_blank';
    track?: string;
  };
}

export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  customCss?: string;
}

export interface BlockSettings {
  isVisible: boolean;
  isRequired?: boolean;
  animation?: {
    type: 'fade' | 'slide' | 'zoom' | 'bounce';
    duration: number;
    delay: number;
  };
  responsive?: {
    desktop: Partial<BlockStyles>;
    tablet: Partial<BlockStyles>;
    mobile: Partial<BlockStyles>;
  };
  conditions?: {
    showIf?: {
      field: string;
      operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
      value: any;
    }[];
    hideIf?: {
      field: string;
      operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
      value: any;
    }[];
  };
}

export interface BlockAnalytics {
  impressions: number;
  clicks: number;
  interactions: number;
  conversionRate: number;
  averageViewTime: number;
  heatmapData?: Record<string, number>;
}

export class Block {
  constructor(
    public readonly id: string,
    public readonly pageId: string,
    public readonly type: BlockType,
    public content: BlockContent,
    public styles: BlockStyles = {},
    public settings: BlockSettings = { isVisible: true },
    public analytics: BlockAnalytics = {
      impressions: 0,
      clicks: 0,
      interactions: 0,
      conversionRate: 0,
      averageViewTime: 0
    },
    public metadata: {
      order: number;
      version: number;
      isTemplate: boolean;
      createdAt: Date;
      updatedAt: Date;
    } = {
      order: 0,
      version: 1,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ) {}

  // 🔍 Business Rules - Block Validation
  isValid(): boolean {
    switch (this.type) {
      case 'text':
      case 'heading':
        return !!(this.content.text || this.content.html);
      
      case 'image':
        return !!(this.content.imageUrl);
      
      case 'video':
        return !!(this.content.videoUrl);
      
      case 'button':
        return !!(this.content.text && this.content.link?.url);
      
      case 'embed':
        return !!(this.content.embedCode);
      
      case 'quiz-question':
        return !!(this.content.text);
      
      case 'quiz-option':
        return !!(this.content.text);
      
      default:
        return true;
    }
  }

  // 🔍 Business Rules - Content Management
  updateContent(contentUpdates: Partial<BlockContent>): Block {
    const updatedContent = { ...this.content, ...contentUpdates };

    return new Block(
      this.id,
      this.pageId,
      this.type,
      updatedContent,
      this.styles,
      this.settings,
      this.analytics,
      { ...this.metadata, updatedAt: new Date(), version: this.metadata.version + 1 }
    );
  }

  updateStyles(styleUpdates: Partial<BlockStyles>): Block {
    const updatedStyles = { ...this.styles, ...styleUpdates };

    return new Block(
      this.id,
      this.pageId,
      this.type,
      this.content,
      updatedStyles,
      this.settings,
      this.analytics,
      { ...this.metadata, updatedAt: new Date(), version: this.metadata.version + 1 }
    );
  }

  updateSettings(settingsUpdates: Partial<BlockSettings>): Block {
    const updatedSettings = { ...this.settings, ...settingsUpdates };

    return new Block(
      this.id,
      this.pageId,
      this.type,
      this.content,
      this.styles,
      updatedSettings,
      this.analytics,
      { ...this.metadata, updatedAt: new Date(), version: this.metadata.version + 1 }
    );
  }

  // 🔍 Business Rules - Visibility and Conditions
  shouldShow(context: Record<string, any> = {}): boolean {
    if (!this.settings.isVisible) return false;

    // Check show conditions
    if (this.settings.conditions?.showIf) {
      const showConditionsMet = this.settings.conditions.showIf.every(condition =>
        this.evaluateCondition(condition, context)
      );
      if (!showConditionsMet) return false;
    }

    // Check hide conditions
    if (this.settings.conditions?.hideIf) {
      const hideConditionsMet = this.settings.conditions.hideIf.some(condition =>
        this.evaluateCondition(condition, context)
      );
      if (hideConditionsMet) return false;
    }

    return true;
  }

  private evaluateCondition(condition: any, context: Record<string, any>): boolean {
    const fieldValue = context[condition.field];
    const expectedValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not-equals':
        return fieldValue !== expectedValue;
      case 'contains':
        return Array.isArray(fieldValue) ? fieldValue.includes(expectedValue) : 
               String(fieldValue).includes(String(expectedValue));
      case 'greater-than':
        return Number(fieldValue) > Number(expectedValue);
      case 'less-than':
        return Number(fieldValue) < Number(expectedValue);
      default:
        return true;
    }
  }

  // 🔍 Business Rules - Analytics
  recordImpression(): Block {
    return new Block(
      this.id,
      this.pageId,
      this.type,
      this.content,
      this.styles,
      this.settings,
      {
        ...this.analytics,
        impressions: this.analytics.impressions + 1
      },
      this.metadata
    );
  }

  recordClick(): Block {
    const updatedAnalytics = {
      ...this.analytics,
      clicks: this.analytics.clicks + 1,
      interactions: this.analytics.interactions + 1
    };

    // Recalcular conversion rate
    if (updatedAnalytics.impressions > 0) {
      updatedAnalytics.conversionRate = updatedAnalytics.clicks / updatedAnalytics.impressions;
    }

    return new Block(
      this.id,
      this.pageId,
      this.type,
      this.content,
      this.styles,
      this.settings,
      updatedAnalytics,
      this.metadata
    );
  }

  recordInteraction(_type: 'hover' | 'focus' | 'scroll' = 'hover'): Block {
    return new Block(
      this.id,
      this.pageId,
      this.type,
      this.content,
      this.styles,
      this.settings,
      {
        ...this.analytics,
        interactions: this.analytics.interactions + 1
      },
      this.metadata
    );
  }

  // 🔍 Business Rules - Performance Analysis
  getClickThroughRate(): number {
    return this.analytics.impressions > 0 ? 
      this.analytics.clicks / this.analytics.impressions : 0;
  }

  getEngagementRate(): number {
    return this.analytics.impressions > 0 ? 
      this.analytics.interactions / this.analytics.impressions : 0;
  }

  isHighPerforming(): boolean {
    const ctr = this.getClickThroughRate();
    const engagementRate = this.getEngagementRate();
    
    // Diferentes thresholds para diferentes tipos de bloco
    switch (this.type) {
      case 'button':
        return ctr > 0.05; // > 5% CTR
      case 'image':
      case 'video':
        return engagementRate > 0.3; // > 30% engagement
      case 'text':
      case 'heading':
        return this.analytics.averageViewTime > 5; // > 5 segundos
      default:
        return engagementRate > 0.1; // > 10% engagement
    }
  }

  needsOptimization(): boolean {
    const ctr = this.getClickThroughRate();
    const engagementRate = this.getEngagementRate();
    
    return (
      this.analytics.impressions > 100 && ( // Tem dados suficientes
        ctr < 0.01 || // < 1% CTR
        engagementRate < 0.05 || // < 5% engagement
        this.analytics.averageViewTime < 2 // < 2 segundos
      )
    );
  }

  // 🔍 Business Rules - Responsive Design
  getStylesForDevice(device: 'desktop' | 'tablet' | 'mobile'): BlockStyles {
    const baseStyles = this.styles;
    const responsiveStyles = this.settings.responsive?.[device] || {};
    
    return { ...baseStyles, ...responsiveStyles };
  }

  // 🔍 Business Rules - Template Management
  convertToTemplate(): Block {
    return new Block(
      `template-${this.id}`,
      'template-page',
      this.type,
      { ...this.content },
      { ...this.styles },
      { ...this.settings },
      {
        impressions: 0,
        clicks: 0,
        interactions: 0,
        conversionRate: 0,
        averageViewTime: 0
      },
      {
        order: this.metadata.order,
        version: 1,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  // 🔍 Utility Methods
  clone(newId?: string, newPageId?: string): Block {
    return new Block(
      newId || `${this.id}-copy`,
      newPageId || this.pageId,
      this.type,
      { ...this.content },
      { ...this.styles },
      { ...this.settings },
      {
        impressions: 0,
        clicks: 0,
        interactions: 0,
        conversionRate: 0,
        averageViewTime: 0
      },
      {
        order: this.metadata.order,
        version: 1,
        isTemplate: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      pageId: this.pageId,
      type: this.type,
      content: this.content,
      styles: this.styles,
      settings: this.settings,
      analytics: this.analytics,
      metadata: this.metadata
    };
  }

  static fromJSON(data: Record<string, any>): Block {
    return new Block(
      data.id,
      data.pageId,
      data.type,
      data.content || {},
      data.styles || {},
      data.settings || { isVisible: true },
      data.analytics || {
        impressions: 0,
        clicks: 0,
        interactions: 0,
        conversionRate: 0,
        averageViewTime: 0
      },
      data.metadata || {
        order: 0,
        version: 1,
        isTemplate: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  // 🔍 Factory Methods
  static createTextBlock(
    id: string,
    pageId: string,
    text: string,
    order: number = 0
  ): Block {
    return new Block(
      id,
      pageId,
      'text',
      { text },
      {},
      { isVisible: true },
      {
        impressions: 0,
        clicks: 0,
        interactions: 0,
        conversionRate: 0,
        averageViewTime: 0
      },
      {
        order,
        version: 1,
        isTemplate: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  static createButtonBlock(
    id: string,
    pageId: string,
    text: string,
    url: string,
    order: number = 0
  ): Block {
    return new Block(
      id,
      pageId,
      'button',
      { 
        text, 
        link: { url, target: '_self' } 
      },
      {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '8px',
        textAlign: 'center'
      },
      { isVisible: true },
      {
        impressions: 0,
        clicks: 0,
        interactions: 0,
        conversionRate: 0,
        averageViewTime: 0
      },
      {
        order,
        version: 1,
        isTemplate: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }
}