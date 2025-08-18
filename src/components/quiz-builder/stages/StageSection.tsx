import { QuizStage } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface StageSectionProps {
  stage: QuizStage;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const StageSection: React.FC<StageSectionProps> = ({
  stage,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      className={`p-3 cursor-pointer transition-colors ${
        isActive ? 'border-[#B89B7A] bg-[#FFFAF0]' : 'border-[#B89B7A]/20 hover:bg-[#FFFAF0]/50'
      }`}
      onClick={() => onSelect(stage.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#432818]">{stage.title}</h4>
          <p className="text-xs text-[#8F7A6A] mt-1 capitalize">{stage.type}</p>
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={e => {
              e.stopPropagation();
              onEdit(stage.id);
            }}
            className="h-6 w-6 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={e => {
              e.stopPropagation();
              onDelete(stage.id);
            }}
            style={{ color: '#432818' }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StageSection;
