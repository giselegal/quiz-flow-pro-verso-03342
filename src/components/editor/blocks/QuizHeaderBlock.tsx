interface QuizHeaderBlockProps {
  properties: {
    title?: string;
    subtitle?: string;
    showProgress?: boolean;
    description?: string;
  };
  config?: {
    currentStep?: number;
    totalSteps?: number;
    quizType?: 'clothing' | 'personality' | 'strategic';
  };
}

/**
 * Block híbrido de cabeçalho do quiz
 * Renderiza título, subtítulo e barra de progresso configuráveis via JSON
 */
const QuizHeaderBlock: React.FC<QuizHeaderBlockProps> = ({ properties, config }) => {
  const title = properties.title || 'Quiz de Estilo';
  const subtitle = properties.subtitle;
  const description = properties.description;
  const showProgress = properties.showProgress ?? true;

  const currentStep = config?.currentStep ?? 1;
  const totalSteps = config?.totalSteps ?? 21;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="text-center mb-8">
      {/* Título principal */}
      <h1 className="text-2xl md:text-3xl font-semibold text-[#432818] mb-4 font-['Playfair_Display']">
        {title}
      </h1>

      {/* Subtítulo */}
      {subtitle && <h2 className="text-lg text-[#7A5F47] mb-4 font-medium">{subtitle}</h2>}

      {/* Descrição */}
      {description && (
        <p className="text-[#5A453A] mb-6 max-w-2xl mx-auto leading-relaxed">{description}</p>
      )}

      {/* Barra de progresso */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#7A5F47]">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-[#7A5F47]">{Math.round(progressPercentage)}%</span>
          </div>

          <div className="w-full bg-[#F3E8E6] rounded-full h-2">
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHeaderBlock;
