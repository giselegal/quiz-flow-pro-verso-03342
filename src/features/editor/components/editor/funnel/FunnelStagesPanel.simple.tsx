import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/context/EditorContext.simple';

const FunnelStagesPanel: React.FC = () => {
  const { stages, activeStageId, stageActions } = useEditor();

  console.log('🏗️ FunnelStagesPanel: Renderizando painel', { 
    stagesCount: stages.length, 
    activeStageId,
    stages: stages.map(s => ({ id: s.id, name: s.name }))
  });

  return (
    <div className="h-full p-4 bg-white border-r border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Quiz de Estilo</h3>
        <p className="text-sm text-gray-600 mt-1">
          {stages.length} etapas do funil
        </p>
      </div>

      <div className="space-y-2">
        {stages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma etapa encontrada</p>
            <p className="text-xs text-gray-400 mt-1">
              Debug: Context não está fornecendo stages
            </p>
          </div>
        ) : (
          stages.map((stage) => (
            <Button
              key={stage.id}
              variant={activeStageId === stage.id ? 'default' : 'outline'}
              className="w-full justify-start text-left h-auto p-3 border"
              onClick={() => {
                console.log('🔄 FunnelStagesPanel: Mudando para etapa:', stage.id);
                stageActions.setActiveStage(stage.id);
              }}
            >
              <div>
                <div className="font-medium text-sm">{stage.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Etapa {stage.order} • {stage.metadata?.blocksCount || 0} blocos
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {stage.description}
                </div>
                {activeStageId === stage.id && (
                  <div className="text-xs text-brand font-medium mt-1">
                    ● Ativa
                  </div>
                )}
              </div>
            </Button>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Etapa ativa: <strong>{activeStageId}</strong></div>
          <div>Total: {stages.length} etapa(s)</div>
        </div>
      </div>
    </div>
  );
};

export default FunnelStagesPanel;