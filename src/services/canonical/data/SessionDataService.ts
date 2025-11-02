import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { supabase } from '@/integrations/supabase/customClient';
import type { QuizSession } from '@/services/canonical/DataService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

export class SessionDataService extends BaseCanonicalService {
  private static instance: SessionDataService;

  private constructor() {
    super('SessionDataService', '0.1.0');
  }

  static getInstance(): SessionDataService {
    if (!this.instance) this.instance = new SessionDataService();
    return this.instance;
  }

  protected async onInitialize(): Promise<void> {}
  protected async onDispose(): Promise<void> {}

  async createSession(data: {
    funnelId: string;
    quizUserId: string;
    totalSteps?: number;
    maxScore?: number;
    metadata?: any;
  }): Promise<ServiceResult<QuizSession>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'createSession');
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

      if (error) return this.createError(new Error(`Failed to create session: ${error.message}`));

      const session: QuizSession = {
        id: row.id,
  funnelId: (row.funnel_id ?? '') as string,
  userId: (row.quiz_user_id ?? '') as string,
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

      return this.createResult(session);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async updateSession(sessionId: string, updates: {
    status?: 'started' | 'in_progress' | 'completed' | 'abandoned';
    currentStep?: number;
    score?: number;
    completedAt?: Date;
    metadata?: any;
  }): Promise<ServiceResult<void>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'updateSession');
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

      if (error) return this.createError(new Error(`Failed to update session: ${error.message}`));
      return this.createResult(undefined);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async getSession(sessionId: string): Promise<ServiceResult<QuizSession | null>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getSession');
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error && (error as any).code !== 'PGRST116') {
        return this.createError(new Error(`Failed to get session: ${error.message}`));
      }
      if (!data) return this.createResult(null);

      const session: QuizSession = {
        id: data.id,
  funnelId: (data.funnel_id ?? '') as string,
  userId: (data.quiz_user_id ?? '') as string,
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

      return this.createResult(session);
    } catch (error) {
      return this.createError(error as Error);
    }
  }
}

export const sessionDataService = SessionDataService.getInstance();
