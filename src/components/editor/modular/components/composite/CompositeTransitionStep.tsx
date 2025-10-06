import React from 'react';
import QuizEstiloWrapper from '@/components/editor/quiz-estilo/QuizEstiloWrapper';

export interface CompositeTransitionStepProps {
    title: string;
    subtitle?: string;
    text?: string;
    image?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    showAnimation?: boolean;
    editableHint?: boolean;
}

const CompositeTransitionStep: React.FC<CompositeTransitionStepProps> = ({
    title,
    subtitle = 'Analisando suas respostas',
    text,
    image,
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    showAnimation = true,
    editableHint = false,
}) => {
    return (
        <QuizEstiloWrapper showHeader={false} showProgress={false} className="py-8">
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-2xl mx-auto" style={{ backgroundColor }}>
                <h1
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{
                        fontFamily: '"Playfair Display", serif',
                        color: textColor,
                    }}
                >
                    {title}
                </h1>

                {image && (
                    <div className="w-full max-w-sm mx-auto mb-6">
                        <img
                            src={image}
                            alt="Transição"
                            className="w-full h-auto rounded-lg shadow-sm"
                        />
                    </div>
                )}

                {subtitle && (
                    <h2 className="text-lg font-semibold mb-4" style={{ color: accentColor }}>
                        {subtitle}
                    </h2>
                )}

                {text && (
                    <p className="text-gray-600 mb-8 leading-relaxed" style={{ color: '#4b5563' }}>
                        {text}
                    </p>
                )}

                {showAnimation && (
                    <div className="flex justify-center items-center space-x-2 mb-6">
                        <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: accentColor }}></div>
                        <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0.2s' }}></div>
                    </div>
                )}

                {editableHint && (
                    <p className="text-xs text-blue-500">
                        ✏️ Editável via Painel de Propriedades
                    </p>
                )}
            </div>
        </QuizEstiloWrapper>
    );
};

export default CompositeTransitionStep;
