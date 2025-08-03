import React from 'react';
import { FunnelStep } from '../../../types/funnel';
import { EditorBlock } from '../../../context/EditorContext';

interface FunnelStagesPanelProps {
  steps: FunnelStep[];
  activeStageId: string;
  onStageSelect: (stageId: string) => void;
  stageBlocks: Record<string, EditorBlock[]>;
}

const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({
  steps,
  activeStageId,
  onStageSelect,
  stageBlocks
}) => {
  console.log(`🔍 FunnelStagesPanel - Steps:`, steps.length);
  console.log(`🎯 FunnelStagesPanel - Etapa ativa:`, activeStageId);
  console.log(`📊 FunnelStagesPanel - Blocos por etapa:`, Object.keys(stageBlocks).length);

  if (!steps || steps.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
          <p className="mt-2 text-sm">Carregando etapas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Etapas do Funil
        <span className="ml-2 text-sm text-gray-500">({steps.length})</span>
      </h3>
      
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isActive = step.id === activeStageId;
          const blockCount = stageBlocks[step.id]?.length || 0;
          
          return (
            <button
              key={step.id}
              onClick={() => onStageSelect(step.id)}
              className={`
                w-full text-left p-3 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 border-blue-300 text-blue-800' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm truncate">
                      {step.name}
                    </div>
                    {step.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Contador de blocos */}
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${blockCount > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {blockCount}
                  </div>
                  
                  {/* Indicador visual de progresso */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(blockCount, 5) }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-blue-400' : 'bg-green-400'
                        }`}
                      />
                    ))}
                    {blockCount > 5 && (
                      <span className="text-xs text-gray-400">+</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Estatísticas do funil */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 text-sm mb-2">📊 Estatísticas</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Total de etapas:</span>
            <span className="font-medium">{steps.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Etapas com conteúdo:</span>
            <span className="font-medium">
              {Object.values(stageBlocks).filter(blocks => blocks.length > 0).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total de blocos:</span>
            <span className="font-medium">
              {Object.values(stageBlocks).reduce((total, blocks) => total + blocks.length, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelStagesPanel;
