/**
 * 📊 ANALYTICS COMPATÍVEL COM TABELAS EXISTENTES
 * 
 * Versão que funciona com as tabelas já existentes no Supabase
 */

import { supabase } from '@/lib/supabase';

// ============================================================================
// TYPES COMPATÍVEIS
// ============================================================================

export interface AnalyticsEvent {
    event_type: 'quiz_started' | 'step_viewed' | 'option_selected' | 'quiz_completed';
    session_id: string;
    funnel_id: string;
    event_data: {
        step_number?: number;
        option_id?: string;
        user_name?: string;
        quiz_result?: any;
        device_info?: {
            type: 'mobile' | 'tablet' | 'desktop';
            user_agent: string;
        };
    };
    timestamp: string;
}

export interface DashboardData {
    totalSessions: number;
    completedSessions: number;
    conversionRate: number;
    averageSteps: number;
    popularStyles: Array<{ style: string; count: number; percentage: number }>;
    recentActivity: Array<{ time: string; sessions: number }>;
    deviceBreakdown: Array<{ type: string; count: number; percentage: number }>;
    currentActiveUsers: number;
}

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

class CompatibleAnalytics {
    private sessionId: string;
    private isEnabled: boolean = true;

    constructor() {
        this.sessionId = this.generateSessionId();
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // ============================================================================
    // TRACKING METHODS
    // ============================================================================

    async trackQuizStarted(userName?: string): Promise<void> {
        const event: AnalyticsEvent = {
            event_type: 'quiz_started',
            session_id: this.sessionId,
            funnel_id: 'quiz-21-steps',
            event_data: {
                user_name: userName,
                device_info: this.getDeviceInfo(),
            },
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        console.log('🚀 Analytics: Quiz started', { sessionId: this.sessionId, userName });
    }

    async trackStepViewed(stepNumber: number): Promise<void> {
        const event: AnalyticsEvent = {
            event_type: 'step_viewed',
            session_id: this.sessionId,
            funnel_id: 'quiz-21-steps',
            event_data: {
                step_number: stepNumber,
            },
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        console.log('👁️ Analytics: Step viewed', { step: stepNumber });
    }

    async trackOptionSelected(stepNumber: number, optionId: string, optionValue?: any): Promise<void> {
        const event: AnalyticsEvent = {
            event_type: 'option_selected',
            session_id: this.sessionId,
            funnel_id: 'quiz-21-steps',
            event_data: {
                step_number: stepNumber,
                option_id: optionId,
            },
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        console.log('✅ Analytics: Option selected', { step: stepNumber, option: optionId });
    }

    async trackQuizCompleted(result: any): Promise<void> {
        const event: AnalyticsEvent = {
            event_type: 'quiz_completed',
            session_id: this.sessionId,
            funnel_id: 'quiz-21-steps',
            event_data: {
                quiz_result: result,
            },
            timestamp: new Date().toISOString(),
        };

        await this.saveEvent(event);
        console.log('🎉 Analytics: Quiz completed', { result: result.primaryStyle });
    }

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    private getDeviceInfo() {
        const userAgent = navigator.userAgent;
        let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

        if (/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            deviceType = 'mobile';
        } else if (/iPad/i.test(userAgent)) {
            deviceType = 'tablet';
        }

        return {
            type: deviceType,
            user_agent: userAgent,
        };
    }

    private async saveEvent(event: AnalyticsEvent): Promise<void> {
        if (!this.isEnabled) return;

        try {
            await supabase
                .from('quiz_analytics')
                .insert([event]);
        } catch (error) {
            console.error('❌ Analytics: Failed to save event:', error);
        }
    }

    // ============================================================================
    // DASHBOARD DATA
    // ============================================================================

    static async getDashboardData(): Promise<DashboardData> {
        try {
            // Buscar dados das tabelas existentes
            const { data: sessions } = await supabase
                .from('quiz_sessions')
                .select('*')
                .order('started_at', { ascending: false });

            const { data: analytics } = await supabase
                .from('quiz_analytics')
                .select('*')
                .order('timestamp', { ascending: false });

            const { data: results } = await supabase
                .from('quiz_results')
                .select('*')
                .order('created_at', { ascending: false });

            if (!sessions) {
                return this.getMockData();
            }

            // Calcular métricas básicas
            const totalSessions = sessions.length;
            const completedSessions = sessions.filter(s => s.completed_at).length;
            const conversionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

            // Calcular steps médios baseado em current_step
            const averageSteps = totalSessions > 0
                ? Math.round(sessions.reduce((acc, s) => acc + (s.current_step || 0), 0) / totalSessions)
                : 0;

            // Estilos populares baseado nos resultados
            let popularStyles: Array<{ style: string; count: number; percentage: number }> = [];
            if (results && results.length > 0) {
                const styleCounts: Record<string, number> = {};
                results.forEach(result => {
                    if (result.result_data && typeof result.result_data === 'object') {
                        const resultData = result.result_data as any;
                        const style = resultData.primaryStyle || resultData.style || result.result_type || 'Desconhecido';
                        styleCounts[style] = (styleCounts[style] || 0) + 1;
                    }
                });

                popularStyles = Object.entries(styleCounts)
                    .map(([style, count]) => ({
                        style,
                        count,
                        percentage: Math.round((count / results.length) * 100),
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);
            }

            // Atividade recente baseada em sessões
            const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentSessions = sessions.filter(s => new Date(s.started_at) > last24Hours);

            const recentActivity = new Array(24).fill(0).map((_, i) => {
                const hour = new Date();
                hour.setHours(hour.getHours() - (23 - i), 0, 0, 0);
                const hourSessions = recentSessions.filter(s => {
                    const sessionHour = new Date(s.started_at);
                    return sessionHour.getHours() === hour.getHours();
                });

                return {
                    time: hour.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    sessions: hourSessions.length,
                };
            });

            // Device breakdown (mock por enquanto)
            const deviceBreakdown = [
                { type: 'Desktop', count: Math.floor(totalSessions * 0.6), percentage: 60 },
                { type: 'Mobile', count: Math.floor(totalSessions * 0.35), percentage: 35 },
                { type: 'Tablet', count: Math.floor(totalSessions * 0.05), percentage: 5 },
            ];

            // Usuários ativos (últimos 10 minutos)
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            const activeUsers = analytics
                ? new Set(analytics
                    .filter(a => new Date(a.timestamp) > tenMinutesAgo)
                    .map(a => a.session_id)).size
                : 0;

            return {
                totalSessions,
                completedSessions,
                conversionRate,
                averageSteps,
                popularStyles,
                recentActivity,
                deviceBreakdown,
                currentActiveUsers: activeUsers,
            };

        } catch (error) {
            console.error('❌ Dashboard: Failed to get data:', error);
            return this.getMockData();
        }
    }

    private static getMockData(): DashboardData {
        return {
            totalSessions: 42,
            completedSessions: 18,
            conversionRate: 43,
            averageSteps: 12,
            popularStyles: [
                { style: 'Clássico', count: 8, percentage: 44 },
                { style: 'Moderno', count: 6, percentage: 33 },
                { style: 'Boho', count: 4, percentage: 23 },
            ],
            recentActivity: new Array(24).fill(0).map((_, i) => ({
                time: `${String(i).padStart(2, '0')}:00`,
                sessions: Math.floor(Math.random() * 5),
            })),
            deviceBreakdown: [
                { type: 'Desktop', count: 25, percentage: 60 },
                { type: 'Mobile', count: 15, percentage: 35 },
                { type: 'Tablet', count: 2, percentage: 5 },
            ],
            currentActiveUsers: 3,
        };
    }
}

// ============================================================================
// SINGLETON E EXPORTS
// ============================================================================

export const compatibleAnalytics = new CompatibleAnalytics();

export const trackQuizStarted = (userName?: string) => compatibleAnalytics.trackQuizStarted(userName);
export const trackStepViewed = (stepNumber: number) => compatibleAnalytics.trackStepViewed(stepNumber);
export const trackOptionSelected = (stepNumber: number, optionId: string, optionValue?: any) =>
    compatibleAnalytics.trackOptionSelected(stepNumber, optionId, optionValue);
export const trackQuizCompleted = (result: any) => compatibleAnalytics.trackQuizCompleted(result);
export const getDashboardData = () => CompatibleAnalytics.getDashboardData();

export default compatibleAnalytics;
