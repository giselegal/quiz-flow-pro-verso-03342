import type { QuizStep } from '../../data/quizSteps';

interface StrategicQuestionStepProps {
    data: QuizStep;
    currentAnswer: string;
    onAnswerChange: (answer: string) => void;
    onNext?: () => void;
}

/**
 * 🎯 COMPONENTE DE PERGUNTA ESTRATÉGICA
 * 
 * Renderiza as perguntas estratégicas (etapas 13-18) que são usadas
 * para personalizar a oferta final baseada no perfil do usuário.
 */
export default function StrategicQuestionStep({
    data,
    currentAnswer,
    onAnswerChange,
    onNext
}: StrategicQuestionStepProps) {
    const handleOptionClick = (optionId: string) => {
        onAnswerChange(optionId);
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

                        {/* Indicador de seleção */}
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

            {/* Botão de avanço manual */}
            {currentAnswer && onNext && (
                <div className="mt-8 text-center">
                    <button
                        onClick={onNext}
                        className="bg-[#deac6d] hover:bg-[#c49548] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        Continuar
                    </button>
                </div>
            )}
        </div>
    );
}