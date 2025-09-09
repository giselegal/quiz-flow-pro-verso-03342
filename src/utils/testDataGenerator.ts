/**
 * 🧪 GERADOR DE DADOS DE TESTE PARA PARTICIPANTES
 * 
 * Script para criar dados simulados e populares o dashboard
 */

import { supabase } from '@/lib/supabase';

// ============================================================================
// DADOS SIMULADOS
// ============================================================================

const MOCK_NAMES = [
    'Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Pedro', 'Fernanda Costa',
    'Roberto Lima', 'Julia Ferreira', 'Pedro Henrique', 'Camila Rodriguez', 'Lucas Almeida',
    'Beatriz Souza', 'Rafael Miranda', 'Isabela Martins', 'Gustavo Pereira', 'Larissa Rocha',
    'Thiago Barbosa', 'Natália Campos', 'Diego Monteiro', 'Gabriela Vieira', 'Alexandre Reis'
];

const STYLE_RESULTS = [
    'Clássico Elegante', 'Moderno Minimalista', 'Boho Chic', 'Romântico Delicado',
    'Rock Contemporâneo', 'Casual Confortável', 'Glamour Noturno', 'Vintage Retrô',
    'Esportivo Urbano', 'Artístico Criativo'
];

const DEVICE_TYPES = ['mobile', 'tablet', 'desktop'] as const;

// ============================================================================
// FUNÇÕES DE GERAÇÃO
// ============================================================================

const generateRandomDate = (daysAgo: number) => {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * daysAgo);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
    date.setHours(randomHours, randomMinutes, 0, 0);

    return date.toISOString();
};

const generateRandomSession = (index: number) => {
    const name = MOCK_NAMES[index % MOCK_NAMES.length];
    const startDate = generateRandomDate(30); // Últimos 30 dias
    const deviceType = DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)];

    // Determinar se a sessão está completa (70% de chance)
    const isCompleted = Math.random() < 0.7;
    const isAbandoned = !isCompleted && Math.random() < 0.3;

    let currentStep;
    let completedAt = null;
    let timeSpent = 0;

    if (isCompleted) {
        currentStep = 21;
        // Tempo entre 3-15 minutos para completos
        timeSpent = Math.floor(Math.random() * 720) + 180; // 3-15 min
        const completedDate = new Date(new Date(startDate).getTime() + timeSpent * 1000);
        completedAt = completedDate.toISOString();
    } else if (isAbandoned) {
        // Abandonados ficaram entre etapa 1-5
        currentStep = Math.floor(Math.random() * 5) + 1;
        timeSpent = Math.floor(Math.random() * 120) + 30; // 30s-2min
    } else {
        // Em andamento ficaram entre etapa 6-20
        currentStep = Math.floor(Math.random() * 15) + 6;
        timeSpent = Math.floor(Math.random() * 600) + 120; // 2-12min
    }

    const sessionId = `session_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        session: {
            id: sessionId,
            quiz_user_id: name,
            funnel_id: 'quiz-21-steps',
            started_at: startDate,
            completed_at: completedAt,
            current_step: currentStep,
            total_steps: 21,
            status: isCompleted ? 'completed' : (isAbandoned ? 'abandoned' : 'active'),
            last_activity: completedAt || new Date().toISOString(),
            score: isCompleted ? Math.floor(Math.random() * 100) + 50 : null,
            max_score: 150,
            metadata: {
                device_type: deviceType,
                time_spent: timeSpent,
                user_agent: `Mozilla/5.0 (${deviceType === 'mobile' ? 'Mobile' : 'Desktop'}) Browser/1.0`
            }
        },
        result: isCompleted ? {
            session_id: sessionId,
            result_type: STYLE_RESULTS[Math.floor(Math.random() * STYLE_RESULTS.length)],
            result_title: 'Descoberta do Seu Estilo Pessoal',
            result_description: 'Baseado nas suas respostas, descobrimos seu estilo único.',
            result_data: {
                primaryStyle: STYLE_RESULTS[Math.floor(Math.random() * STYLE_RESULTS.length)],
                totalScore: Math.floor(Math.random() * 100) + 50,
                confidence: Math.floor(Math.random() * 30) + 70
            },
            recommendation: 'Explore peças que realcem seu estilo natural.',
            next_steps: {
                suggestions: ['Visite nossa coleção', 'Agende consultoria', 'Compartilhe resultado']
            }
        } : null,
        responses: generateStepResponses(sessionId, currentStep)
    };
};

const generateStepResponses = (sessionId: string, maxStep: number) => {
    const responses = [];

    for (let step = 1; step <= Math.min(maxStep, 21); step++) {
        if (Math.random() < 0.9) { // 90% chance de ter resposta para cada etapa
            responses.push({
                session_id: sessionId,
                step_number: step,
                question_id: `question_${step}`,
                question_text: `Pergunta da etapa ${step}`,
                answer_text: `Resposta escolhida para etapa ${step}`,
                answer_value: `option_${step}_${Math.floor(Math.random() * 4) + 1}`,
                response_time_ms: Math.floor(Math.random() * 30000) + 5000, // 5-35 segundos
                score_earned: Math.floor(Math.random() * 10) + 1,
                responded_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                metadata: {
                    step_type: step <= 11 ? 'scoring' : 'strategic',
                    category: `category_${Math.floor(Math.random() * 5) + 1}`
                }
            });
        }
    }

    return responses;
};

// ============================================================================
// FUNÇÃO PRINCIPAL DE GERAÇÃO
// ============================================================================

export const generateTestData = async (count: number = 50) => {
    console.log(`🧪 Gerando ${count} participantes de teste...`);

    try {
        const testData = [];

        for (let i = 0; i < count; i++) {
            testData.push(generateRandomSession(i));
        }

        // Inserir sessões
        const sessions = testData.map(d => d.session);
        const { error: sessionsError } = await supabase
            .from('quiz_sessions')
            .insert(sessions);

        if (sessionsError) {
            console.error('Erro ao inserir sessões:', sessionsError);
            return;
        }

        // Inserir resultados (apenas para sessões completas)
        const results = testData
            .filter(d => d.result !== null)
            .map(d => d.result!)
            .filter(Boolean);

        if (results.length > 0) {
            const { error: resultsError } = await supabase
                .from('quiz_results')
                .insert(results);

            if (resultsError) {
                console.error('Erro ao inserir resultados:', resultsError);
            }
        }

        // Inserir respostas por etapa
        const allResponses = testData.flatMap(d => d.responses);
        if (allResponses.length > 0) {
            // Inserir em lotes para evitar timeout
            const batchSize = 100;
            for (let i = 0; i < allResponses.length; i += batchSize) {
                const batch = allResponses.slice(i, i + batchSize);
                const { error: responsesError } = await supabase
                    .from('quiz_step_responses')
                    .insert(batch);

                if (responsesError) {
                    console.error('Erro ao inserir respostas:', responsesError);
                }
            }
        }

        console.log(`✅ Dados de teste gerados com sucesso!`);
        console.log(`📊 Estatísticas:`);
        console.log(`   - ${sessions.length} sessões criadas`);
        console.log(`   - ${results.length} resultados completos`);
        console.log(`   - ${allResponses.length} respostas por etapa`);

        return {
            sessions: sessions.length,
            results: results.length,
            responses: allResponses.length
        };

    } catch (error) {
        console.error('❌ Erro ao gerar dados de teste:', error);
        throw error;
    }
};

// ============================================================================
// FUNÇÃO DE LIMPEZA
// ============================================================================

export const clearTestData = async () => {
    console.log('🧹 Limpando dados de teste...');

    try {
        // Deletar apenas dados de teste (identificados pelo prefixo session_)
        await supabase
            .from('quiz_step_responses')
            .delete()
            .like('session_id', 'session_%');

        await supabase
            .from('quiz_results')
            .delete()
            .like('session_id', 'session_%');

        await supabase
            .from('quiz_sessions')
            .delete()
            .like('id', 'session_%');

        console.log('✅ Dados de teste removidos com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao limpar dados de teste:', error);
        throw error;
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    generateTestData,
    clearTestData
};
