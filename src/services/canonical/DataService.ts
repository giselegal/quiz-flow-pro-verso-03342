/**
 * 🗄️ DATA SERVICE - Canonical Service for Data Operations
 * 
 * Consolidates 31 data services into a unified data management layer:
 * - Funnels CRUD (create, read, update, delete, duplicate, publish)
 * - Results operations (list, get, create, delete, export)
 * - Participants/Users (list, get, update, export)
 * - Quiz Sessions (create, update, track)
 * - Supabase integration with caching
 * - Repository pattern for data access
 * 
 * CONSOLIDATES:
 * - EnhancedUnifiedDataService, FunnelUnifiedService, quizSupabaseService
 * - UnifiedCRUDService, FunnelDataMigration, Quiz21CompleteService
 * - resultService, phase5DataSimulator, realTimeAnalytics
 * - And 22 more data-related services
 */

import { supabase } from '@/integrations/supabase/customClient';
import { indexedDBService } from '../storage/IndexedDBService';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { deepClone } from '@/utils/cloneFunnel';
import { errorManager, createValidationError } from '@/utils/errorHandling';
import { BaseCanonicalService, ServiceResult } from './types';
import { CacheService } from './CacheService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  category?: string;
  context: FunnelContext;
  userId: string;
  settings: any;
  pages: any[];
  isPublished: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  templateId?: string;
  isFromTemplate?: boolean;
}

export interface FunnelFilters {
  context?: FunnelContext;
  userId?: string;
  category?: string;
  isPublished?: boolean;
  search?: string;
}

export interface FunnelPagination {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateFunnelDTO {
  name: string;
  description?: string;
  category?: string;
  context: FunnelContext;
  templateId?: string;
  userId?: string;
  autoPublish?: boolean;
  settings?: any;
  pages?: any[];
}

export interface UpdateFunnelDTO {
  name?: string;
  description?: string;
  category?: string;
  settings?: any;
  pages?: any[];
  isPublished?: boolean;
}

export interface QuizParticipant {
  id: string;
  sessionId: string;
  email?: string;
  name?: string;
  ipAddress?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: Date;
}

export interface QuizSession {
  id: string;
  funnelId: string;
  userId: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  currentStep: number;
  totalSteps: number;
  score: number;
  maxScore: number;
  startedAt: Date;
  completedAt?: Date;
  lastActivity: Date;
  metadata?: any;
}

export interface QuizResult {
  id: string;
  sessionId: string;
  funnelId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: any[];
  completedAt: Date;
  metadata?: any;
}

export interface QuizResponse {
  id: string;
  sessionId: string;
  stepNumber: number;
  questionId: string;
  questionText?: string;
  answerValue?: string;
  answerText?: string;
  scoreEarned: number;
  responseTimeMs?: number;
  respondedAt: Date;
}

export interface DashboardMetrics {
  activeUsersNow: number;
  totalSessions: number;
  conversionRate: number;
  totalRevenue: number;
  averageSessionDuration: number;
  bounceRate: number;
}

// ============================================================================
// DATA SERVICE - MAIN CLASS
// ============================================================================

export class DataService extends BaseCanonicalService {
  private static instance: DataService;
  private cacheService: CacheService;
  private eventListeners = new Map<string, Function[]>();

  private constructor() {
    super('DataService', '1.0.0', { debug: false });
    this.cacheService = CacheService.getInstance();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing DataService...');
    
    try {
      // Initialize cache service
      await this.cacheService.initialize();
      
      // Setup event listeners for cache invalidation
      this.setupEventListeners();
      
      this.log('DataService initialized successfully');
    } catch (error) {
      this.error('Failed to initialize DataService', error);
      throw error;
    }
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing DataService...');
    this.eventListeners.clear();
    await this.cacheService.dispose();
  }

  async healthCheck(): Promise<boolean> {
    if (this.state !== 'ready') return false;
    
    try {
      // Test Supabase connection
      const { error } = await supabase.from('funnels').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  private setupEventListeners(): void {
    // Listen to funnel events to invalidate cache
    this.on('funnel:created', () => this.cacheService.funnels.invalidate(''));
    this.on('funnel:updated', () => this.cacheService.funnels.invalidate(''));
    this.on('funnel:deleted', () => this.cacheService.funnels.invalidate(''));
  }

  private on(event: string, handler: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(handler);
  }

  private emit(event: string, data?: any): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          this.error(`Error in event handler for ${event}`, error);
        }
      });
    }
  }

  // ============================================================================
  // FUNNELS - CORE CRUD OPERATIONS
  // ============================================================================

  /**
   * List funnels with filters and pagination
   */
  async listFunnels(
    filters?: FunnelFilters,
    pagination?: FunnelPagination
  ): Promise<ServiceResult<Funnel[]>> {
    try {
      const cacheKey = `funnels:list:${JSON.stringify({ filters, pagination })}`;
      const cached = this.cacheService.get<Funnel[]>(cacheKey);
      if (cached.success && cached.data) {
        return { success: true, data: cached.data };
      }

      let query = supabase.from('funnels').select('*');

      // Apply filters
      if (filters?.context) query = query.eq('context', filters.context);
      if (filters?.userId) query = query.eq('user_id', filters.userId);
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.isPublished !== undefined) query = query.eq('is_published', filters.isPublished);
      if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

      // Apply pagination
      const limit = pagination?.limit || 50;
      const offset = pagination?.offset || 0;
      query = query.range(offset, offset + limit - 1);

      // Apply sorting
      const sortBy = pagination?.sortBy || 'updatedAt';
      const sortOrder = pagination?.sortOrder || 'desc';
      query = query.order(sortBy === 'updatedAt' ? 'updated_at' : sortBy === 'createdAt' ? 'created_at' : 'name', {
        ascending: sortOrder === 'asc'
      });

      const { data, error } = await query;

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to list funnels: ${error.message}`)
        };
      }

      const funnels: Funnel[] = (data || []).map(row => this.mapRowToFunnel(row));
      
      // Cache results
      this.cacheService.set(cacheKey, funnels, { ttl: 5 * 60 * 1000 }); // 5 min TTL

      return { success: true, data: funnels };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to list funnels')
      };
    }
  }

  /**
   * Get funnel by ID
   */
  async getFunnel(id: string): Promise<ServiceResult<Funnel>> {
    try {
      const cacheKey = `funnel:${id}`;
      const cached = this.cacheService.funnels.get(cacheKey);
      if (cached.success && cached.data && typeof cached.data === 'object' && 'id' in cached.data) {
        return { success: true, data: cached.data as Funnel };
      }

      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(`Funnel not found: ${error.message}`)
        };
      }

      const funnel = this.mapRowToFunnel(data);
      
      // Cache funnel
      this.cacheService.funnels.set(cacheKey, funnel);

      return { success: true, data: funnel };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get funnel')
      };
    }
  }

  /**
   * Create new funnel
   */
  async createFunnel(dto: CreateFunnelDTO): Promise<ServiceResult<Funnel>> {
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

      const { data, error } = await supabase
        .from('funnels')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to create funnel: ${error.message}`)
        };
      }

      const funnel = this.mapRowToFunnel(data);
      
      // Invalidate cache and emit event
      this.cacheService.funnels.invalidate('');
      this.emit('funnel:created', funnel);

      return { success: true, data: funnel };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to create funnel')
      };
    }
  }

  /**
   * Update existing funnel
   */
  async updateFunnel(id: string, dto: UpdateFunnelDTO): Promise<ServiceResult<Funnel>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.category !== undefined) updateData.category = dto.category;
      if (dto.settings !== undefined) updateData.settings = dto.settings;
      if (dto.pages !== undefined) updateData.pages = dto.pages;
      if (dto.isPublished !== undefined) updateData.is_published = dto.isPublished;

      const { data, error } = await supabase
        .from('funnels')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to update funnel: ${error.message}`)
        };
      }

      const funnel = this.mapRowToFunnel(data);
      
      // Invalidate cache and emit event
      this.cacheService.funnels.invalidate(id);
      this.emit('funnel:updated', funnel);

      return { success: true, data: funnel };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to update funnel')
      };
    }
  }

  /**
   * Delete funnel
   */
  async deleteFunnel(id: string): Promise<ServiceResult<void>> {
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to delete funnel: ${error.message}`)
        };
      }

      // Invalidate cache and emit event
      this.cacheService.funnels.invalidate(id);
      this.emit('funnel:deleted', { id });

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to delete funnel')
      };
    }
  }

  /**
   * Duplicate funnel
   */
  async duplicateFunnel(id: string, newName?: string): Promise<ServiceResult<Funnel>> {
    try {
      const getFunnelResult = await this.getFunnel(id);
      if (!getFunnelResult.success) {
        return getFunnelResult;
      }

      const original = getFunnelResult.data;
      const cloned = deepClone(original);

      return await this.createFunnel({
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
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to duplicate funnel')
      };
    }
  }

  /**
   * Publish funnel
   */
  async publishFunnel(id: string): Promise<ServiceResult<Funnel>> {
    return await this.updateFunnel(id, { isPublished: true });
  }

  /**
   * Unpublish funnel
   */
  async unpublishFunnel(id: string): Promise<ServiceResult<Funnel>> {
    return await this.updateFunnel(id, { isPublished: false });
  }

  // ============================================================================
  // PARTICIPANTS - USER MANAGEMENT
  // ============================================================================

  /**
   * Create quiz participant/user
   */
  async createParticipant(data: {
    sessionId?: string;
    email?: string;
    name?: string;
    ipAddress?: string;
    userAgent?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }): Promise<ServiceResult<QuizParticipant>> {
    try {
      const sessionId = data.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const insertData = {
        session_id: sessionId,
        email: data.email,
        name: data.name,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
      };

      const { data: row, error } = await supabase
        .from('quiz_users')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to create participant: ${error.message}`)
        };
      }

      const participant: QuizParticipant = {
        id: row.id,
        sessionId: row.session_id,
        email: row.email || undefined,
        name: row.name || undefined,
        ipAddress: row.ip_address?.toString(),
        userAgent: row.user_agent || undefined,
        utmSource: row.utm_source || undefined,
        utmMedium: row.utm_medium || undefined,
        utmCampaign: row.utm_campaign || undefined,
        createdAt: new Date(row.created_at!),
      };

      return { success: true, data: participant };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to create participant')
      };
    }
  }

  /**
   * Get participant by session ID
   */
  async getParticipantBySession(sessionId: string): Promise<ServiceResult<QuizParticipant | null>> {
    try {
      const { data, error } = await supabase
        .from('quiz_users')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return {
          success: false,
          error: new Error(`Failed to get participant: ${error.message}`)
        };
      }

      if (!data) {
        return { success: true, data: null };
      }

      const participant: QuizParticipant = {
        id: data.id,
        sessionId: data.session_id,
        email: data.email || undefined,
        name: data.name || undefined,
        ipAddress: data.ip_address?.toString(),
        userAgent: data.user_agent || undefined,
        utmSource: data.utm_source || undefined,
        utmMedium: data.utm_medium || undefined,
        utmCampaign: data.utm_campaign || undefined,
        createdAt: new Date(data.created_at!),
      };

      return { success: true, data: participant };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get participant')
      };
    }
  }

  /**
   * List participants with filters
   */
  async listParticipants(filters?: {
    funnelId?: string;
    email?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResult<QuizParticipant[]>> {
    try {
      let query = supabase.from('quiz_users').select('*');

      if (filters?.email) query = query.ilike('email', `%${filters.email}%`);

      const limit = filters?.limit || 50;
      const offset = filters?.offset || 0;
      query = query.range(offset, offset + limit - 1);
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to list participants: ${error.message}`)
        };
      }

      const participants: QuizParticipant[] = (data || []).map(row => ({
        id: row.id,
        sessionId: row.session_id,
        email: row.email || undefined,
        name: row.name || undefined,
        ipAddress: row.ip_address?.toString(),
        userAgent: row.user_agent || undefined,
        utmSource: row.utm_source || undefined,
        utmMedium: row.utm_medium || undefined,
        utmCampaign: row.utm_campaign || undefined,
        createdAt: new Date(row.created_at!),
      }));

      return { success: true, data: participants };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to list participants')
      };
    }
  }

  // ============================================================================
  // SESSIONS - QUIZ SESSION MANAGEMENT
  // ============================================================================

  /**
   * Create quiz session
   */
  async createSession(data: {
    funnelId: string;
    quizUserId: string;
    totalSteps?: number;
    maxScore?: number;
    metadata?: any;
  }): Promise<ServiceResult<QuizSession>> {
    try {
      const insertData = {
        funnel_id: data.funnelId,
        quiz_user_id: data.quizUserId,
        status: 'started',
        current_step: 0,
        total_steps: data.totalSteps || 0,
        score: 0,
        max_score: data.maxScore || 0,
        metadata: data.metadata || {},
      };

      const { data: row, error } = await supabase
        .from('quiz_sessions')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to create session: ${error.message}`)
        };
      }

      const session: QuizSession = {
        id: row.id,
        funnelId: row.funnel_id,
        userId: row.quiz_user_id,
        status: row.status as any,
        currentStep: row.current_step || 0,
        totalSteps: row.total_steps || 0,
        score: row.score || 0,
        maxScore: row.max_score || 0,
        startedAt: new Date(row.started_at!),
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        lastActivity: new Date(row.last_activity!),
        metadata: row.metadata,
      };

      return { success: true, data: session };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to create session')
      };
    }
  }

  /**
   * Update quiz session
   */
  async updateSession(sessionId: string, updates: {
    status?: 'started' | 'in_progress' | 'completed' | 'abandoned';
    currentStep?: number;
    score?: number;
    completedAt?: Date;
    metadata?: any;
  }): Promise<ServiceResult<void>> {
    try {
      const updateData: any = {};

      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.currentStep !== undefined) updateData.current_step = updates.currentStep;
      if (updates.score !== undefined) updateData.score = updates.score;
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt.toISOString();
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

      const { error } = await supabase
        .from('quiz_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to update session: ${error.message}`)
        };
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to update session')
      };
    }
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<ServiceResult<QuizSession | null>> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return {
          success: false,
          error: new Error(`Failed to get session: ${error.message}`)
        };
      }

      if (!data) {
        return { success: true, data: null };
      }

      const session: QuizSession = {
        id: data.id,
        funnelId: data.funnel_id,
        userId: data.quiz_user_id,
        status: data.status as any,
        currentStep: data.current_step || 0,
        totalSteps: data.total_steps || 0,
        score: data.score || 0,
        maxScore: data.max_score || 0,
        startedAt: new Date(data.started_at!),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        lastActivity: new Date(data.last_activity!),
        metadata: data.metadata,
      };

      return { success: true, data: session };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get session')
      };
    }
  }

  // ============================================================================
  // RESULTS - QUIZ RESULTS MANAGEMENT
  // ============================================================================

  /**
   * Create quiz result
   * NOTE: Using quiz_analytics table as quiz_results might not exist
   */
  async saveQuizResult(data: {
    sessionId: string;
    funnelId: string;
    userId: string;
    score: number;
    maxScore: number;
    answers: any[];
    metadata?: any;
  }): Promise<ServiceResult<QuizResult>> {
    try {
      const percentage = data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0;

      // Store in analytics table since quiz_results schema doesn't match
      const insertData = {
        session_id: data.sessionId,
        funnel_id: data.funnelId,
        event_type: 'quiz_completed',
        event_data: {
          score: data.score,
          maxScore: data.maxScore,
          percentage,
          answers: data.answers,
          userId: data.userId,
          ...data.metadata
        }
      };

      const { data: row, error } = await supabase
        .from('quiz_analytics')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to create result: ${error.message}`)
        };
      }

      const result: QuizResult = {
        id: row.id!,
        sessionId: row.session_id!,
        funnelId: row.funnel_id!,
        userId: data.userId,
        score: data.score,
        maxScore: data.maxScore,
        percentage,
        answers: data.answers,
        completedAt: new Date(row.timestamp!),
        metadata: data.metadata,
      };

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to create result')
      };
    }
  }

  /**
   * Get result by ID
   */
  async getQuizResult(resultId: string): Promise<ServiceResult<QuizResult | null>> {
    try {
      const { data, error } = await supabase
        .from('quiz_analytics')
        .select('*')
        .eq('id', resultId)
        .eq('event_type', 'quiz_completed')
        .single();

      if (error && error.code !== 'PGRST116') {
        return {
          success: false,
          error: new Error(`Failed to get result: ${error.message}`)
        };
      }

      if (!data) {
        return { success: true, data: null };
      }

      const eventData = data.event_data as any || {};
      const result: QuizResult = {
        id: data.id!,
        sessionId: data.session_id!,
        funnelId: data.funnel_id!,
        userId: eventData.userId || '',
        score: eventData.score || 0,
        maxScore: eventData.maxScore || 0,
        percentage: eventData.percentage || 0,
        answers: eventData.answers || [],
        completedAt: new Date(data.timestamp!),
        metadata: eventData,
      };

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get result')
      };
    }
  }

  /**
   * List results with filters
   */
  async listQuizResults(filters?: {
    funnelId?: string;
    userId?: string;
    minScore?: number;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResult<QuizResult[]>> {
    try {
      let query = supabase
        .from('quiz_analytics')
        .select('*')
        .eq('event_type', 'quiz_completed');

      if (filters?.funnelId) query = query.eq('funnel_id', filters.funnelId);

      const limit = filters?.limit || 50;
      const offset = filters?.offset || 0;
      query = query.range(offset, offset + limit - 1);
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to list results: ${error.message}`)
        };
      }

      const results: QuizResult[] = (data || []).map(row => {
        const eventData = row.event_data as any || {};
        return {
          id: row.id!,
          sessionId: row.session_id!,
          funnelId: row.funnel_id!,
          userId: eventData.userId || '',
          score: eventData.score || 0,
          maxScore: eventData.maxScore || 0,
          percentage: eventData.percentage || 0,
          answers: eventData.answers || [],
          completedAt: new Date(row.timestamp!),
          metadata: eventData,
        };
      });

      return { success: true, data: results };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to list results')
      };
    }
  }

  /**
   * Delete result
   */
  async deleteQuizResult(resultId: string): Promise<ServiceResult<void>> {
    try {
      const { error } = await supabase
        .from('quiz_analytics')
        .delete()
        .eq('id', resultId)
        .eq('event_type', 'quiz_completed');

      if (error) {
        return {
          success: false,
          error: new Error(`Failed to delete result: ${error.message}`)
        };
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to delete result')
      };
    }
  }

  // ============================================================================
  // ANALYTICS - DASHBOARD METRICS
  // ============================================================================

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<ServiceResult<DashboardMetrics>> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Active users (last 5 minutes)
      const { count: activeUsers } = await supabase
        .from('active_user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      // Total sessions today
      const { count: totalSessions } = await supabase
        .from('quiz_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today);

      // Conversions today
      const { count: conversions } = await supabase
        .from('quiz_conversions')
        .select('*', { count: 'exact', head: true })
        .gte('converted_at', today);

      // Revenue today
      const { data: revenueData } = await supabase
        .from('quiz_conversions')
        .select('conversion_value')
        .gte('converted_at', today);

      const totalRevenue = revenueData?.reduce(
        (sum, item) => sum + (Number(item.conversion_value) || 0),
        0
      ) || 0;

      // Session analytics
      const { data: analyticsData } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      const metrics: DashboardMetrics = {
        activeUsersNow: activeUsers || 0,
        totalSessions: totalSessions || 0,
        conversionRate: totalSessions && conversions 
          ? (conversions / totalSessions) * 100 
          : 0,
        totalRevenue,
        averageSessionDuration: analyticsData?.average_duration_seconds || 0,
        bounceRate: analyticsData?.bounce_rate || 0,
      };

      return { success: true, data: metrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get dashboard metrics')
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

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

  // ============================================================================
  // SPECIALIZED API - ORGANIZED BY DOMAIN
  // ============================================================================

  /**
   * Funnels API
   */
  readonly funnels = {
    list: (filters?: FunnelFilters, pagination?: FunnelPagination) =>
      this.listFunnels(filters, pagination),
    get: (id: string) => this.getFunnel(id),
    create: (dto: CreateFunnelDTO) => this.createFunnel(dto),
    update: (id: string, dto: UpdateFunnelDTO) => this.updateFunnel(id, dto),
    delete: (id: string) => this.deleteFunnel(id),
    duplicate: (id: string, newName?: string) => this.duplicateFunnel(id, newName),
    publish: (id: string) => this.publishFunnel(id),
    unpublish: (id: string) => this.unpublishFunnel(id),
  };

  /**
   * Participants API
   */
  readonly participants = {
    create: (data: Parameters<typeof this.createParticipant>[0]) =>
      this.createParticipant(data),
    getBySession: (sessionId: string) => this.getParticipantBySession(sessionId),
    list: (filters?: Parameters<typeof this.listParticipants>[0]) =>
      this.listParticipants(filters),
  };

  /**
   * Sessions API
   */
  readonly sessions = {
    create: (data: Parameters<typeof this.createSession>[0]) =>
      this.createSession(data),
    update: (sessionId: string, updates: Parameters<typeof this.updateSession>[1]) =>
      this.updateSession(sessionId, updates),
    get: (sessionId: string) => this.getSession(sessionId),
  };

  /**
   * Results API
   */
  readonly results = {
    create: (data: Parameters<typeof this.saveQuizResult>[0]) =>
      this.saveQuizResult(data),
    get: (resultId: string) => this.getQuizResult(resultId),
    list: (filters?: Parameters<typeof this.listQuizResults>[0]) =>
      this.listQuizResults(filters),
    delete: (resultId: string) => this.deleteQuizResult(resultId),
  };

  /**
   * Analytics API
   */
  readonly analytics = {
    getDashboardMetrics: () => this.getDashboardMetrics(),
  };
}

// Export singleton instance
export const dataService = DataService.getInstance();
