import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/context/EditorContext.simple';

const FunnelStagesPanel: React.FC = () => {
  const { stages, activeStageId, stageActions } = useEditor();

  return (
    <div className="h-full p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Etapas do Funil</h3>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie as etapas do seu funil
        </p>
      </div>

      <div className="space-y-2">
        {stages.map((stage) => (
          <Button
            key={stage.id}
            variant={activeStageId === stage.id ? 'default' : 'ghost'}
            className="w-full justify-start text-left h-auto p-3"
            onClick={() => stageActions.setActiveStage(stage.id)}
          >
            <div>
              <div className="font-medium">{stage.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                Etapa {stage.order} • {stage.type}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Etapa ativa: {activeStageId}
        </div>
      </div>
    </div>
  );
};

export default FunnelStagesPanel;