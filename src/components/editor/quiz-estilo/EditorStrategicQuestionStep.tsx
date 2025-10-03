import React from 'react';
import QuizEstiloWrapper from './QuizEstiloWrapper';

interface EditorStrategicQuestionStepProps {
    data: any;
    currentAnswer?: string;
    onAnswerChange?: (answer: string) => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
}

/**
 * 🎯 STRATEGIC QUESTION STEP COM DESIGN DO /QUIZ-ESTILO
 * 
 * Versão para o editor que replica o visual exato do quiz de produção
 */
export default function EditorStrategicQuestionStep({
    data,
    currentAnswer = '',
    onAnswerChange,
    onEdit,
    isEditable = false
}: EditorStrategicQuestionStepProps) {

    // Dados seguros com fallbacks
    const safeData = {
        questionNumber: data.questionNumber || 'Pergunta Estratégica',
        questionText: data.questionText || 'Qual é sua resposta?',
        options: data.options || [
            { id: 'opt1', text: 'Opção A' },
            { id: 'opt2', text: 'Opção B' },
            { id: 'opt3', text: 'Opção C' }
        ]
    };

    const handleOptionClick = (optionId: string) => {
        if (onAnswerChange) {
            onAnswerChange(optionId);
        }
    };

    // Calcular progresso (assumindo steps estratégicas 12-16 de 21 total)
    const progress = Math.round((15 / 21) * 100);

    return (
        <QuizEstiloWrapper showHeader={false} showProgress={true} progress={progress}>
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#432818]">
                    {safeData.questionNumber}
                </h2>

                <p
                    className="text-xl md:text-2xl font-bold text-[#deac6d] mb-8"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    {safeData.questionText}
                </p>

                {isEditable && (
                    <p className="text-xs text-blue-500 mb-4">
                        ✏️ Editável via Painel de Propriedades
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                    {safeData.options.map((option: any) => (
                        <button
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={`p-4 border-2 rounded-lg transition-all duration-200 hover:border-[#deac6d] hover:shadow-md ${currentAnswer === option.id
                                ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg'
                                : 'border-gray-200'
                                }`}
                        >
                            <p className="font-medium text-sm text-[#432818]">
                                {option.text}
                            </p>
                            {currentAnswer === option.id && (
                                <div className="mt-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-white text-xs font-bold">✓</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    disabled={!currentAnswer}
                    className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${currentAnswer
                        ? 'bg-[#deac6d] text-white hover:bg-[#c19a5d]'
                        : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                        }`}
                >
                    {currentAnswer ? 'Próxima' : 'Selecione uma opção'}
                </button>
            </div>
        </QuizEstiloWrapper>
    );
}