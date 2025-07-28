
import React from 'react';
import { EditorBlock } from '@/types/editor';
import TextBlock from './TextBlock';
import HeaderBlock from './HeaderBlock';
import ImageBlock from './ImageBlock';
import ButtonBlock from './ButtonBlock';
import SpacerBlock from './SpacerBlock';
import QuizQuestionBlock from './QuizQuestionBlock';

interface BlockComponentProps {
  block: EditorBlock;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onSelect?: () => void;
  className?: string;
}

export const BlockComponents: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const commonProps = {
    content: block.content,
    isSelected,
    isEditing,
    onUpdate,
    onSelect,
    className
  };

  switch (block.type) {
    case 'text':
    case 'paragraph':
      return <TextBlock {...commonProps} />;
      
    case 'header':
    case 'heading':
    case 'headline':
    case 'title':
      return <HeaderBlock {...commonProps} />;
      
    case 'image':
      return <ImageBlock {...commonProps} />;
      
    case 'button':
    case 'cta':
      return <ButtonBlock {...commonProps} />;
      
    case 'spacer':
      return <SpacerBlock {...commonProps} />;
      
    case 'quiz-question':
      return <QuizQuestionBlock {...commonProps} />;
      
    default:
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          Componente não implementado: {block.type}
        </div>
      );
  }
};

export default BlockComponents;
