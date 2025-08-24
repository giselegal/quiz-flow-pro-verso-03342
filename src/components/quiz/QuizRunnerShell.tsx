import { cn } from '@/lib/utils';
import React from 'react';

interface QuizRunnerShellProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  onNext?: () => void;
  onPrev?: () => void;
  children: React.ReactNode;
  className?: string;
  /**
   * full: inclui background gradiente e container externo (para /quiz)
   * embedded: somente o conteúdo central e card (para prévia no editor)
   */
  variant?: 'full' | 'embedded';
  /**
   * Quando embedded, permite desativar o header de progresso se desejar
   */
  showHeader?: boolean;
}

const QuizRunnerShell: React.FC<QuizRunnerShellProps> = ({
  currentStep,
  totalSteps,
  progress,
  onNext,
  onPrev,
  children,
  className,
  variant = 'full',
  showHeader = true,
}) => {
  const Header = (
    <div className="bg-white/90 backdrop-blur-sm border border-stone-200/50 shadow-sm rounded-lg mb-8 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-stone-800">Quiz Style Challenge</h2>
          <div className="text-sm text-stone-600">
            Etapa {currentStep} de {totalSteps}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-48 h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-[#B89B7A] to-[#8B7355]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm font-medium text-stone-700">{progress}%</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={cn(
              'px-3 py-2 rounded border text-sm',
              currentStep === 1 && 'opacity-50 cursor-not-allowed'
            )}
            onClick={onPrev}
            disabled={currentStep === 1 || !onPrev}
          >
            ← Anterior
          </button>
          <button
            className={cn(
              'px-3 py-2 rounded text-sm text-white transition-all',
              'bg-gradient-to-r from-[#B89B7A] to-[#8B7355]'
            )}
            onClick={onNext}
            disabled={currentStep === totalSteps || !onNext}
          >
            {currentStep === totalSteps ? 'Finalizado' : 'Próxima →'}
          </button>
        </div>
      </div>
    </div>
  );

  const ContentCard = (
    <div
      className={cn(
        'bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );

  if (variant === 'embedded') {
    return (
      <div className="w-full">
        {showHeader ? Header : null}
        {ContentCard}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {showHeader ? Header : null}
          {ContentCard}
        </div>
      </div>
    </div>
  );
};

export default QuizRunnerShell;
