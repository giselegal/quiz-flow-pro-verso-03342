import React, { useMemo, useState } from 'react';
import QuizEstiloWrapper from '@/components/editor/quiz-estilo/QuizEstiloWrapper';
import { CompositeQuestionOption } from './CompositeQuestionStep';

export interface CompositeStrategicQuestionStepProps {
    questionNumber?: string;
    questionText: string;
    options: CompositeQuestionOption[];
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    progressCurrentStep?: number;
    totalSteps?: number;
    editableHint?: boolean;
}

const CompositeStrategicQuestionStep: React.FC<CompositeStrategicQuestionStepProps> = ({
    questionNumber = 'Pergunta Estratégica',
    questionText,
    options,
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#deac6d',
    progressCurrentStep = 15,
    totalSteps = 21,
    editableHint = false,
}) => {
    const [selectedId, setSelectedId] = useState<string>('');

    const progress = useMemo(() => {
        if (!totalSteps) return Math.round((progressCurrentStep / 21) * 100);
        return Math.round((progressCurrentStep / totalSteps) * 100);
    }, [progressCurrentStep, totalSteps]);

    return (
        <QuizEstiloWrapper showHeader={false} showProgress progress={progress} className="py-8">
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto" style={{ backgroundColor }}>
                <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: textColor }}>
                    {questionNumber}
                </h2>

                <p
                    className="text-xl md:text-2xl font-bold mb-8"
                    style={{
                        fontFamily: '"Playfair Display", serif',
                        color: accentColor,
                    }}
                >
                    {questionText}
                </p>

                {editableHint && (
                    <p className="text-xs text-blue-500 mb-4">
                        ✏️ Editável via Painel de Propriedades
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                    {options.map((option) => {
                        const isSelected = selectedId === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => setSelectedId(option.id)}
                                className={`p-4 border-2 rounded-lg transition-all duration-200 ${isSelected
                                        ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg'
                                        : 'border-gray-200 hover:border-[#deac6d] hover:shadow-md'
                                    }`}
                                style={{ color: textColor }}
                            >
                                <p className="font-medium text-sm">
                                    {option.text}
                                </p>
                                {isSelected && (
                                    <div className="mt-2 w-6 h-6 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: accentColor }}>
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button
                    disabled={!selectedId}
                    className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${selectedId
                            ? 'text-white'
                            : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                        }`}
                    style={{ backgroundColor: selectedId ? accentColor : undefined }}
                >
                    {selectedId ? 'Próxima' : 'Selecione uma opção'}
                </button>
            </div>
        </QuizEstiloWrapper>
    );
};

export default CompositeStrategicQuestionStep;
