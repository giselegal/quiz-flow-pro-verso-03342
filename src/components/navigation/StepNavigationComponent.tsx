import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import React from 'react';

interface StepNavigationProps {
  currentStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

/**
 * 🎯 Componente de navegação entre etapas do quiz
 *
 * Funcionalidades:
 * - ✅ Botões próxima/anterior
 * - ✅ Barra de progresso
 * - ✅ Indicador de etapa atual
 * - ✅ Validação de navegação
 */
export const StepNavigationComponent: React.FC<StepNavigationProps> = ({
  currentStep: propCurrentStep,
  onStepChange,
  className = '',
}) => {
  const navigation = useStepNavigation();

  const handleNext = async () => {
    await navigation.goNext();
    const nextStep = (propCurrentStep || navigation.currentStep) + 1;
    onStepChange?.(nextStep);
  };

  const handlePrevious = async () => {
    await navigation.goPrevious();
    const prevStep = (propCurrentStep || navigation.currentStep) - 1;
    onStepChange?.(prevStep);
  };

  const handleStepClick = async (step: number) => {
    await navigation.goToStep(step);
    onStepChange?.(step);
  };

  // Usar current step do prop ou do navigation
  const currentStep = propCurrentStep || navigation.currentStep;
  const totalSteps = 21;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#6B4F43] font-medium">Progresso</span>
          <span className="text-[#432818] font-semibold">
            Etapa {currentStep} de {totalSteps}
          </span>
        </div>

        <Progress
          value={(currentStep / totalSteps) * 100}
          className="h-2 bg-[#FAF9F7]"
          style={
            {
              '--progress-foreground': 'linear-gradient(90deg, #B89B7A, #A08766)',
            } as any
          }
        />
      </div>

      {/* Indicadores de Etapas */}
      <div className="flex items-center justify-center space-x-2 py-2">
        {Array.from({ length: Math.min(7, totalSteps) }, (_, index) => {
          const stepNumber = Math.max(1, currentStep - 3 + index);
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          if (stepNumber > totalSteps) return null;

          return (
            <button
              key={stepNumber}
              onClick={() => handleStepClick(stepNumber)}
              disabled={navigation.isLoading}
              className={`
                w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#B89B7A] text-white shadow-md scale-110'
                    : isCompleted
                      ? 'bg-[#A08766] text-white hover:bg-[#B89B7A]'
                      : 'bg-[#FAF9F7] text-[#6B4F43] hover:bg-[#F5F2E9] border border-[#B89B7A]/30'
                }
                ${navigation.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
              `}
            >
              {stepNumber}
            </button>
          );
        })}

        {totalSteps > 7 && currentStep < totalSteps - 3 && (
          <span className="text-[#6B4F43] px-2">...</span>
        )}
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep <= 1 || navigation.isLoading}
          className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div className="flex items-center space-x-2 text-sm text-[#6B4F43]">
          {navigation.isLoading && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Carregando...</span>
            </>
          )}
        </div>

        {currentStep >= totalSteps ? (
          <Button
            onClick={handleNext}
            disabled={navigation.isLoading}
            className="bg-gradient-to-r from-[#B89B7A] to-[#A08766] text-white hover:from-[#A08766] hover:to-[#8F7555]"
          >
            {navigation.isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Finalizar Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentStep >= totalSteps || navigation.isLoading}
            className="bg-[#B89B7A] text-white hover:bg-[#A08766]"
          >
            Próxima
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Informações da Etapa Atual */}
      {navigation.getCurrentStepData() && (
        <div className="mt-4 p-3 bg-[#FAF9F7] rounded-lg border border-[#B89B7A]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[#432818]">
                {navigation.getCurrentStepData()?.template.metadata.name}
              </h3>
              <p className="text-sm text-[#6B4F43] mt-1">
                {navigation.getCurrentStepData()?.template.metadata.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {navigation.getCurrentStepData()?.isQuizStep && (
                <span className="px-2 py-1 bg-[#B89B7A]/20 text-[#432818] text-xs font-medium rounded">
                  Quiz
                </span>
              )}

              <span className="text-xs text-[#6B4F43]">
                {navigation.getCurrentStepData()?.template.metadata.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepNavigationComponent;
