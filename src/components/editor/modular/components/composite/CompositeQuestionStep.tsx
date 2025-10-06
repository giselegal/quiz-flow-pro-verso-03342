import React, { useMemo, useState } from 'react';
import QuizEstiloWrapper from '@/components/editor/quiz-estilo/QuizEstiloWrapper';

export interface CompositeQuestionOption {
    id: string;
    text: string;
    image?: string;
}

export interface CompositeQuestionStepProps {
    questionNumber?: string;
    questionText: string;
    subtitle?: string;
    options: CompositeQuestionOption[];
    requiredSelections?: number;
    allowMultipleSelection?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    totalSteps?: number;
    editableHint?: boolean;
}

const CompositeQuestionStep: React.FC<CompositeQuestionStepProps> = ({
    questionNumber,
    questionText,
    subtitle,
    options,
    requiredSelections = 1,
    allowMultipleSelection = false,
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#deac6d',
    totalSteps = 21,
    editableHint = false,
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const hasImages = useMemo(() => options.some((option) => Boolean(option.image)), [options]);

    const currentStepIndex = useMemo(() => {
        if (!questionNumber) return 1;
        const digits = questionNumber.match(/\d+/g);
        if (!digits || digits.length === 0) return 1;
        const parsed = Number(digits[0]);
        return Number.isFinite(parsed) ? Math.max(parsed, 1) : 1;
    }, [questionNumber]);

    const progress = useMemo(() => {
        if (!totalSteps) return Math.round((currentStepIndex / 21) * 100);
        return Math.round((currentStepIndex / totalSteps) * 100);
    }, [currentStepIndex, totalSteps]);

    const handleOptionClick = (optionId: string) => {
        setSelectedIds((prev) => {
            const isSelected = prev.includes(optionId);
            if (allowMultipleSelection) {
                if (isSelected) {
                    return prev.filter((id) => id !== optionId);
                }
                if (prev.length >= requiredSelections) {
                    return prev;
                }
                return [...prev, optionId];
            }
            return isSelected ? [] : [optionId];
        });
    };

    const canProceed = allowMultipleSelection
        ? selectedIds.length === (requiredSelections || selectedIds.length)
        : selectedIds.length === 1;

    const selectionText = useMemo(() => {
        if (requiredSelections && requiredSelections > 1) {
            return `Selecione ${requiredSelections} opções (${selectedIds.length}/${requiredSelections})`;
        }
        return `Selecione uma opção (${selectedIds.length}/1)`;
    }, [requiredSelections, selectedIds.length]);

    const gridColumns = hasImages ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1';

    return (
        <QuizEstiloWrapper showHeader={false} showProgress progress={progress} className="py-8">
            <div
                className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-6xl mx-auto"
                style={{ backgroundColor }}
            >
                {questionNumber && (
                    <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: textColor }}>
                        {questionNumber}
                    </h2>
                )}

                <p
                    className="text-xl md:text-2xl font-bold mb-4"
                    style={{
                        fontFamily: '"Playfair Display", serif',
                        color: accentColor,
                    }}
                >
                    {questionText}
                </p>

                <p className="text-sm text-gray-600 mb-8">
                    {subtitle || selectionText}
                    {subtitle && (
                        <span className="block text-xs text-gray-500 mt-1">{selectionText}</span>
                    )}
                    {editableHint && (
                        <span className="block text-blue-500 mt-1 text-xs">
                            ✏️ Editável via Painel de Propriedades
                        </span>
                    )}
                </p>

                <div className={`grid ${gridColumns} gap-6 mb-8 max-w-4xl mx-auto`}>
                    {options.map((option) => {
                        const isSelected = selectedIds.includes(option.id);
                        return (
                            <div
                                key={option.id}
                                onClick={() => handleOptionClick(option.id)}
                                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                                    ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg transform -translate-y-1'
                                    : 'border-gray-200 hover:border-[#deac6d] hover:shadow-md'
                                    }`}
                            >
                                {option.image && (
                                    <img
                                        src={option.image}
                                        alt={option.text}
                                        className="rounded-md w-full mb-2 object-cover max-h-48"
                                    />
                                )}
                                <p className="text-center font-medium text-sm leading-relaxed" style={{ color: textColor }}>
                                    {option.text}
                                </p>
                                {isSelected && (
                                    <div className="mt-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    disabled={!canProceed}
                    className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${canProceed
                        ? 'bg-[#deac6d] text-white animate-pulse'
                        : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                        }`}
                    style={canProceed ? { backgroundColor: accentColor } : undefined}
                >
                    {canProceed ? 'Avançando...' : 'Próxima'}
                </button>
            </div>
        </QuizEstiloWrapper>
    );
};

export default CompositeQuestionStep;
