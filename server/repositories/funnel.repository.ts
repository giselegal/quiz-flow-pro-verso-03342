/**
 * Funnel Repository
 * Implements data access layer for funnels using Supabase
 */

import { getSupabaseServiceClient } from '@/services/supabaseServiceClient';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';

// Initialize Supabase client
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('[FunnelRepository] Supabase not configured, using mock data');
      // Return a mock client that will be handled gracefully
    }
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }
  return supabaseClient!;
}

export interface Funnel {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  user_id?: string | null;
  steps: any[];
  settings?: any;
  published: boolean;
  public_url?: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFunnelInput {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  user_id?: string;
  steps?: any[];
  settings?: any;
  published?: boolean;
  public_url?: string;
}

export interface UpdateFunnelInput {
  name?: string;
  slug?: string;
  description?: string;
  steps?: any[];
  settings?: any;
  published?: boolean;
  public_url?: string;
}

export class FunnelRepository {
  private supabase: SupabaseClient;
  private isTestMode: boolean = false;
  private testStore: Map<string, Funnel> = new Map();

  constructor() {
    // Permitir modo de teste sem Supabase (apenas para E2E/unit tests)
    const isTest = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === 'true';
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      if (isTest || isDev) {
        console.warn('[FunnelRepository] Running in TEST/DEV MODE without Supabase (using in-memory store)');
        this.isTestMode = true;
        // Create a mock Supabase client for type compatibility
        this.supabase = {} as SupabaseClient;
        return;
      }
      throw new Error('[FunnelRepository] Supabase configuration is required. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.');
    }
    
    this.supabase = getSupabaseClient();
    
    if (!this.supabase) {
      throw new Error('[FunnelRepository] Failed to initialize Supabase client');
    }
  }

  /**
   * Health check to verify Supabase connection
   */
  async healthCheck(): Promise<boolean> {
    if (this.isTestMode) return true;
    try {
      const { error } = await this.supabase.from('funnels').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  async findAll(options?: {
    userId?: string;
    published?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ funnels: Funnel[]; total: number }> {
    // Test mode: usar in-memory store
    if (this.isTestMode) {
      const funnels = Array.from(this.testStore.values());
      return { funnels, total: funnels.length };
    }

    try {
      let query = this.supabase.from('funnels').select('*', { count: 'exact' });

      if (options?.userId) {
        query = query.eq('user_id', options.userId);
      }
      if (options?.published !== undefined) {
        query = query.eq('published', options.published);
      }

      if (options?.page && options?.limit) {
        const offset = (options.page - 1) * options.limit;
        query = query.range(offset, offset + options.limit - 1);
      }

      query = query.order('updated_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw new Error(`Failed to fetch funnels: ${error.message}`);

      return {
        funnels: (data || []) as Funnel[],
        total: count || 0,
      };
    } catch (error) {
      console.error('[FunnelRepository] findAll error:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Funnel | null> {
    // Test mode: usar in-memory store
    if (this.isTestMode) {
      return this.testStore.get(id) || null;
    }

    try {
      const { data, error } = await this.supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Failed to fetch funnel: ${error.message}`);
      }

      return data as Funnel;
    } catch (error) {
      console.error('[FunnelRepository] findById error:', error);
      throw error;
    }
  }

  async create(input: CreateFunnelInput): Promise<Funnel> {
    const funnel: Funnel = {
      id: input.id || `funnel_${Date.now()}`,
      name: input.name,
      slug: input.slug || null,
      description: input.description || null,
      user_id: input.user_id || null,
      steps: input.steps || [],
      settings: input.settings || {},
      published: input.published || false,
      public_url: input.public_url || null,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Test mode: usar in-memory store
    if (this.isTestMode) {
      this.testStore.set(funnel.id, funnel);
      return funnel;
    }

    try {
      const { data, error } = await this.supabase
        .from('funnels')
        .insert(funnel)
        .select()
        .single();

      if (error) throw new Error(`Failed to create funnel: ${error.message}`);
      return data as Funnel;
    } catch (error) {
      console.error('[FunnelRepository] create error:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updates: UpdateFunnelInput,
    expectedVersion?: number
  ): Promise<Funnel> {
    // Test mode: usar in-memory store
    if (this.isTestMode) {
      const existing = this.testStore.get(id);
      if (!existing) throw new Error('Funnel not found');
      const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
      this.testStore.set(id, updated);
      return updated;
    }

    try {
      let query = this.supabase.from('funnels').update(updates).eq('id', id);

      if (expectedVersion !== undefined) {
        query = query.eq('version', expectedVersion);
      }

      const { data, error } = await query.select().single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('CONFLICT: Funnel was modified by another user');
        }
        throw new Error(`Failed to update funnel: ${error.message}`);
      }

      const { data: versionData } = await this.supabase!
        .from('funnels')
        .update({ version: (data.version || 1) + 1 })
        .eq('id', id)
        .select()
        .single();

      return (versionData || data) as Funnel;
    } catch (error) {
      console.error('[FunnelRepository] update error:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    // Test mode: usar in-memory store
    if (this.isTestMode) {
      this.testStore.delete(id);
      return;
    }

    try {
      const { error } = await this.supabase.from('funnels').delete().eq('id', id);
      if (error) throw new Error(`Failed to delete funnel: ${error.message}`);
    } catch (error) {
      console.error('[FunnelRepository] delete error:', error);
      throw error;
    }
  }
}

export const funnelRepository = new FunnelRepository();
