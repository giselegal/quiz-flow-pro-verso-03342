/**
 * 🚀 CONFIGURAÇÃO DE CODE SPLITTING - FASE 3
 * 
 * Define estratégias de chunking otimizadas para o UnifiedStepRenderer
 * Reduz bundle size e melhora performance de carregamento
 */

/**
 * Configuração de chunks por categoria de step
 */
export const STEP_CHUNKS_CONFIG = {
    // Chunk para steps de introdução
    intro: {
        name: 'steps-intro',
        priority: 10,
        test: /step-01/,
        steps: ['step-01']
    },

    // Chunk para steps de perguntas (mais comum)
    questions: {
        name: 'steps-questions',
        priority: 20,
        test: /step-(02|03|04|05|06|07|08|09|10|11)/,
        steps: ['step-02', 'step-03', 'step-04', 'step-05', 'step-06', 'step-07', 'step-08', 'step-09', 'step-10', 'step-11']
    },

    // Chunk para step estratégico
    strategic: {
        name: 'steps-strategic',
        priority: 15,
        test: /step-12/,
        steps: ['step-12']
    },

    // Chunk para transição
    transition: {
        name: 'steps-transition',
        priority: 5,
        test: /step-13/,
        steps: ['step-13']
    },

    // Chunk para resultado e oferta (final)
    final: {
        name: 'steps-final',
        priority: 30,
        test: /step-(14|15)/,
        steps: ['step-14', 'step-15']
    }
} as const;

/**
 * Configuração de preload estratégico
 */
export const PRELOAD_STRATEGY = {
    // Steps que devem ser pré-carregados
    preload: {
        // Sempre pré-carregar intro
        immediate: ['step-01'],
        // Pré-carregar próximos steps baseado no atual
        next: {
            'step-01': ['step-02'], // Após intro, carregar primeira pergunta
            'step-11': ['step-12'], // Após última pergunta, carregar estratégica
            'step-12': ['step-13'], // Após estratégica, carregar transição
            'step-13': ['step-14'], // Após transição, carregar resultado
            'step-14': ['step-15'], // Após resultado, carregar oferta
        }
    },

    // Steps que devem ser carregados sob demanda
    onDemand: ['step-15'], // Oferta só quando necessário
} as const;

/**
 * Métricas de performance por chunk
 */
export const PERFORMANCE_TARGETS = {
    maxChunkSize: {
        'steps-intro': 15000,      // 15KB - crítico para first load
        'steps-questions': 25000,  // 25KB - usado frequentemente
        'steps-strategic': 12000,  // 12KB - pequeno e específico
        'steps-transition': 8000,  // 8KB - simples
        'steps-final': 35000,      // 35KB - pode ser maior (final)
    },

    loadingTargets: {
        'steps-intro': 200,    // 200ms - crítico
        'steps-questions': 300, // 300ms - frequente
        'steps-strategic': 250, // 250ms - importante
        'steps-transition': 150, // 150ms - rápido
        'steps-final': 500,    // 500ms - pode ser mais lento
    }
} as const;

/**
 * Função para determinar o chunk apropriado para um stepId
 */
export const getChunkForStep = (stepId: string): string => {
    for (const [category, config] of Object.entries(STEP_CHUNKS_CONFIG)) {
        if (config.steps.includes(stepId as any)) {
            return config.name;
        }
    }
    return 'steps-default';
};

/**
 * Função para obter steps que devem ser pré-carregados
 */
export const getPreloadSteps = (currentStepId: string): string[] => {
    const immediate = PRELOAD_STRATEGY.preload.immediate;
    const next = PRELOAD_STRATEGY.preload.next[currentStepId as keyof typeof PRELOAD_STRATEGY.preload.next] || [];

    return [...immediate, ...next];
};

/**
 * Configuração de Webpack para otimização de chunks
 */
export const getWebpackChunkConfig = () => ({
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
            // Steps de introdução
            stepsIntro: {
                name: STEP_CHUNKS_CONFIG.intro.name,
                test: STEP_CHUNKS_CONFIG.intro.test,
                priority: STEP_CHUNKS_CONFIG.intro.priority,
                enforce: true
            },

            // Steps de perguntas
            stepsQuestions: {
                name: STEP_CHUNKS_CONFIG.questions.name,
                test: STEP_CHUNKS_CONFIG.questions.test,
                priority: STEP_CHUNKS_CONFIG.questions.priority,
                enforce: true
            },

            // Step estratégico
            stepsStrategic: {
                name: STEP_CHUNKS_CONFIG.strategic.name,
                test: STEP_CHUNKS_CONFIG.strategic.test,
                priority: STEP_CHUNKS_CONFIG.strategic.priority,
                enforce: true
            },

            // Step de transição
            stepsTransition: {
                name: STEP_CHUNKS_CONFIG.transition.name,
                test: STEP_CHUNKS_CONFIG.transition.test,
                priority: STEP_CHUNKS_CONFIG.transition.priority,
                enforce: true
            },

            // Steps finais
            stepsFinal: {
                name: STEP_CHUNKS_CONFIG.final.name,
                test: STEP_CHUNKS_CONFIG.final.test,
                priority: STEP_CHUNKS_CONFIG.final.priority,
                enforce: true
            }
        }
    }
});

export default {
    STEP_CHUNKS_CONFIG,
    PRELOAD_STRATEGY,
    PERFORMANCE_TARGETS,
    getChunkForStep,
    getPreloadSteps,
    getWebpackChunkConfig
};