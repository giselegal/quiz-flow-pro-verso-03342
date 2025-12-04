/**
 * 🎯 CANONICAL ANALYTICS TYPES
 * 
 * Tipos para analytics e métricas.
 * 
 * @canonical
 */

// =============================================================================
// ANALYTICS EVENT
// =============================================================================

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  sessionId: string;
  userId?: string;
  funnelId?: string;
  stepNumber?: number;
  data?: Record<string, unknown>;
  metadata?: AnalyticsMetadata;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'session_start'
  | 'session_end'
  | 'step_start'
  | 'step_complete'
  | 'quiz_start'
  | 'quiz_complete'
  | 'quiz_abandon'
  | 'option_select'
  | 'form_submit'
  | 'button_click'
  | 'scroll'
  | 'focus'
  | 'blur'
  | 'error'
  | 'custom';

export interface AnalyticsMetadata {
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  timezone?: string;
}

// =============================================================================
// ANALYTICS SESSION
// =============================================================================

export interface AnalyticsSession {
  id: string;
  userId?: string;
  funnelId?: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  events: AnalyticsEvent[];
  metadata?: AnalyticsMetadata;
  
  // Computed
  totalSteps?: number;
  completedSteps?: number;
  conversionStatus?: 'converted' | 'abandoned' | 'in_progress';
}

// =============================================================================
// ANALYTICS METRICS
// =============================================================================

export interface AnalyticsMetrics {
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  conversionRate: number;
  averageCompletionTime: number;
  averageStepsCompleted: number;
  dropoffRate: number;
  activeSessions: number;
  leadsGenerated: number;
  
  // Time-based
  sessionsToday: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  
  // Step-level
  stepCompletionRates: Record<number, number>;
  stepDropoffRates: Record<number, number>;
  stepAverageTimes: Record<number, number>;
}

// =============================================================================
// FUNNEL ANALYTICS
// =============================================================================

export interface FunnelAnalyticsData {
  funnelId: string;
  period: AnalyticsPeriod;
  metrics: AnalyticsMetrics;
  stepAnalytics: StepAnalytics[];
  topPerformingDays: DayAnalytics[];
  conversionTrend: TrendPoint[];
}

export interface StepAnalytics {
  stepNumber: number;
  stepName?: string;
  views: number;
  completions: number;
  completionRate: number;
  averageTime: number;
  dropoffs: number;
  dropoffRate: number;
}

export interface DayAnalytics {
  date: string;
  sessions: number;
  completions: number;
  conversionRate: number;
}

export interface TrendPoint {
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
}

// =============================================================================
// ANALYTICS PERIOD
// =============================================================================

export type AnalyticsPeriod =
  | 'today'
  | 'yesterday'
  | 'last-7-days'
  | 'last-30-days'
  | 'this-month'
  | 'last-month'
  | 'this-year'
  | 'custom';

export interface AnalyticsPeriodRange {
  start: string;
  end: string;
}

// =============================================================================
// ANALYTICS QUERY
// =============================================================================

export interface AnalyticsQuery {
  funnelId?: string;
  period?: AnalyticsPeriod;
  dateRange?: AnalyticsPeriodRange;
  groupBy?: 'day' | 'week' | 'month';
  metrics?: (keyof AnalyticsMetrics)[];
  filters?: AnalyticsFilter[];
  limit?: number;
  offset?: number;
}

export interface AnalyticsFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains';
  value: unknown;
}

// =============================================================================
// REAL-TIME ANALYTICS
// =============================================================================

export interface RealTimeAnalytics {
  activeSessions: number;
  sessionsLastHour: number;
  completionsLastHour: number;
  currentStepDistribution: Record<number, number>;
  recentEvents: AnalyticsEvent[];
  lastUpdated: string;
}

// =============================================================================
// A/B TEST ANALYTICS
// =============================================================================

export interface ABTestAnalytics {
  testId: string;
  variants: ABTestVariantAnalytics[];
  winner?: string;
  confidence: number;
  isSignificant: boolean;
  startedAt: string;
  endedAt?: string;
}

export interface ABTestVariantAnalytics {
  variantId: string;
  variantName: string;
  sessions: number;
  completions: number;
  conversionRate: number;
  averageTime: number;
  isControl: boolean;
  improvement?: number;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isAnalyticsEvent(value: unknown): value is AnalyticsEvent {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'type' in value &&
    'timestamp' in value
  );
}

export function isAnalyticsSession(value: unknown): value is AnalyticsSession {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'startedAt' in value
  );
}
