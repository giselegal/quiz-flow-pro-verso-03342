import React from 'react';
import { FileText } from 'lucide-react';
import { InlineEditableText } from './InlineEditableText';
import type { BlockComponentProps } from '@/types/blocks';

const ResultDescriptionBlock: React.FC<BlockComponentProps> = ({ 
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const { 
    content = 'Baseado nas suas respostas, identificamos que...', 
    showIcon = true 
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div 
      className={`
        p-6 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-2 border-yellow-500 bg-yellow-50' 
          : 'border-2 border-dashed border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="flex items-start space-x-4">
        {showIcon && (
          <div className="flex-shrink-0 w-12 h-12 bg-[#B89B7A]/10 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#B89B7A]" />
          </div>
        )}
        
        <div className="flex-1">
          <InlineEditableText
            value={content}
            onChange={(value: string) => handlePropertyChange('content', value)}
            className="text-gray-700 leading-relaxed"
            placeholder="Descrição detalhada do resultado baseado nas respostas do quiz"
          />
        </div>
      </div>
    </div>
  );
};

export default ResultDescriptionBlock;
