import QuizNavigation from '@/components/quiz/QuizNavigation';
import { cn } from '@/lib/utils';
import React from 'react';

interface QuizNavigationBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      className?: string;
      backgroundColor?: string;
      // Configurações JSON exportáveis
      navigationConfig?: {
        currentStep: number;
        totalSteps: number;
        stepName: string;
        canProceed: boolean;
        showUserInfo: boolean;
        showBackButton: boolean;
        showProgress: boolean;
        sessionId: string;
        currentQuestionType: 'normal' | 'strategic' | 'final';
        selectedOptionsCount: number;
        isLastQuestion: boolean;
        nextStepUrl?: string;
        prevStepUrl?: string;
        theme?: {
          primaryColor: string;
          backgroundColor: string;
          textColor: string;
          progressColor: string;
        };
      };
    };
    content?: any;
  };
  onPropertyChange?: (key: string, value: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

/**
 * 🎯 QUIZ NAVIGATION BLOCK
 * ✅ Navegação premium avançada
 * ✅ Configuração JSON exportável
 * ✅ Compatível com editor de blocos
 */
const QuizNavigationBlock: React.FC<QuizNavigationBlockProps> = ({
  block,
  onPropertyChange,
  onNext,
  onBack,
}) => {
  const properties = block?.properties || {};
  const {
    className = '',
    backgroundColor = 'transparent',
    navigationConfig,
  } = properties;

  // Configuração padrão ou do JSON
  const config = navigationConfig || {
    currentStep: 1,
    totalSteps: 21,
    stepName: 'Questão',
    canProceed: false,
    showUserInfo: true,
    showBackButton: true,
    showProgress: true,
    sessionId: 'default-session',
    currentQuestionType: 'normal' as const,
    selectedOptionsCount: 0,
    isLastQuestion: false,
    theme: {
      primaryColor: '#B89B7A',
      backgroundColor: '#FAF9F7',
      textColor: '#432818',
      progressColor: '#B89B7A',
    },
  };

  const handleNext = () => {
    console.log('🚀 QuizNavigationBlock: Próxima etapa');
    
    // Atualizar propriedades
    if (onPropertyChange) {
      onPropertyChange('lastAction', 'next');
      onPropertyChange('actionTimestamp', new Date().toISOString());
    }

    // Callback personalizado
    if (onNext) {
      onNext();
    }
  };

  const handleBack = () => {
    console.log('🔙 QuizNavigationBlock: Etapa anterior');
    
    // Atualizar propriedades
    if (onPropertyChange) {
      onPropertyChange('lastAction', 'back');
      onPropertyChange('actionTimestamp', new Date().toISOString());
    }

    // Callback personalizado
    if (onBack) {
      onBack();
    }
  };

  return (
    <div
      className={cn('quiz-navigation-block', className)}
      style={{ 
        backgroundColor,
        '--primary-color': config.theme?.primaryColor,
        '--text-color': config.theme?.textColor,
      } as React.CSSProperties}
    >
      <QuizNavigation
        currentStep={config.currentStep}
        totalSteps={config.totalSteps}
        stepName={config.stepName}
        canProceed={config.canProceed}
        showUserInfo={config.showUserInfo}
        sessionId={config.sessionId}
        currentQuestionType={config.currentQuestionType}
        selectedOptionsCount={config.selectedOptionsCount}
        isLastQuestion={config.isLastQuestion}
        onNext={handleNext}
        onBack={config.showBackButton ? handleBack : undefined}
      />
      
      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <details>
            <summary>Navigation Config (Debug)</summary>
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(config, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default QuizNavigationBlock;

// ✅ CONFIGURAÇÃO JSON EXPORTÁVEL
export const getQuizNavigationConfig = (stepNumber: number, customConfig?: Partial<any>) => ({
  id: `quiz-navigation-step-${stepNumber}`,
  type: 'quiz-navigation',
  properties: {
    navigationConfig: {
      currentStep: stepNumber,
      totalSteps: 21,
      stepName: `Etapa ${stepNumber}`,
      canProceed: false,
      showUserInfo: true,
      showBackButton: stepNumber > 1,
      showProgress: true,
      sessionId: `quiz-session-${Date.now()}`,
      currentQuestionType: 'normal' as const,
      selectedOptionsCount: 0,
      isLastQuestion: stepNumber === 21,
      theme: {
        primaryColor: '#B89B7A',
        backgroundColor: '#FAF9F7',
        textColor: '#432818',
        progressColor: '#B89B7A',
      },
      ...customConfig,
    },
    className: 'w-full sticky top-0 z-10',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
});
