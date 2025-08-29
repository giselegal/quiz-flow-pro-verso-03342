import React from 'react';
import { cn } from '@/lib/utils';

export interface StepSidebarProps {
  currentStep: number;
  totalSteps?: number;
  stepHasBlocks: Record<number, boolean>;
  stepValidation?: Record<number, boolean>;
  onSelectStep: (step: number) => void;
  getStepAnalysis: (step: number) => { icon: string; label: string; desc: string };
  renderIcon: (name: string, className?: string) => React.ReactNode;
  className?: string;
}

const StepSidebarComponent: React.FC<StepSidebarProps> = ({
  currentStep,
  totalSteps = 21,
  stepHasBlocks,
  stepValidation,
  onSelectStep,
  getStepAnalysis,
  renderIcon,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'w-[13rem] min-w-[13rem] max-w-[13rem] flex-shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col',
        className
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-sm text-gray-900">Etapas do Quiz</h3>
        <p className="text-xs text-gray-500 mt-1">{totalSteps} etapas configuradas</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => {
            const analysis = getStepAnalysis(step);
            const isActive = step === currentStep;
            const hasBlocks = stepHasBlocks[step];
            const isValid = stepValidation ? stepValidation[step] : undefined;

            return (
              <button
                key={step}
                type="button"
                onClick={() => onSelectStep(step)}
                className={cn(
                  'w-full text-left p-2 rounded-md text-xs',
                  isActive ? 'bg-blue-100 border-blue-300 text-blue-900' : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{renderIcon(analysis.icon, 'w-4 h-4 text-gray-600')}</span>
                    <span className="font-medium">Etapa {step}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {typeof isValid === 'boolean' ? (
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          isValid ? 'bg-green-500' : 'bg-red-400'
                        )}
                        title={isValid ? 'Válida' : 'Inválida'}
                      />
                    ) : hasBlocks ? (
                      <span className="w-2 h-2 bg-gray-300 rounded-full" title="Com conteúdo" />
                    ) : null}
                  </div>
                </div>
                <div className="text-gray-600 mt-1">
                  <div className="font-medium">{analysis.label}</div>
                  <div className="text-xs">{analysis.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Etapa atual:</span>
          <span className="font-medium">{currentStep}/{totalSteps}</span>
        </div>
      </div>
    </div>
  );
};

export const StepSidebar = React.memo(StepSidebarComponent);
export default StepSidebar;
