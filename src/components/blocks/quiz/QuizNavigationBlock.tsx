// @ts-nocheck
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

/**
 * QuizNavigationBlock - Componente de navegação do quiz 100% reutilizável e editável
 *
 * Props editáveis via editor visual:
 * - showBackButton?: boolean - Exibir botão voltar
 * - showNextButton?: boolean - Exibir botão avançar
 * - showResetButton?: boolean - Exibir botão reiniciar
 * - backButtonText?: string - Texto do botão voltar
 * - nextButtonText?: string - Texto do botão avançar
 * - resetButtonText?: string - Texto do botão reiniciar
 * - disableBack?: boolean - Desabilitar botão voltar
 * - disableNext?: boolean - Desabilitar botão avançar
 * - alignment?: 'left' | 'center' | 'right' | 'space-between' - Alinhamento
 * - buttonStyle?: 'primary' | 'secondary' | 'outline' - Estilo dos botões
 * - size?: 'sm' | 'md' | 'lg' - Tamanho dos botões
 *
 * @example
 * <QuizNavigationBlock
 *   blockId="quiz-nav-1"
 *   showBackButton={true}
 *   showNextButton={true}
 *   backButtonText="Voltar"
 *   nextButtonText="Próxima"
 *   onBack={() => goToPreviousQuestion()}
 *   onNext={() => goToNextQuestion()}
 *   disableNext={!hasValidAnswer}
 * />
 */

export interface QuizNavigationBlockProps {
  // Identificação
  blockId: string;
  className?: string;
  style?: React.CSSProperties;

  // Configurações de exibição
  showBackButton?: boolean;
  showNextButton?: boolean;
  showResetButton?: boolean;
  showSkipButton?: boolean;

  // Textos editáveis
  backButtonText?: string;
  nextButtonText?: string;
  resetButtonText?: string;
  skipButtonText?: string;

  // Estados dos botões
  disableBack?: boolean;
  disableNext?: boolean;
  disableReset?: boolean;
  disableSkip?: boolean;

  // Loading states
  loadingBack?: boolean;
  loadingNext?: boolean;
  loadingReset?: boolean;

  // Layout e estilo
  alignment?: 'left' | 'center' | 'right' | 'space-between';
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;

  // Callbacks
  onBack?: () => void;
  onNext?: () => void;
  onReset?: () => void;
  onSkip?: () => void;

  // Informações contextuais
  currentQuestion?: number;
  totalQuestions?: number;
  isFirstQuestion?: boolean;
  isLastQuestion?: boolean;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuizNavigationBlock: React.FC<QuizNavigationBlockProps> = ({
  blockId,
  className = '',
  style = {},
  showBackButton = true,
  showNextButton = true,
  showResetButton = false,
  showSkipButton = false,
  backButtonText = 'Voltar',
  nextButtonText = 'Próxima',
  resetButtonText = 'Reiniciar',
  skipButtonText = 'Pular',
  disableBack = false,
  disableNext = false,
  disableReset = false,
  disableSkip = false,
  loadingBack = false,
  loadingNext = false,
  loadingReset = false,
  alignment = 'space-between',
  buttonStyle = 'primary',
  size = 'md',
  fullWidth = false,
  onBack,
  onNext,
  onReset,
  onSkip,
  currentQuestion,
  totalQuestions,
  isFirstQuestion = false,
  isLastQuestion = false,
}) => {
  const getButtonClasses = (variant: 'primary' | 'secondary' | 'outline' = buttonStyle) => {
    const baseClasses = `
      quiz-nav-button font-semibold transition-all duration-300 transform hover:scale-105
      ${
        size === 'sm'
          ? 'px-3 py-2 text-sm md:px-4 md:py-2'
          : size === 'lg'
            ? 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg'
            : 'px-4 py-2.5 text-sm md:px-6 md:py-3 md:text-base'
      }
      ${fullWidth ? 'w-full md:w-auto' : 'w-full md:w-auto'}
      flex items-center justify-center
    `;

    const variants = {
      primary: 'bg-[#B89B7A] hover:bg-[#A1835D] text-white rounded-full shadow-md',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full',
      outline:
        'border-2 border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white rounded-full',
    };

    return `${baseClasses} ${variants[variant]}`;
  };

  const getContainerClasses = () => {
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center', 
      right: 'justify-end',
      'space-between': 'justify-between md:justify-between', // Mobile será flex-col via CSS
    };

    // Adicionar classes responsivas adequadas
    return `quiz-navigation flex items-center gap-4 ${alignmentClasses[alignment]} md:flex-row flex-col md:gap-4 gap-3`;
  };

  const handleBack = () => {
    if (!disableBack && !loadingBack && onBack) {
      onBack();
    }
  };

  const handleNext = () => {
    if (!disableNext && !loadingNext && onNext) {
      onNext();
    }
  };

  const handleReset = () => {
    if (!disableReset && !loadingReset && onReset) {
      onReset();
    }
  };

  const handleSkip = () => {
    if (!disableSkip && onSkip) {
      onSkip();
    }
  };

  // Auto-determinar se é primeira/última questão
  const isActuallyFirst = isFirstQuestion || currentQuestion === 1;
  const isActuallyLast = isLastQuestion || currentQuestion === totalQuestions;

  return (
    <div className={`quiz-navigation-block quiz-navigation-inline ${className}`} style={style} data-block-id={blockId}>
      <div className="py-4 md:py-6">
        <div className={getContainerClasses()}>
          {/* Botão Voltar */}
          {showBackButton && !isActuallyFirst && (
            <Button
              onClick={handleBack}
              disabled={disableBack || loadingBack}
              className={getButtonClasses('outline')}
            >
              {loadingBack ? (
                <RotateCcw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ChevronLeft className="w-4 h-4 mr-2" />
              )}
              <span className="truncate">{backButtonText}</span>
            </Button>
          )}

          {/* Botão Reiniciar */}
          {showResetButton && (
            <Button
              onClick={handleReset}
              disabled={disableReset || loadingReset}
              className={getButtonClasses('secondary')}
            >
              {loadingReset ? (
                <RotateCcw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              <span className="truncate">{resetButtonText}</span>
            </Button>
          )}

          {/* Spacer para space-between quando não há botão esquerdo - apenas em desktop */}
          {alignment === 'space-between' && (!showBackButton || isActuallyFirst) && (
            <div className="hidden md:block"></div>
          )}

          {/* Grupo de botões direitos */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-col md:flex-row">
            {/* Botão Pular */}
            {showSkipButton && !isActuallyLast && (
              <Button
                onClick={handleSkip}
                disabled={disableSkip}
                className={getButtonClasses('outline')}
                variant="ghost"
              >
                <span className="truncate">{skipButtonText}</span>
              </Button>
            )}

            {/* Botão Próxima/Finalizar */}
            {showNextButton && (
              <Button
                onClick={handleNext}
                disabled={disableNext || loadingNext}
                className={getButtonClasses('primary')}
              >
                {loadingNext ? (
                  <RotateCcw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  !isActuallyLast && <ChevronRight className="hidden md:inline w-4 h-4 ml-2" />
                )}
                <span className="truncate">{isActuallyLast ? 'Finalizar' : nextButtonText}</span>
                {!isActuallyLast && !loadingNext && <ChevronRight className="hidden md:inline w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>

        {/* Informações contextuais */}
        {currentQuestion && totalQuestions && (
          <div className="text-center mt-3 md:mt-4 text-xs md:text-sm text-[#6B5B73] px-2">
            {isActuallyLast
              ? 'Última questão - clique em "Finalizar" para ver seu resultado'
              : `${totalQuestions - currentQuestion} questões restantes`}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizNavigationBlock;
