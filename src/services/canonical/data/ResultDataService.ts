import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { supabase } from '@/integrations/supabase/customClient';
import type { QuizResult } from '@/services/canonical/DataService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

export class ResultDataService extends BaseCanonicalService {
  private static instance: ResultDataService;

  private constructor() {
    super('ResultDataService', '0.1.0');
  }

  static getInstance(): ResultDataService {
    if (!this.instance) this.instance = new ResultDataService();
    return this.instance;
  }

  protected async onInitialize(): Promise<void> {}
  protected async onDispose(): Promise<void> {}

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
    try {
      const percentage = data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0;
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
          ...data.metadata,
        },
      };

      const { data: row, error } = await supabase
        .from('quiz_analytics')
        .insert([insertData])
        .select()
        .single();
      if (error) return this.createError(new Error(`Failed to create result: ${error.message}`));

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

      return this.createResult(result);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async getQuizResult(resultId: string): Promise<ServiceResult<QuizResult | null>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getQuizResult');
    try {
      const { data, error } = await supabase
        .from('quiz_analytics')
        .select('*')
        .eq('id', resultId)
        .eq('event_type', 'quiz_completed')
        .single();
      if (error && (error as any).code !== 'PGRST116') return this.createError(new Error(`Failed to get result: ${error.message}`));
      if (!data) return this.createResult(null);

      const eventData = (data as any).event_data || {};
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
      return this.createResult(result);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async listQuizResults(filters?: {
    funnelId?: string;
    userId?: string;
    minScore?: number;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResult<QuizResult[]>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'listQuizResults');
    try {
      let query = supabase
        .from('quiz_analytics')
        .select('*')
        .eq('event_type', 'quiz_completed');

      if (filters?.funnelId) query = query.eq('funnel_id', filters.funnelId);
      const limit = filters?.limit || 50;
      const offset = filters?.offset || 0;
      query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) return this.createError(new Error(`Failed to list results: ${error.message}`));

      const results: QuizResult[] = (data || []).map((row: any) => {
        const eventData = row.event_data || {};
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

      return this.createResult(results);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async deleteQuizResult(resultId: string): Promise<ServiceResult<void>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'deleteQuizResult');
    try {
      const { error } = await supabase
        .from('quiz_analytics')
        .delete()
        .eq('id', resultId)
        .eq('event_type', 'quiz_completed');
      if (error) return this.createError(new Error(`Failed to delete result: ${error.message}`));
      return this.createResult(undefined);
    } catch (error) {
      return this.createError(error as Error);
    }
  }
}

export const resultDataService = ResultDataService.getInstance();
