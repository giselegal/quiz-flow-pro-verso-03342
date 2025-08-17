interface QuizContentIntegrationProps {
  properties: {
    questionSource?: string;
    isStrategic?: boolean;
  };
  config?: {
    questionId?: string;
    multiSelect?: number;
    isStrategic?: boolean;
  };
}

/**
 * Block híbrido simplificado que renderiza questões
 * Usa dados estáticos por enquanto - será integrado com hooks depois
 */
const QuizContentIntegration: React.FC<QuizContentIntegrationProps> = ({ properties, config }) => {
  // Por enquanto, questão mockada para funcionar
  const mockQuestion = {
    id: config?.questionId || '1',
    question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    options: [
      'Conforto, leveza e praticidade no vestir.',
      'Discrição, caimento clássico e sobriedade.',
      'Praticidade com um toque de estilo atual.',
      'Elegância refinada, moderna e sem exageros.',
    ],
  };

  const isStrategic = config?.isStrategic ?? properties.isStrategic ?? false;
  const maxSelection = isStrategic ? 1 : config?.multiSelect || 3;

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-playfair font-bold text-[#432818] mb-6 text-center">
        {mockQuestion.question}
      </h2>
      <div className="flex flex-col gap-4">
        {mockQuestion.options.map((option, idx) => (
          <button
            type="button"
            key={idx}
            className="w-full border rounded-lg px-5 py-4 text-lg text-left transition-all duration-200 
              bg-white text-[#432818] border-[#B89B7A]/40 hover:bg-[#F3E8E6]"
          >
            {option}
          </button>
        ))}
      </div>
      {!isStrategic && (
        <p className="text-xs text-[#8F7A6A] mt-3 text-center">
          Selecione até {maxSelection} opção{maxSelection > 1 ? 's' : ''}.
        </p>
      )}
    </div>
  );
};

export default QuizContentIntegration;
