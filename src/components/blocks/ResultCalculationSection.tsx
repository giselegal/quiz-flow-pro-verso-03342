import React, { useEffect, useState } from 'react';
import { QuizData } from '../types';

interface ResultCalculationSectionProps {
    props: {
        calculationMethod: 'weighted_sum' | 'percentage' | 'ranking';
        scoreMapping: Record<string, {
            min: number;
            max: number;
            label: string;
        }>;
        resultLogic: {
            winnerSelection: 'highest_score' | 'threshold_based';
            tieBreaker: 'secondary_scores' | 'random' | 'first_encountered';
            minThreshold: number;
        };
        leadCapture?: {
            id: string;
            type: string;
            properties: {
                fields: string[];
                submitText: string;
            };
        };
    };
    quizData?: QuizData;
    onResultCalculated?: (result: CalculatedResult) => void;
}

interface CalculatedResult {
    primaryStyle: {
        name: string;
        score: number;
        percentage: number;
    };
    secondaryStyles: Array<{
        name: string;
        score: number;
        percentage: number;
    }>;
    allScores: Record<string, number>;
    metadata: {
        totalAnswers: number;
        calculationMethod: string;
        timestamp: string;
    };
}

export const ResultCalculationSection: React.FC<ResultCalculationSectionProps> = ({
    props,
    quizData,
    onResultCalculated
}) => {
    const [calculated, setCalculated] = useState<CalculatedResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        if (quizData?.answers && Object.keys(quizData.answers).length > 0) {
            calculateResults();
        }
    }, [quizData?.answers]);

    const calculateResults = async () => {
        if (!quizData?.answers) return;

        setIsCalculating(true);

        try {
            console.log('🧮 Calculando resultados do quiz...', {
                totalAnswers: Object.keys(quizData.answers).length,
                method: props.calculationMethod
            });

            // Calcular pontuações por estilo
            const styleScores: Record<string, number> = {};

            // Inicializar todos os estilos com 0
            Object.keys(props.scoreMapping).forEach(style => {
                styleScores[style] = 0;
            });

            // Processar cada resposta
            let totalAnswers = 0;
            Object.entries(quizData.answers).forEach(([stepId, answer]) => {
                if (answer && typeof answer === 'object' && 'selectedOptions' in answer) {
                    const selectedOptions = answer.selectedOptions as string[];

                    selectedOptions.forEach(optionId => {
                        // Mapear opção para estilo (baseado no padrão dos IDs)
                        const styleFromOption = extractStyleFromOption(optionId);
                        if (styleFromOption && styleScores.hasOwnProperty(styleFromOption)) {
                            styleScores[styleFromOption] += 1;
                            totalAnswers++;
                        }
                    });
                }
            });

            console.log('📊 Pontuações calculadas:', styleScores);

            // Calcular percentuais
            const totalPoints = Math.max(totalAnswers, 1); // Evitar divisão por zero
            const stylesWithPercentages = Object.entries(styleScores).map(([style, score]) => ({
                name: props.scoreMapping[style]?.label || style,
                score,
                percentage: Math.round((score / totalPoints) * 100)
            }));

            // Ordenar por pontuação (maior primeiro)
            stylesWithPercentages.sort((a, b) => b.score - a.score);

            // Estilo principal (maior pontuação)
            const primaryStyle = stylesWithPercentages[0];

            // Estilos secundários (resto da lista)
            const secondaryStyles = stylesWithPercentages.slice(1);

            const result: CalculatedResult = {
                primaryStyle,
                secondaryStyles,
                allScores: styleScores,
                metadata: {
                    totalAnswers,
                    calculationMethod: props.calculationMethod,
                    timestamp: new Date().toISOString()
                }
            };

            console.log('🎯 Resultado final calculado:', result);

            setCalculated(result);

            // Notificar componente pai
            if (onResultCalculated) {
                onResultCalculated(result);
            }

            // Salvar no localStorage para persistência
            localStorage.setItem('quiz-calculated-result', JSON.stringify(result));

        } catch (error) {
            console.error('❌ Erro no cálculo:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    const extractStyleFromOption = (optionId: string): string | null => {
        // Extrair estilo do ID da opção (ex: "romantico_1" -> "romantico")
        const patterns = [
            /^(romantico|classico|moderno|criativo|dramatico)/i,
            /_?(romantico|classico|moderno|criativo|dramatico)/i
        ];

        for (const pattern of patterns) {
            const match = optionId.match(pattern);
            if (match) {
                return match[1].toLowerCase();
            }
        }

        // Fallback: tentar mapear por palavras-chave
        const styleMappings: Record<string, string> = {
            'romantic': 'romantico',
            'classic': 'classico',
            'modern': 'moderno',
            'creative': 'criativo',
            'dramatic': 'dramatico'
        };

        for (const [key, style] of Object.entries(styleMappings)) {
            if (optionId.toLowerCase().includes(key)) {
                return style;
            }
        }

        console.warn(`⚠️ Não foi possível extrair estilo de: ${optionId}`);
        return null;
    };

    if (isCalculating) {
        return (
            <div className="result-calculation-loading">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <span className="ml-3 text-amber-800">Calculando seu resultado...</span>
                </div>
            </div>
        );
    }

    if (!calculated) {
        return (
            <div className="result-calculation-empty">
                <div className="text-center py-8 text-gray-500">
                    <p>🧮 Aguardando dados do quiz para calcular resultado...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="result-calculation-section">
            {/* Seção de debug (visível apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">🔍 Debug - Cálculo de Resultados</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Método:</strong> {calculated.metadata.calculationMethod}</p>
                        <p><strong>Total de respostas:</strong> {calculated.metadata.totalAnswers}</p>
                        <p><strong>Estilo vencedor:</strong> {calculated.primaryStyle.name} ({calculated.primaryStyle.percentage}%)</p>
                        <p><strong>Calculado em:</strong> {new Date(calculated.metadata.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            )}

            {/* Resultado principal (invisível, mas dados disponíveis para outras seções) */}
            <div className="result-data" style={{ display: 'none' }}>
                <script
                    type="application/json"
                    data-quiz-result={JSON.stringify(calculated)}
                />
            </div>

            {/* Componente de lead capture (se configurado) */}
            {props.leadCapture && (
                <div className="lead-capture-integrated mt-8">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
                            🎉 Seu resultado está pronto!
                        </h3>
                        <p className="text-center text-gray-600 mb-6">
                            Deixe seus dados para receber seu guia personalizado:
                        </p>

                        <form className="space-y-4">
                            {props.leadCapture.properties.fields.includes('name') && (
                                <input
                                    type="text"
                                    placeholder="Seu nome"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    required
                                />
                            )}

                            {props.leadCapture.properties.fields.includes('email') && (
                                <input
                                    type="email"
                                    placeholder="Seu melhor e-mail"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    required
                                />
                            )}

                            {props.leadCapture.properties.fields.includes('phone') && (
                                <input
                                    type="tel"
                                    placeholder="Seu WhatsApp"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105"
                            >
                                {props.leadCapture.properties.submitText}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Disponibilizar dados globalmente para outras seções */}
            <script dangerouslySetInnerHTML={{
                __html: `
          window.quizCalculatedResult = ${JSON.stringify(calculated)};
          window.dispatchEvent(new CustomEvent('quizResultCalculated', { 
            detail: ${JSON.stringify(calculated)} 
          }));
        `
            }} />
        </div>
    );
};

export default ResultCalculationSection;