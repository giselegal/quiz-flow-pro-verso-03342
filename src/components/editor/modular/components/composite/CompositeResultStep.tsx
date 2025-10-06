import React from 'react';
import QuizEstiloWrapper from '@/components/editor/quiz-estilo/QuizEstiloWrapper';

export interface CompositeResultStepProps {
    title: string;
    subtitle?: string;
    userName?: string;
    resultStyle?: string;
    description?: string;
    image?: string;
    characteristics?: string[];
    ctaText?: string;
    resultPlaceholder?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    accentColorSecondary?: string;
    showEditableHint?: boolean;
}

const CompositeResultStep: React.FC<CompositeResultStepProps> = ({
    title,
    subtitle,
    userName = 'João',
    resultStyle = 'Clássico Elegante',
    description = 'Parabéns! Você descobriu seu estilo único.',
    image,
    characteristics = ['Elegante e refinado', 'Atemporal e sofisticado', 'Valoriza qualidade'],
    ctaText = 'Descobrir Minha Consultoria Personalizada',
    resultPlaceholder,
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    accentColorSecondary = '#A1835D',
    showEditableHint = false,
}) => {
    const headline = `Parabéns, ${userName}!`;
    const sectionTitle = title.replace('{userName}', userName).replace('{resultStyle}', resultStyle);
    const subtitleText = subtitle?.replace('{userName}', userName).replace('{resultStyle}', resultStyle);
    const resultText = (resultStyle || resultPlaceholder || '').replace('{userName}', userName);
    const descriptionText = description?.replace('{userName}', userName).replace('{resultStyle}', resultStyle);

    return (
        <QuizEstiloWrapper showHeader={false} showProgress={false}>
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto" style={{ backgroundColor }}>
                <h1
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{ fontFamily: '"Playfair Display", serif', color: textColor }}
                >
                    {headline}
                </h1>

                <h2 className="text-lg text-gray-600 mb-6">
                    {sectionTitle}
                </h2>

                {subtitleText && (
                    <p className="text-sm text-gray-500 mb-4">
                        {subtitleText}
                    </p>
                )}

                <div
                    className="bg-gradient-to-br from-[#B89B7A] to-[#A1835D] text-white p-6 rounded-lg shadow-lg mb-8"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColorSecondary})`,
                    }}
                >
                    <h3
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                        {resultText || resultPlaceholder}
                    </h3>
                </div>

                {image && (
                    <div className="w-full max-w-sm mx-auto mb-6">
                        <img
                            src={image}
                            alt={`Estilo ${resultText}`}
                            className="w-full h-auto rounded-lg shadow-sm"
                        />
                    </div>
                )}

                {descriptionText && (
                    <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                        {descriptionText}
                    </p>
                )}

                {characteristics.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <h4 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
                            Suas principais características:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {characteristics.map((characteristic, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-3 rounded-md shadow-sm border-l-4"
                                    style={{ borderColor: accentColor }}
                                >
                                    <p className="text-sm font-medium" style={{ color: textColor }}>
                                        {characteristic}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    className="bg-[#B89B7A] hover:bg-[#A1835D] text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: accentColor }}
                >
                    {ctaText}
                </button>

                {showEditableHint && (
                    <p className="text-xs text-blue-500 mt-4">
                        ✏️ Editável via Painel de Propriedades
                    </p>
                )}
            </div>
        </QuizEstiloWrapper>
    );
};

export default CompositeResultStep;
