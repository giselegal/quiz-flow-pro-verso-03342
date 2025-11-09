import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { supabase } from '@/integrations/supabase/customClient';
import { CacheService } from '@/services/canonical/CacheService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';
import { deepClone } from '@/lib/utils/cloneFunnel';
import type { Funnel, FunnelFilters, FunnelPagination, CreateFunnelDTO, UpdateFunnelDTO } from '@/services/canonical/DataService';

export class FunnelDataService extends BaseCanonicalService {
  private static instance: FunnelDataService;
  private cacheService: CacheService;

  private constructor() {
    super('FunnelDataService', '0.1.0');
    this.cacheService = CacheService.getInstance();
  }

  static getInstance(): FunnelDataService {
    if (!this.instance) this.instance = new FunnelDataService();
    return this.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('FunnelDataService initialized');
  }
  protected async onDispose(): Promise<void> {}

  private mapRowToFunnel(row: any): Funnel {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      context: row.context,
      userId: row.user_id,
      settings: row.settings || {},
      pages: row.pages || [],
      isPublished: row.is_published || false,
      version: row.version || 1,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      templateId: row.template_id,
      isFromTemplate: row.is_from_template || false,
    };
  }

  async listFunnels(
    filters?: FunnelFilters,
    pagination?: FunnelPagination,
  ): Promise<ServiceResult<Funnel[]>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'listFunnels');
    try {
      const cacheKey = `funnels:list:${JSON.stringify({ filters, pagination })}`;
      const cached = this.cacheService.get<Funnel[]>(cacheKey);
      if (cached.success && cached.data) return this.createResult(cached.data);

      let query = supabase.from('funnels').select('*');
      if (filters?.context) query = query.eq('context', filters.context);
      if (filters?.userId) query = query.eq('user_id', filters.userId);
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.isPublished !== undefined) query = query.eq('is_published', filters.isPublished);
      if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

      const limit = pagination?.limit || 50;
      const offset = pagination?.offset || 0;
      query = query.range(offset, offset + limit - 1);
      const sortBy = pagination?.sortBy || 'updatedAt';
      const sortOrder = pagination?.sortOrder || 'desc';
      query = query.order(sortBy === 'updatedAt' ? 'updated_at' : sortBy === 'createdAt' ? 'created_at' : 'name', {
        ascending: sortOrder === 'asc',
      });

      const { data, error } = await query;
      if (error) return this.createError(new Error(`Failed to list funnels: ${error.message}`));
      const funnels: Funnel[] = (data || []).map((row: any) => this.mapRowToFunnel(row));
      this.cacheService.set(cacheKey, funnels, { ttl: 5 * 60 * 1000 });
      return this.createResult(funnels);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async getFunnel(id: string): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getFunnel');
    try {
      const cacheKey = `funnel:${id}`;
      const cached = this.cacheService.funnels.get(cacheKey);
      if (cached.success && cached.data && typeof cached.data === 'object' && 'id' in cached.data) {
        return this.createResult(cached.data as Funnel);
      }
      const { data, error } = await supabase.from('funnels').select('*').eq('id', id).single();
      if (error) return this.createError(new Error(`Funnel not found: ${error.message}`));
      const funnel = this.mapRowToFunnel(data);
      this.cacheService.funnels.set(cacheKey, funnel);
      return this.createResult(funnel);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async createFunnel(dto: CreateFunnelDTO): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'createFunnel');
    try {
      const userId = dto.userId || 'anonymous';
      const funnelId = `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const insertData = {
        id: funnelId,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        context: dto.context,
        user_id: userId,
        settings: dto.settings || {},
        pages: dto.pages || [],
        is_published: dto.autoPublish || false,
        version: 1,
        template_id: dto.templateId,
        is_from_template: !!dto.templateId,
      };
      const { data, error } = await supabase.from('funnels').insert([insertData]).select().single();
      if (error) return this.createError(new Error(`Failed to create funnel: ${error.message}`));
      const funnel = this.mapRowToFunnel(data);
      this.cacheService.funnels.invalidate('');
      return this.createResult(funnel);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async updateFunnel(id: string, dto: UpdateFunnelDTO): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'updateFunnel');
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.category !== undefined) updateData.category = dto.category;
      if (dto.settings !== undefined) updateData.settings = dto.settings;
      if (dto.pages !== undefined) updateData.pages = dto.pages;
      if (dto.isPublished !== undefined) updateData.is_published = dto.isPublished;
      const { data, error } = await supabase.from('funnels').update(updateData).eq('id', id).select().single();
      if (error) return this.createError(new Error(`Failed to update funnel: ${error.message}`));
      const funnel = this.mapRowToFunnel(data);
      this.cacheService.funnels.invalidate(id);
      return this.createResult(funnel);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async deleteFunnel(id: string): Promise<ServiceResult<void>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'deleteFunnel');
    try {
      const { error } = await supabase.from('funnels').delete().eq('id', id);
      if (error) return this.createError(new Error(`Failed to delete funnel: ${error.message}`));
      this.cacheService.funnels.invalidate(id);
      return this.createResult(undefined);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async duplicateFunnel(id: string, newName?: string): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'duplicateFunnel');
    try {
      const getRes = await this.getFunnel(id);
      if (!getRes.success) return getRes;
      const original = getRes.data;
      const cloned = deepClone(original);
      return this.createFunnel({
        name: newName || `${original.name} (Copy)`,
        description: original.description,
        category: original.category,
        context: original.context,
        settings: cloned.settings,
        pages: cloned.pages,
        userId: original.userId,
        autoPublish: false,
      });
    } catch (error) {
      return this.createError(error as Error);
    }
  }
}

export const funnelDataService = FunnelDataService.getInstance();
