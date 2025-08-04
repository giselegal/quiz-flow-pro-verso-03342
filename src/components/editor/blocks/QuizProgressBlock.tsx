import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface QuizProgressBlockProps {
  currentStep?: number;
  totalSteps?: number;
  stepTitle?: string;
  showStepNumbers?: boolean;
  className?: string;
}

const QuizProgressBlock: React.FC<QuizProgressBlockProps> = ({
  currentStep = 3,
  totalSteps = 10,
  stepTitle = 'Descobrindo seu estilo...',
  showStepNumbers = true,
  className,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('py-4', className)}>
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
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
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
                    isCurrent && 'scale-125 shadow-lg',
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-center mt-3">
          <p className="text-sm text-[#8F7A6A]">
            <span className="font-medium text-[#B89B7A]">{Math.round(progressPercentage)}%</span> completo - Continue
            para descobrir mais sobre seu estilo único
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizProgressBlock;
