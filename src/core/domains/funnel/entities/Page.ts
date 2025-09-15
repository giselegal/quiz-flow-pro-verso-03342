/**
 * 🎯 PAGE ENTITY - Core Business Object
 * 
 * Representa uma página individual no domínio Funnel.
 * Contém todas as regras de negócio relacionadas a páginas.
 */

export type PageType = 
  | 'landing' 
  | 'quiz-question' 
  | 'quiz-result' 
  | 'lead-capture' 
  | 'thank-you' 
  | 'sales-page' 
  | 'video-sales-letter' 
  | 'checkout' 
  | 'upsell' 
  | 'downsell';

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface PageTracking {
  pixelEvents: {
    facebook?: string[];
    google?: string[];
    custom?: Record<string, any>[];
  };
  conversionGoals: string[];
  heatmapEnabled: boolean;
  recordingEnabled: boolean;
}

export interface PageSettings {
  slug: string;
  isActive: boolean;
  requireAuth: boolean;
  accessPassword?: string;
  redirectUrl?: string;
  maxTimeSpent?: number; // em segundos
  autoAdvance?: boolean;
  autoAdvanceDuration?: number; // em segundos
  allowBack: boolean;
  showProgress: boolean;
}

export interface PageAnalytics {
  views: number;
  uniqueViews: number;
  averageTimeSpent: number;
  exitRate: number;
  conversionRate: number;
  interactions: Record<string, number>;
  topExitElements: string[];
  deviceBreakdown: Record<string, number>;
}

export class Page {
  constructor(
    public readonly id: string,
    public readonly funnelId: string,
    public readonly type: PageType,
    public title: string,
    public description: string,
    public blockIds: string[] = [],
    public settings: PageSettings,
    public seo: PageSEO,
    public tracking: PageTracking = {
      pixelEvents: {},
      conversionGoals: [],
      heatmapEnabled: false,
      recordingEnabled: false
    },
    public analytics: PageAnalytics = {
      views: 0,
      uniqueViews: 0,
      averageTimeSpent: 0,
      exitRate: 0,
      conversionRate: 0,
      interactions: {},
      topExitElements: [],
      deviceBreakdown: {}
    },
    public metadata: {
      order: number;
      version: number;
      createdAt: Date;
      updatedAt: Date;
    } = {
      order: 0,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ) {}

  // 🔍 Business Rules - Page Validation
  isValid(): boolean {
    return (
      this.title.trim().length > 0 &&
      this.settings.slug.trim().length > 0 &&
      this.blockIds.length > 0 &&
      this.isSlugValid(this.settings.slug)
    );
  }

  private isSlugValid(slug: string): boolean {
    // Slug deve conter apenas letras, números, hífens e underscores
    const slugPattern = /^[a-z0-9-_]+$/;
    return slugPattern.test(slug) && slug.length >= 2 && slug.length <= 100;
  }

  // 🔍 Business Rules - Page Type Validation
  canHaveType(type: PageType): boolean {
    // Algumas regras específicas por tipo
    switch (type) {
      case 'quiz-question':
        // Páginas de pergunta devem ter pelo menos 1 bloco de pergunta
        return this.blockIds.length >= 1;
      
      case 'quiz-result':
        // Páginas de resultado devem ter pelo menos 1 bloco de resultado
        return this.blockIds.length >= 1;
      
      case 'checkout':
        // Páginas de checkout devem ter SSL e captura de pagamento
        return this.settings.requireAuth === true;
      
      default:
        return true;
    }
  }

  // 🔍 Business Rules - Block Management
  addBlock(blockId: string, position?: number): Page {
    if (this.blockIds.includes(blockId)) {
      throw new Error('Bloco já existe na página');
    }

    const newBlockIds = [...this.blockIds];
    
    if (position !== undefined && position >= 0 && position <= newBlockIds.length) {
      newBlockIds.splice(position, 0, blockId);
    } else {
      newBlockIds.push(blockId);
    }

    return new Page(
      this.id,
      this.funnelId,
      this.type,
      this.title,
      this.description,
      newBlockIds,
      this.settings,
      this.seo,
      this.tracking,
      this.analytics,
      { ...this.metadata, updatedAt: new Date(), version: this.metadata.version + 1 }
    );
  }

  removeBlock(blockId: string): Page {
    const newBlockIds = this.blockIds.filter(id => id !== blockId);
    
    if (newBlockIds.length === this.blockIds.length) {
      throw new Error('Bloco não encontrado na página');
    }

    return new Page(
      this.id,
      this.funnelId,
      this.type,
      this.title,
      this.description,
      newBlockIds,
      this.settings,
      this.seo,
      this.tracking,
      this.analytics,
      { ...this.metadata, updatedAt: new Date(), version: this.metadata.version + 1 }
    );
  }

  reorderBlocks(newBlockIds: string[]): Page {
    // Validar que todos os blocos existem
    if (newBlockIds.length !== this.blockIds.length) {
      throw new Error('Lista de blocos deve ter o mesmo tamanho');
    }

    const allBlocksExist = newBlockIds.every(id => this.blockIds.includes(id));
    if (!allBlocksExist) {
      throw new Error('Um ou mais blocos não existem na página');
    }

    return new Page(
      this.id,
      this.funnelId,
      this.type,
      this.title,
      this.description,
      newBlockIds,
      this.settings,
      this.seo,
      this.tracking,
      this.analytics,
      { ...this.metadata, updatedAt: new Date(), version: this.metadata.version + 1 }
    );
  }

  // 🔍 Business Rules - Page Analytics
  incrementViews(isUnique: boolean = false): Page {
    const updatedAnalytics = {
      ...this.analytics,
      views: this.analytics.views + 1
    };

    if (isUnique) {
      updatedAnalytics.uniqueViews = this.analytics.uniqueViews + 1;
    }

    return new Page(
      this.id,
      this.funnelId,
      this.type,
      this.title,
      this.description,
      this.blockIds,
      this.settings,
      this.seo,
      this.tracking,
      updatedAnalytics,
      this.metadata
    );
  }

  recordInteraction(elementId: string): Page {
    const updatedAnalytics = {
      ...this.analytics,
      interactions: {
        ...this.analytics.interactions,
        [elementId]: (this.analytics.interactions[elementId] || 0) + 1
      }
    };

    return new Page(
      this.id,
      this.funnelId,
      this.type,
      this.title,
      this.description,
      this.blockIds,
      this.settings,
      this.seo,
      this.tracking,
      updatedAnalytics,
      this.metadata
    );
  }

  // 🔍 Business Rules - SEO Management
  updateSEO(seoUpdates: Partial<PageSEO>): Page {
    const updatedSEO = { ...this.seo, ...seoUpdates };
    
    // Validações de SEO
    if (updatedSEO.title.length > 60) {
      console.warn('Título SEO muito longo (> 60 caracteres)');
    }
    
    if (updatedSEO.description.length > 160) {
      console.warn('Descrição SEO muito longa (> 160 caracteres)');
    }

    return new Page(
      this.id,
      this.funnelId,
      this.type,
      this.title,
      this.description,
      this.blockIds,
      this.settings,
      updatedSEO,
      this.tracking,
      this.analytics,
      { ...this.metadata, updatedAt: new Date() }
    );
  }

  // 🔍 Business Rules - Access Control
  canAccess(userAuth?: any, password?: string): boolean {
    if (!this.settings.isActive) return false;
    
    if (this.settings.requireAuth && !userAuth) return false;
    
    if (this.settings.accessPassword && this.settings.accessPassword !== password) {
      return false;
    }
    
    return true;
  }

  // 🔍 Business Rules - Performance Analysis
  getEngagementScore(): number {
    let score = 0;
    
    // Base score from time spent (0-40 points)
    const idealTime = this.getIdealTimeSpent();
    const timeScore = Math.max(40 - Math.abs(this.analytics.averageTimeSpent - idealTime) / 5, 0);
    score += timeScore;
    
    // Interaction score (0-30 points)
    const totalInteractions = Object.values(this.analytics.interactions).reduce((sum, count) => sum + count, 0);
    const interactionScore = Math.min(totalInteractions / this.blockIds.length * 10, 30);
    score += interactionScore;
    
    // Low exit rate bonus (0-30 points)
    score += Math.max(30 - this.analytics.exitRate, 0);
    
    return Math.min(score, 100);
  }

  private getIdealTimeSpent(): number {
    // Tempo ideal baseado no tipo de página
    switch (this.type) {
      case 'landing':
        return 45; // 45 segundos
      case 'quiz-question':
        return 15; // 15 segundos por pergunta
      case 'quiz-result':
        return 60; // 1 minuto para ler resultado
      case 'sales-page':
        return 180; // 3 minutos
      case 'video-sales-letter':
        return 300; // 5 minutos
      default:
        return 30;
    }
  }

  // 🔍 Business Rules - Conversion Optimization
  isHighConverting(): boolean {
    return this.analytics.conversionRate > 0.15; // > 15%
  }

  needsOptimization(): boolean {
    return (
      this.analytics.exitRate > 0.7 || // > 70% exit rate
      this.analytics.averageTimeSpent < 5 || // < 5 segundos
      this.analytics.conversionRate < 0.05 // < 5% conversion
    );
  }

  // 🔍 Utility Methods
  clone(newId?: string, newFunnelId?: string): Page {
    return new Page(
      newId || `${this.id}-copy`,
      newFunnelId || this.funnelId,
      this.type,
      `${this.title} (Cópia)`,
      this.description,
      [...this.blockIds],
      {
        ...this.settings,
        slug: `${this.settings.slug}-copy`
      },
      { ...this.seo },
      { ...this.tracking },
      {
        views: 0,
        uniqueViews: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        conversionRate: 0,
        interactions: {},
        topExitElements: [],
        deviceBreakdown: {}
      },
      {
        order: this.metadata.order,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      funnelId: this.funnelId,
      type: this.type,
      title: this.title,
      description: this.description,
      blockIds: this.blockIds,
      settings: this.settings,
      seo: this.seo,
      tracking: this.tracking,
      analytics: this.analytics,
      metadata: this.metadata
    };
  }

  static fromJSON(data: Record<string, any>): Page {
    return new Page(
      data.id,
      data.funnelId,
      data.type,
      data.title,
      data.description,
      data.blockIds || [],
      data.settings,
      data.seo,
      data.tracking || {
        pixelEvents: {},
        conversionGoals: [],
        heatmapEnabled: false,
        recordingEnabled: false
      },
      data.analytics || {
        views: 0,
        uniqueViews: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        conversionRate: 0,
        interactions: {},
        topExitElements: [],
        deviceBreakdown: {}
      },
      data.metadata || {
        order: 0,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }
}