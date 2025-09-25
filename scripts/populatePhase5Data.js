/**
 * 🚀 SCRIPT DE POPULAÇÃO DA FASE 5
 * 
 * Este script cria dados de amostra para completar a Fase 5 do dashboard:
 * - Cria funis de exemplo
 * - Gera usuários de quiz
 * - Cria sessões de quiz com diferentes status
 * - Popula respostas às perguntas
 * - Gera resultados de quiz
 * 
 * Execução: node scripts/populatePhase5Data.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read environment variables
const envContent = fs.readFileSync('.env', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data generators
const generateFunnels = () => [
    {
        id: 'funnel-estilo-pessoal-1',
        name: 'Quiz: Descubra Seu Estilo Pessoal',
        description: 'Um quiz completo para descobrir seu estilo pessoal único',
        is_published: true,
        settings: {
            theme: 'modern',
            allowRetries: true,
            showProgress: true,
            collectEmail: true
        },
        version: 1
    },
    {
        id: 'funnel-carreira-ideal-2',
        name: 'Quiz: Sua Carreira Ideal',
        description: 'Descubra qual carreira combina melhor com seu perfil',
        is_published: true,
        settings: {
            theme: 'professional',
            allowRetries: false,
            showProgress: true,
            collectEmail: true
        },
        version: 1
    },
    {
        id: 'funnel-personalidade-3',
        name: 'Quiz: Teste de Personalidade',
        description: 'Conheça melhor sua personalidade com nosso teste completo',
        is_published: true,
        settings: {
            theme: 'colorful',
            allowRetries: true,
            showProgress: false,
            collectEmail: false
        },
        version: 1
    },
    {
        id: 'funnel-empreendedor-4',
        name: 'Quiz: Perfil Empreendedor',
        description: 'Avalie seu potencial empreendedor',
        is_published: false,
        settings: {
            theme: 'business',
            allowRetries: true,
            showProgress: true,
            collectEmail: true
        },
        version: 1
    },
    {
        id: 'funnel-lifestyle-5',
        name: 'Quiz: Seu Estilo de Vida Ideal',
        description: 'Descubra qual estilo de vida combina com você',
        is_published: true,
        settings: {
            theme: 'lifestyle',
            allowRetries: false,
            showProgress: true,
            collectEmail: false
        },
        version: 1
    }
];

const generateQuizUsers = (count = 50) => {
    const names = [
        'Ana Silva', 'João Santos', 'Maria Oliveira', 'Pedro Costa', 'Julia Ferreira',
        'Carlos Pereira', 'Luciana Lima', 'Felipe Rodrigues', 'Beatriz Almeida', 'Ricardo Moreira',
        'Patricia Cardoso', 'Gustavo Barbosa', 'Camila Nascimento', 'Rafael Ribeiro', 'Fernanda Campos',
        'Thiago Monteiro', 'Amanda Vieira', 'Bruno Machado', 'Isabela Ramos', 'Lucas Araújo'
    ];

    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'uol.com.br'];
    const sources = ['google', 'facebook', 'instagram', 'direct', 'email'];

    return Array.from({ length: count }, (_, i) => {
        const name = names[i % names.length];
        const firstName = name.split(' ')[0].toLowerCase();
        const lastName = name.split(' ')[1].toLowerCase();
        const email = `${firstName}.${lastName}${i > 19 ? i : ''}@${domains[i % domains.length]}`;

        return {
            id: `user-quiz-${i + 1}`,
            name,
            email: Math.random() > 0.3 ? email : null, // 70% provide email
            session_id: `session-${Date.now()}-${i}`,
            utm_source: sources[i % sources.length],
            utm_medium: 'organic',
            utm_campaign: i % 3 === 0 ? 'quiz-promo-2024' : null,
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Last 30 days
        };
    });
};

const generateQuizSessions = (users, funnels) => {
    const statuses = ['completed', 'active', 'abandoned', 'completed', 'completed']; // More completed sessions

    return users.flatMap(user => {
        // Each user has 1-3 sessions
        const sessionCount = Math.random() > 0.7 ? (Math.random() > 0.5 ? 3 : 2) : 1;

        return Array.from({ length: sessionCount }, (_, i) => {
            const funnel = funnels[Math.floor(Math.random() * funnels.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const totalSteps = Math.floor(Math.random() * 8) + 5; // 5-12 steps
            const currentStep = status === 'completed' ? totalSteps : Math.floor(Math.random() * totalSteps) + 1;

            const startTime = new Date(user.created_at);
            const sessionDuration = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
            const completedAt = status === 'completed' ?
                new Date(startTime.getTime() + sessionDuration * 1000) : null;

            return {
                id: `session-${user.id}-${i + 1}`,
                funnel_id: funnel.id,
                quiz_user_id: user.id,
                status,
                started_at: startTime.toISOString(),
                completed_at: completedAt?.toISOString() || null,
                last_activity: (completedAt || new Date(startTime.getTime() + Math.random() * sessionDuration * 1000)).toISOString(),
                current_step: currentStep,
                total_steps: totalSteps,
                score: status === 'completed' ? Math.floor(Math.random() * 100) + 20 : null, // 20-120 points
                max_score: totalSteps * 10,
                metadata: {
                    device: Math.random() > 0.6 ? 'mobile' : (Math.random() > 0.5 ? 'desktop' : 'tablet'),
                    browser: Math.random() > 0.5 ? 'Chrome' : (Math.random() > 0.5 ? 'Safari' : 'Firefox'),
                    referrer: Math.random() > 0.5 ? 'https://google.com' : 'direct'
                }
            };
        });
    });
};

const generateQuizStepResponses = (sessions) => {
    const questions = [
        'Qual é seu estilo preferido?',
        'Como você se veste para trabalhar?',
        'Qual cor mais combina com você?',
        'Que tipo de evento você prefere?',
        'Como é seu estilo de vida?',
        'Qual sua marca favorita?',
        'Que tipo de música você escuta?',
        'Como você se diverte?',
        'Qual seu hobby favorito?',
        'Que tipo de viagem prefere?'
    ];

    const answers = {
        'Qual é seu estilo preferido?': ['Clássico', 'Moderno', 'Boho', 'Minimalista'],
        'Como você se veste para trabalhar?': ['Formal', 'Casual', 'Smart Casual', 'Criativo'],
        'Qual cor mais combina com você?': ['Azul', 'Preto', 'Branco', 'Vermelho', 'Verde'],
        'Que tipo de evento você prefere?': ['Formal', 'Casual', 'Festa', 'Familiar'],
        'Como é seu estilo de vida?': ['Ativo', 'Relaxado', 'Aventureiro', 'Tranquilo']
    };

    return sessions.flatMap(session => {
        if (session.status === 'abandoned' && session.current_step <= 2) {
            return []; // Very early abandonment, no responses
        }

        return Array.from({ length: session.current_step }, (_, i) => {
            const questionText = questions[i % questions.length];
            const possibleAnswers = answers[questionText] || ['Sim', 'Não', 'Talvez', 'Não sei'];
            const answer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];

            return {
                id: `response-${session.id}-${i + 1}`,
                session_id: session.id,
                step_number: i + 1,
                question_id: `question-${i + 1}`,
                question_text: questionText,
                answer_text: answer,
                answer_value: answer.toLowerCase().replace(/\s+/g, '_'),
                score_earned: Math.floor(Math.random() * 10) + 1,
                response_time_ms: Math.floor(Math.random() * 15000) + 2000, // 2-17 seconds
                responded_at: new Date(
                    new Date(session.started_at).getTime() + i * (Math.random() * 60000 + 30000) // 30s-90s per question
                ).toISOString(),
                metadata: {
                    hesitation_time: Math.floor(Math.random() * 5000),
                    clicked_back: Math.random() > 0.8
                }
            };
        });
    });
};

const generateQuizResults = (sessions) => {
    const resultTypes = [
        'Estilo Clássico',
        'Estilo Moderno',
        'Estilo Boho',
        'Estilo Minimalista',
        'Estilo Criativo'
    ];

    const descriptions = {
        'Estilo Clássico': 'Você tem um gosto refinado e atemporal. Prefere peças que nunca saem de moda.',
        'Estilo Moderno': 'Você está sempre em sintonia com as últimas tendências e gosta de inovar.',
        'Estilo Boho': 'Seu estilo é livre e artístico. Você valoriza a individualidade e expressão pessoal.',
        'Estilo Minimalista': 'Você acredita que menos é mais. Prefere simplicidade e funcionalidade.',
        'Estilo Criativo': 'Você não tem medo de ousar e experimentar. Seu estilo é único e autêntico.'
    };

    return sessions
        .filter(session => session.status === 'completed')
        .map(session => {
            const resultType = resultTypes[Math.floor(Math.random() * resultTypes.length)];

            return {
                id: `result-${session.id}`,
                session_id: session.id,
                result_type: resultType,
                result_title: `Seu resultado: ${resultType}`,
                result_description: descriptions[resultType],
                recommendation: `Baseado no seu perfil ${resultType.toLowerCase()}, recomendamos explorar...`,
                result_data: {
                    primary_style: resultType,
                    secondary_styles: resultTypes.filter(t => t !== resultType).slice(0, 2),
                    confidence_score: Math.floor(Math.random() * 30) + 70, // 70-100%
                    characteristics: ['Autêntico', 'Elegante', 'Versátil'].slice(0, Math.floor(Math.random() * 3) + 1)
                },
                next_steps: {
                    actions: [
                        'Explore nosso catálogo de produtos',
                        'Faça uma consultoria personalizada',
                        'Siga nossas dicas no Instagram'
                    ],
                    products: [`produto-${resultType.toLowerCase()}`, 'consultoria-estilo', 'ebook-estilo']
                },
                created_at: session.completed_at
            };
        });
};

async function populateDatabase() {
    console.log('🚀 Iniciando população da Fase 5...\n');

    try {
        // 1. Create Funnels
        console.log('📊 Criando funis...');
        const funnels = generateFunnels();
        const { error: funnelsError } = await supabase
            .from('funnels')
            .upsert(funnels, { onConflict: 'id' });

        if (funnelsError) {
            console.error('❌ Erro ao criar funis:', funnelsError);
            return;
        }
        console.log(`✅ ${funnels.length} funis criados!\n`);

        // 2. Create Quiz Users
        console.log('👥 Criando usuários...');
        const users = generateQuizUsers(30);
        const { error: usersError } = await supabase
            .from('quiz_users')
            .upsert(users, { onConflict: 'id' });

        if (usersError) {
            console.error('❌ Erro ao criar usuários:', usersError);
            return;
        }
        console.log(`✅ ${users.length} usuários criados!\n`);

        // 3. Create Quiz Sessions
        console.log('🎯 Criando sessões de quiz...');
        const sessions = generateQuizSessions(users, funnels);
        const { error: sessionsError } = await supabase
            .from('quiz_sessions')
            .upsert(sessions, { onConflict: 'id' });

        if (sessionsError) {
            console.error('❌ Erro ao criar sessões:', sessionsError);
            return;
        }
        console.log(`✅ ${sessions.length} sessões criadas!\n`);

        // 4. Create Quiz Step Responses
        console.log('💭 Criando respostas...');
        const responses = generateQuizStepResponses(sessions);

        // Insert responses in batches to avoid timeout
        const batchSize = 100;
        for (let i = 0; i < responses.length; i += batchSize) {
            const batch = responses.slice(i, i + batchSize);
            const { error: responsesError } = await supabase
                .from('quiz_step_responses')
                .upsert(batch, { onConflict: 'id' });

            if (responsesError) {
                console.error(`❌ Erro ao criar respostas (lote ${Math.floor(i / batchSize) + 1}):`, responsesError);
                return;
            }
        }
        console.log(`✅ ${responses.length} respostas criadas!\n`);

        // 5. Create Quiz Results
        console.log('📈 Criando resultados...');
        const results = generateQuizResults(sessions);
        const { error: resultsError } = await supabase
            .from('quiz_results')
            .upsert(results, { onConflict: 'id' });

        if (resultsError) {
            console.error('❌ Erro ao criar resultados:', resultsError);
            return;
        }
        console.log(`✅ ${results.length} resultados criados!\n`);

        // 6. Summary
        console.log('🎉 FASE 5 CONCLUÍDA COM SUCESSO!\n');
        console.log('📊 RESUMO DOS DADOS CRIADOS:');
        console.log(`   • ${funnels.length} funis`);
        console.log(`   • ${users.length} usuários`);
        console.log(`   • ${sessions.length} sessões`);
        console.log(`   • ${responses.length} respostas`);
        console.log(`   • ${results.length} resultados`);

        const completedSessions = sessions.filter(s => s.status === 'completed').length;
        const activeSessions = sessions.filter(s => s.status === 'active').length;
        const abandonedSessions = sessions.filter(s => s.status === 'abandoned').length;

        console.log('\n📈 MÉTRICAS GERADAS:');
        console.log(`   • ${completedSessions} sessões completas`);
        console.log(`   • ${activeSessions} sessões ativas`);
        console.log(`   • ${abandonedSessions} sessões abandonadas`);
        console.log(`   • ${Math.round((completedSessions / sessions.length) * 100)}% taxa de conclusão`);

        console.log('\n✨ O dashboard agora tem dados reais para exibir!');

    } catch (error) {
        console.error('💥 Erro geral:', error);
    }
}

// Execute the population
populateDatabase();