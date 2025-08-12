// @ts-nocheck
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface QuizProgressBlockProps {
  currentStep?: number;
  totalSteps?: number;
  stepTitle?: string;
  showStepNumbers?: boolean;
  className?: string;
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

const QuizProgressBlock: React.FC<QuizProgressBlockProps> = ({
  currentStep = 3,
  totalSteps = 10,
  stepTitle = 'Descobrindo seu estilo...',
  showStepNumbers = true,
  className,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div
      className={cn(
        'py-4',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Step Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {showStepNumbers && (
              <div className="bg-[#B89B7A] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {currentStep}
              </div>
            )}
            <h3 className="text-lg font-semibold text-[#432818]">{stepTitle}</h3>
          </div>

          <div className="text-sm text-[#8F7A6A] flex items-center gap-1">
            <span>{currentStep}</span>
            <ChevronRight className="w-3 h-3" />
            <span>{totalSteps}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          {/* Background */}
          <div style={{ backgroundColor: '#E5DDD5' }}>
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Progress Markers */}
          <div className="absolute top-0 w-full h-2 flex justify-between">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber <= currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div
                  key={stepNumber}
                  className={cn(
                    'w-3 h-3 rounded-full border-2 transform -translate-y-0.5 transition-all duration-300',
                    isCompleted ? 'bg-[#B89B7A] border-[#B89B7A]' : 'bg-white border-gray-300',
                    isCurrent && 'scale-125 shadow-lg'
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-center mt-3">
          <p className="text-sm text-[#8F7A6A]">
            <span className="font-medium text-[#B89B7A]">{Math.round(progressPercentage)}%</span>{' '}
            completo - Continue para descobrir mais sobre seu estilo único
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizProgressBlock;
