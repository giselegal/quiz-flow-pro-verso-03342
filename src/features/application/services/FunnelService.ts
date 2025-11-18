/**
 * 🎯 FUNNEL SERVICE - Application Layer
 * 
 * Orchestrates funnel operations, encapsulating business logic.
 */

import { Funnel } from '@/core/domains/funnel/entities/Funnel';
import { Page } from '@/core/domains/funnel/entities/Page';
import { Block, BlockType, BlockSettings } from '@/core/domains/funnel/entities/Block';

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

export interface FunnelSession {
  id: string;
  funnelId: string;
  userId?: string;
  currentPageIndex: number;
  visitedPages: string[];
  startedAt: Date;
  lastActivity: Date;
  isCompleted: boolean;
  conversionData?: any;
}

export class FunnelService {
  private funnelRepository = infrastructureLayer.repositories.funnel;
  private storageAdapter = infrastructureLayer.storage;

  async createFunnel(name: string, description: string, options: any = {}): Promise<Funnel> {
    const now = new Date();
    return new Funnel('temp-id',
      {
        name,
        description,
        category: options.category ?? 'quiz',
        tags: options.tags ?? [],
        templateId: options.templateId,
        language: options.language ?? 'pt-BR',
        isTemplate: !!options.isTemplate,
        isPublished: false,
        createdAt: now,
        updatedAt: now,
        createdBy: options.createdBy ?? 'system',
      },
      {
        allowAnonymous: true,
        collectEmail: true,
        collectPhone: false,
        requireEmailVerification: false,
        enableAnalytics: true,
        enableABTesting: false,
        customDomain: undefined,
        seoTitle: undefined,
        seoDescription: undefined,
        seoKeywords: [],
        pixelId: undefined,
        conversionGoals: ['completion'],
      },
      {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#F59E0B',
        fontFamily: 'Inter, sans-serif',
        theme: 'light',
      },
    );
  }

  async getFunnel(id: string): Promise<Funnel | null> {
    return this.funnelRepository.findById(id);
  }

  async updateFunnel(id: string, updates: any): Promise<Funnel> {
    const funnel = await this.getFunnel(id);
    if (!funnel) throw new Error('Funnel not found');
    return funnel;
  }

  async deleteFunnel(id: string): Promise<boolean> {
    return this.funnelRepository.delete(id);
  }

  async cloneFunnel(id: string, newName?: string): Promise<Funnel> {
    return this.funnelRepository.clone(id, newName);
  }

  async publishFunnel(id: string): Promise<Funnel> {
    const funnel = await this.getFunnel(id);
    if (!funnel) throw new Error('Funnel not found');
    return funnel;
  }

  async unpublishFunnel(id: string): Promise<Funnel> {
    const funnel = await this.getFunnel(id);
    if (!funnel) throw new Error('Funnel not found');
    return funnel;
  }

  async addPage(funnelId: string, type: string, title: string, description?: string): Promise<Page> {
    const now = new Date();
    return new Page(
      'temp-id',
      funnelId,
      type as any,
      title,
      description ?? '',
      [],
      {
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        isActive: true,
        requireAuth: false,
        allowBack: true,
        showProgress: true,
      } as any,
      {},
      {},
      {},
      { createdAt: now, updatedAt: now } as any,
    );
  }

  async updatePage(pageId: string, updates: Partial<Page>): Promise<Page> {
    const page = await this.funnelRepository.findPageById(pageId);
    if (!page) throw new Error('Page not found');
    return { ...page, ...updates } as Page;
  }

  async deletePage(funnelId: string, pageId: string): Promise<boolean> {
    return this.funnelRepository.deletePage(pageId);
  }

  async getPages(funnelId: string): Promise<Page[]> {
    return this.funnelRepository.findPagesByFunnel(funnelId);
  }

  async addBlock(pageId: string, type: BlockType, content: any, position?: number): Promise<Block> {
    const settings: BlockSettings = {
      isVisible: true,
    } as BlockSettings;
    return new Block('temp-id', pageId, type, content, settings, {}, {}, {} as any);
  }

  async updateBlock(blockId: string, updates: Partial<Block>): Promise<Block> {
    const block = await this.funnelRepository.findBlockById(blockId);
    if (!block) throw new Error('Block not found');
    return { ...block, ...updates } as Block;
  }

  async deleteBlock(pageId: string, blockId: string): Promise<boolean> {
    return true;
  }

  async getBlocks(pageId: string): Promise<Block[]> {
    return this.funnelRepository.findBlocksByPage(pageId);
  }

  async getBlock(blockId: string): Promise<Block | null> {
    return null;
  }

  async startFunnelSession(funnelId: string, userId?: string): Promise<FunnelSession> {
    return {
      id: crypto.randomUUID(),
      funnelId,
      userId,
      currentPageIndex: 0,
      visitedPages: [],
      startedAt: new Date(),
      lastActivity: new Date(),
      isCompleted: false,
    };
  }

  async updateFunnelSession(sessionId: string, updates: any): Promise<FunnelSession> {
    return {
      id: sessionId,
      funnelId: 'temp',
      currentPageIndex: 0,
      visitedPages: [],
      startedAt: new Date(),
      lastActivity: new Date(),
      isCompleted: false,
    };
  }

  async navigateToPage(sessionId: string, pageId: string): Promise<FunnelSession> {
    return this.updateFunnelSession(sessionId, {});
  }

  async completeFunnelSession(sessionId: string, conversionData?: any): Promise<FunnelSession> {
    return this.updateFunnelSession(sessionId, {});
  }

  async getFunnelSession(sessionId: string): Promise<FunnelSession | null> {
    return null;
  }

  async getFunnelAnalytics(funnelId: string): Promise<FunnelAnalytics> {
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      conversionRate: 0,
      averageTimeSpent: 0,
      exitRate: 0,
      topTrafficSources: {},
      deviceBreakdown: {},
      locationBreakdown: {},
    };
  }

  async getUserFunnels(userId: string): Promise<Funnel[]> {
    return this.funnelRepository.findByUserId(userId);
  }

  async getPublishedFunnels(): Promise<Funnel[]> {
    return this.funnelRepository.findPublished();
  }

  async createTemplate(funnelId: string, templateName: string): Promise<Funnel> {
    const funnel = await this.getFunnel(funnelId);
    if (!funnel) throw new Error('Funnel not found');
    return funnel;
  }

  async createFromTemplate(templateId: string, newName: string): Promise<Funnel> {
    return new Funnel('temp-id', {}, {}, {}, [], {});
  }

  async validateFunnel(funnelId: string): Promise<{ isValid: boolean; errors: string[] }> {
    return { isValid: true, errors: [] };
  }
}