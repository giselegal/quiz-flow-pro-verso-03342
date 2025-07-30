
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';

interface TextBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  onClick?: () => void;
  className?: string;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  content,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  onClick,
  className
}) => {
  const [localText, setLocalText] = useState(content.text || '');

  useEffect(() => {
    setLocalText(content.text || '');
  }, [content.text]);

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer",
        className
      )}
      onClick={onClick || onSelect}
      style={{
        color: content.style?.color,
        backgroundColor: content.style?.backgroundColor,
        fontSize: content.style?.fontSize,
        fontWeight: content.style?.fontWeight,
        textAlign: content.style?.textAlign as any,
        padding: content.style?.padding,
        margin: content.style?.margin
      }}
    >
      <div 
        className="min-h-[1.5rem] leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: localText || '<span class="text-gray-400">Adicione seu texto aqui</span>' 
        }}
      />
    </div>
  );
};

export default TextBlock;
