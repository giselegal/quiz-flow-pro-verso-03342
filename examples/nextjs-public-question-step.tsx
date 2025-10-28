// 🎯 EXEMPLO PRÁTICO: QuestionStep - Versão Pública (SSR-Safe)
// Localização: components/quiz/steps/QuestionStep.tsx
'use client';

import React, { useMemo } from 'react';
import { validateAnswer } from '@/lib/quiz/validation';
import { computeProgress } from '@/lib/quiz/navigation';

// ✅ Props minimalistas (apenas o necessário para quiz público)
interface QuestionStepProps {
    // Dados do step
    data: {
        id: string;
        questionNumber: string;
        questionText: string;
        instructions?: string;
        options: Array<{
            id: string;
            text: string;
            image?: string;
            value?: string;
        }>;
        requiredSelections: number;
    };

    // Estado da aplicação
    currentAnswers: string[];
    totalSteps: number;
    currentStepNumber: number;

    // Callbacks simples
    onAnswersChange: (answers: string[]) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function QuestionStep({
    data,
    currentAnswers,
    totalSteps,
    currentStepNumber,
    onAnswersChange,
    onNext,
    onPrev,
}: QuestionStepProps) {
    // ✅ Lógica pura (sem editor, sem DnD)
    const progress = useMemo(
        () => computeProgress(currentStepNumber, totalSteps),
        [currentStepNumber, totalSteps]
    );

    const isValid = useMemo(
        () => validateAnswer(currentAnswers, data.requiredSelections),
        [currentAnswers, data.requiredSelections]
    );

    const handleOptionClick = (optionId: string) => {
        const isSelected = currentAnswers.includes(optionId);
        const maxSelections = data.requiredSelections;

        if (isSelected) {
            // Desselecionar
            onAnswersChange(currentAnswers.filter(id => id !== optionId));
        } else if (currentAnswers.length < maxSelections) {
            // Adicionar seleção
            onAnswersChange([...currentAnswers, optionId]);
        } else if (maxSelections === 1) {
            // Substituir (single choice)
            onAnswersChange([optionId]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
                <div
                    className="h-full bg-[#deac6d] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Question Header */}
                <div className="mb-8">
                    <div className="text-sm text-gray-500 mb-2">
                        Pergunta {data.questionNumber} de {totalSteps}
                    </div>
                    <h2 className="text-3xl font-bold text-[#432818] mb-4">
                        {data.questionText}
                    </h2>
                    {data.instructions && (
                        <p className="text-gray-600">{data.instructions}</p>
                    )}
                </div>

                {/* Options Grid */}
                <div className={`grid gap-4 mb-8 ${data.options.length > 4 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                    }`}>
                    {data.options.map((option) => {
                        const isSelected = currentAnswers.includes(option.id);

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option.id)}
                                className={`
                  flex flex-col items-center p-6 border-2 rounded-xl
                  transition-all duration-200 hover:border-[#deac6d] hover:shadow-md
                  ${isSelected
                                        ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg transform -translate-y-1'
                                        : 'border-gray-200 bg-white'
                                    }
                `}
                            >
                                {option.image && (
                                    <img
                                        src={option.image}
                                        alt={option.text}
                                        className="rounded-lg w-full mb-4 object-cover max-h-48"
                                    />
                                )}

                                <p className="text-center font-medium text-sm leading-relaxed text-[#432818]">
                                    {option.text}
                                </p>

                                {isSelected && (
                                    <div className="mt-3 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-between">
                    <button
                        onClick={onPrev}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        ← Voltar
                    </button>

                    <button
                        onClick={onNext}
                        disabled={!isValid}
                        className={`
              px-8 py-3 rounded-lg font-medium transition-all
              ${isValid
                                ? 'bg-[#deac6d] text-white hover:bg-[#5b4135] shadow-md'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        Continuar →
                    </button>
                </div>

                {/* Selection Counter */}
                {data.requiredSelections > 1 && (
                    <div className="mt-4 text-center text-sm text-gray-500">
                        {currentAnswers.length} de {data.requiredSelections} selecionado(s)
                    </div>
                )}
            </div>
        </div>
    );
}

// ✅ Bundle: ~8KB (sem editor, sem DnD)
// ✅ SSR: Sim (renderiza no servidor)
// ✅ Performance: Otimizada (mínimo JavaScript)
// ✅ SEO: Conteúdo visível para crawlers
