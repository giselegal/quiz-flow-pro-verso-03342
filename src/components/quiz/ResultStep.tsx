import { useEffect, useState, useMemo } from 'react';
import { styleConfigGisele } from '../../data/styles';
import { resolveStyleId } from '@/utils/styleIds';
import type { QuizStep } from '../../data/quizSteps';
import type { QuizScores } from '../../hooks/useQuizState';
import { useImageWithFallback } from '../../hooks/useImageWithFallback';
import { RESULT_STEP_SCHEMA } from '@/data/stepBlockSchemas';
import { Block } from '@/types/editor';

interface ResultStepProps {
    data: QuizStep;
    userProfile: {
        userName: string;
        resultStyle: string;
        secondaryStyles: string[];
    };
    scores?: QuizScores;
}

/**
 * 🏆 PÁGINA UNIFICADA DE RESULTADO + OFERTA - MODULAR
 * 
 * Usa sistema de blocos para renderização modular
 */
export default function ResultStep({
    data,
    userProfile,
    scores
}: ResultStepProps) {
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    // Verificação de segurança para o estilo
    let styleConfig = styleConfigGisele[userProfile.resultStyle];

    if (!styleConfig) {
        console.warn(`⚠️ Estilo "${userProfile.resultStyle}" não encontrado, usando fallback`);
        const firstStyle = Object.keys(styleConfigGisele)[0];
        styleConfig = styleConfigGisele[firstStyle];
    }

    // Hooks para imagens com fallback
    const styleImage = useImageWithFallback(styleConfig?.imageUrl, {
        width: 400,
        height: 300,
        fallbackText: styleConfig?.name || 'Estilo',
        fallbackBgColor: '#f8f9fa',
        fallbackTextColor: '#6b7280'
    });

    const guideImage = useImageWithFallback(styleConfig?.guideImageUrl, {
        width: 600,
        height: 400,
        fallbackText: `Guia ${styleConfig?.name || 'Estilo'}`,
        fallbackBgColor: '#f1f5f9',
        fallbackTextColor: '#64748b'
    });

    // Preparar blocos do schema com dados dinâmicos
    const blocks: Block[] = useMemo(() => {
        return RESULT_STEP_SCHEMA.blocks.map((schemaBlock, index) => ({
            id: `result-${data.id || 'unknown'}-${schemaBlock.id}`,
            type: schemaBlock.type as any,
            order: index,
            content: {},
            properties: {
                ...schemaBlock.props,
                text: schemaBlock.props.text
                    ?.replace('{{userName}}', userProfile.userName)
                    ?.replace('{{styleName}}', styleConfig?.name || '')
                    ?.replace('{{styleDescription}}', styleConfig?.description || '')
                    ?.replace('{{styleImage}}', styleImage.src || ''),
                src: schemaBlock.props.src?.replace('{{styleImage}}', styleImage.src || '')
            }
        }));
    }, [data, userProfile, styleConfig, styleImage]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!styleConfig) {
        const firstKey = Object.keys(styleConfigGisele)[0];
        styleConfig = styleConfigGisele[firstKey];
    }

    // Processar estilos com porcentagens
    const processStylesWithPercentages = () => {
        if (!scores) return [];

        const scoresEntries = [
            ['natural', scores.natural],
            ['classico', scores.classico],
            ['contemporaneo', scores.contemporaneo],
            ['elegante', scores.elegante],
            ['romantico', scores.romantico],
            ['sexy', scores.sexy],
            ['dramatico', scores.dramatico],
            ['criativo', scores.criativo]
        ] as [string, number][];

        const totalPoints = scoresEntries.reduce((sum, [, score]) => sum + score, 0);
        if (totalPoints === 0) return [];

        return scoresEntries
            .map(([styleKey, score], originalIndex) => {
                const displayKey = resolveStyleId(styleKey);
                return {
                    key: styleKey,
                    displayKey: displayKey,
                    name: styleConfigGisele[displayKey]?.name || displayKey,
                    score,
                    percentage: ((score / totalPoints) * 100),
                    originalIndex
                };
            })
            .filter(style => style.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return a.originalIndex - b.originalIndex;
            })
            .slice(0, 3);
    };

    const stylesWithPercentages = processStylesWithPercentages();

    const secondaryStyleNames = userProfile.secondaryStyles
        .map(styleId => styleConfigGisele[styleId]?.name)
        .filter(Boolean)
        .join(' e ');

    const handleCTAClick = () => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'checkout_initiated', {
                'event_category': 'ecommerce',
                'event_label': `CTA_Click_${userProfile.resultStyle}`,
                'value': 497.00
            });
        }

        window.open('https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912', '_blank');
    };

    const offerFeatures = [
        { icon: '✅', label: '31 Aulas Online (Acesso Imediato)', value: 'R$ 297,00' },
        { icon: '✅', label: 'Bônus: Guia de Visagismo Facial (PDF)', value: 'R$ 67,00' },
        { icon: '✅', label: 'Bônus: Peças-Chave + Inventário', value: 'R$ 83,00' }
    ];

    const offerPricing = {
        current: 97,
        original: 447,
        installments: { quantity: 8, value: 14.11 },
        discount: 78
    };

    const testimonials = [
        {
            name: "Maria Silva",
            role: "Advogada",
            quote: "Finalmente descobri como me vestir com elegância e profissionalismo. Meu guarda-roupa nunca fez tanto sentido!",
            rating: 5
        },
        {
            name: "Ana Costa",
            role: "Empresária",
            quote: "O guia me ajudou a encontrar meu estilo pessoal. Agora me sinto confiante em qualquer ocasião.",
            rating: 5
        },
        {
            name: "Julia Santos",
            role: "Designer",
            quote: "Economizei muito dinheiro parando de comprar peças que não combinam comigo. Recomendo!",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-[#fffaf7] relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#B89B7A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#a08966]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-3 sm:px-5 py-6 md:py-8 max-w-5xl relative z-10">

                {/* ====================== SEÇÃO 1: RESULTADO DO QUIZ ====================== */}
                <div className="bg-white p-5 sm:p-6 md:p-12 rounded-lg shadow-lg text-center mb-10 md:mb-12">
                    {/* Celebração */}
                    <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🎉</div>

                    {/* Saudação Personalizada */}
                    <p className="text-lg sm:text-xl text-gray-700 mb-2">
                        Olá, <span className="font-semibold text-[#B89B7A]">{userProfile.userName}</span>!
                    </p>

                    {/* Título com Hierarquia Clara */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#432818] mb-3">
                        Seu Estilo Predominante é:
                    </h1>

                    {/* Nome do Estilo */}
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#B89B7A] playfair-display mb-6 md:mb-8">
                        {styleConfig.name}
                    </p>

                    <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-start md:items-center">
                        {/* Coluna da Imagem */}
                        <div className="order-2 md:order-1">
                            <div className="max-w-sm mx-auto relative">
                                {styleImage.isLoading ? (
                                    <div className="w-full h-auto rounded-lg shadow-md bg-gray-100 animate-pulse flex items-center justify-center min-h-[260px] sm:min-h-[300px] md:min-h-[300px]">
                                        <span className="text-gray-500">Carregando...</span>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[4/5] overflow-hidden rounded-lg shadow-md">
                                        <img
                                            src={styleImage.src}
                                            alt={`Estilo ${styleConfig.name}`}
                                            className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${styleImage.isFallback ? 'border-2 border-dashed border-gray-300' : ''}`}
                                            loading="eager"
                                        />
                                    </div>
                                )}
                                {/* Cantos decorativos */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
                                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
                            </div>
                        </div>

                        {/* Coluna do Texto */}
                        <div className="order-1 md:order-2 text-left">
                            {/* Parágrafo Introdutório Emocional */}
                            <div className="mb-5 p-4 bg-gradient-to-br from-[#B89B7A]/5 to-[#a08966]/5 rounded-lg border-l-4 border-[#B89B7A]">
                                <p className="text-sm sm:text-base text-gray-800 leading-relaxed italic">
                                    Esse é o estilo que mais traduz a sua essência.
                                    Ele revela muito sobre como você se conecta com o mundo
                                    e a forma como expressa sua energia.
                                </p>
                            </div>

                            {/* Description do styleConfig */}
                            <p className="text-sm sm:text-base md:text-lg mb-5 md:mb-6 text-gray-800 leading-relaxed tracking-normal">
                                {styleConfig.description}
                            </p>

                            {/* Transição para Estilos Complementares */}
                            <div className="mb-4 text-center">
                                <p className="text-base sm:text-lg font-semibold text-[#432818]">
                                    Mas lembre-se: você não é só um estilo.
                                </p>
                            </div>

                            {/* Barras de Progresso ou Estilos Complementares */}
                            {stylesWithPercentages.length > 0 && (
                                <div className="mb-6 p-4 bg-[#B89B7A]/10 rounded-lg border border-[#B89B7A]/20">
                                    <h4 className="font-semibold text-[#432818] mb-2 text-sm sm:text-base">
                                        Além do <span className="text-[#B89B7A]">{stylesWithPercentages[0].name}</span>, você também tem traços de:
                                    </h4>
                                    <div className="space-y-2 sm:space-y-3">
                                        {stylesWithPercentages.map((style, index) => (
                                            <div key={style.key} className="relative">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span
                                                        className={`text-xs sm:text-sm font-medium ${index === 0 ? 'text-[#432818]' : 'text-gray-600'}`}
                                                    >
                                                        {index === 0 && '👑 '}{style.name}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-[#B89B7A] font-medium">
                                                        {style.percentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0
                                                            ? 'bg-gradient-to-r from-[#B89B7A] to-[#a08966]'
                                                            : index === 1
                                                                ? 'bg-gradient-to-r from-[#B89B7A]/80 to-[#a08966]/80'
                                                                : 'bg-gradient-to-r from-[#B89B7A]/60 to-[#a08966]/60'
                                                            }`}
                                                        style={{
                                                            width: `${style.percentage}%`,
                                                            animationDelay: `${index * 0.2}s`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Keywords */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-[#432818] mb-2 sm:mb-3">Palavras que te definem:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(styleConfig.keywords || []).map((keyword: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-[#B89B7A] text-white text-sm rounded-full font-medium"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="mb-8 text-center">
                                <button
                                    onClick={handleCTAClick}
                                    onMouseEnter={() => setIsButtonHovered(true)}
                                    onMouseLeave={() => setIsButtonHovered(false)}
                                    className="w-full bg-[#65c83a] hover:bg-[#5ab532] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl text-lg uppercase tracking-wide"
                                >
                                    Ver Oferta Exclusiva
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
