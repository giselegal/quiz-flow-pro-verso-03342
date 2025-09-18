import { StyleResult, QuizFunnel } from '@/types/quiz';
import { EnhancedResultPageEditor } from './EnhancedResultPageEditor';

interface EnhancedResultPageEditorWrapperProps {
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  initialFunnel?: QuizFunnel;
  onSave?: (funnel: QuizFunnel) => void;
}

export const EnhancedResultPageEditorWrapper: React.FC<
  EnhancedResultPageEditorWrapperProps
> = props => {
  return (
    <EnhancedResultPageEditor
      selectedStyle={props.primaryStyle}
      primaryStyle={props.primaryStyle}
      secondaryStyles={props.secondaryStyles}
      initialFunnel={props.initialFunnel}
      onSave={props.onSave}
    />
  );
};

export default EnhancedResultPageEditorWrapper;
