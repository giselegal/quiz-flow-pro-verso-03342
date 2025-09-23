import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import UniversalQuizStep from '@/components/universal/UniversalQuizStep';
import { BlockPropertiesAPI } from '@/api/internal/BlockPropertiesAPI';
import ScalableHybridTemplateService from '@/services/ScalableHybridTemplateService';
import { QuizStepRouter } from '@/components/router/QuizStepRouter';
import SpecializedStepRenderer from '@/components/specialized/SpecializedStepRenderer';

interface ScalableQuizRendererProps {
    funnelId: string;
    mode?: 'preview' | 'production';
    className?: string;
    onComplete?: (results: any) => void;
    onStepChange?: (step: number, data: any) => void;
    debugMode?: boolean;
}

/**
 * ScalableQuizRenderer - Sistema Escalável com HybridTemplateService
 * 
 * 🚀 Recursos:
 * - ✅ Usa ScalableHybridTemplateService para configuração dinâmica
 * - ✅ Suporta qualquer funil via JSON configs
 * - ✅ API conectada aos dados reais (questões, opções, imagens)
 * - ✅ Sistema de fallback inteligente
 * - ✅ A/B Testing com overrides por step
 * - ✅ Analytics automático
 * - ✅ NoCode configurável
 * - ✅ Performance otimizada
 */
export const ScalableQuizRenderer = memo<ScalableQuizRendererProps>(({
    funnelId,
    mode = 'production',
    className,
    onComplete,
    onStepChange,
    debugMode = false
}) => {
    // Estado do quiz flow
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(0); // ❌ REMOVIDO: Default 21 - será dinâmico
    const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [realQuizData, setRealQuizData] = useState<any>(null);
    const [stepData, setStepData] = useState<any>(null);

    // Configuração inicial do funil
    useEffect(() => {
        const initializeFunnel = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 1. Primeiro carregar configuração master do funil via ScalableHybridTemplateService
                const funnelStats = await ScalableHybridTemplateService.getFunnelStats(funnelId);
                let detectedSteps = funnelStats.stepCount || 21;
                
                console.log(`🔍 Configuração master carregada para ${funnelId}:`, funnelStats);

                // 2. Carrega dados reais do quiz via BlockPropertiesAPI (opcional/complementar)
                const blockApi = new BlockPropertiesAPI();
                const realData = await blockApi.getRealTemplateData(funnelId);
                setRealQuizData(realData);

                // 3. Para o quiz21StepsComplete especificamente, garantir 21 steps
                if (funnelId === 'quiz21StepsComplete') {
                    detectedSteps = 21;
                }

                setTotalSteps(Math.max(detectedSteps, 1)); // Garante pelo menos 1 step

                console.log(`✅ ScalableQuizRenderer: Funil ${funnelId} inicializado`, {
                    totalSteps: totalSteps,
                    hasRealData: !!realData
                });

            } catch (error) {
                console.error('❌ Erro ao inicializar funil:', error);
                setError('Erro ao carregar o quiz. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        initializeFunnel();
    }, [funnelId, totalSteps]);

    // Carrega dados do step atual
    useEffect(() => {
        const loadStepData = async () => {
            try {
                // Carrega configuração do step via ScalableHybridTemplateService
                const stepConfig = await ScalableHybridTemplateService.getStepConfig(funnelId, currentStep);

                // Combina com dados reais se disponível
                let combinedData = stepConfig;
                if (realQuizData && realQuizData.steps && realQuizData.steps[currentStep]) {
                    combinedData = {
                        ...stepConfig,
                        ...realQuizData.steps[currentStep]
                    };
                }

                setStepData(combinedData);

            } catch (error) {
                console.error(`❌ Erro ao carregar step ${currentStep}:`, error);
                // Mantém dados anteriores em caso de erro
            }
        };

        if (!isLoading) {
            loadStepData();
        }
    }, [currentStep, funnelId, realQuizData, isLoading]);

    // Notifica mudanças de step
    useEffect(() => {
        if (onStepChange && stepData) {
            const progress = Math.round((currentStep / totalSteps) * 100);
            onStepChange(currentStep, {
                stepData,
                userAnswers,
                progress,
                currentStep,
                totalSteps
            });
        }
    }, [currentStep, stepData, userAnswers, totalSteps, onStepChange]);

    // Handle completion
    useEffect(() => {
        if (currentStep > totalSteps && onComplete) {
            onComplete({
                answers: userAnswers,
                funnelId,
                totalSteps,
                completedAt: new Date().toISOString()
            });
        }
    }, [currentStep, totalSteps, userAnswers, funnelId, onComplete]);

    // Navigation functions
    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        } else if (currentStep === totalSteps) {
            // Finalizar quiz
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Handle quiz data
    const handleStepAnswer = (stepNumber: number, answerData: any) => {
        setUserAnswers(prev => ({
            ...prev,
            [stepNumber]: answerData
        }));
    };    // Cálculos derivados
    const progress = Math.round((currentStep / totalSteps) * 100);
    const isCompleted = currentStep > totalSteps;

    // Loading state
    if (isLoading) {
        return (
            <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A]" />
                    <p className="text-stone-600">
                        Carregando sistema escalável...
                    </p>
                    {debugMode && (
                        <div className="text-xs text-stone-400 text-center">
                            <p>Funil: {funnelId}</p>
                            <p>Modo: {mode}</p>
                            <p>Sistema: HybridTemplateService</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
                <div className="text-center space-y-4">
                    <div className="text-red-500 text-lg">⚠️ Erro no Quiz</div>
                    <p className="text-stone-600 max-w-md">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#B89B7A] text-white rounded-lg hover:bg-[#A08966] transition-colors"
                    >
                        Tentar Novamente
                    </button>
                    {debugMode && (
                        <details className="text-xs text-stone-400 text-left mt-4">
                            <summary>Debug Info</summary>
                            <div className="mt-2 p-2 bg-stone-100 rounded text-left">
                                <p>Funil ID: {funnelId}</p>
                                <p>Step Atual: {currentStep}</p>
                                <p>Total Steps: {totalSteps}</p>
                                <p>Erro: {error}</p>
                            </div>
                        </details>
                    )}
                </div>
            </div>
        );
    }

    // Quiz completed
    if (isCompleted) {
        return (
            <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
                <div className="text-center space-y-6">
                    <div className="text-6xl">🎉</div>
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 mb-2">
                            Quiz Concluído!
                        </h2>
                        <p className="text-stone-600">
                            Obrigado por participar do nosso quiz
                        </p>
                    </div>

                    {debugMode && (
                        <details className="text-xs text-stone-400">
                            <summary>Resultados (Debug)</summary>
                            <div className="mt-4 p-4 bg-stone-50 rounded text-left">
                                <div className="space-y-2">
                                    <p><strong>Funil:</strong> {funnelId}</p>
                                    <p><strong>Total Steps:</strong> {totalSteps}</p>
                                    <p><strong>Sistema:</strong> ScalableHybridTemplateService</p>
                                    <p><strong>Dados Reais:</strong> {realQuizData ? '✅' : '❌'}</p>
                                    <p><strong>Respostas:</strong></p>
                                    <pre className="text-xs overflow-auto max-h-40">
                                        {JSON.stringify(userAnswers, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </details>
                    )}
                </div>
            </div>
        );
    }

    // Main Quiz Interface
    return (
        <div className={cn('w-full max-w-2xl mx-auto', className)}>
            {/* Debug Panel (apenas em modo debug) */}
            {debugMode && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                    <div className="font-semibold text-yellow-800 mb-2">
                        🔧 Debug Mode - Sistema Escalável Ativo
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-yellow-700">
                        <div>Funil: {funnelId}</div>
                        <div>Step: {currentStep}/{totalSteps}</div>
                        <div>Progresso: {progress}%</div>
                        <div>Dados Reais: {realQuizData ? '✅' : '❌'}</div>
                        <div>Step Data: {stepData ? '✅' : '❌'}</div>
                        <div>Sistema: HybridTemplateService</div>
                    </div>

                    {stepData && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-yellow-800 font-medium">
                                Config Atual (JSON)
                            </summary>
                            <pre className="mt-1 p-2 bg-yellow-100 rounded overflow-auto text-yellow-900 max-h-32">
                                {JSON.stringify(stepData, null, 2)}
                            </pre>
                        </details>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
                    <span>Etapa {currentStep} de {totalSteps}</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* 🎯 HYBRID RENDERING - Specializada vs Universal */}
            {stepData && (() => {
                // Detectar se step é especializado usando QuizStepRouter
                const stepType = QuizStepRouter.getStepType(currentStep);
                const isSpecialized = stepType === 'specialized';

                if (isSpecialized) {
                    console.log(`🎯 ScalableQuizRenderer: Renderizando step ${currentStep} como ESPECIALIZADO`);
                    return (
                        <SpecializedStepRenderer
                            stepNumber={currentStep}
                            data={stepData}
                            funnelId={funnelId}
                            onNext={() => {
                                // Salva resposta antes de avançar se houver dados do step
                                if (stepData?.userAnswer) {
                                    handleStepAnswer(currentStep, stepData.userAnswer);
                                }
                                nextStep();
                            }}
                            onBack={prevStep}
                        />
                    );
                } else {
                    console.log(`🎯 ScalableQuizRenderer: Renderizando step ${currentStep} como MODULAR`);
                    return (
                        <UniversalQuizStep
                            funnelId={funnelId}
                            stepNumber={currentStep}
                            data={stepData}
                            onNext={() => {
                                // Salva resposta antes de avançar se houver dados do step
                                if (stepData?.userAnswer) {
                                    handleStepAnswer(currentStep, stepData.userAnswer);
                                }
                                nextStep();
                            }}
                            onBack={prevStep}
                        />
                    );
                }
            })()}            {/* Loading do step */}
            {!stepData && !isLoading && (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B89B7A]" />
                    <p className="ml-3 text-stone-600">Carregando step...</p>
                </div>
            )}

            {/* Navigation Controls */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {/* Previous Button */}
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={cn(
                        'flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg border transition-colors',
                        currentStep === 1
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-stone-200'
                            : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-300 shadow-sm'
                    )}
                >
                    ← Anterior
                </button>

                {/* Next Button */}
                <button
                    onClick={nextStep}
                    className={cn(
                        'flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors',
                        'bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white hover:from-[#A08966] hover:to-[#7A6B4D] shadow-sm'
                    )}
                >
                    {currentStep === totalSteps ? 'Finalizar' : 'Próximo'} →
                </button>
            </div>

            {/* Sistema Info (apenas em modo preview) */}
            {mode === 'preview' && (
                <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-500 text-center">
                    <div className="space-x-4">
                        <span>🚀 Sistema Escalável</span>
                        <span>📊 HybridTemplateService</span>
                        <span>🔧 JSON Configurável</span>
                        {realQuizData && <span>✅ Dados Reais</span>}
                        <span>⚡ Funil: {funnelId}</span>
                    </div>
                </div>
            )}
        </div>
    );
});

// Display name for debugging
ScalableQuizRenderer.displayName = 'ScalableQuizRenderer';

export default ScalableQuizRenderer;