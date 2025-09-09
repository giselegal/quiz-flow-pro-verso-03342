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
        'w-[13rem] min-w-[13rem] max-w-[13rem] flex-shrink-0 h-screen sticky top-0 bg-gray-900 border-r border-gray-800/50 flex flex-col',
        className
      )}
    >
      <div className="p-4 border-b border-gray-800/50">
        <h3 className="font-medium text-sm text-gray-200">Quiz Steps</h3>
        <p className="text-xs text-gray-500 mt-1">{totalSteps} steps configured</p>
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
                  'w-full text-left p-2 rounded border border-transparent text-xs transition-all',
                  isActive 
                    ? 'bg-gradient-to-r from-brand-brightBlue/20 to-brand-brightPink/20 border-brand-brightBlue/30 text-gray-200' 
                    : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{renderIcon(analysis.icon, 'w-4 h-4')}</span>
                    <span className="font-medium">Step {step}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {typeof isValid === 'boolean' ? (
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          isValid ? 'bg-green-400' : 'bg-red-400'
                        )}
                        title={isValid ? 'Valid' : 'Invalid'}
                      />
                    ) : hasBlocks ? (
                      <span className="w-2 h-2 bg-gray-500 rounded-full" title="Has content" />
                    ) : null}
                  </div>
                </div>
                <div className="text-gray-500 mt-1">
                  <div className="font-medium text-xs">{analysis.label}</div>
                  <div className="text-xs opacity-80">{analysis.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-gray-800/50 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Current step:</span>
          <span className="font-medium text-gray-400">{currentStep}/{totalSteps}</span>
        </div>
      </div>
    </div>
  );
};

export const StepSidebar = React.memo(StepSidebarComponent);
export default StepSidebar;
