// @ts-nocheck
import { ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizCategory, QUIZ_CATEGORIES } from '@/types/quizEditor';
import { QuizQuestion } from '@/types/quiz';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CategoryInfo {
  id: QuizCategory;
  name: string;
  description: string;
  icon: string;
  isStrategic: boolean;
}

interface QuizCategoryTabProps {
  category: CategoryInfo;
  isActive: boolean;
  onClick: () => void;
  questions: QuizQuestion[];
  onEditQuestion: (questionId: string) => void;
}

const QuizCategoryTab: React.FC<QuizCategoryTabProps> = ({
  category,
  isActive,
  onClick,
  questions,
  onEditQuestion,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  return (
    <div className={`rounded-md border ${isActive ? 'border-[#B89B7A]' : 'border-gray-200'}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div
            className={`p-3 flex justify-between items-center cursor-pointer ${isActive ? 'bg-[#FAF9F7]' : 'bg-white'}`}
            onClick={onClick}
          >
            <div>
              <h3 className="font-medium text-[#432818]">{category.name}</h3>
              <p style={{ color: '#8B7355' }}>{category.description}</p>
            </div>
            {isOpen ? (
              <ChevronDown className="w-5 h-5 text-[#B89B7A]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[#B89B7A]" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2 space-y-1 bg-[#FAF9F7] rounded-b-md">
            {questions.length > 0 ? (
              questions.map(question => (
                <div
                  key={question.id}
                  className="p-2 rounded-md hover:bg-white flex justify-between items-center group"
                >
                  <span className="text-sm truncate">{question.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      onEditQuestion(question.id);
                    }}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 p-2">Nenhuma pergunta nesta categoria</div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default QuizCategoryTab;
