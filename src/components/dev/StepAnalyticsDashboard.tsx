import React from 'react';
import { useEditor } from '@/components/editor/EditorProvider';

interface StepAnalyticsDashboardProps {
  totalSteps: number;
}

/**
 * Dashboard completo de análise de etapas do editor
 * Exibe informações detalhadas sobre o estado atual do editor e métricas por etapa
 */
export const StepAnalyticsDashboard: React.FC<StepAnalyticsDashboardProps> = ({ totalSteps }) => {
  const { state } = useEditor();
  
  // Calcular métricas por etapa
  const stepMetrics = React.useMemo(() => {
    const metrics = [];
    
    for (let i = 1; i <= totalSteps; i++) {
      const stepKey = `step${i}`;
      const blocks = state.stepBlocks?.[stepKey] || [];
      
      metrics.push({
        step: i,
        blockCount: blocks.length,
        types: blocks.reduce((acc: Record<string, number>, block: any) => {
          acc[block.type] = (acc[block.type] || 0) + 1;
          return acc;
        }, {}),
      });
    }
    
    return metrics;
  }, [state.stepBlocks, totalSteps]);
  
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white/95 dark:bg-gray-800/95 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs font-mono max-h-[80vh] overflow-y-auto w-80">
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm border-b pb-2 mb-2">
          Dashboard de Análise de Etapas
        </div>
        
        <div className="grid grid-cols-2 gap-x-2 mb-4">
          <span className="text-gray-500 dark:text-gray-400">Etapa Atual:</span>
          <span className="font-semibold">{state.currentStep} / {totalSteps}</span>
          
          <span className="text-gray-500 dark:text-gray-400">Total de Blocos:</span>
          <span className="font-semibold">{Object.values(state.stepBlocks || {}).flat().length}</span>
        </div>
        
        <div className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-xs">Métricas por Etapa:</div>
        
        <div className="space-y-2">
          {stepMetrics.map((metric) => (
            <div 
              key={`step-${metric.step}`}
              className={`p-2 rounded ${state.currentStep === metric.step ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">Etapa {metric.step}</span>
                <span className="text-gray-500 dark:text-gray-400">{metric.blockCount} blocos</span>
              </div>
              
              {metric.blockCount > 0 && (
                <div className="mt-1 grid grid-cols-2 gap-x-1 gap-y-0.5">
                  {Object.entries(metric.types as Record<string, number>).map(([type, count]) => (
                    <div key={`${metric.step}-${type}`} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400 truncate">{type}:</span>
                      <span>{count as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Exportação padrão para compatibilidade
export default StepAnalyticsDashboard;