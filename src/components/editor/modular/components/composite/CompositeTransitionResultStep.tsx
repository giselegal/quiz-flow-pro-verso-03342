import React from 'react';
import QuizEstiloWrapper from '@/components/editor/quiz-estilo/QuizEstiloWrapper';

export interface CompositeTransitionResultStepProps {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    showAnimation?: boolean;
    editableHint?: boolean;
}

const CompositeTransitionResultStep: React.FC<CompositeTransitionResultStepProps> = ({
    title,
    subtitle = 'Estamos combinando suas respostas com nossos modelos exclusivos.',
    description = 'Em poucos segundos você vai descobrir seu estilo predominante e receber recomendações personalizadas.',
    backgroundColor,
    textColor = '#432818',
    accentColor = '#B89B7A',
    showAnimation = true,
    editableHint = false,
}) => {
    return (
        <QuizEstiloWrapper showHeader={false} showProgress={false} className="py-10">
            <section
                className="py-16 px-4"
                style={{
                    background: backgroundColor || `linear-gradient(120deg, ${accentColor}15 0%, #f8fafc 100%)`,
                }}
            >
                <div className="max-w-3xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl" style={{ color: textColor }}>
                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="text-lg font-semibold mb-4" style={{ color: accentColor }}>
                            {subtitle}
                        </p>
                    )}

                    {description && (
                        <p className="text-base leading-relaxed mb-8" style={{ color: '#4b5563' }}>
                            {description}
                        </p>
                    )}

                    {showAnimation && (
                        <div className="flex justify-center items-center space-x-2">
                            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: accentColor }}></div>
                            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0.2s' }}></div>
                        </div>
                    )}

                    {editableHint && (
                        <p className="text-xs text-blue-500 mt-6">
                            ✏️ Editável via Painel de Propriedades
                        </p>
                    )}
                </div>
            </section>
        </QuizEstiloWrapper>
    );
};

export default CompositeTransitionResultStep;
