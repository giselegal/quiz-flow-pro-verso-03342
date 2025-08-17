interface QuizTransitionBlockProps {
  properties: {
    message?: string;
    showDivider?: boolean;
    variant?: 'success' | 'transition' | 'info';
    buttonText?: string;
    showButton?: boolean;
  };
  config?: {
    fromSection?: 'clothing' | 'personality' | 'strategic';
    toSection?: 'clothing' | 'personality' | 'strategic' | 'results';
  };
}

/**
 * Block híbrido para transições entre seções do quiz
 * Usado entre seções de perguntas ou antes dos resultados
 */
const QuizTransitionBlock: React.FC<QuizTransitionBlockProps> = ({ properties }) => {
  const message = properties.message || 'Ótimo! Vamos para a próxima etapa.';
  const showDivider = properties.showDivider ?? true;
  const variant = properties.variant || 'transition';
  const buttonText = properties.buttonText || 'Continuar';
  const showButton = properties.showButton ?? false;

  const handleContinue = () => {
    console.log('Transição: Continuar para próxima seção');
  };

  // Cores por variante
  const variantStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      button: 'bg-green-600 hover:bg-green-700',
    },
    transition: {
      bg: 'bg-[#F3E8E6]',
      border: 'border-[#B89B7A]/30',
      text: 'text-[#432818]',
      button: 'bg-[#B89B7A] hover:bg-[#a0845c]',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="my-8">
      {showDivider && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-[#B89B7A]/20"></div>
          <div className="px-4">
            <div className="w-2 h-2 bg-[#B89B7A] rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-[#B89B7A]/20"></div>
        </div>
      )}

      <div
        className={`
        ${styles.bg} ${styles.border} ${styles.text}
        border rounded-lg p-6 text-center max-w-md mx-auto
      `}
      >
        <p className="text-lg font-medium mb-4">{message}</p>

        {showButton && (
          <button
            type="button"
            className={`
              ${styles.button}
              px-6 py-2 text-white rounded-lg font-medium
              transition-all duration-200
            `}
            onClick={handleContinue}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTransitionBlock;
