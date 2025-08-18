import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface StepNavigationSimpleProps {
  currentStep: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onStepChange?: (step: number) => void;
  className?: string;
}

/**
 * Componente de navegação simplificado (sem Supabase)
 */
export const StepNavigationSimple: React.FC<StepNavigationSimpleProps> = ({
  currentStep,
  totalSteps = 21,
  onNext,
  onPrevious,
  onStepChange,
  className = '',
}) => {
  const handleStepClick = (step: number) => {
    onStepChange?.(step);
  };

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

        <Progress value={(currentStep / totalSteps) * 100} className="h-2 bg-[#FAF9F7]" />
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
              className={`
                w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#B89B7A] text-white shadow-md scale-110'
                    : isCompleted
                      ? 'bg-[#A08766] text-white hover:bg-[#B89B7A]'
                      : 'bg-[#FAF9F7] text-[#6B4F43] hover:bg-[#F5F2E9] border border-[#B89B7A]/30'
                }
                hover:scale-105 cursor-pointer
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
          onClick={onPrevious}
          disabled={currentStep <= 1}
          className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep >= totalSteps ? (
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-[#B89B7A] to-[#A08766] text-white hover:from-[#A08766] hover:to-[#8F7555]"
          >
            Finalizar Quiz
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={currentStep >= totalSteps}
            className="bg-[#B89B7A] text-white hover:bg-[#A08766]"
          >
            Próxima
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Info da Etapa */}
      <div className="mt-4 p-3 bg-[#FAF9F7] rounded-lg border border-[#B89B7A]/20">
        <div className="text-center">
          <h3 className="font-medium text-[#432818]">
            Etapa {currentStep}: {getStepName(currentStep)}
          </h3>
          <p className="text-sm text-[#6B4F43] mt-1">{getStepDescription(currentStep)}</p>
        </div>
      </div>
    </div>
  );
};

// Funções auxiliares para nomes e descrições
const getStepName = (step: number): string => {
  const stepNames = {
    1: 'Introdução',
    2: 'Nome',
    3: 'Roupa Favorita',
    4: 'Estilo Pessoal',
    5: 'Ocasiões',
    6: 'Cores',
    7: 'Texturas',
    8: 'Silhuetas',
    9: 'Acessórios',
    10: 'Inspiração',
    11: 'Conforto',
    12: 'Tendências',
    13: 'Investimento',
    14: 'Personalidade',
    15: 'Transição',
    16: 'Processamento',
    17: 'Resultado Parcial',
    18: 'Resultado Completo',
    19: 'Resultado Final',
    20: 'Lead Capture',
    21: 'Oferta',
  };

  return stepNames[step as keyof typeof stepNames] || `Etapa ${step}`;
};

const getStepDescription = (step: number): string => {
  const descriptions = {
    1: 'Tela inicial do quiz',
    2: 'Coleta do nome pessoal',
    3: 'Tipo de roupa preferida',
    4: 'Identificação do estilo',
    5: 'Contextos de uso',
    6: 'Preferências de cores',
    7: 'Texturas favoritas',
    8: 'Formas preferidas',
    9: 'Acessórios de estilo',
    10: 'Referências de moda',
    11: 'Prioridade de conforto',
    12: 'Interesse em tendências',
    13: 'Orçamento para roupas',
    14: 'Traços pessoais',
    15: 'Preparação para resultado',
    16: 'Calculando resultado',
    17: 'Primeiro resultado',
    18: 'Análise completa',
    19: 'Apresentação final',
    20: 'Captura de contato',
    21: 'Página de oferta final',
  };

  return descriptions[step as keyof typeof descriptions] || 'Descrição da etapa';
};

export default StepNavigationSimple;
