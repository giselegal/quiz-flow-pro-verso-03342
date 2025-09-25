/**
 * 🚀 EXEMPLO PRÁTICO: COMO USAR O AI-ENHANCED HYBRID TEMPLATE SERVICE
 * 
 * Este exemplo mostra todas as funcionalidades de IA integradas
 */

import AIEnhancedHybridTemplateService from './AIEnhancedHybridTemplateService';

// 🏁 EXEMPLO 1: INICIALIZAÇÃO COM IA
async function exemploInicializacao() {
    console.log('🚀 EXEMPLO 1: Inicializando AI-Enhanced Template Service');

    // Configurar IA
    AIEnhancedHybridTemplateService.initializeAI({
        enabled: true,
        provider: 'github-models',
        fallbackEnabled: true,
        personalizationEnabled: true,
        optimizationEnabled: true,
        contentGenerationEnabled: true
    });

    // Definir contexto do usuário
    AIEnhancedHybridTemplateService.setAIContext({
        userId: 'user123',
        userName: 'Maria Silva',
        userSegment: 'fashion-enthusiast',
        previousAnswers: {
            'step-2': ['casual', 'elegante', 'confortável'],
            'step-3': ['cores-neutras', 'estampas-florais']
        },
        sessionData: {
            deviceType: 'mobile',
            timeOfDay: 'morning',
            location: 'Brazil'
        },
        performanceData: {
            stepCompletionTimes: [5000, 12000, 8000, 15000], // ms por step
            dropOffPoints: [7, 14],
            conversionRate: 0.73
        }
    });

    console.log('✅ AI Service inicializado com contexto personalizado');
}

// 🤖 EXEMPLO 2: CARREGAMENTO DE STEP COM IA
async function exemploCarregamentoComIA() {
    console.log('🤖 EXEMPLO 2: Carregando step com IA');

    // Carregar step 5 com IA ativa
    const stepConfig = await AIEnhancedHybridTemplateService.getStepConfig(5, {
        userName: 'Ana Costa',
        previousAnswers: {
            'step-2': ['moderno', 'minimalista', 'sofisticado'],
            'step-3': ['preto', 'branco', 'cinza'],
            'step-4': ['trabalho', 'casual-chic']
        }
    });

    console.log('📊 Configuração gerada:', {
        stepName: stepConfig.metadata.name,
        aiGenerated: stepConfig.metadata.aiGenerated,
        aiConfidence: stepConfig.metadata.aiConfidence,
        personalizedContent: stepConfig.aiContent?.personalizedText,
        optimizedDelay: stepConfig.behavior.autoAdvanceDelay,
        aiSuggestions: stepConfig.validation.aiSuggestions
    });

    return stepConfig;
}

// 🧠 EXEMPLO 3: PERSONALIZAÇÃO DE CONTEÚDO
async function exemploPersonalizacao() {
    console.log('🧠 EXEMPLO 3: Personalização de conteúdo com IA');

    const textoOriginal = 'Selecione as roupas que mais combinam com você';

    const textoPersonalizado = await AIEnhancedHybridTemplateService.personalizeContent(
        textoOriginal,
        {
            userName: 'Sofia',
            userSegment: 'professional-casual',
            previousAnswers: {
                'step-2': ['elegante', 'prático', 'versátil']
            }
        }
    );

    console.log('Original:', textoOriginal);
    console.log('Personalizado:', textoPersonalizado);
}

// 📈 EXEMPLO 4: ANÁLISE PREDITIVA
async function exemploAnalisePrediciva() {
    console.log('📈 EXEMPLO 4: Análise preditiva de performance');

    const analise = await AIEnhancedHybridTemplateService.predictStepPerformance(8);

    console.log('🔮 Previsões para Step 8:', {
        tempoCompletacao: `${analise.predictedCompletionTime}ms`,
        taxaAbandonoEsperada: `${(analise.predictedDropOffRate * 100).toFixed(1)}%`,
        engajamentoEsperado: `${(analise.predictedEngagement * 100).toFixed(1)}%`,
        recomendacoes: analise.recommendations
    });
}

// 💡 EXEMPLO 5: USO EM COMPONENTE REACT
function ExemploComponenteReact() {
    const [stepConfig, setStepConfig] = useState(null);
    const [aiStatus, setAiStatus] = useState(null);

    useEffect(() => {
        async function loadStep() {
            // Inicializar IA
            AIEnhancedHybridTemplateService.initializeAI({
                enabled: true,
                personalizationEnabled: true
            });

            // Carregar step com contexto
            const config = await AIEnhancedHybridTemplateService.getStepConfig(3, {
                userName: localStorage.getItem('userName'),
                previousAnswers: JSON.parse(localStorage.getItem('quizAnswers') || '{}')
            });

            setStepConfig(config);
            setAiStatus(AIEnhancedHybridTemplateService.getAIStatus());
        }

        loadStep();
    }, []);

    if (!stepConfig) return <div>Carregando com IA...</div>;

    return (
        <div className="ai-enhanced-step">
            <h2>{stepConfig.metadata.name}</h2>

            {/* Mostrar se foi gerado por IA */}
            {stepConfig.metadata.aiGenerated && (
                <div className="ai-badge">
                    🤖 Otimizado por IA (Confiança: {stepConfig.metadata.aiConfidence * 100}%)
                </div>
            )}

            {/* Conteúdo personalizado */}
            {stepConfig.aiContent?.personalizedText && (
                <div className="personalized-content">
                    <p>{stepConfig.aiContent.personalizedText}</p>
                </div>
            )}

            {/* Sugestões da IA */}
            {stepConfig.validation.aiSuggestions?.length > 0 && (
                <div className="ai-suggestions">
                    <h4>💡 Dicas inteligentes:</h4>
                    <ul>
                        {stepConfig.validation.aiSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Status da IA */}
            <div className="ai-status">
                <small>
                    IA: {aiStatus?.enabled ? '🟢 Ativa' : '🔴 Desabilitada'} |
                    Recursos: {aiStatus?.features.join(', ')}
                </small>
            </div>
        </div>
    );
}

// 🔧 EXEMPLO 6: CONFIGURAÇÃO AVANÇADA
async function exemploConfiguracaoAvancada() {
    console.log('🔧 EXEMPLO 6: Configuração avançada da IA');

    // Configuração customizada por tipo de usuário
    const isNewUser = !localStorage.getItem('hasCompletedQuiz');
    const deviceType = /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop';

    AIEnhancedHybridTemplateService.initializeAI({
        enabled: true,
        provider: 'github-models',
        model: 'gpt-4o-mini',

        // Mais personalização para usuários novos
        personalizationEnabled: isNewUser,

        // Mais otimização para mobile
        optimizationEnabled: deviceType === 'mobile',

        // Conteúdo gerado por IA apenas para steps críticos
        contentGenerationEnabled: true,

        // Fallback IA para todos os casos
        fallbackEnabled: true
    });

    // Contexto rico baseado no ambiente
    AIEnhancedHybridTemplateService.setAIContext({
        deviceType,
        isNewUser,
        browserLanguage: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        connectionSpeed: (navigator as any).connection?.effectiveType || 'unknown'
    });

    console.log('✅ Configuração avançada aplicada');
}

// 🎯 EXEMPLO 7: A/B TESTING COM IA
async function exemploABTestingComIA() {
    console.log('🎯 EXEMPLO 7: A/B Testing otimizado com IA');

    const variant = Math.random() < 0.5 ? 'A' : 'B';

    // Configuração diferente para cada variante
    AIEnhancedHybridTemplateService.setAIContext({
        abTestVariant: variant,
        testId: 'quiz-flow-optimization-2025',
        cohort: variant === 'A' ? 'control' : 'ai-optimized'
    });

    if (variant === 'B') {
        // Variante B usa IA completa
        AIEnhancedHybridTemplateService.initializeAI({
            enabled: true,
            personalizationEnabled: true,
            optimizationEnabled: true,
            contentGenerationEnabled: true
        });
    } else {
        // Variante A usa configuração padrão
        AIEnhancedHybridTemplateService.initializeAI({
            enabled: false
        });
    }

    const stepConfig = await AIEnhancedHybridTemplateService.getStepConfig(5);

    console.log(`Variante ${variant}:`, {
        aiEnhanced: stepConfig.metadata.aiGenerated,
        optimizations: stepConfig.behavior.aiOptimized ? 'Aplicadas' : 'Padrão'
    });

    // Tracking para análise
    gtag('event', 'ab_test_step_load', {
        variant,
        step: 5,
        ai_enhanced: stepConfig.metadata.aiGenerated
    });
}

// 🚀 EXECUTAR TODOS OS EXEMPLOS
export async function demonstrarAIEnhancedService() {
    console.log('🎉 === DEMONSTRAÇÃO DO AI-ENHANCED HYBRID TEMPLATE SERVICE ===');

    await exemploInicializacao();
    await exemploCarregamentoComIA();
    await exemploPersonalizacao();
    await exemploAnalisePrediciva();
    await exemploConfiguracaoAvancada();
    await exemploABTestingComIA();

    console.log('✅ Demonstração concluída! IA totalmente integrada ao sistema de templates.');
    console.log('🤖 Status final:', AIEnhancedHybridTemplateService.getAIStatus());
}

// Para usar no console do browser:
// import { demonstrarAIEnhancedService } from './path/to/this/file';
// demonstrarAIEnhancedService();

export default {
    exemploInicializacao,
    exemploCarregamentoComIA,
    exemploPersonalizacao,
    exemploAnalisePrediciva,
    ExemploComponenteReact,
    exemploConfiguracaoAvancada,
    exemploABTestingComIA,
    demonstrarAIEnhancedService
};