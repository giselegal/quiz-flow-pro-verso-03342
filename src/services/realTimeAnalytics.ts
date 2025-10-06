/**
 * 📊 SISTEMA DE ANALYTICS EM TEMPO REAL
 * 
 * Coleta e persiste métricas reais do uso do quiz
 */

import { supabase } from '@/lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface QuizEvent {
    id?: string;
    event_type: 'quiz_started' | 'step_completed' | 'quiz_completed' | 'step_viewed' | 'option_selected';
    user_session_id: string;
    step_number?: number;
    option_selected?: string;
    time_spent?: number; // em segundos
    user_data?: {
        name?: string;
        email?: string;
        user_agent?: string;
        screen_resolution?: string;
        device_type?: 'mobile' | 'tablet' | 'desktop';
    };
    quiz_data?: {
        style_result?: string;
        total_score?: number;
        completion_percentage?: number;
    };
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface SessionMetrics {
    session_id: string;
    user_name?: string;
    started_at: string;
    completed_at?: string;
    current_step: number;
    total_steps: number;
    completion_percentage: number;
    time_spent_total: number;
    device_info: {
        type: 'mobile' | 'tablet' | 'desktop';
        user_agent: string;
        screen_resolution: string;
    };
    final_result?: {
        style_category: string;
        total_score: number;
        primary_style: string;
    };
}

export interface DashboardMetrics {
    total_sessions: number;
    completed_sessions: number;
    conversion_rate: number;
    average_completion_time: number;
    popular_styles: { style: string; count: number; percentage: number }[];
    step_completion_rates: { step: number; completion_rate: number }[];
    hourly_activity: { hour: number; sessions: number }[];
    device_breakdown: { device: string; count: number; percentage: number }[];
    real_time_active_users: number;
}

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

class RealTimeAnalytics {
    private sessionId: string;
    private sessionStartTime: Date;
    private currentStep: number = 1;
    private stepStartTime: Date;
    private isEnabled: boolean = true;

    constructor() {
        this.sessionId = this.generateSessionId();
        this.sessionStartTime = new Date();
        this.stepStartTime = new Date();
        this.initializeSession();
    }

    // ============================================================================
    // SESSION MANAGEMENT
    // ============================================================================

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private async initializeSession(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            const sessionData = {
                session_id: this.sessionId,
                started_at: this.sessionStartTime.toISOString(),
                current_step: 1,
                total_steps: 21,
                completion_percentage: 0,
                time_spent_total: 0,
                device_info: this.getDeviceInfo(),
                funnel_id: 'quiz-21-steps', // Default funnel ID
                quiz_user_id: this.sessionId, // Usar session ID como user ID temporário
                status: 'active'
            };

            await supabase
                .from('quiz_sessions')
                .insert([sessionData]);

            console.log('📊 Analytics: Session initialized:', this.sessionId);
        } catch (error) {
            console.error('❌ Analytics: Failed to initialize session:', error);
        }
    }

    private getDeviceInfo() {
        const userAgent = navigator.userAgent;
        const screen = window.screen;

        let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            deviceType = /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
        }

        return {
            type: deviceType,
            user_agent: userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
        };
    }

    // ============================================================================
    // EVENT TRACKING
    // ============================================================================

    async trackQuizStarted(userName?: string): Promise<void> {
        const event: QuizEvent = {
            event_type: 'quiz_started',
            user_session_id: this.sessionId,
            user_data: {
                name: userName,
                user_agent: navigator.userAgent,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                device_type: this.getDeviceInfo().type,
            },
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        await this.updateSession({ user_name: userName });

        console.log('🚀 Analytics: Quiz started', { sessionId: this.sessionId, userName });
    }

    async trackStepViewed(stepNumber: number): Promise<void> {
        // Calcular tempo gasto na etapa anterior
        const timeSpent = this.currentStep > 1 ?
            Math.round((Date.now() - this.stepStartTime.getTime()) / 1000) : 0;

        // Salvar evento da etapa anterior se não for a primeira
        if (this.currentStep > 1 && timeSpent > 0) {
            const completedStepEvent: QuizEvent = {
                event_type: 'step_completed',
                user_session_id: this.sessionId,
                step_number: this.currentStep - 1,
                time_spent: timeSpent,
                timestamp: new Date().toISOString(),
            };
            await this.saveEvent(completedStepEvent);
        }

        // Atualizar para nova etapa
        this.currentStep = stepNumber;
        this.stepStartTime = new Date();

        const event: QuizEvent = {
            event_type: 'step_viewed',
            user_session_id: this.sessionId,
            step_number: stepNumber,
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        await this.updateSession({
            current_step: stepNumber,
            completion_percentage: Math.round((stepNumber / 21) * 100),
        });

        console.log('👁️ Analytics: Step viewed', { step: stepNumber, sessionId: this.sessionId });
    }

    async trackOptionSelected(stepNumber: number, optionId: string, optionValue?: any): Promise<void> {
        const event: QuizEvent = {
            event_type: 'option_selected',
            user_session_id: this.sessionId,
            step_number: stepNumber,
            option_selected: optionId,
            metadata: { option_value: optionValue },
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        console.log('✅ Analytics: Option selected', { step: stepNumber, option: optionId });
    }

    async trackQuizCompleted(result: any): Promise<void> {
        const totalTimeSpent = Math.round((Date.now() - this.sessionStartTime.getTime()) / 1000);

        const event: QuizEvent = {
            event_type: 'quiz_completed',
            user_session_id: this.sessionId,
            time_spent: totalTimeSpent,
            quiz_data: {
                style_result: result.primaryStyle?.category || result.primaryStyle || 'unknown',
                total_score: result.totalScore || 0,
                completion_percentage: 100,
            },
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        await this.updateSession({
            completed_at: new Date().toISOString(),
            completion_percentage: 100,
            time_spent_total: totalTimeSpent,
            final_result: {
                style_category: result.primaryStyle?.category || result.primaryStyle || 'unknown',
                total_score: result.totalScore || 0,
                primary_style: result.primaryStyle?.category || result.primaryStyle || 'unknown',
            },
        });

        console.log('🎉 Analytics: Quiz completed', {
            sessionId: this.sessionId,
            result: result.primaryStyle?.category,
            timeSpent: totalTimeSpent
        });
    }

    // ============================================================================
    // DATA PERSISTENCE
    // ============================================================================

    private async saveEvent(event: QuizEvent): Promise<void> {
        if (!this.isEnabled) return;

        try {
            // Use quiz_analytics table with correct schema
            const adaptedEvent = {
                funnel_id: 'quiz-main', // Default funnel ID
                event_type: event.event_type,
                event_data: {
                    step_number: event.step_number || 0,
                    option_selected: event.option_selected,
                    time_spent: event.time_spent,
                    user_data: event.user_data,
                    quiz_data: event.quiz_data,
                    ...event.metadata,
                },
                session_id: this.sessionId,
                user_id: null, // Will be set if user is authenticated
                timestamp: event.timestamp,
            };

            await supabase
                .from('quiz_analytics')
                .insert([adaptedEvent]);
        } catch (error) {
            console.error('❌ Analytics: Failed to save event:', error);
        }
    }

    private async updateSession(updates: Partial<SessionMetrics>): Promise<void> {
        if (!this.isEnabled) return;

        try {
            await supabase
                .from('quiz_sessions')
                .update(updates)
                .eq('session_id', this.sessionId);
        } catch (error) {
            console.error('❌ Analytics: Failed to update session:', error);
        }
    }

    // ============================================================================
    // DASHBOARD DATA
    // ============================================================================

    static async getDashboardMetrics(): Promise<DashboardMetrics> {
        try {
            // Buscar todas as sessões
            const { data: sessions } = await supabase
                .from('quiz_sessions')
                .select('*')
                .order('started_at', { ascending: false });

            // Buscar eventos do quiz_analytics
            const { data: events } = await supabase
                .from('quiz_analytics')
                .select('*')
                .order('timestamp', { ascending: false });

            if (!sessions || !events) {
                return this.getEmptyMetrics();
            }

            // Calcular métricas
            const totalSessions = sessions.length;
            const completedSessions = sessions.filter(s => s.completed_at).length;
            const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

            // Tempo médio de conclusão - usar dados das sessions existentes
            const completedSessionsWithTime = sessions.filter(s => s.completed_at && s.started_at);
            const averageCompletionTime = completedSessionsWithTime.length > 0
                ? Math.round(completedSessionsWithTime.reduce((acc, s) => {
                    const startTime = new Date(s.started_at).getTime();
                    const endTime = new Date(s.completed_at!).getTime();
                    return acc + (endTime - startTime);
                }, 0) / completedSessionsWithTime.length / 1000) // Convert to seconds
                : 0;

            // Estilos populares - usar metadata das sessões
            const styleResults = sessions
                .filter(s => s.metadata && typeof s.metadata === 'object' && 'final_result' in s.metadata)
                .map(s => (s.metadata as any).final_result?.style_category)
                .filter(Boolean);

            const styleCounts = styleResults.reduce((acc, style) => {
                acc[style] = (acc[style] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const popularStyles = Object.entries(styleCounts)
                .map(([style, count]) => ({
                    style,
                    count: count as number,
                    percentage: Math.round(((count as number) / styleResults.length) * 100),
                }))
                .sort((a, b) => (b.count as number) - (a.count as number))
                .slice(0, 5);

            // Taxa de conclusão por etapa
            const stepCompletionRates = [];
            for (let step = 1; step <= 21; step++) {
                const stepEvents = events?.filter(e => {
                    const eventData = e.event_data as any;
                    return eventData?.step_number === step && e.event_type === 'step_viewed';
                }) || [];
                const completionRate = totalSessions > 0 ? (stepEvents.length / totalSessions) * 100 : 0;
                stepCompletionRates.push({ step, completion_rate: Math.round(completionRate) });
            }

            // Atividade por hora
            const hourlyActivity = new Array(24).fill(0).map((_, hour) => ({ hour, sessions: 0 }));
            sessions.forEach(session => {
                const hour = new Date(session.started_at).getHours();
                hourlyActivity[hour].sessions++;
            });

            // Breakdown por dispositivo
            const deviceCounts = sessions.reduce((acc, s) => {
                const deviceInfo = s.metadata && typeof s.metadata === 'object' && 'device_info' in s.metadata
                    ? (s.metadata as any).device_info : null;
                const device = deviceInfo?.type || 'unknown';
                acc[device] = (acc[device] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const deviceBreakdown = Object.entries(deviceCounts)
                .map(([device, count]) => ({
                    device,
                    count,
                    percentage: Math.round((count / totalSessions) * 100),
                }));

            // Usuários ativos em tempo real (últimos 5 minutos)
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            const recentEvents = events?.filter(e => e.timestamp > fiveMinutesAgo) || [];
            const activeUsers = new Set(recentEvents.map(e => e.session_id)).size;

            return {
                total_sessions: totalSessions,
                completed_sessions: completedSessions,
                conversion_rate: Math.round(conversionRate),
                average_completion_time: averageCompletionTime,
                popular_styles: popularStyles,
                step_completion_rates: stepCompletionRates,
                hourly_activity: hourlyActivity,
                device_breakdown: deviceBreakdown,
                real_time_active_users: activeUsers,
            };

        } catch (error) {
            console.error('❌ Analytics: Failed to get dashboard metrics:', error);
            return this.getEmptyMetrics();
        }
    }

    private static getEmptyMetrics(): DashboardMetrics {
        return {
            total_sessions: 0,
            completed_sessions: 0,
            conversion_rate: 0,
            average_completion_time: 0,
            popular_styles: [],
            step_completion_rates: new Array(21).fill(0).map((_, i) => ({ step: i + 1, completion_rate: 0 })),
            hourly_activity: new Array(24).fill(0).map((_, i) => ({ hour: i, sessions: 0 })),
            device_breakdown: [],
            real_time_active_users: 0,
        };
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    getSessionId(): string {
        return this.sessionId;
    }

    disable(): void {
        this.isEnabled = false;
    }

    enable(): void {
        this.isEnabled = true;
    }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export { RealTimeAnalytics };
export const analytics = new RealTimeAnalytics();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const trackQuizStarted = (userName?: string) => analytics.trackQuizStarted(userName);
export const trackStepViewed = (stepNumber: number) => analytics.trackStepViewed(stepNumber);
export const trackOptionSelected = (stepNumber: number, optionId: string, optionValue?: any) =>
    analytics.trackOptionSelected(stepNumber, optionId, optionValue);
export const trackQuizCompleted = (result: any) => analytics.trackQuizCompleted(result);
export const getDashboardMetrics = () => RealTimeAnalytics.getDashboardMetrics();

export default analytics;
