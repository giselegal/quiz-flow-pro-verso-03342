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

import { supabase } from '@/services/integrations/supabase/customClient';
import { indexedDBService } from '../storage/IndexedDBService';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { deepClone } from '@/lib/utils/cloneFunnel';
import { errorManager, createValidationError } from '@/lib/utils/errorHandling';
import { BaseCanonicalService, ServiceResult } from './types';
import { CacheService } from './CacheService';
import { participantDataService } from './data/ParticipantDataService';
import { sessionDataService } from './data/SessionDataService';
import { resultDataService } from './data/ResultDataService';
import { funnelDataService } from './data/FunnelDataService';
import { analyticsDataService } from './data/AnalyticsDataService';
import { CanonicalServicesMonitor } from './monitoring';
import { appLogger } from '@/lib/utils/appLogger';

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
      const dbOk = !error;

      // Aggregate subservices health
      const [participantsOk, sessionsOk, resultsOk, funnelsOk, analyticsOk] = await Promise.all([
        participantDataService.healthCheck(),
        sessionDataService.healthCheck(),
        resultDataService.healthCheck(),
        funnelDataService.healthCheck(),
        analyticsDataService.healthCheck(),
      ]);

      return dbOk && participantsOk && sessionsOk && resultsOk && funnelsOk && analyticsOk;
    } catch (error) {
      appLogger.warn('[DataService] Health check falhou:', { data: [error] });
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
    pagination?: FunnelPagination,
  ): Promise<ServiceResult<Funnel[]>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'listFunnels');
    return funnelDataService.listFunnels(filters, pagination);
  }

  /**
   * Get funnel by ID
   */
  async getFunnel(id: string): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getFunnel');
    return funnelDataService.getFunnel(id);
  }

  /**
   * Create new funnel
   */
  async createFunnel(dto: CreateFunnelDTO): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'createFunnel');
    return funnelDataService.createFunnel(dto);
  }

  /**
   * Update existing funnel
   */
  async updateFunnel(id: string, dto: UpdateFunnelDTO): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'updateFunnel');
    return funnelDataService.updateFunnel(id, dto);
  }

  /**
   * Delete funnel
   */
  async deleteFunnel(id: string): Promise<ServiceResult<void>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'deleteFunnel');
    return funnelDataService.deleteFunnel(id);
  }

  /**
   * Duplicate funnel
   */
  async duplicateFunnel(id: string, newName?: string): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'duplicateFunnel');
    return funnelDataService.duplicateFunnel(id, newName);
  }

  /**
   * Publish funnel
   */
  async publishFunnel(id: string): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'publishFunnel');
    return await this.updateFunnel(id, { isPublished: true });
  }

  /**
   * Unpublish funnel
   */
  async unpublishFunnel(id: string): Promise<ServiceResult<Funnel>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'unpublishFunnel');
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
    CanonicalServicesMonitor.trackUsage(this.name, 'createParticipant');
    return participantDataService.createParticipant(data);
  }

  /**
   * Get participant by session ID
   */
  async getParticipantBySession(sessionId: string): Promise<ServiceResult<QuizParticipant | null>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getParticipantBySession');
    return participantDataService.getParticipantBySession(sessionId);
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
    // Ignoramos funnelId aqui (não filtrado nessa tabela) para manter compatibilidade
    const { email, limit, offset } = filters || {};
    CanonicalServicesMonitor.trackUsage(this.name, 'listParticipants');
    return participantDataService.listParticipants({ email, limit, offset });
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
    CanonicalServicesMonitor.trackUsage(this.name, 'createSession');
    return sessionDataService.createSession(data);
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
    CanonicalServicesMonitor.trackUsage(this.name, 'updateSession');
    return sessionDataService.updateSession(sessionId, updates);
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<ServiceResult<QuizSession | null>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getSession');
    return sessionDataService.getSession(sessionId);
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
    CanonicalServicesMonitor.trackUsage(this.name, 'saveQuizResult');
    return resultDataService.saveQuizResult(data);
  }

  /**
   * Get result by ID
   */
  async getQuizResult(resultId: string): Promise<ServiceResult<QuizResult | null>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getQuizResult');
    return resultDataService.getQuizResult(resultId);
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
    CanonicalServicesMonitor.trackUsage(this.name, 'listQuizResults');
    return resultDataService.listQuizResults(filters);
  }

  /**
   * Delete result
   */
  async deleteQuizResult(resultId: string): Promise<ServiceResult<void>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'deleteQuizResult');
    return resultDataService.deleteQuizResult(resultId);
  }

  // ============================================================================
  // ANALYTICS - DASHBOARD METRICS
  // ============================================================================

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<ServiceResult<DashboardMetrics>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getDashboardMetrics');
    return analyticsDataService.getDashboardMetrics();
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
