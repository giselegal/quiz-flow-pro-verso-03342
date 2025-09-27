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

const supabase = createClient(supabaseUrl, supabaseKey);// Dados de exemplo
const SAMPLE_USERS = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'admin@quizquest.com',
        full_name: 'Admin QuizQuest',
        created_at: new Date('2024-01-15').toISOString(),
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'maria.silva@exemplo.com',
        full_name: 'Maria Silva',
        created_at: new Date('2024-02-20').toISOString(),
    }
];

const SAMPLE_FUNNELS = [
    {
        id: 'funnel-quiz-personalidade-001',
        title: 'Quiz: Qual seu tipo de personalidade?',
        description: 'Descubra seu perfil comportamental em 5 minutos',
        status: 'published',
        created_at: new Date('2024-01-20').toISOString(),
        updated_at: new Date('2024-03-15').toISOString(),
    },
    {
        id: 'funnel-quiz-marketing-digital-002',
        title: 'Avaliação: Sua estratégia de marketing digital',
        description: 'Identifique gaps na sua estratégia de marketing',
        status: 'published',
        created_at: new Date('2024-02-05').toISOString(),
        updated_at: new Date('2024-03-20').toISOString(),
    }
];

async function insertTestData() {
    console.log('🚀 Iniciando inserção de dados de teste...\n');

    try {
        // Verificar conexão
        console.log('🔍 Testando conexão...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.error('❌ Erro de conexão:', error.message);
            return;
        }
        console.log('✅ Conexão OK');

        // Inserir usuários
        console.log('\n👥 Inserindo usuários...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .insert(SAMPLE_USERS)
            .select();

        if (usersError) {
            console.error('❌ Erro ao inserir usuários:', usersError.message);
        } else {
            console.log(`✅ ${users?.length || 0} usuários inseridos`);
        }

        // Inserir funis
        console.log('\n🎯 Inserindo funis...');
        const { data: funnels, error: funnelsError } = await supabase
            .from('funnels')
            .insert(SAMPLE_FUNNELS)
            .select();

        if (funnelsError) {
            console.error('❌ Erro ao inserir funis:', funnelsError.message);
        } else {
            console.log(`✅ ${funnels?.length || 0} funis inseridos`);
        }

        // Verificar dados
        console.log('\n🔍 Verificando dados inseridos...');

        const { count: userCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        console.log(`📊 Total de usuários: ${userCount || 0}`);

        const { count: funnelCount } = await supabase
            .from('funnels')
            .select('*', { count: 'exact', head: true });
        console.log(`📊 Total de funis: ${funnelCount || 0}`);

        console.log('\n🏁 Inserção completa!');

    } catch (error) {
        console.error('❌ Erro inesperado:', error);
    }
}

// Executar
insertTestData();