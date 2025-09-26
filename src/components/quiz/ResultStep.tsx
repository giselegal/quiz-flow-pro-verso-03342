import { useEffect, useState } from 'react';
import { styleConfigGisele } from '../../data/styles';
import type { QuizStep } from '../../data/quizSteps';
import type { QuizScores } from '../../hooks/useQuizState';
import { CheckCircle, ShoppingCart, ArrowDown, Lock, Star, Shield, Clock } from 'lucide-react';

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
 * 🏆 PÁGINA UNIFICADA DE RESULTADO + OFERTA
 * 
 * Combina o resultado do quiz com a página de vendas numa experiência única
 */
export default function ResultStep({
    data,
    userProfile,
    scores
}: ResultStepProps) {
    // Estados para interatividade
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    // Verificação de segurança para o estilo
    let styleConfig = styleConfigGisele[userProfile.resultStyle];

    // Se não encontrar o estilo, usar o primeiro disponível como fallback
    if (!styleConfig) {
        console.warn(`⚠️ Estilo "${userProfile.resultStyle}" não encontrado, usando fallback`);
        const firstStyle = Object.keys(styleConfigGisele)[0];
        styleConfig = styleConfigGisele[firstStyle];
    }

    // Scroll para o topo quando carregar
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!styleConfig) {
        return (
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                <div className="text-red-500 text-xl">
                    ❌ Erro: Nenhum estilo disponível. Reinicie o quiz.
                </div>
            </div>
        );
    }
                </div >
            </div >
        );
}

const secondaryStyleNames = userProfile.secondaryStyles
    .map(styleId => styleConfigGisele[styleId]?.name)
    .filter(Boolean)
    .join(' e ');

// Processar estilos com porcentagens para as barras de progresso
const processStylesWithPercentages = () => {
    if (!scores) return [];

    // Converter QuizScores para array de entradas (usando chaves sem acento do QuizScores)
    const scoresEntries = [
        ['natural', scores.natural],
        ['classico', scores.classico], // sem acento no QuizScores
        ['contemporaneo', scores.contemporaneo], // sem acento no QuizScores  
        ['elegante', scores.elegante],
        ['romantico', scores.romantico], // sem acento no QuizScores
        ['sexy', scores.sexy],
        ['dramatico', scores.dramatico], // sem acento no QuizScores
        ['criativo', scores.criativo]
    ] as [string, number][];

    // Calcular total de pontos
    const totalPoints = scoresEntries.reduce((sum, [, score]) => sum + score, 0);
    if (totalPoints === 0) return [];

    // Mapeamento de chave sem acento para com acento (para acessar styleConfigGisele)
    const keyMapping: Record<string, string> = {
        'classico': 'clássico',
        'contemporaneo': 'contemporâneo',
        'romantico': 'romântico',
        'dramatico': 'dramático'
    };

    // Ordenar estilos por pontuação e calcular porcentagens
    return scoresEntries
        .map(([styleKey, score]) => {
            const displayKey = keyMapping[styleKey] || styleKey; // usar chave com acento para display
            return {
                key: styleKey,
                displayKey: displayKey,
                name: styleConfigGisele[displayKey]?.name || displayKey,
                score,
                percentage: ((score / totalPoints) * 100)
            };
        })
        .filter(style => style.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Mostrar apenas os top 5
};

const stylesWithPercentages = processStylesWithPercentages();

return (
    <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-5xl mx-auto">
        {/* Celebração */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>

        {/* Título Principal */}
        <h1 className="text-3xl md:text-4xl font-bold playfair-display mb-2 text-[#deac6d]">
            {data.title?.replace('{userName}', userProfile.userName)}
        </h1>

        {/* Nome do Estilo */}
        <p className="text-2xl md:text-3xl font-bold text-[#5b4135] playfair-display mb-6">
            {styleConfig.name}
        </p>

        {/* Badge da Categoria */}
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#deac6d]/20 to-[#c49548]/20 rounded-full mb-8">
            <span className="text-[#5b4135] font-semibold">{styleConfig.category}</span>
        </div>

        {/* Layout de Duas Colunas */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
            {/* Imagem do Estilo */}
            <div className="order-2 md:order-1">
                <img
                    src={styleConfig.image}
                    alt={styleConfig.name}
                    className="rounded-xl shadow-xl w-full max-w-md mx-auto object-cover"
                />
            </div>

            {/* Descrição e Detalhes */}
            <div className="order-1 md:order-2 text-left">
                <h3 className="text-xl font-bold text-[#5b4135] mb-4">Seu Perfil de Estilo:</h3>
                <p className="text-base md:text-lg mb-6 text-gray-800 leading-relaxed">
                    {styleConfig.description}
                </p>

                {/* Estilos com Barras de Progresso */}
                {stylesWithPercentages.length > 0 && (
                    <div className="mb-6 p-4 bg-[#deac6d]/10 rounded-lg border border-[#deac6d]/20">
                        <h4 className="font-semibold text-[#5b4135] mb-4">Seu Perfil de Estilos:</h4>
                        <div className="space-y-3">
                            {stylesWithPercentages.map((style, index) => (
                                <div key={style.key} className="relative">
                                    <div className="flex justify-between items-center mb-1">
                                        <span
                                            className={`text-sm font-medium ${index === 0
                                                ? 'text-[#5b4135]'
                                                : 'text-gray-600'
                                                }`}
                                        >
                                            {index === 0 && '👑 '}{style.name}
                                        </span>
                                        <span className="text-sm text-[#deac6d] font-medium">
                                            {style.percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0
                                                ? 'bg-gradient-to-r from-[#deac6d] to-[#c19952]'
                                                : index === 1
                                                    ? 'bg-gradient-to-r from-[#deac6d]/80 to-[#c19952]/80'
                                                    : 'bg-gradient-to-r from-[#deac6d]/60 to-[#c19952]/60'
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

                {/* Fallback para estilos secundários caso não haja scores */}
                {stylesWithPercentages.length === 0 && secondaryStyleNames && (
                    <div className="mb-6 p-4 bg-[#deac6d]/10 rounded-lg border border-[#deac6d]/20">
                        <h4 className="font-semibold text-[#5b4135] mb-2">Estilos Complementares:</h4>
                        <p className="text-sm text-gray-700">
                            Você também tem influências de: <span className="font-medium text-[#deac6d]">{secondaryStyleNames}</span>
                        </p>
                    </div>
                )}

                {/* Keywords */}
                <div className="mb-6">
                    <h4 className="font-semibold text-[#5b4135] mb-3">Palavras que te definem:</h4>
                    <div className="flex flex-wrap gap-2">
                        {(styleConfig.keywords || []).map((keyword: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-[#deac6d] text-white text-sm rounded-full font-medium"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Dicas Especiais */}
        <div className="bg-gradient-to-r from-[#deac6d]/5 to-[#c49548]/5 border-l-4 border-[#deac6d] p-6 rounded-lg text-left">
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#deac6d] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✨</span>
                </div>
                <h3 className="font-bold text-lg text-[#deac6d]">Dicas Especiais para o seu estilo:</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {(styleConfig.specialTips || []).map((tip: string, index: number) => (
                    <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-[#deac6d]/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-[#deac6d] text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-[#deac6d]/10 rounded-full">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#deac6d] border-t-transparent mr-2"></div>
                <span className="text-[#deac6d] font-medium text-sm">Preparando sua oferta personalizada...</span>
            </div>
        </div>
    </div>
);
}