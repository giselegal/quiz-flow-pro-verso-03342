interface QuizNavigationIntegrationProps {
  properties: {
    showPrevious?: boolean;
    showNext?: boolean;
    nextButtonText?: string;
  };
  config?: {
    isLastQuestion?: boolean;
    isStrategic?: boolean;
  };
}

/**
 * Block híbrido de navegação simplificado
 * Renderiza botões de navegação configuráveis via JSON
 */
const QuizNavigationIntegration: React.FC<QuizNavigationIntegrationProps> = ({
  properties,
  config,
}) => {
  const showPrevious = properties.showPrevious ?? true;
  const showNext = properties.showNext ?? true;
  const isLastQuestion = config?.isLastQuestion ?? false;
  const isStrategic = config?.isStrategic ?? false;

  // Texto dinâmico do botão
  const nextButtonText =
    properties.nextButtonText ||
    (isLastQuestion ? (isStrategic ? 'Finalizar' : 'Próxima etapa') : 'Próxima');

  const handlePrevious = () => {
    console.log('Navegação: Voltar');
  };

  const handleNext = () => {
    console.log('Navegação: Avançar');
  };

  return (
    <div className="flex flex-row justify-between items-center mt-8 w-full max-w-md mx-auto gap-4">
      {showPrevious && (
        <button
          type="button"
          className="px-6 py-2 rounded-lg font-medium border transition-all duration-200
            bg-white text-[#432818] border-[#B89B7A]/40 hover:bg-[#F3E8E6]"
          onClick={handlePrevious}
        >
          Voltar
        </button>
      )}

      {showNext && (
        <button
          type="button"
          className="px-6 py-2 rounded-lg font-medium border transition-all duration-200
            bg-[#B89B7A] text-white border-[#B89B7A] hover:bg-[#a0845c]"
          onClick={handleNext}
        >
          {nextButtonText}
        </button>
      )}
    </div>
  );
};

export default QuizNavigationIntegration;
