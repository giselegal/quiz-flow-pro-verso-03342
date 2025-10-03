import React from 'react';
import QuizEstiloWrapper from './QuizEstiloWrapper';

interface EditorQuestionStepProps {
    data: any;
    currentAnswers?: string[];
    onAnswersChange?: (answers: string[]) => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
}

/**
 * ❓ QUESTION STEP COM DESIGN DO /QUIZ-ESTILO
 * 
 * Versão para o editor que replica o visual exato do quiz de produção
 */
export default function EditorQuestionStep({
    data,
    currentAnswers = [],
    onAnswersChange,
    onEdit,
    isEditable = false
}: EditorQuestionStepProps) {

    // Dados seguros com fallbacks
    const safeData = {
        questionNumber: data.questionNumber || 'Pergunta 1',
        questionText: data.questionText || 'Qual é a sua preferência?',
        requiredSelections: data.requiredSelections || 1,
        options: data.options || [
            { id: 'opt1', text: 'Opção 1', image: undefined },
            { id: 'opt2', text: 'Opção 2', image: undefined },
            { id: 'opt3', text: 'Opção 3', image: undefined }
        ]
    };

    const hasImages = safeData.options[0]?.image;
    const gridClass = hasImages ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1';

    const handleOptionClick = (optionId: string) => {
        if (!onAnswersChange) return;

        const isSelected = currentAnswers.includes(optionId);

        if (isSelected) {
            // Remove seleção
            const newAnswers = currentAnswers.filter(id => id !== optionId);
            onAnswersChange(newAnswers);
        } else if (currentAnswers.length < safeData.requiredSelections) {
            // Adiciona seleção se não atingiu o limite
            const newAnswers = [...currentAnswers, optionId];
            onAnswersChange(newAnswers);
        }
    };

    const canProceed = currentAnswers.length === safeData.requiredSelections;
    const selectionText = safeData.requiredSelections > 1
        ? `Selecione ${safeData.requiredSelections} opções`
        : 'Selecione uma opção';

    // Calcular progresso (assumindo step 2-11 de 21 total)
    const stepNumber = parseInt(data.questionNumber?.replace(/\D/g, '') || '1');
    const progress = Math.round((stepNumber / 21) * 100);

    return (
        <QuizEstiloWrapper showHeader={false} showProgress={true} progress={progress}>
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#432818]">
                    {safeData.questionNumber}
                </h2>

                <p
                    className="text-xl md:text-2xl font-bold text-[#deac6d] mb-4"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    {safeData.questionText}
                </p>

                <p className="text-sm text-gray-600 mb-8">
                    {selectionText} ({currentAnswers.length}/{safeData.requiredSelections})
                    {isEditable && (
                        <span className="block text-blue-500 mt-1 text-xs">
                            ✏️ Editável via Painel de Propriedades
                        </span>
                    )}
                </p>

                <div className={`grid ${gridClass} gap-6 mb-8 max-w-4xl mx-auto`}>
                    {safeData.options.map((option: any) => (
                        <div
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-[#deac6d] hover:shadow-md ${currentAnswers.includes(option.id)
                                ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg transform -translate-y-1'
                                : 'border-gray-200'
                                }`}
                        >
                            {option.image && (
                                <img
                                    src={option.image}
                                    alt={option.text}
                                    className="rounded-md w-full mb-2 object-cover max-h-48"
                                />
                            )}
                            <p className="text-center font-medium text-sm leading-relaxed text-[#432818]">
                                {option.text}
                            </p>

                            {/* Indicador visual de seleção */}
                            {currentAnswers.includes(option.id) && (
                                <div className="mt-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">✓</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Botão de feedback visual */}
                <button
                    disabled={!canProceed}
                    className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${canProceed
                        ? 'bg-[#deac6d] text-white animate-pulse'
                        : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                        }`}
                >
                    {canProceed ? 'Avançando...' : 'Próxima'}
                </button>
            </div>
        </QuizEstiloWrapper>
    );
}