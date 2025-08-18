// @ts-nocheck
import { QuizStage } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Settings, Trash2 } from 'lucide-react';

interface StageListProps {
  stages: QuizStage[];
  activeStageId: string;
  onStageSelect: (id: string) => void;
  onStageAdd: (type: QuizStage['type']) => void;
  onStageUpdate: (id: string, updates: Partial<QuizStage>) => void;
  onStageDelete: (id: string) => void;
}

const StageList: React.FC<StageListProps> = ({
  stages,
  activeStageId,
  onStageSelect,
  onStageAdd,
  onStageUpdate,
  onStageDelete,
}) => {
  const getStageIcon = (type: QuizStage['type']) => {
    switch (type) {
      case 'cover':
        return '📋';
      case 'question':
        return '❓';
      case 'result':
        return '🎯';
      case 'strategic':
        return '⚡';
      case 'welcome':
        return '👋';
      default:
        return '📄';
    }
  };

  const handleResultPreview = (result: any) => {
    // Handle result preview logic
    console.log('Previewing result:', result);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#432818]">Etapas do Quiz</h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStageAdd('cover')}
            className="text-xs"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {stages.map(stage => (
          <Card
            key={stage.id}
            className={`p-3 cursor-pointer transition-all ${
              stage.id === activeStageId
                ? 'border-[#B89B7A] bg-[#B89B7A]/5'
                : 'border-gray-200 hover:border-[#B89B7A]/50'
            }`}
            onClick={() => onStageSelect(stage.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStageIcon(stage.type)}</span>
                <div>
                  <p className="font-medium text-sm text-[#432818]">{stage.title}</p>
                  <p className="text-xs text-[#8F7A6A] capitalize">{stage.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={e => {
                    e.stopPropagation();
                    handleResultPreview(stage);
                  }}
                  className="text-[#8F7A6A] hover:text-[#432818] p-1 h-auto"
                >
                  <Eye className="w-3 h-3" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={e => {
                    e.stopPropagation();
                    onStageDelete(stage.id);
                  }}
                  style={{ color: '#432818' }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {stages.length === 0 && (
        <div className="text-center py-8 text-[#8F7A6A]">
          <p className="mb-3">Nenhuma etapa criada ainda</p>
          <Button
            onClick={() => onStageAdd('cover')}
            className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Etapa
          </Button>
        </div>
      )}
    </div>
  );
};

export default StageList;
