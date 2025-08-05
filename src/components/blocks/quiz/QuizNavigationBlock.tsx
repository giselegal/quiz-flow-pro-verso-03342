import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

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
  alignment?: "left" | "center" | "right" | "space-between";
  buttonStyle?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
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

const QuizNavigationBlock: React.FC<QuizNavigationBlockProps> = ({
  blockId,
  className = "",
  style = {},
  showBackButton = true,
  showNextButton = true,
  showResetButton = false,
  showSkipButton = false,
  backButtonText = "Voltar",
  nextButtonText = "Próxima",
  resetButtonText = "Reiniciar",
  skipButtonText = "Pular",
  disableBack = false,
  disableNext = false,
  disableReset = false,
  disableSkip = false,
  loadingBack = false,
  loadingNext = false,
  loadingReset = false,
  alignment = "space-between",
  buttonStyle = "primary",
  size = "md",
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
  const getButtonClasses = (variant: "primary" | "secondary" | "outline" = buttonStyle) => {
    const baseClasses = `
      font-semibold transition-all duration-300 transform hover:scale-105
      ${
        size === "sm"
          ? "px-4 py-2 text-sm"
          : size === "lg"
            ? "px-8 py-4 text-lg"
            : "px-6 py-3 text-base"
      }
      ${fullWidth ? "w-full" : ""}
    `;

    const variants = {
      primary: "bg-[#B89B7A] hover:bg-[#A1835D] text-white rounded-full shadow-md",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full",
      outline:
        "border-2 border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white rounded-full",
    };

    return `${baseClasses} ${variants[variant]}`;
  };

  const getContainerClasses = () => {
    const alignmentClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
      "space-between": "justify-between",
    };

    return `flex items-center gap-4 ${alignmentClasses[alignment]}`;
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
    <div className={`quiz-navigation-block ${className}`} style={style} data-block-id={blockId}>
      <div className="py-6">
        <div className={getContainerClasses()}>
          {/* Botão Voltar */}
          {showBackButton && !isActuallyFirst && (
            <Button
              onClick={handleBack}
              disabled={disableBack || loadingBack}
              className={getButtonClasses("outline")}
            >
              {loadingBack ? (
                <RotateCcw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ChevronLeft className="w-4 h-4 mr-2" />
              )}
              {backButtonText}
            </Button>
          )}

          {/* Botão Reiniciar */}
          {showResetButton && (
            <Button
              onClick={handleReset}
              disabled={disableReset || loadingReset}
              className={getButtonClasses("secondary")}
            >
              {loadingReset ? (
                <RotateCcw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              {resetButtonText}
            </Button>
          )}

          {/* Spacer para space-between quando não há botão esquerdo */}
          {alignment === "space-between" && (!showBackButton || isActuallyFirst) && <div></div>}

          {/* Grupo de botões direitos */}
          <div className="flex items-center gap-3">
            {/* Botão Pular */}
            {showSkipButton && !isActuallyLast && (
              <Button
                onClick={handleSkip}
                disabled={disableSkip}
                className={getButtonClasses("outline")}
                variant="ghost"
              >
                {skipButtonText}
              </Button>
            )}

            {/* Botão Próxima/Finalizar */}
            {showNextButton && (
              <Button
                onClick={handleNext}
                disabled={disableNext || loadingNext}
                className={getButtonClasses("primary")}
              >
                {loadingNext ? (
                  <RotateCcw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  !isActuallyLast && <ChevronRight className="w-4 h-4 ml-2" />
                )}
                {isActuallyLast ? "Finalizar" : nextButtonText}
                {!isActuallyLast && !loadingNext && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>

        {/* Informações contextuais */}
        {currentQuestion && totalQuestions && (
          <div className="text-center mt-4 text-sm text-[#6B5B73]">
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
