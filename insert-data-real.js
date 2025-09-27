/**
 * Script para executar população de dados via Node.js
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente Supabase não configuradas');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Definido' : 'Não definido');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Definido' : 'Não definido');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// DADOS REALISTAS PARA TABELAS EXISTENTES
// ============================================================================

const SAMPLE_PROFILES = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'admin@quizquest.com',
        name: 'Admin QuizQuest',
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date('2024-03-25').toISOString()
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'maria.silva@exemplo.com',
        name: 'Maria Silva',
        created_at: new Date('2024-02-20').toISOString(),
        updated_at: new Date('2024-03-22').toISOString()
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'joao.santos@empresa.com',
        name: 'João Santos',
        created_at: new Date('2024-03-10').toISOString(),
        updated_at: new Date('2024-03-25').toISOString()
    }
];

const SAMPLE_FUNNELS = [
    {
        id: 'funnel-quiz-personalidade-001',
        name: 'Quiz: Qual seu tipo de personalidade?',
        description: 'Descubra seu perfil comportamental em 5 minutos',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        is_published: true,
        version: 1,
        settings: {
            theme: 'modern',
            colors: { primary: '#687ef7', secondary: '#d85dfb' },
            totalSteps: 21,
            category: 'personality'
        },
        created_at: new Date('2024-01-20').toISOString(),
        updated_at: new Date('2024-03-15').toISOString(),
    },
    {
        id: 'funnel-quiz-marketing-digital-002',
        name: 'Avaliação: Sua estratégia de marketing digital',
        description: 'Identifique gaps na sua estratégia de marketing',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        is_published: true,
        version: 1,
        settings: {
            theme: 'professional',
            colors: { primary: '#0066cc', secondary: '#ff6600' },
            totalSteps: 15,
            category: 'business'
        },
        created_at: new Date('2024-02-05').toISOString(),
        updated_at: new Date('2024-03-20').toISOString(),
    },
    {
        id: 'funnel-quiz-saude-wellness-003',
        name: 'Quiz: Seu nível de bem-estar',
        description: 'Avalie sua qualidade de vida e receba dicas personalizadas',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        is_published: true,
        version: 1,
        settings: {
            theme: 'wellness',
            colors: { primary: '#4CAF50', secondary: '#8BC34A' },
            totalSteps: 12,
            category: 'health'
        },
        created_at: new Date('2024-02-25').toISOString(),
        updated_at: new Date('2024-03-18').toISOString(),
    }
];

const SAMPLE_QUIZ_USERS = [
    {
        id: '650e8400-e29b-41d4-a716-446655440001',
        session_id: 'session-001-personality',
        email: 'cliente1@email.com',
        name: 'Ana Costa',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        utm_source: 'google',
        utm_medium: 'organic',
        utm_campaign: 'personality-quiz',
        created_at: new Date('2024-03-10T14:30:00').toISOString()
    },
    {
        id: '650e8400-e29b-41d4-a716-446655440002',
        session_id: 'session-002-marketing',
        email: 'cliente2@email.com',
        name: 'Carlos Mendes',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        utm_source: 'facebook',
        utm_medium: 'cpc',
        utm_campaign: 'marketing-assessment',
        created_at: new Date('2024-03-12T09:15:00').toISOString()
    }
];

const SAMPLE_QUIZ_SESSIONS = [
    {
        id: '750e8400-e29b-41d4-a716-446655440001',
        funnel_id: 'funnel-quiz-personalidade-001',
        quiz_user_id: '650e8400-e29b-41d4-a716-446655440001',
        status: 'completed',
        current_step: 21,
        total_steps: 21,
        score: 85,
        max_score: 105,
        started_at: new Date('2024-03-10T14:30:00').toISOString(),
        completed_at: new Date('2024-03-10T14:54:00').toISOString(),
        last_activity: new Date('2024-03-10T14:54:00').toISOString(),
        metadata: {
            completionTime: 1440, // seconds
            averageTimePerStep: 68.5,
            resultType: 'Perfil Inovador'
        }
    },
    {
        id: '750e8400-e29b-41d4-a716-446655440002',
        funnel_id: 'funnel-quiz-marketing-digital-002',
        quiz_user_id: '650e8400-e29b-41d4-a716-446655440002',
        status: 'completed',
        current_step: 15,
        total_steps: 15,
        score: 68,
        max_score: 90,
        started_at: new Date('2024-03-12T09:15:00').toISOString(),
        completed_at: new Date('2024-03-12T09:40:00').toISOString(),
        last_activity: new Date('2024-03-12T09:40:00').toISOString(),
        metadata: {
            completionTime: 1500,
            averageTimePerStep: 100,
            resultType: 'Estratégia Intermediária'
        }
    }
];

const SAMPLE_QUIZ_CONVERSIONS = [
    {
        id: '850e8400-e29b-41d4-a716-446655440001',
        session_id: '750e8400-e29b-41d4-a716-446655440001',
        conversion_type: 'lead_capture',
        conversion_value: 97.50,
        currency: 'BRL',
        product_id: 'consultation-personality',
        product_name: 'Consultoria de Autoconhecimento',
        commission_rate: 0.15,
        conversion_data: {
            leadQuality: 'high',
            interests: ['autoconhecimento', 'desenvolvimento-pessoal']
        },
        converted_at: new Date('2024-03-10T14:54:30').toISOString()
    }
];

// ============================================================================
// FUNÇÕES DE INSERÇÃO
// ============================================================================

async function insertTestData() {
    console.log('🚀 Iniciando inserção de dados de teste...\n');

    let successCount = 0;
    let totalOperations = 0;

    try {
        // Verificar conexão
        console.log('🔍 Testando conexão...');
        const { data, error } = await supabase.from('funnels').select('count').limit(1);
        if (error) {
            console.error('❌ Erro de conexão:', error.message);
            return;
        }
        console.log('✅ Conexão OK');

        // 1. Inserir profiles
        console.log('\n👥 Inserindo profiles...');
        totalOperations++;
        try {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .insert(SAMPLE_PROFILES)
                .select();

            if (profilesError) {
                console.error('❌ Erro ao inserir profiles:', profilesError.message);
            } else {
                console.log(`✅ ${profiles?.length || 0} profiles inseridos`);
                successCount++;
            }
        } catch (error) {
            console.error('❌ Erro inesperado profiles:', error.message);
        }

        // 2. Inserir funis
        console.log('\n🎯 Inserindo funis...');
        totalOperations++;
        try {
            const { data: funnels, error: funnelsError } = await supabase
                .from('funnels')
                .insert(SAMPLE_FUNNELS)
                .select();

            if (funnelsError) {
                console.error('❌ Erro ao inserir funis:', funnelsError.message);
            } else {
                console.log(`✅ ${funnels?.length || 0} funis inseridos`);
                successCount++;
            }
        } catch (error) {
            console.error('❌ Erro inesperado funis:', error.message);
        }

        // 3. Inserir quiz_users
        console.log('\n👤 Inserindo quiz users...');
        totalOperations++;
        try {
            const { data: quizUsers, error: quizUsersError } = await supabase
                .from('quiz_users')
                .insert(SAMPLE_QUIZ_USERS)
                .select();

            if (quizUsersError) {
                console.error('❌ Erro ao inserir quiz users:', quizUsersError.message);
            } else {
                console.log(`✅ ${quizUsers?.length || 0} quiz users inseridos`);
                successCount++;
            }
        } catch (error) {
            console.error('❌ Erro inesperado quiz users:', error.message);
        }

        // 4. Inserir quiz_sessions
        console.log('\n📊 Inserindo quiz sessions...');
        totalOperations++;
        try {
            const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .insert(SAMPLE_QUIZ_SESSIONS)
                .select();

            if (sessionsError) {
                console.error('❌ Erro ao inserir sessions:', sessionsError.message);
            } else {
                console.log(`✅ ${sessions?.length || 0} quiz sessions inseridas`);
                successCount++;
            }
        } catch (error) {
            console.error('❌ Erro inesperado sessions:', error.message);
        }

        // 5. Inserir conversions
        console.log('\n💰 Inserindo conversions...');
        totalOperations++;
        try {
            const { data: conversions, error: conversionsError } = await supabase
                .from('quiz_conversions')
                .insert(SAMPLE_QUIZ_CONVERSIONS)
                .select();

            if (conversionsError) {
                console.error('❌ Erro ao inserir conversions:', conversionsError.message);
            } else {
                console.log(`✅ ${conversions?.length || 0} conversions inseridas`);
                successCount++;
            }
        } catch (error) {
            console.error('❌ Erro inesperado conversions:', error.message);
        }

        // Verificar dados inseridos
        console.log('\n🔍 Verificando dados inseridos...');

        const { count: profileCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        console.log(`📊 Total de profiles: ${profileCount || 0}`);

        const { count: funnelCount } = await supabase
            .from('funnels')
            .select('*', { count: 'exact', head: true });
        console.log(`📊 Total de funis: ${funnelCount || 0}`);

        const { count: quizUserCount } = await supabase
            .from('quiz_users')
            .select('*', { count: 'exact', head: true });
        console.log(`📊 Total de quiz users: ${quizUserCount || 0}`);

        const { count: sessionCount } = await supabase
            .from('quiz_sessions')
            .select('*', { count: 'exact', head: true });
        console.log(`📊 Total de sessions: ${sessionCount || 0}`);

        const { count: conversionCount } = await supabase
            .from('quiz_conversions')
            .select('*', { count: 'exact', head: true });
        console.log(`📊 Total de conversions: ${conversionCount || 0}`);

        console.log(`\n🏁 INSERÇÃO COMPLETA: ${successCount}/${totalOperations} operações bem-sucedidas!`);

        if (successCount === totalOperations) {
            console.log('🎉 TODOS OS DADOS FORAM INSERIDOS COM SUCESSO!');
            console.log('🎯 Agora você pode testar /admin e /dashboard com dados reais!');
        } else {
            console.log(`⚠️  ${totalOperations - successCount} operações falharam. Verifique os erros acima.`);
        }

    } catch (error) {
        console.error('❌ Erro inesperado:', error);
    }
}

// Executar
insertTestData();