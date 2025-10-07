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
    // Fallback defensivo: impedir TypeError se prop vier incorretamente definida
    const safeOnAnswersChange: (answers: string[]) => void =
        typeof onAnswersChange === 'function' ? onAnswersChange : () => {
            if (process.env.NODE_ENV === 'development') {
                console.warn('[QuestionStep] onAnswersChange ausente ou inválido – usando noop. Verifique adaptador/registry.');
            }
        };
    // Verificação de segurança para currentAnswers
    const safeCurrentAnswers = currentAnswers || [];

    // Determina se qualquer opção possui imagem para ajustar layout responsivo.
    // Regra solicitada: se houver imagens -> 3 colunas em desktop, 2 colunas em tablet/mobile.
    // Caso contrário (todas texto) -> sempre 1 coluna.
    const hasImages = Array.isArray(data.options) && data.options.some(opt => !!opt.image);
    // Ajuste: sempre começar em 1 coluna para mobile para dar mais destaque
    // e subir para 2 colunas em sm/md e 3 em lg quando há imagens.
    const gridClass = hasImages
        // Menos colunas em desktop para dobrar área visual das imagens; 3 colunas só em telas muito largas
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
        : 'grid-cols-1';
    const gapClass = hasImages ? 'gap-5 md:gap-6' : 'gap-6';

    const handleOptionClick = (optionId: string) => {
        const isSelected = safeCurrentAnswers.includes(optionId);

        if (isSelected) {
            // Remove seleção
            const newAnswers = safeCurrentAnswers.filter(id => id !== optionId);
            safeOnAnswersChange(newAnswers);
        } else if (safeCurrentAnswers.length < (data.requiredSelections || 1)) {
            // Adiciona seleção se não atingiu o limite
            const newAnswers = [...safeCurrentAnswers, optionId];
            safeOnAnswersChange(newAnswers);
        }
    };

    const canProceed = safeCurrentAnswers.length === (data.requiredSelections || 1);
    const selectionText = data.requiredSelections && data.requiredSelections > 1
        ? `Selecione ${data.requiredSelections} opções`
        : 'Selecione uma opção';

    return (
        <div className="bg-white px-2 pt-4 pb-6 sm:p-5 md:p-12 rounded-lg shadow-lg text-center max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
                {data.questionNumber}
            </h2>

            <p className="text-xl md:text-2xl font-bold text-[#deac6d] mb-4 playfair-display">
                {data.questionText}
            </p>

            <p className="text-sm text-gray-600 mb-8">
                {selectionText} ({safeCurrentAnswers.length}/{data.requiredSelections || 1})
            </p>

            <div className={`grid ${gridClass} ${gapClass} mb-6 md:mb-8`}>
                {data.options?.map((option) => (
                    <div
                        key={option.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={safeCurrentAnswers.includes(option.id)}
                        onClick={() => handleOptionClick(option.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOptionClick(option.id); } }}
                        className={`option-button group rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#deac6d]/40 disabled:pointer-events-none disabled:opacity-50 overflow-hidden w-full flex h-auto pt-2 pb-3 flex-col items-center justify-start border-2 cursor-pointer break-words whitespace-normal ${safeCurrentAnswers.includes(option.id)
                            ? 'border-[#5b4135] bg-white shadow-md'
                            : 'border-zinc-200 bg-white hover:border-[#deac6d] hover:shadow'
                            }`}
                    >
                        {option.image && (
                            <div className="w-full aspect-[4/5] sm:aspect-square bg-white rounded-t-md overflow-hidden relative">
                                <img
                                    src={option.image}
                                    alt={option.text}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover scale-[1.05]"
                                />
                            </div>
                        )}
                        <p
                            className="text-center font-medium text-sm leading-relaxed px-2 sm:px-3 pt-2 w-full break-words hyphens-auto whitespace-normal"
                            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                            {option.text}
                        </p>

                        {/* Indicador visual de seleção */}
                        {safeCurrentAnswers.includes(option.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center shadow">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Botão desabilitado visualmente, avanço é automático */}
            <div className="mt-4">
                <button
                    disabled={!canProceed}
                    className={`font-bold py-3 px-8 rounded-full shadow-md transition-all text-sm sm:text-base ${canProceed
                        ? 'bg-[#deac6d] text-white animate-pulse'
                        : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                        }`}
                >
                    {canProceed ? 'Avançando...' : 'Selecionar e Continuar'}
                </button>
            </div>
        </div>
    );
}