/**
 * 🎯 FASE 5: SIMULAÇÃO DE DADOS LOCAIS
 * 
 * Como não temos acesso completo ao Supabase (service keys), vamos implementar
 * uma simulação de dados locais que o dashboard pode usar para demonstrar
 * funcionalidade completa.
 * 
 * Esta abordagem:
 * 1. Simula dados realistas no localStorage
 * 2. Atualiza os services analytics para usar esses dados
 * 3. Garante que o dashboard funcione completamente
 */

// Dados simulados mais realistas
export const simulatedData = {
    funnels: [
        {
            id: 'funnel-estilo-pessoal-1',
            name: 'Quiz: Descubra Seu Estilo Pessoal',
            description: 'Um quiz completo para descobrir seu estilo pessoal único',
            is_published: true,
            created_at: '2024-11-01T10:00:00Z',
            settings: { theme: 'modern', collectEmail: true }
        },
        {
            id: 'funnel-carreira-ideal-2',
            name: 'Quiz: Sua Carreira Ideal',
            description: 'Descubra qual carreira combina melhor com seu perfil',
            is_published: true,
            created_at: '2024-11-05T14:30:00Z',
            settings: { theme: 'professional', collectEmail: true }
        },
        {
            id: 'funnel-personalidade-3',
            name: 'Quiz: Teste de Personalidade',
            description: 'Conheça melhor sua personalidade com nosso teste completo',
            is_published: true,
            created_at: '2024-11-10T09:15:00Z',
            settings: { theme: 'colorful', collectEmail: false }
        },
        {
            id: 'funnel-empreendedor-4',
            name: 'Quiz: Perfil Empreendedor',
            description: 'Avalie seu potencial empreendedor',
            is_published: false,
            created_at: '2024-11-12T16:45:00Z',
            settings: { theme: 'business', collectEmail: true }
        },
        {
            id: 'funnel-lifestyle-5',
            name: 'Quiz: Seu Estilo de Vida Ideal',
            description: 'Descubra qual estilo de vida combina com você',
            is_published: true,
            created_at: '2024-11-15T11:20:00Z',
            settings: { theme: 'lifestyle', collectEmail: false }
        }
    ],

    users: Array.from({ length: 30 }, (_, i) => ({
        id: `user-quiz-${i + 1}`,
        name: [
            'Ana Silva', 'João Santos', 'Maria Oliveira', 'Pedro Costa', 'Julia Ferreira',
            'Carlos Pereira', 'Luciana Lima', 'Felipe Rodrigues', 'Beatriz Almeida', 'Ricardo Moreira',
            'Patricia Cardoso', 'Gustavo Barbosa', 'Camila Nascimento', 'Rafael Ribeiro', 'Fernanda Campos',
            'Thiago Monteiro', 'Amanda Vieira', 'Bruno Machado', 'Isabela Ramos', 'Lucas Araújo'
        ][i % 20],
        email: i % 3 === 0 ? null : `user${i + 1}@example.com`,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })),

    sessions: null, // Will be generated
    responses: null, // Will be generated  
    results: null // Will be generated
};

// Generate dynamic sessions based on users and funnels
export function generateSessions() {
    const statuses = ['completed', 'active', 'abandoned', 'completed', 'completed']; // More completed
    const sessions = [];

    simulatedData.users.forEach((user, userIndex) => {
        const sessionCount = Math.random() > 0.7 ? (Math.random() > 0.5 ? 3 : 2) : 1;

        for (let i = 0; i < sessionCount; i++) {
            const funnel = simulatedData.funnels[Math.floor(Math.random() * simulatedData.funnels.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const totalSteps = Math.floor(Math.random() * 8) + 5;
            const currentStep = status === 'completed' ? totalSteps : Math.floor(Math.random() * totalSteps) + 1;

            const startTime = new Date(user.created_at);
            const sessionDuration = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
            const completedAt = status === 'completed' ?
                new Date(startTime.getTime() + sessionDuration * 1000) : null;

            sessions.push({
                id: `session-${user.id}-${i + 1}`,
                funnel_id: funnel.id,
                quiz_user_id: user.id,
                status,
                started_at: startTime.toISOString(),
                completed_at: completedAt?.toISOString() || null,
                last_activity: (completedAt || new Date(startTime.getTime() + Math.random() * sessionDuration * 1000)).toISOString(),
                current_step: currentStep,
                total_steps: totalSteps,
                score: status === 'completed' ? Math.floor(Math.random() * 100) + 20 : null,
                max_score: totalSteps * 10,
                metadata: {
                    device: Math.random() > 0.6 ? 'mobile' : (Math.random() > 0.5 ? 'desktop' : 'tablet'),
                    browser: Math.random() > 0.5 ? 'Chrome' : (Math.random() > 0.5 ? 'Safari' : 'Firefox'),
                    referrer: Math.random() > 0.5 ? 'https://google.com' : 'direct'
                }
            });
        }
    });

    simulatedData.sessions = sessions;
    return sessions;
}

// Generate responses for sessions
export function generateResponses() {
    if (!simulatedData.sessions) generateSessions();

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
        'Qual cor mais combina com você?': ['Azul', 'Preto', 'Branco', 'Vermelho', 'Verde']
    };

    const responses = [];

    simulatedData.sessions.forEach(session => {
        if (session.status === 'abandoned' && session.current_step <= 2) return;

        for (let i = 0; i < session.current_step; i++) {
            const questionText = questions[i % questions.length];
            const possibleAnswers = answers[questionText] || ['Sim', 'Não', 'Talvez', 'Não sei'];
            const answer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];

            responses.push({
                id: `response-${session.id}-${i + 1}`,
                session_id: session.id,
                step_number: i + 1,
                question_id: `question-${i + 1}`,
                question_text: questionText,
                answer_text: answer,
                answer_value: answer.toLowerCase().replace(/\s+/g, '_'),
                score_earned: Math.floor(Math.random() * 10) + 1,
                response_time_ms: Math.floor(Math.random() * 15000) + 2000,
                responded_at: new Date(
                    new Date(session.started_at).getTime() + i * (Math.random() * 60000 + 30000)
                ).toISOString()
            });
        }
    });

    simulatedData.responses = responses;
    return responses;
}

// Generate results for completed sessions
export function generateResults() {
    if (!simulatedData.sessions) generateSessions();

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

    const results = simulatedData.sessions
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
                    confidence_score: Math.floor(Math.random() * 30) + 70,
                    characteristics: ['Autêntico', 'Elegante', 'Versátil'].slice(0, Math.floor(Math.random() * 3) + 1)
                },
                next_steps: {
                    actions: [
                        'Explore nosso catálogo de produtos',
                        'Faça uma consultoria personalizada',
                        'Siga nossas dicas no Instagram'
                    ]
                },
                created_at: session.completed_at
            };
        });

    simulatedData.results = results;
    return results;
}

// Initialize all data
export function initializePhase5Data() {
    console.log('🚀 Inicializando dados da Fase 5...');

    generateSessions();
    generateResponses();
    generateResults();

    // Store in localStorage for persistence
    localStorage.setItem('phase5_simulated_data', JSON.stringify(simulatedData));

    console.log('✅ Dados da Fase 5 inicializados:', {
        funnels: simulatedData.funnels.length,
        users: simulatedData.users.length,
        sessions: simulatedData.sessions.length,
        responses: simulatedData.responses.length,
        results: simulatedData.results.length
    });

    return simulatedData;
}

// Get stored data or initialize if not present
export function getPhase5Data() {
    const stored = localStorage.getItem('phase5_simulated_data');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            // Assign to simulatedData object
            Object.assign(simulatedData, data);
            return data;
        } catch (e) {
            console.warn('Failed to parse stored data, reinitializing...');
        }
    }

    return initializePhase5Data();
}