
import React from 'react';
import { EditableContent } from '@/types/editor';
import { cn } from '@/lib/utils';

interface QuizQuestionBlockProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  content = {},
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  // Safely handle style object
  const style = content.style || {};
  const styleProps = typeof style === 'object' ? style : {};

  const containerStyle = {
    backgroundColor: styleProps.backgroundColor || content.backgroundColor || '#ffffff',
    padding: styleProps.padding || content.padding || '1rem',
    margin: styleProps.margin || content.margin || '0',
    borderRadius: styleProps.borderRadius || content.borderRadius || '8px',
    border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb'
  };

  const options = content.options || [
    { id: '1', text: 'Opção 1' },
    { id: '2', text: 'Opção 2' }
  ];

  return (
    <div
      className={cn('quiz-question-block cursor-pointer transition-all', className)}
      style={containerStyle}
      onClick={handleClick}
    >
      <div className="space-y-4">
        {content.title && (
          <h3 className="text-lg font-medium text-gray-900">{content.title}</h3>
        )}
        
        {content.text && (
          <p className="text-gray-700">{content.text}</p>
        )}
        
        <div className="space-y-2">
          {options.map((option: any) => (
            <div
              key={option.id}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            >
              <span className="text-gray-800">{option.text}</span>
            </div>
          ))}
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Selecionado
        </div>
      )}
    </div>
  );
};

export default QuizQuestionBlock;
