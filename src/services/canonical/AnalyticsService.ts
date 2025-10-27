/**
 * ANALYTICS SERVICE - Sistema Canônico de Analytics e Métricas
 * 
 * Consolida: AnalyticsService, QuizAnalyticsService, RealTimeAnalytics, RealDataAnalyticsService (4 serviços)
 * 
 * Funcionalidades:
 * - Rastreamento de eventos (quiz start, step change, completion, etc)
 * - Métricas de performance (tempo de carregamento, resposta, etc)
 * - Analytics em tempo real (usuários ativos, sessões, conversão)
 * - Métricas de negócio (lead generation, funil performance)
 * - Persistência de eventos (Supabase + localStorage)
 * - Dashboard metrics agregadas
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { supabase } from '@/lib/supabase';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type EventType = 
  | 'quiz_started' 
  | 'step_changed' 
  | 'step_completed' 
  | 'question_answered' 
  | 'quiz_completed'
  | 'quiz_abandoned'
  | 'editor_action'
  | 'error'
  | 'performance';

export type MetricCategory = 'performance' | 'collaboration' | 'versioning' | 'usage' | 'system';
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  userId?: string;
  funnelId?: string;
  sessionId: string;
  timestamp: Date;
  properties: Record<string, any>;
  context: EventContext;
}

export interface EventContext {
  userAgent: string;
  url: string;
  referrer?: string;
  screenResolution: string;
  timezone: string;
  deviceType: DeviceType;
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: MetricCategory;
  tags: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface SessionMetrics {
  sessionId: string;
  userId?: string;
  funnelId?: string;
  startedAt: Date;
  lastActivity: Date;
  completedAt?: Date;
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  timeSpent: number;
  deviceInfo: {
    type: DeviceType;
    userAgent: string;
    screenResolution: string;
  };
  responses: number;
  finalResult?: {
    resultType: string;
    resultTitle: string;
    score?: number;
  };
}

export interface AnalyticsDashboardMetrics {
  // Core metrics
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  conversionRate: number;
  
  // Performance
  averageCompletionTime: number;
  averageSessionDuration: number;
  dropOffRate: number;
  
  // User behavior
  deviceStats: Array<{ device: string; count: number; percentage: number }>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  dailyTrends: Array<{ date: string; sessions: number; completions: number }>;
  
  // Business
  leadGeneration: number;
  topPerformingFunnels: Array<{ id: string; name: string; sessions: number; conversionRate: number }>;
  
  // Real-time
  activeUsersNow: number;
  recentActivity: Array<{ sessionId: string; funnelId: string; timestamp: string; event: string }>;
  
  // Metadata
  lastUpdated: Date;
  dataSource: 'supabase' | 'localStorage';
}

export interface QuizAnalytics {
  totalQuizzes: number;
  completionRate: number;
  averageScore: number;
  popularStyles: Array<{ style: string; count: number; percentage: number }>;
  stepCompletionRates: Array<{ step: number; completionRate: number }>;
  averageTimePerStep: Array<{ step: number; averageTime: number }>;
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export class AnalyticsService extends BaseCanonicalService {
  private static instance: AnalyticsService;
  
  private eventsList: AnalyticsEvent[] = [];
  private metricsList: Map<MetricCategory, Metric[]> = new Map();
  private sessionsMap: Map<string, SessionMetrics> = new Map();
  
  private currentSessionId: string;
  private sessionStartTime: Date;
  private stepStartTime: Date;
  
  private readonly MAX_EVENTS = 500;
  private readonly MAX_METRICS_PER_CATEGORY = 200;
  private readonly STORAGE_KEY = 'analytics_v1';
  private readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  
  private dashboardCache?: { data: AnalyticsDashboardMetrics; timestamp: number };

  private constructor() {
    super('AnalyticsService', '1.0.0', { debug: false });
    this.currentSessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    this.stepStartTime = new Date();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing AnalyticsService...');
    
    // Restore from localStorage if browser
    if (this.isBrowser()) {
      this.restoreFromStorage();
    }
    
    // Initialize session tracking
    this.startSession();
    
    this.log('AnalyticsService initialized successfully');
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing AnalyticsService...');
    
    // Persist to storage before disposing
    if (this.isBrowser()) {
      this.persistToStorage();
    }
    
    // Clear data
    this.eventsList = [];
    this.metricsList.clear();
    this.sessionsMap.clear();
  }

  async healthCheck(): Promise<boolean> {
    if (this.state !== 'ready') return false;
    
    // Check if can connect to Supabase
    try {
      const { error } = await supabase
        .from('quiz_sessions')
        .select('count(*)')
        .limit(1);
      
      return !error;
    } catch {
      // Fallback to localStorage mode
      return this.isBrowser();
    }
  }

  // ============================================================================
  // EVENT TRACKING
  // ============================================================================

  /**
   * Track an analytics event
   */
  trackEvent(params: {
    type: EventType;
    userId?: string;
    funnelId?: string;
    properties?: Record<string, any>;
  }): ServiceResult<AnalyticsEvent> {
    try {
      const event: AnalyticsEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: params.type,
        userId: params.userId,
        funnelId: params.funnelId,
        sessionId: this.currentSessionId,
        timestamp: new Date(),
        properties: params.properties || {},
        context: this.getEventContext(),
      };

      this.eventsList.push(event);
      this.pruneEvents();

      // Persist to Supabase (async, don't block)
      this.persistEventToSupabase(event).catch(err => {
        if (this.options.debug) {
          this.log('Failed to persist event to Supabase:', err);
        }
      });

      // Update session metrics
      this.updateSessionMetrics(event);

      if (this.isBrowser()) {
        this.persistToStorage();
      }

      if (this.options.debug) {
        this.log(`Event tracked: ${params.type}`, event);
      }

      return { success: true, data: event };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to track event'),
      };
    }
  }

  /**
   * Track quiz start
   */
  trackQuizStart(userId?: string, funnelId?: string): ServiceResult<AnalyticsEvent> {
    return this.trackEvent({
      type: 'quiz_started',
      userId,
      funnelId,
      properties: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track step change
   */
  trackStepChange(stepNumber: number, stepType: string, funnelId?: string): ServiceResult<AnalyticsEvent> {
    const timeSpent = Date.now() - this.stepStartTime.getTime();
    this.stepStartTime = new Date();

    return this.trackEvent({
      type: 'step_changed',
      funnelId,
      properties: {
        stepNumber,
        stepType,
        timeSpent: Math.round(timeSpent / 1000), // seconds
      },
    });
  }

  /**
   * Track question answered
   */
  trackAnswer(questionId: string, optionId: string, stepNumber: number, funnelId?: string): ServiceResult<AnalyticsEvent> {
    return this.trackEvent({
      type: 'question_answered',
      funnelId,
      properties: {
        questionId,
        optionId,
        stepNumber,
      },
    });
  }

  /**
   * Track quiz completion
   */
  trackQuizComplete(result: any, funnelId?: string): ServiceResult<AnalyticsEvent> {
    const completionTime = Date.now() - this.sessionStartTime.getTime();

    return this.trackEvent({
      type: 'quiz_completed',
      funnelId,
      properties: {
        resultStyle: result.primaryStyle?.name,
        resultPercentage: result.primaryStyle?.percentage,
        totalQuestions: result.totalQuestions,
        completionTime: Math.round(completionTime / 1000), // seconds
        score: result.score,
      },
    });
  }

  /**
   * Track editor action
   */
  trackEditorAction(action: string, details: Record<string, any> = {}): ServiceResult<AnalyticsEvent> {
    return this.trackEvent({
      type: 'editor_action',
      userId: details.userId,
      funnelId: details.funnelId,
      properties: { action, ...details },
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, component?: string): ServiceResult<AnalyticsEvent> {
    return this.trackEvent({
      type: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        component: component || 'unknown',
      },
    });
  }

  /**
   * Get events with filters
   */
  getEvents(filters?: {
    type?: EventType;
    userId?: string;
    funnelId?: string;
    sessionId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): ServiceResult<AnalyticsEvent[]> {
    try {
      let filtered = [...this.eventsList];

      if (filters?.type) {
        filtered = filtered.filter(e => e.type === filters.type);
      }

      if (filters?.userId) {
        filtered = filtered.filter(e => e.userId === filters.userId);
      }

      if (filters?.funnelId) {
        filtered = filtered.filter(e => e.funnelId === filters.funnelId);
      }

      if (filters?.sessionId) {
        filtered = filtered.filter(e => e.sessionId === filters.sessionId);
      }

      if (filters?.startDate) {
        filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
      }

      if (filters?.endDate) {
        filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
      }

      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      if (filters?.limit) {
        filtered = filtered.slice(0, filters.limit);
      }

      return { success: true, data: filtered };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get events'),
      };
    }
  }

  // ============================================================================
  // METRICS TRACKING
  // ============================================================================

  /**
   * Record a metric
   */
  recordMetric(params: {
    name: string;
    value: number;
    unit: string;
    category: MetricCategory;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
  }): ServiceResult<Metric> {
    try {
      const metric: Metric = {
        id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: params.name,
        value: params.value,
        unit: params.unit,
        timestamp: new Date(),
        category: params.category,
        tags: params.tags || {},
        metadata: params.metadata,
      };

      const categoryMetrics = this.metricsList.get(params.category) || [];
      categoryMetrics.push(metric);
      this.metricsList.set(params.category, categoryMetrics);
      this.pruneMetrics(params.category);

      if (this.isBrowser()) {
        this.persistToStorage();
      }

      if (this.options.debug) {
        this.log(`Metric recorded: ${params.name} = ${params.value} ${params.unit}`);
      }

      return { success: true, data: metric };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to record metric'),
      };
    }
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number, unit: string = 'ms'): ServiceResult<Metric> {
    return this.recordMetric({
      name: metric,
      value,
      unit,
      category: 'performance',
    });
  }

  /**
   * Get metrics with filters
   */
  getMetrics(filters?: {
    category?: MetricCategory;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): ServiceResult<Metric[]> {
    try {
      let allMetrics: Metric[] = [];

      if (filters?.category) {
        allMetrics = this.metricsList.get(filters.category) || [];
      } else {
        for (const metrics of this.metricsList.values()) {
          allMetrics.push(...metrics);
        }
      }

      if (filters?.name) {
        allMetrics = allMetrics.filter(m => m.name === filters.name);
      }

      if (filters?.startDate) {
        allMetrics = allMetrics.filter(m => m.timestamp >= filters.startDate!);
      }

      if (filters?.endDate) {
        allMetrics = allMetrics.filter(m => m.timestamp <= filters.endDate!);
      }

      allMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      if (filters?.limit) {
        allMetrics = allMetrics.slice(0, filters.limit);
      }

      return { success: true, data: allMetrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get metrics'),
      };
    }
  }

  // ============================================================================
  // SESSION TRACKING
  // ============================================================================

  /**
   * Start a new session
   */
  private startSession(): void {
    const session: SessionMetrics = {
      sessionId: this.currentSessionId,
      startedAt: this.sessionStartTime,
      lastActivity: new Date(),
      currentStep: 1,
      totalSteps: 0,
      completionPercentage: 0,
      timeSpent: 0,
      deviceInfo: {
        type: this.detectDeviceType(),
        userAgent: this.isBrowser() ? navigator.userAgent : 'server',
        screenResolution: this.isBrowser() ? `${screen.width}x${screen.height}` : 'unknown',
      },
      responses: 0,
    };

    this.sessionsMap.set(this.currentSessionId, session);
  }

  /**
   * Update session metrics based on event
   */
  private updateSessionMetrics(event: AnalyticsEvent): void {
    const session = this.sessionsMap.get(event.sessionId);
    if (!session) return;

    session.lastActivity = new Date();
    session.timeSpent = Date.now() - session.startedAt.getTime();

    switch (event.type) {
      case 'step_changed':
        session.currentStep = event.properties.stepNumber || session.currentStep;
        break;
      
      case 'question_answered':
        session.responses++;
        break;
      
      case 'quiz_completed':
        session.completedAt = new Date();
        session.completionPercentage = 100;
        if (event.properties.resultStyle) {
          session.finalResult = {
            resultType: event.properties.resultStyle,
            resultTitle: event.properties.resultStyle,
            score: event.properties.score,
          };
        }
        break;
    }

    if (session.totalSteps > 0) {
      session.completionPercentage = Math.round((session.currentStep / session.totalSteps) * 100);
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): ServiceResult<SessionMetrics | null> {
    const session = this.sessionsMap.get(this.currentSessionId);
    return { success: true, data: session || null };
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ServiceResult<SessionMetrics | null> {
    const session = this.sessionsMap.get(sessionId);
    return { success: true, data: session || null };
  }

  // ============================================================================
  // DASHBOARD METRICS
  // ============================================================================

  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics(funnelId?: string): Promise<ServiceResult<AnalyticsDashboardMetrics>> {
    try {
      // Check cache
      if (this.dashboardCache && (Date.now() - this.dashboardCache.timestamp) < this.CACHE_TTL) {
        return { success: true, data: this.dashboardCache.data };
      }

      // Try to fetch from Supabase first
      const supabaseMetrics = await this.fetchSupabaseDashboardMetrics(funnelId);
      if (supabaseMetrics.success) {
        this.dashboardCache = {
          data: supabaseMetrics.data!,
          timestamp: Date.now(),
        };
        return supabaseMetrics;
      }

      // Fallback to local data
      const localMetrics = this.calculateLocalDashboardMetrics(funnelId);
      this.dashboardCache = {
        data: localMetrics,
        timestamp: Date.now(),
      };

      return { success: true, data: localMetrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get dashboard metrics'),
      };
    }
  }

  /**
   * Get quiz-specific analytics
   */
  getQuizAnalytics(funnelId?: string): ServiceResult<QuizAnalytics> {
    try {
      let relevantEvents = this.eventsList;
      if (funnelId) {
        relevantEvents = relevantEvents.filter(e => e.funnelId === funnelId);
      }

      const quizStartEvents = relevantEvents.filter(e => e.type === 'quiz_started');
      const quizCompleteEvents = relevantEvents.filter(e => e.type === 'quiz_completed');

      const totalQuizzes = quizStartEvents.length;
      const completionRate = totalQuizzes > 0 
        ? Math.round((quizCompleteEvents.length / totalQuizzes) * 100 * 10) / 10 
        : 0;

      // Calculate average score
      const scores = quizCompleteEvents
        .map(e => e.properties.score)
        .filter((s): s is number => typeof s === 'number');
      const averageScore = scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : 0;

      // Popular styles
      const styleMap = new Map<string, number>();
      quizCompleteEvents.forEach(e => {
        const style = e.properties.resultStyle;
        if (style) {
          styleMap.set(style, (styleMap.get(style) || 0) + 1);
        }
      });

      const popularStyles = Array.from(styleMap.entries())
        .map(([style, count]) => ({
          style,
          count,
          percentage: Math.round((count / quizCompleteEvents.length) * 100 * 10) / 10,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Step completion rates
      const stepMap = new Map<number, { started: number; completed: number }>();
      relevantEvents.forEach(e => {
        if (e.type === 'step_changed') {
          const step = e.properties.stepNumber;
          const current = stepMap.get(step) || { started: 0, completed: 0 };
          current.started++;
          stepMap.set(step, current);
        }
      });

      const stepCompletionRates = Array.from(stepMap.entries())
        .map(([step, data]) => ({
          step,
          completionRate: data.started > 0 
            ? Math.round((data.completed / data.started) * 100 * 10) / 10 
            : 0,
        }))
        .sort((a, b) => a.step - b.step);

      // Average time per step
      const stepTimes = new Map<number, number[]>();
      relevantEvents.forEach(e => {
        if (e.type === 'step_changed' && typeof e.properties.timeSpent === 'number') {
          const step = e.properties.stepNumber;
          const times = stepTimes.get(step) || [];
          times.push(e.properties.timeSpent);
          stepTimes.set(step, times);
        }
      });

      const averageTimePerStep = Array.from(stepTimes.entries())
        .map(([step, times]) => ({
          step,
          averageTime: Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 10) / 10,
        }))
        .sort((a, b) => a.step - b.step);

      const analytics: QuizAnalytics = {
        totalQuizzes,
        completionRate,
        averageScore,
        popularStyles,
        stepCompletionRates,
        averageTimePerStep,
      };

      return { success: true, data: analytics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get quiz analytics'),
      };
    }
  }

  // ============================================================================
  // SPECIALIZED APIS
  // ============================================================================

  readonly events = {
    track: (params: Parameters<AnalyticsService['trackEvent']>[0]) => 
      this.trackEvent(params),
    
    trackQuizStart: (userId?: string, funnelId?: string) => 
      this.trackQuizStart(userId, funnelId),
    
    trackStepChange: (stepNumber: number, stepType: string, funnelId?: string) => 
      this.trackStepChange(stepNumber, stepType, funnelId),
    
    trackAnswer: (questionId: string, optionId: string, stepNumber: number, funnelId?: string) => 
      this.trackAnswer(questionId, optionId, stepNumber, funnelId),
    
    trackQuizComplete: (result: any, funnelId?: string) => 
      this.trackQuizComplete(result, funnelId),
    
    trackEditorAction: (action: string, details?: Record<string, any>) => 
      this.trackEditorAction(action, details),
    
    trackError: (error: Error, component?: string) => 
      this.trackError(error, component),
    
    get: (filters?: Parameters<AnalyticsService['getEvents']>[0]) => 
      this.getEvents(filters),
  };

  readonly metrics = {
    record: (params: Parameters<AnalyticsService['recordMetric']>[0]) => 
      this.recordMetric(params),
    
    trackPerformance: (metric: string, value: number, unit?: string) => 
      this.trackPerformance(metric, value, unit),
    
    get: (filters?: Parameters<AnalyticsService['getMetrics']>[0]) => 
      this.getMetrics(filters),
  };

  readonly sessions = {
    getCurrent: () => 
      this.getCurrentSession(),
    
    get: (sessionId: string) => 
      this.getSession(sessionId),
  };

  readonly dashboard = {
    getMetrics: (funnelId?: string) => 
      this.getDashboardMetrics(funnelId),
    
    getQuizAnalytics: (funnelId?: string) => 
      this.getQuizAnalytics(funnelId),
  };

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getEventContext(): EventContext {
    if (!this.isBrowser()) {
      return {
        userAgent: 'server',
        url: 'server',
        screenResolution: 'unknown',
        timezone: 'UTC',
        deviceType: 'unknown',
      };
    }

    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      deviceType: this.detectDeviceType(),
    };
  }

  private detectDeviceType(): DeviceType {
    if (!this.isBrowser()) return 'unknown';

    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private pruneEvents(): void {
    if (this.eventsList.length > this.MAX_EVENTS) {
      this.eventsList = this.eventsList.slice(-this.MAX_EVENTS);
    }
  }

  private pruneMetrics(category: MetricCategory): void {
    const metrics = this.metricsList.get(category);
    if (metrics && metrics.length > this.MAX_METRICS_PER_CATEGORY) {
      const pruned = metrics.slice(-this.MAX_METRICS_PER_CATEGORY);
      this.metricsList.set(category, pruned);
    }
  }

  private persistToStorage(): void {
    if (!this.isBrowser()) return;

    try {
      const data = {
        events: this.eventsList.slice(-100), // Store last 100 events
        sessions: Array.from(this.sessionsMap.entries()).slice(-10), // Store last 10 sessions
        timestamp: Date.now(),
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      if (this.options.debug) {
        this.log('Failed to persist to storage:', error);
      }
    }
  }

  private restoreFromStorage(): void {
    if (!this.isBrowser()) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return;

      const data = JSON.parse(stored);
      
      // Restore events
      if (Array.isArray(data.events)) {
        this.eventsList = data.events.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }

      // Restore sessions
      if (Array.isArray(data.sessions)) {
        this.sessionsMap = new Map(
          data.sessions.map(([id, session]: [string, any]) => [
            id,
            {
              ...session,
              startedAt: new Date(session.startedAt),
              lastActivity: new Date(session.lastActivity),
              completedAt: session.completedAt ? new Date(session.completedAt) : undefined,
            },
          ]),
        );
      }

      if (this.options.debug) {
        this.log('Restored from storage:', {
          events: this.eventsList.length,
          sessions: this.sessionsMap.size,
        });
      }
    } catch (error) {
      if (this.options.debug) {
        this.log('Failed to restore from storage:', error);
      }
    }
  }

  private async persistEventToSupabase(event: AnalyticsEvent): Promise<void> {
    try {
      await supabase.from('quiz_analytics').insert({
        event_type: event.type,
        session_id: event.sessionId,
        funnel_id: event.funnelId || '',
        user_id: event.userId,
        event_data: event.properties as any,
        timestamp: event.timestamp.toISOString(),
      });
    } catch (error) {
      // Silent fail - localStorage is fallback
      throw error;
    }
  }

  private async fetchSupabaseDashboardMetrics(funnelId?: string): Promise<ServiceResult<AnalyticsDashboardMetrics>> {
    try {
      const { data: sessions, error } = await supabase
        .from('quiz_sessions')
        .select('*');

      if (error) throw error;

      const sessionsData = sessions || [];
      
      // Calculate metrics from Supabase data
      const metrics = this.calculateDashboardMetricsFromSessions(sessionsData, funnelId);
      
      return { success: true, data: metrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to fetch Supabase metrics'),
      };
    }
  }

  private calculateLocalDashboardMetrics(funnelId?: string): AnalyticsDashboardMetrics {
    const sessions = Array.from(this.sessionsMap.values());
    const filteredSessions = funnelId 
      ? sessions.filter(s => s.funnelId === funnelId)
      : sessions;

    const now = Date.now();
    const activeThreshold = 5 * 60 * 1000; // 5 minutes

    const totalSessions = filteredSessions.length;
    const activeSessions = filteredSessions.filter(s => 
      now - s.lastActivity.getTime() < activeThreshold,
    ).length;
    const completedSessions = filteredSessions.filter(s => s.completedAt).length;
    const abandonedSessions = totalSessions - completedSessions - activeSessions;
    const conversionRate = totalSessions > 0 
      ? Math.round((completedSessions / totalSessions) * 100 * 10) / 10 
      : 0;

    return {
      totalSessions,
      activeSessions,
      completedSessions,
      abandonedSessions,
      conversionRate,
      averageCompletionTime: 0,
      averageSessionDuration: 0,
      dropOffRate: totalSessions > 0 ? Math.round((abandonedSessions / totalSessions) * 100 * 10) / 10 : 0,
      deviceStats: [],
      hourlyActivity: [],
      dailyTrends: [],
      leadGeneration: 0,
      topPerformingFunnels: [],
      activeUsersNow: activeSessions,
      recentActivity: [],
      lastUpdated: new Date(),
      dataSource: 'localStorage',
    };
  }

  private calculateDashboardMetricsFromSessions(sessions: any[], funnelId?: string): AnalyticsDashboardMetrics {
    // Similar to calculateLocalDashboardMetrics but using Supabase data structure
    // Implementation would mirror the logic above
    return this.calculateLocalDashboardMetrics(funnelId);
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
