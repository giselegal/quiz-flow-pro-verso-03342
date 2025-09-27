/**
 * 🔧 SISTEMA DE DADOS DE EXEMPLO PARA ADMIN/DASHBOARD
 * 
 * Popula o sistema com dados de exemplo quando não há dados reais
 * Resolve o problema de dashboards vazios
 */

import { supabase } from '@/integrations/supabase/client';

export interface SampleFunnel {
    id: string;
    name: string;
    description: string;
    user_id: string;
    is_published: boolean;
    version: number;
    settings: any;
    created_at: string;
    updated_at: string;
}

export interface SampleSession {
    id: string;
    funnel_id: string;
    started_at: string;
    completed_at: string | null;
    user_responses: any;
}

export class SampleDataService {

    // ========================================================================
    // DADOS DE EXEMPLO
    // ========================================================================

    private static sampleFunnels: SampleFunnel[] = [
        {
            id: 'sample-quiz-estilo',
            name: 'Quiz de Estilo Pessoal',
            description: 'Descubra seu estilo único em 21 passos',
            user_id: 'sample-user-1',
            is_published: true,
            version: 1,
            settings: {
                theme: 'modern-elegant',
                category: 'lifestyle',
                autoSave: true,
                totalSteps: 21
            },
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()  // 2 days ago
        },
        {
            id: 'sample-marketing-funnel',
            name: 'Funil de Marketing Digital',
            description: 'Estratégias para crescer seu negócio online',
            user_id: 'sample-user-1',
            is_published: true,
            version: 2,
            settings: {
                theme: 'professional',
                category: 'business',
                autoSave: true,
                totalSteps: 15
            },
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()   // 1 day ago
        },
        {
            id: 'sample-wellness-guide',
            name: 'Guia de Bem-estar',
            description: 'Transforme seus hábitos para uma vida mais saudável',
            user_id: 'sample-user-1',
            is_published: false,
            version: 1,
            settings: {
                theme: 'wellness',
                category: 'health',
                autoSave: true,
                totalSteps: 12
            },
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()       // 1 hour ago
        }
    ];

    private static sampleSessions: SampleSession[] = [
        // Sessions for Quiz de Estilo Pessoal
        ...Array.from({ length: 45 }, (_, i) => ({
            id: `session-estilo-${i + 1}`,
            funnel_id: 'sample-quiz-estilo',
            started_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString() : null,
            user_responses: { step: Math.floor(Math.random() * 21) + 1 }
        })),
        // Sessions for Marketing Funnel
        ...Array.from({ length: 32 }, (_, i) => ({
            id: `session-marketing-${i + 1}`,
            funnel_id: 'sample-marketing-funnel',
            started_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 12 * 24 * 60 * 60 * 1000).toISOString() : null,
            user_responses: { step: Math.floor(Math.random() * 15) + 1 }
        })),
        // Sessions for Wellness Guide
        ...Array.from({ length: 18 }, (_, i) => ({
            id: `session-wellness-${i + 1}`,
            funnel_id: 'sample-wellness-guide',
            started_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString() : null,
            user_responses: { step: Math.floor(Math.random() * 12) + 1 }
        }))
    ];

    // ========================================================================
    // MÉTODOS PARA POPULAR DADOS
    // ========================================================================

    static async populateSampleData(force: boolean = false): Promise<void> {
        try {
            console.log('🌱 Verificando necessidade de popular dados de exemplo...');

            // Verificar se já existem dados reais
            if (!force) {
                const { data: existingFunnels } = await supabase
                    .from('funnels')
                    .select('id')
                    .limit(1);

                if (existingFunnels && existingFunnels.length > 0) {
                    console.log('✅ Dados reais já existem, não populando exemplos');
                    return;
                }
            }

            console.log('🌱 Populando dados de exemplo...');

            // Popular funis de exemplo
            const { error: funnelsError } = await supabase
                .from('funnels')
                .upsert(this.sampleFunnels, { onConflict: 'id' });

            if (funnelsError) {
                console.warn('⚠️ Erro ao inserir funis de exemplo:', funnelsError);
            } else {
                console.log('✅ Funis de exemplo inseridos');
            }

            // Popular sessões de exemplo
            const { error: sessionsError } = await supabase
                .from('quiz_sessions')
                .upsert(this.sampleSessions, { onConflict: 'id' });

            if (sessionsError) {
                console.warn('⚠️ Erro ao inserir sessões de exemplo:', sessionsError);
            } else {
                console.log('✅ Sessões de exemplo inseridas');
            }

            console.log('🎉 Dados de exemplo populados com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao popular dados de exemplo:', error);
        }
    }

    static async clearSampleData(): Promise<void> {
        try {
            console.log('🧹 Removendo dados de exemplo...');

            // Remover sessões de exemplo
            await supabase
                .from('quiz_sessions')
                .delete()
                .in('id', this.sampleSessions.map(s => s.id));

            // Remover funis de exemplo
            await supabase
                .from('funnels')
                .delete()
                .in('id', this.sampleFunnels.map(f => f.id));

            console.log('🧹 Dados de exemplo removidos');
        } catch (error) {
            console.error('❌ Erro ao remover dados de exemplo:', error);
        }
    }

    // ========================================================================
    // MÉTODOS DE VERIFICAÇÃO
    // ========================================================================

    static async checkDataAvailability(): Promise<{
        hasFunnels: boolean;
        hasSessions: boolean;
        totalFunnels: number;
        totalSessions: number;
        needsSampleData: boolean;
    }> {
        try {
            const { data: funnels, error: funnelsError } = await supabase
                .from('funnels')
                .select('id');

            const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .select('id');

            const totalFunnels = funnels?.length || 0;
            const totalSessions = sessions?.length || 0;

            return {
                hasFunnels: totalFunnels > 0,
                hasSessions: totalSessions > 0,
                totalFunnels,
                totalSessions,
                needsSampleData: totalFunnels === 0 && totalSessions === 0
            };
        } catch (error) {
            console.error('❌ Erro ao verificar dados:', error);
            return {
                hasFunnels: false,
                hasSessions: false,
                totalFunnels: 0,
                totalSessions: 0,
                needsSampleData: true
            };
        }
    }

    // ========================================================================
    // MÉTODOS PARA OBTER DADOS DE EXEMPLO (FALLBACK LOCAL)
    // ========================================================================

    static getSampleFunnels(): SampleFunnel[] {
        return [...this.sampleFunnels];
    }

    static getSampleSessions(): SampleSession[] {
        return [...this.sampleSessions];
    }

    static getSampleMetrics() {
        const totalSessions = this.sampleSessions.length;
        const completedSessions = this.sampleSessions.filter(s => s.completed_at).length;
        const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

        return {
            totalFunnels: this.sampleFunnels.length,
            activeFunnels: this.sampleFunnels.filter(f => f.is_published).length,
            draftFunnels: this.sampleFunnels.filter(f => !f.is_published).length,
            totalSessions,
            completedSessions,
            conversionRate,
            totalRevenue: completedSessions * 45, // R$ 45 por conversão
            activeUsersNow: Math.floor(Math.random() * 15) + 5,
            topPerformingFunnels: [
                { id: 'sample-quiz-estilo', name: 'Quiz de Estilo Pessoal', conversions: 32, conversion_rate: 71 },
                { id: 'sample-marketing-funnel', name: 'Funil de Marketing Digital', conversions: 19, conversion_rate: 59 },
                { id: 'sample-wellness-guide', name: 'Guia de Bem-estar', conversions: 9, conversion_rate: 50 }
            ]
        };
    }
}

export default SampleDataService;