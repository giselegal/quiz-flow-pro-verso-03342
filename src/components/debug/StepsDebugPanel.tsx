import { useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
import { useFunnels } from '@/context/FunnelsContext';
import React from 'react';

export const StepsDebugPanel: React.FC = () => {
  const quiz21Steps = useQuiz21Steps();
  const funnels = useFunnels();

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Debug das Etapas</h3>

      <div className="space-y-2 text-xs">
        <div>
          <strong>Quiz21Steps:</strong>
          <div className="ml-2">
            <div>currentStep: {quiz21Steps.currentStep}</div>
            <div>totalSteps: {quiz21Steps.totalSteps}</div>
            <div>isLoading: {quiz21Steps.isLoading.toString()}</div>
            <div>canGoNext: {quiz21Steps.canGoNext.toString()}</div>
            <div>canGoPrevious: {quiz21Steps.canGoPrevious.toString()}</div>
          </div>
        </div>

        <div>
          <strong>FunnelsContext:</strong>
          <div className="ml-2">
            <div>currentFunnelId: {funnels.currentFunnelId}</div>
            <div>steps.length: {funnels.steps.length}</div>
            <div>loading: {funnels.loading.toString()}</div>
            <div>error: {funnels.error || 'nenhum'}</div>
          </div>
        </div>

        <div>
          <strong>Steps IDs:</strong>
          <div className="ml-2 max-h-20 overflow-y-auto">
            {funnels.steps.map((step, index) => (
              <div key={step.id} className="text-xs">
                {index + 1}. {step.id} - {step.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
