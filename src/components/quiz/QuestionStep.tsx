import type { QuizStep } from '../../data/quizSteps';

interface QuestionStepProps {
    data: QuizStep;
    currentAnswers: string[];
    onAnswersChange: (answers: string[]) => void;
}

/**
 * ❓ COMPONENTE DE PERGUNTA DO QUIZ
 * 
 * Renderiza as perguntas principais do quiz (etapas 2-11)
 * com opções de múltipla escolha, imagens e seleção obrigatória.
 */
export default function QuestionStep({
    data,
    currentAnswers,
    onAnswersChange
}: QuestionStepProps) {
    // Verificação de segurança para currentAnswers
    const safeCurrentAnswers = currentAnswers || [];
    
    const hasImages = data.options?.[0]?.image;
    const gridClass = hasImages ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1';

    const handleOptionClick = (optionId: string) => {
        const isSelected = safeCurrentAnswers.includes(optionId);

        if (isSelected) {
            // Remove seleção
            const newAnswers = safeCurrentAnswers.filter(id => id !== optionId);
            onAnswersChange(newAnswers);
        } else if (safeCurrentAnswers.length < (data.requiredSelections || 1)) {
            // Adiciona seleção se não atingiu o limite
            const newAnswers = [...safeCurrentAnswers, optionId];
            onAnswersChange(newAnswers);
        }
    };

    const canProceed = safeCurrentAnswers.length === (data.requiredSelections || 1);
    const selectionText = data.requiredSelections && data.requiredSelections > 1
        ? `Selecione ${data.requiredSelections} opções`
        : 'Selecione uma opção';

    return (
        <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
                {data.questionNumber}
            </h2>

            <p className="text-xl md:text-2xl font-bold text-[#deac6d] mb-4 playfair-display">
                {data.questionText}
            </p>

            <p className="text-sm text-gray-600 mb-8">
                {selectionText} ({safeCurrentAnswers.length}/{data.requiredSelections || 1})
            </p>

            <div className={`grid ${gridClass} gap-6 mb-8`}>
                {data.options?.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-[#deac6d] hover:shadow-md ${safeCurrentAnswers.includes(option.id)
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
                        <p className="text-center font-medium text-sm leading-relaxed">{option.text}</p>

                        {/* Indicador visual de seleção */}
                        {safeCurrentAnswers.includes(option.id) && (
                            <div className="mt-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Botão desabilitado visualmente, avanço é automático */}
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
    );
}