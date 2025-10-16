import { useMemo } from 'react';
import type { QuizStep } from '../../data/quizSteps';
import { STRATEGIC_QUESTION_STEP_SCHEMA } from '@/data/stepBlockSchemas';
import { Block } from '@/types/editor';

interface StrategicQuestionStepProps {
    data: QuizStep;
    currentAnswer: string;
    onAnswerChange: (answer: string) => void;
}

/**
 * 🎯 COMPONENTE DE PERGUNTA ESTRATÉGICA - MODULAR
 * 
 * Usa sistema de blocos para renderização modular
 */
export default function StrategicQuestionStep({
    data,
    currentAnswer,
    onAnswerChange
}: StrategicQuestionStepProps) {
    const safeOnAnswerChange: (answer: string) => void =
        typeof onAnswerChange === 'function' ? onAnswerChange : (answer: string) => {
            if (process.env.NODE_ENV === 'development') {
                console.warn('[StrategicQuestionStep] onAnswerChange ausente ou inválido – noop usado. answer=', answer);
            }
        };

    // Preparar blocos do schema com dados dinâmicos
    const blocks: Block[] = useMemo(() => {
        return STRATEGIC_QUESTION_STEP_SCHEMA.blocks.map((schemaBlock, index) => ({
            id: `strategic-${data.id || 'unknown'}-${schemaBlock.id}`,
            type: schemaBlock.type as any,
            order: index,
            content: {},
            properties: {
                ...schemaBlock.props,
                // Substituir placeholders dinâmicos
                text: schemaBlock.props.text?.replace('{{questionText}}', data.questionText || ''),
                options: schemaBlock.type === 'GridOptionsBlock' ? data.options : undefined
            }
        }));
    }, [data]);

    const handleOptionClick = (optionId: string) => {
        safeOnAnswerChange(optionId);
    };

    return (
        <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#deac6d] to-[#c49548] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">💭</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-[#deac6d] playfair-display leading-tight">
                    {data.questionText}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {data.options?.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:border-[#deac6d] hover:shadow-md ${currentAnswer === option.id
                            ? 'border-[#5b4135] bg-gradient-to-r from-[#deac6d]/10 to-[#c49548]/10 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <p className="text-left font-medium text-[#5b4135] leading-relaxed">
                            {option.text}
                        </p>

                        {currentAnswer === option.id && (
                            <div className="mt-3 flex items-center text-[#deac6d]">
                                <div className="w-4 h-4 bg-[#deac6d] rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                                <span className="text-sm font-medium">Selecionado</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {currentAnswer && (
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-[#deac6d]/10 rounded-full">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#deac6d] border-t-transparent mr-2"></div>
                        <span className="text-[#deac6d] font-medium text-sm">Processando resposta...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
