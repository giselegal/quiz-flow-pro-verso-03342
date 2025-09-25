import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Home, RotateCcw } from 'lucide-react';
import React from 'react';
import { useLocation } from 'wouter';
import { useQuiz21Steps } from '@/providers/FunnelMasterProvider';
import { QuizBackendStatus } from './QuizBackendStatus';

interface Quiz21StepsNavigationProps {
  position?: 'floating' | 'sticky' | 'static';
  variant?: 'compact' | 'full';
  showProgress?: boolean;
  showControls?: boolean;
  showBackendStatus?: boolean;
  funnelId?: string;
  className?: string;
}

/**
 * 🎯 COMPONENTE DE NAVEGAÇÃO PARA QUIZ 21 ETAPAS
 *
 * Características:
 * - Navegação entre etapas
 * - Barra de progresso
 * - Controles de sessão
 * - Indicadores visuais
 * - Responsivo
 */
export const Quiz21StepsNavigation: React.FC<Quiz21StepsNavigationProps> = ({
  position = 'sticky',
  variant = 'full',
  showProgress = true,
  showControls = true,
  showBackendStatus = true,
  funnelId,
  className = '',
}) => {
  const [, setLocation] = useLocation();

  const {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    isCurrentStepComplete,
    autoAdvanceEnabled,
    goToNextStep,
    goToPreviousStep,
    resetQuiz,
    getProgress,
    getStepRequirements,
    userName,
    answers,
    currentStepSelections,
  } = useQuiz21Steps();

  const progress = getProgress();
  const stepRequirements = getStepRequirements();
  const selectionsCount = Object.keys(currentStepSelections).length;

  // Determinar se o botão de avançar deve estar ativo
  const shouldHighlightNext = () => {
    if (!isCurrentStepComplete) return false;

    // Etapas com auto-advance: destacar quando completo
    if (autoAdvanceEnabled) {
      return selectionsCount >= stepRequirements.requiredSelections;
    }

    // Outras etapas: sempre destacar quando pode avançar
    return canGoNext;
  };

  const nextButtonActive = shouldHighlightNext();

  // Classes de posicionamento
  const getPositionClasses = () => {
    switch (position) {
      case 'floating':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
      case 'sticky':
        return 'sticky top-0 z-40';
      case 'static':
      default:
        return 'relative';
    }
  };

  // Classes de variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'max-w-md';
      case 'full':
      default:
        return 'max-w-2xl';
    }
  };

  // Determinar fase atual
  const getCurrentPhase = () => {
    if (currentStep === 1) return 'inicio';
    if (currentStep >= 2 && currentStep <= 11) return 'quiz';
    if (currentStep === 12) return 'transicao1';
    if (currentStep >= 13 && currentStep <= 18) return 'estrategicas';
    if (currentStep === 19) return 'transicao2';
    if (currentStep === 20) return 'resultado';
    if (currentStep === 21) return 'oferta';
    return 'desconhecida';
  };

  const phase = getCurrentPhase();

  // Labels das fases
  const getPhaseLabel = () => {
    switch (phase) {
      case 'inicio':
        return 'Bem-vindo';
      case 'quiz':
        return `Questão ${currentStep - 1} de 10`;
      case 'transicao1':
        return 'Preparando próxima fase';
      case 'estrategicas':
        return `Pergunta estratégica ${currentStep - 12} de 6`;
      case 'transicao2':
        return 'Calculando resultado';
      case 'resultado':
        return 'Seu resultado';
      case 'oferta':
        return 'Oferta especial';
      default:
        return `Etapa ${currentStep}`;
    }
  };

  // Obter informações sobre as seleções necessárias
  const getSelectionInfo = () => {
    if (stepRequirements.requiredSelections > 0) {
      return `${selectionsCount}/${stepRequirements.requiredSelections} seleções`;
    }
    return null;
  };

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      <Card
        className={`${getVariantClasses()} mx-auto shadow-lg bg-white/95 backdrop-blur-sm border-2 border-stone-200`}
      >
        <CardContent className="p-4">
          {/* 📊 BARRA DE PROGRESSO */}
          {showProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
                <span className="font-medium">{getPhaseLabel()}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-stone-100 px-2 py-1 rounded">
                    {currentStep}/{totalSteps}
                  </span>
                  {getSelectionInfo() && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        isCurrentStepComplete
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {getSelectionInfo()}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-stone-500 mt-1">
                <span>0%</span>
                <span className="font-medium">{progress}%</span>
                <span>100%</span>
              </div>

              {/* Mensagem sobre auto-advance */}
              {autoAdvanceEnabled && stepRequirements.requiredSelections > 0 && (
                <div className="text-xs text-center text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded">
                  {isCurrentStepComplete
                    ? '✅ Avançará automaticamente em breve'
                    : `💡 Selecione ${stepRequirements.requiredSelections} opções para continuar`}
                </div>
              )}
            </div>
          )}

          {/* 🎮 CONTROLES DE NAVEGAÇÃO */}
          <div className="flex items-center justify-between">
            {/* Navegação Anterior/Próximo */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={goToPreviousStep}
                disabled={!canGoPrevious}
                variant="outline"
                size="sm"
                className="h-9 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>

              <div className="px-3 py-1 bg-stone-100 rounded text-sm font-medium min-w-[80px] text-center">
                {currentStep}/{totalSteps}
              </div>

              <Button
                onClick={goToNextStep}
                disabled={!canGoNext}
                variant={nextButtonActive ? 'default' : 'outline'}
                size="sm"
                className={`h-9 px-3 ${
                  nextButtonActive
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg animate-pulse'
                    : ''
                }`}
              >
                {autoAdvanceEnabled &&
                stepRequirements.requiredSelections > 0 &&
                !isCurrentStepComplete
                  ? `Selecione ${stepRequirements.requiredSelections - selectionsCount} mais`
                  : 'Avançar'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Controles de Sessão */}
            {showControls && (
              <div className="flex items-center space-x-2">
                {/* Indicador de Dados */}
                {(userName || answers.length > 0) && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    {answers.length} respostas
                  </div>
                )}

                {/* Reset */}
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  title="Resetar Quiz"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                {/* Home */}
                <Button
                  onClick={() => setLocation('/')}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  title="Voltar ao Início"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* 🔍 BACKEND STATUS */}
          {showBackendStatus && funnelId && (
            <div className="mt-3 pt-3 border-t border-stone-200">
              <QuizBackendStatus 
                funnelId={funnelId} 
                variant="compact" 
                showDetails={variant === 'full'} 
              />
            </div>
          )}

          {/* 🔍 INFORMAÇÕES DE DEBUG (COMPACT) */}
          {variant === 'compact' && (userName || answers.length > 0) && (
            <div className="mt-3 text-xs text-stone-500 bg-stone-50 p-2 rounded">
              {userName && (
                <div>
                  👤 <span className="font-medium">{userName}</span>
                </div>
              )}
              {answers.length > 0 && <div>📝 {answers.length} respostas coletadas</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz21StepsNavigation;
