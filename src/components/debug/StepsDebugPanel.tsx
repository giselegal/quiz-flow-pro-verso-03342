import { useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
import { useFunnels } from '@/context/FunnelsContext';
import React from 'react';

// ✅ FASE 3: Interface adaptadora para debug steps
interface AdaptedDebugStep {
  id: string;
  name: string;
  description?: string;
  order: number;
  type: string;
  isActive?: boolean;
  blocksCount?: number;
  // Propriedades do core
  isRequired?: boolean;
  isVisible?: boolean;
}

// ✅ HELPER: Adaptar step legacy para interface unificada (debug)
const adaptLegacyStepForDebug = (legacyStep: any): AdaptedDebugStep => {
  return {
    id: legacyStep.id,
    name: legacyStep.name,
    description: legacyStep.description || '',
    order: legacyStep.order,
    type: legacyStep.type,
    isActive: legacyStep.isActive ?? true,
    blocksCount: legacyStep.blocksCount || 1,
    isRequired: true, // Default do core
    isVisible: legacyStep.isActive ?? true,
  };
};

export const StepsDebugPanel: React.FC = () => {
  const quiz21Steps = useQuiz21Steps();
  const funnelsRaw = useFunnels();

  // ✅ FASE 3: Adaptar steps para interface unificada
  const funnels = {
    ...funnelsRaw,
    adaptedSteps: funnelsRaw.steps ? funnelsRaw.steps.map(adaptLegacyStepForDebug) : [],
  };

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
            <div>adaptedSteps.length: {funnels.adaptedSteps.length}</div>
            <div>loading: {funnels.loading.toString()}</div>
            <div>error: {funnels.error || 'nenhum'}</div>
          </div>
        </div>

        <div>
          <strong>Steps IDs (Adapted):</strong>
          <div className="ml-2 max-h-20 overflow-y-auto">
            {funnels.adaptedSteps.map((step, index) => (
              <div key={step.id} className="text-xs">
                {index + 1}. {step.id} - {step.name} ({step.type})
              </div>
            ))}
          </div>
        </div>

        <div>
          <strong>Core Properties:</strong>
          <div className="ml-2 max-h-16 overflow-y-auto text-xs">
            {funnels.adaptedSteps.slice(0, 3).map((step) => (
              <div key={step.id} className="text-xs">
                {step.name}: required={step.isRequired?.toString()}, visible={step.isVisible?.toString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
