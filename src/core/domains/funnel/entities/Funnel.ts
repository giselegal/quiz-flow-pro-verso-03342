/**
 * 🎯 FUNNEL ENTITY - Core Business Object
 * 
 * Representa a entidade principal Funnel no domínio de negócio.
 * Contém todas as regras de negócio relacionadas a funis de conversão.
 */

export interface FunnelMetadata {
  name: string;
  description?: string;
  category: string;
  tags: string[];
  templateId?: string;
  language: string;
  isTemplate: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FunnelSettings {
  allowAnonymous: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  requireEmailVerification: boolean;
  enableAnalytics: boolean;
  enableABTesting: boolean;
  customDomain?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  pixelId?: string;
  conversionGoals: string[];
}

export interface FunnelBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
  faviconUrl?: string;
  backgroundImage?: string;
  customCss?: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface FunnelAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  averageTimeSpent: number;
  exitRate: number;
  topTrafficSources: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
}

export class Funnel {
  constructor(
    public readonly id: string,
    public metadata: FunnelMetadata,
    public settings: FunnelSettings,
    public branding: FunnelBranding,
    public pageIds: string[] = [],
    public analytics: FunnelAnalytics = {
      totalViews: 0,
      uniqueVisitors: 0,
      conversionRate: 0,
      averageTimeSpent: 0,
      exitRate: 0,
      topTrafficSources: {},
      deviceBreakdown: {},
      locationBreakdown: {}
    }
  ) {}

  // 🔍 Business Rules - Funnel Validation
  isValid(): boolean {
    return (
      this.metadata.name.trim().length > 0 &&
      this.metadata.category.trim().length > 0 &&
      this.pageIds.length > 0 &&
      this.branding.primaryColor.length > 0
    );
  }

  // 🔍 Business Rules - Publishing
  canPublish(): boolean {
    return (
      this.isValid() &&
      this.pageIds.length >= 1 && // Pelo menos 1 página
      this.metadata.name.trim().length >= 3 // Nome mínimo
    );
  }

  // 🔍 Business Rules - Funnel State Management
  publish(): Funnel {
    if (!this.canPublish()) {
      throw new Error('Funil não pode ser publicado: validação falhou');
    }

    return new Funnel(
      this.id,
      {
        ...this.metadata,
        isPublished: true,
        publishedAt: new Date(),
        updatedAt: new Date()
      },
      this.settings,
      this.branding,
      this.pageIds,
      this.analytics
    );
  }

  unpublish(): Funnel {
    return new Funnel(
      this.id,
      {
        ...this.metadata,
        isPublished: false,
        publishedAt: undefined,
        updatedAt: new Date()
      },
      this.settings,
      this.branding,
      this.pageIds,
      this.analytics
    );
  }

  // 🔍 Business Rules - Page Management
  addPage(pageId: string, position?: number): Funnel {
    if (this.pageIds.includes(pageId)) {
      throw new Error('Página já existe no funil');
    }

    const newPageIds = [...this.pageIds];
    
    if (position !== undefined && position >= 0 && position <= newPageIds.length) {
      newPageIds.splice(position, 0, pageId);
    } else {
      newPageIds.push(pageId);
    }

    return new Funnel(
      this.id,
      { ...this.metadata, updatedAt: new Date() },
      this.settings,
      this.branding,
      newPageIds,
      this.analytics
    );
  }

  removePage(pageId: string): Funnel {
    const newPageIds = this.pageIds.filter(id => id !== pageId);
    
    if (newPageIds.length === this.pageIds.length) {
      throw new Error('Página não encontrada no funil');
    }

    if (newPageIds.length === 0) {
      throw new Error('Funil deve ter pelo menos uma página');
    }

    return new Funnel(
      this.id,
      { ...this.metadata, updatedAt: new Date() },
      this.settings,
      this.branding,
      newPageIds,
      this.analytics
    );
  }

  reorderPages(newPageIds: string[]): Funnel {
    // Validar que todas as páginas existem
    if (newPageIds.length !== this.pageIds.length) {
      throw new Error('Lista de páginas deve ter o mesmo tamanho');
    }

    const allPagesExist = newPageIds.every(id => this.pageIds.includes(id));
    if (!allPagesExist) {
      throw new Error('Uma ou mais páginas não existem no funil');
    }

    return new Funnel(
      this.id,
      { ...this.metadata, updatedAt: new Date() },
      this.settings,
      this.branding,
      newPageIds,
      this.analytics
    );
  }

  // 🔍 Business Rules - Funnel Analytics
  updateAnalytics(newAnalytics: Partial<FunnelAnalytics>): Funnel {
    return new Funnel(
      this.id,
      this.metadata,
      this.settings,
      this.branding,
      this.pageIds,
      { ...this.analytics, ...newAnalytics }
    );
  }

  incrementViews(isUnique: boolean = false): Funnel {
    const updatedAnalytics = {
      ...this.analytics,
      totalViews: this.analytics.totalViews + 1
    };

    if (isUnique) {
      updatedAnalytics.uniqueVisitors = this.analytics.uniqueVisitors + 1;
    }

    return new Funnel(
      this.id,
      this.metadata,
      this.settings,
      this.branding,
      this.pageIds,
      updatedAnalytics
    );
  }

  // 🔍 Business Rules - Performance Analysis
  getPerformanceScore(): number {
    let score = 0;
    
    // Conversion rate (0-40 points)
    score += Math.min(this.analytics.conversionRate * 4, 40);
    
    // Low exit rate bonus (0-20 points)
    score += Math.max(20 - this.analytics.exitRate, 0);
    
    // Engagement time bonus (0-20 points)
    const idealTime = 180; // 3 minutos
    const timeScore = Math.max(20 - Math.abs(this.analytics.averageTimeSpent - idealTime) / 10, 0);
    score += timeScore;
    
    // Traffic diversity bonus (0-20 points)
    const sourceCount = Object.keys(this.analytics.topTrafficSources).length;
    score += Math.min(sourceCount * 4, 20);
    
    return Math.min(score, 100);
  }

  // 🔍 Business Rules - SEO Optimization
  isSEOOptimized(): boolean {
    return !!(
      this.settings.seoTitle &&
      this.settings.seoDescription &&
      this.settings.seoKeywords &&
      this.settings.seoKeywords.length > 0 &&
      this.settings.customDomain
    );
  }

  getPageCount(): number {
    return this.pageIds.length;
  }

  getFirstPageId(): string | null {
    return this.pageIds.length > 0 ? this.pageIds[0] : null;
  }

  getLastPageId(): string | null {
    return this.pageIds.length > 0 ? this.pageIds[this.pageIds.length - 1] : null;
  }

  getPagePosition(pageId: string): number {
    return this.pageIds.indexOf(pageId);
  }

  getNextPageId(currentPageId: string): string | null {
    const currentIndex = this.pageIds.indexOf(currentPageId);
    if (currentIndex === -1 || currentIndex === this.pageIds.length - 1) {
      return null;
    }
    return this.pageIds[currentIndex + 1];
  }

  getPreviousPageId(currentPageId: string): string | null {
    const currentIndex = this.pageIds.indexOf(currentPageId);
    if (currentIndex <= 0) {
      return null;
    }
    return this.pageIds[currentIndex - 1];
  }

  // 🔍 Business Rules - Template Management
  convertToTemplate(): Funnel {
    return new Funnel(
      `template-${this.id}`,
      {
        ...this.metadata,
        name: `${this.metadata.name} (Template)`,
        isTemplate: true,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { ...this.settings },
      { ...this.branding },
      [...this.pageIds],
      {
        totalViews: 0,
        uniqueVisitors: 0,
        conversionRate: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        topTrafficSources: {},
        deviceBreakdown: {},
        locationBreakdown: {}
      }
    );
  }

  // 🔍 Utility Methods
  clone(newId?: string, newName?: string): Funnel {
    return new Funnel(
      newId || `${this.id}-copy`,
      {
        ...this.metadata,
        name: newName || `${this.metadata.name} (Cópia)`,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { ...this.settings },
      { ...this.branding },
      [...this.pageIds],
      {
        totalViews: 0,
        uniqueVisitors: 0,
        conversionRate: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        topTrafficSources: {},
        deviceBreakdown: {},
        locationBreakdown: {}
      }
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      metadata: this.metadata,
      settings: this.settings,
      branding: this.branding,
      pageIds: this.pageIds,
      analytics: this.analytics
    };
  }

  static fromJSON(data: Record<string, any>): Funnel {
    return new Funnel(
      data.id,
      data.metadata,
      data.settings,
      data.branding,
      data.pageIds || [],
      data.analytics || {
        totalViews: 0,
        uniqueVisitors: 0,
        conversionRate: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        topTrafficSources: {},
        deviceBreakdown: {},
        locationBreakdown: {}
      }
    );
  }

  // 🔍 Factory Methods
  static createBasicQuizFunnel(
    id: string,
    name: string,
    createdBy: string,
    category: string = 'quiz'
  ): Funnel {
    return new Funnel(
      id,
      {
        name,
        category,
        tags: ['quiz'],
        language: 'pt-BR',
        isTemplate: false,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy
      },
      {
        allowAnonymous: true,
        collectEmail: true,
        collectPhone: false,
        requireEmailVerification: false,
        enableAnalytics: true,
        enableABTesting: false,
        conversionGoals: ['completion', 'email_capture']
      },
      {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#F59E0B',
        fontFamily: 'Inter, sans-serif',
        theme: 'light'
      }
    );
  }
}