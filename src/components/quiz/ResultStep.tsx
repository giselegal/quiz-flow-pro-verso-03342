import { useEffect } from 'react';
import { styleConfigGisele } from '@/data/styles';
import type { QuizStep } from '@/data/quizSteps';

interface ResultStepProps {
    data: QuizStep;
    userProfile: {
        userName: string;
        resultStyle: string;
        secondaryStyles: string[];
    };
    onContinue: () => void;
}

/**
 * 🏆 COMPONENTE DE RESULTADO DO QUIZ
 * 
 * Exibe o resultado personalizado do quiz de estilo pessoal (etapa 20)
 * com descrição do estilo, imagem e dicas especializadas.
 */
export default function ResultStep({
    data,
    userProfile,
    onContinue
}: ResultStepProps) {
    const styleConfig = styleConfigGisele[userProfile.resultStyle];

    useEffect(() => {
        const timer = setTimeout(() => {
            onContinue();
        }, 8000); // Mais tempo para ler o resultado
        return () => clearTimeout(timer);
    }, [onContinue]);

    if (!styleConfig) {
        return (
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                <div className="text-red-500 text-xl">
                    ❌ Erro: Estilo "{userProfile.resultStyle}" não encontrado.
                </div>
            </div>
        );
    }

    const secondaryStyleNames = userProfile.secondaryStyles
        .map(styleId => styleConfigGisele[styleId]?.name)
        .filter(Boolean)
        .join(' e ');

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

                    {/* Estilos Secundários */}
                    {secondaryStyleNames && (
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
                            {styleConfig.keywords.map((keyword, index) => (
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
                    {styleConfig.specialTips.map((tip, index) => (
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