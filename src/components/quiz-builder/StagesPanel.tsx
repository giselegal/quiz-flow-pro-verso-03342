import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuizStage } from '@/types/quizBuilder';
import { Plus, Trash2 } from 'lucide-react';

interface StagesPanelProps {
  stages: QuizStage[];
  activeStageId?: string;
  onStageSelect: (stageId: string) => void;
  onStageAdd: () => void;
  onStageDelete: (stageId: string) => void;
  onStageUpdate: (stageId: string, updates: Partial<QuizStage>) => void;
}

export const StagesPanel: React.FC<StagesPanelProps> = ({
  stages,
  activeStageId,
  onStageSelect,
  onStageAdd,
  onStageDelete,
  onStageUpdate,
}) => {
  const handleStageEdit = (stage: QuizStage, field: keyof QuizStage, value: any) => {
    onStageUpdate(stage.id, { [field]: value });
  };

  const handleAddStage = (event: React.MouseEvent) => {
    event.preventDefault();
    onStageAdd();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Etapas do Quiz</h3>
        <Button
          size="sm"
          onClick={handleAddStage}
          className="bg-[#B89B7A] hover:bg-[#A08A72] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Etapa
        </Button>
      </div>

      <div className="space-y-3">
        {stages.map(stage => (
          <Card
            key={stage.id}
            className={`p-3 cursor-pointer transition-colors ${
              activeStageId === stage.id ? 'bg-[#B89B7A]/10 border-[#B89B7A]' : 'hover:bg-gray-50'
            }`}
            onClick={() => onStageSelect(stage.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span style={{ backgroundColor: '#E5DDD5' }}>{stage.type}</span>
                  <span style={{ color: '#8B7355' }}>Ordem: {stage.order}</span>
                </div>

                <Label htmlFor={`stage-title-${stage.id}`} className="text-xs">
                  Título da Etapa
                </Label>
                <Input
                  id={`stage-title-${stage.id}`}
                  value={stage.title}
                  onChange={e => handleStageEdit(stage, 'title', e.target.value)}
                  className="text-sm mt-1"
                  placeholder="Nome da etapa"
                  onClick={e => e.stopPropagation()}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onStageDelete(stage.id);
                }}
                style={{ color: '#432818' }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {stages.length === 0 && (
          <div style={{ color: '#8B7355' }}>
            <p className="mb-4">Nenhuma etapa criada ainda</p>
            <Button onClick={handleAddStage} className="bg-[#B89B7A] hover:bg-[#A08A72] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Etapa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StagesPanel;
