import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { Copy, Eye, GripVertical, Plus, Settings, Trash2 } from 'lucide-react';

interface FunnelStagesPanelProps {
  className?: string;
  onStageSelect?: (stageId: string) => void;
}

export const FunnelStagesPanel: React.FC<FunnelStagesPanelProps> = ({
  className,
  onStageSelect,
}) => {
  const {
    stages,
    activeStageId,
    stageActions: { setActiveStage, addStage, removeStage },
    computed: { stageCount },
  } = useEditor();

  const handleAddStage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addStage();
  };

  const handleStageClick = (stageId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveStage(stageId);
    if (onStageSelect) {
      onStageSelect(stageId);
    }
  };

  const handleActionClick = (action: string, stageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case 'view':
        handleStageClick(stageId);
        break;
      case 'delete':
        if (confirm(`Deseja excluir a etapa "${stageId}"?`)) {
          removeStage(stageId);
        }
        break;
    }
  };

  if (!stages || stages.length === 0) {
    return (
      <Card className={cn('h-full flex flex-col min-h-[400px]', className)}>
        <CardHeader>
          <CardTitle>Nenhuma etapa disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Recarregue a página ou verifique a configuração.</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-bold">Debug Info:</p>
            <p>stages: {stages ? `Array com ${stages.length} itens` : 'null/undefined'}</p>
            <p>stageCount: {stageCount}</p>
            <p>activeStageId: {activeStageId}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('h-full flex flex-col min-h-[400px]', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Etapas do Funil
          <Badge variant="secondary" className="ml-auto">
            {stageCount}/21
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-y-auto [scrollbar-gutter:stable]">
          <div className="space-y-2 p-4">
            {stages.map(stage => (
              <div
                key={stage.id}
                className={cn(
                  'group relative rounded-lg border-2 transition-all cursor-pointer',
                  'hover:border-purple-400 hover:shadow-lg',
                  'min-h-[80px] bg-white p-4',
                  activeStageId === stage.id
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
                onClick={e => handleStageClick(stage.id, e)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Etapa {stage.order}</span>
                      <Badge variant={stage.isActive ? 'default' : 'secondary'} className="text-xs">
                        {stage.type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold truncate">{stage.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="outline" className="text-xs">
                    {stage.metadata?.blocksCount || 0} blocos
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => handleActionClick('view', stage.id, e)}
                      title="Visualizar"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => handleActionClick('settings', stage.id, e)}
                      title="Configurações"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => handleActionClick('copy', stage.id, e)}
                      title="Copiar"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={e => handleActionClick('delete', stage.id, e)}
                      title="Excluir"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2"
              onClick={handleAddStage}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Etapa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelStagesPanel;
