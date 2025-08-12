// @ts-nocheck
import { EditableContent } from '@/types/editor';
import QuizQuestionBlock from '../quiz/QuizQuestionBlock';

interface CaktoQuizQuestionProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const CaktoQuizQuestion: React.FC<CaktoQuizQuestionProps> = props => {
  return <QuizQuestionBlock {...props} />;
};

export default CaktoQuizQuestion;
