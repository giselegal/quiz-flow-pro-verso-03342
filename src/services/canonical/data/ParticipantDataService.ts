import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { supabase } from '@/integrations/supabase/customClient';
import type { QuizParticipant } from '@/services/canonical/DataService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

export class ParticipantDataService extends BaseCanonicalService {
  private static instance: ParticipantDataService;

  private constructor() {
    super('ParticipantDataService', '0.2.0');
  }

  static getInstance(): ParticipantDataService {
    if (!this.instance) this.instance = new ParticipantDataService();
    return this.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('ParticipantDataService initialized');
  }

  protected async onDispose(): Promise<void> {
    this.log('ParticipantDataService disposed');
  }

  // CRUD mínimo de participantes (replicando a fatia do DataService para migração incremental)

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

      if (error) return this.createError(new Error(`Failed to create participant: ${error.message}`));

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

      return this.createResult(participant);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async getParticipantBySession(sessionId: string): Promise<ServiceResult<QuizParticipant | null>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'getParticipantBySession');
    try {
      const { data, error } = await supabase
        .from('quiz_users')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error && (error as any).code !== 'PGRST116') return this.createError(new Error(`Failed to get participant: ${error.message}`));
      if (!data) return this.createResult(null);

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

      return this.createResult(participant);
    } catch (error) {
      return this.createError(error as Error);
    }
  }

  async listParticipants(filters?: { email?: string; limit?: number; offset?: number; }): Promise<ServiceResult<QuizParticipant[]>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'listParticipants');
    try {
      let query = supabase.from('quiz_users').select('*');
      if (filters?.email) query = query.ilike('email', `%${filters.email}%`);
      const limit = filters?.limit ?? 50;
      const offset = filters?.offset ?? 0;
      query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) return this.createError(new Error(`Failed to list participants: ${error.message}`));
      const participants: QuizParticipant[] = (data || []).map((row: any) => ({
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
      return this.createResult(participants);
    } catch (error) {
      return this.createError(error as Error);
    }
  }
}

export const participantDataService = ParticipantDataService.getInstance();
